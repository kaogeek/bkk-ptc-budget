<script>
import jwt_decode from "jwt-decode";
import axios from 'axios'
import Swal from 'sweetalert2'
import update from './update.vue'
import docs from './docs.vue'

// token ใช้ใน api
const token = 'b61621e24aacca8e195d5d3baab1b644980be16a116d8333fb05bf34d22be87cbe>'
// const link_API = 'http://bkkpb.ath.cx/'
const link_API = process.env.BASE_URL

export default {
    data() {
        return {
            page: 1,
            role: 0,
            email: '',
            fullname: '',
            imageData: null, // ตัวแปรเพื่อเก็บข้อมูลรูปภาพที่ได้รับ
            id: null,
            dev_msg: null,
            projects: [],
            selected: '',
            status_text: '',
            note: '',
            status_note: ''
        };
    },
    mounted() {
        this.asyncData();
        this.id = this.$route.params.id;
        setTimeout(() => { this.api_get_project_id() }, 500)
    },

    computed: {

    },
    components: {
        update,
        docs
    },
    methods: {

        async asyncData() {
            const token = sessionStorage.getItem('auth-token');

            if (token != null) {
                var decoded = jwt_decode(token);

                this.role = decoded.role
                this.email = decoded.email
                this.fullname = decoded.fullname
            }
        },

        async api_get_img(filename) {
            try {
                const url = link_API + 'api/images/' + filename;
                const options = {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                responseType: 'blob' // กำหนดให้รับข้อมูลเป็นไบนารี
                };

                const res = await axios.get(url, options);

                if (res.status === 200) {
                const imageUrl = URL.createObjectURL(res.data); // สร้าง URL ของรูปภาพจากข้อมูลที่ได้รับ
                this.imageData = imageUrl; // เก็บ URL ของรูปภาพ
                // console.log(imageUrl)
                } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '404 (515816)'
                });
                }
            } catch (error) {
                console.error(error);
            }
        },   

        // รับข้อมูล เก็บใน projects
        async api_get_project_id () {
            try {
                const url     = link_API+'api/project/'+this.id
                const params  = {}
                const json    = {}
                const options = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
                }
                const res = await axios.get(url, json, options)

                if (res.status === 200){
                    this.projects = res.data.data[0];
                    this.note = this.projects.note
                    if(this.projects.og_image != ''){
                        this.api_get_img(this.projects.og_image)
                    }else{
                        this.api_get_img('0')
                    }
                    
                    
                    if( this.projects.status_id === 1 || this.projects.status_id === 2 || this.projects.status_id === 3 || this.projects.status_id === 4){
                        this.status_text = 'ดำเนินการอยู่'
                        this.selected = 'ดำเนินการอยู่'
                    }

                    if( this.projects.status_id === 5){
                        this.status_text = 'ระงับการดำเนินโครงการ'
                        this.selected = 'ระงับการดำเนินโครงการ'
                    }

                    if( this.projects.status_id === 6){
                        this.status_text = 'ดำเนินการเสร็จสิ้น'
                        this.selected = 'ดำเนินการเสร็จสิ้น'
                    }

                }else{
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'api_get_project_id : '+res.status
                    })
                }

            } catch (error) {
                console.error(error)
            }
        },
        
        // update status_id
        async api_update_status_id (row_id,status_id,status_note,note) {
        try {
            const url     = link_API+'api/update/status_id'
            const params  = {}
            const json    = {"row_id" : row_id, "status_id" : status_id, "status_note": status_note,"note": note}
            const options = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
            }
            const res = await axios.post(url, json, options)
            console.log(res.status)

            if (res.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                icon: 'success',
                title: 'อัพเดทสำเร็จ'
                })

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ไม่สามารถอัพเดทได้'
                })
            }

        } catch (error) {
            console.error(error)
          }
        },

        update_status(){

            if (this.selected === '5'){
                // let status_note = `${this.status_note} ลงชื่อ : ${this.fullname}`;
                let status_note = {"note":this.status_note, "fullname":this.fullname}

                this.api_update_status_id(this.projects.id, 5, status_note, this.note)
            }
            if (this.selected === '6'){
                let status_note = {"note":'', "fullname":""}

                this.api_update_status_id(this.projects.id,6, status_note, this.note)
            }
            setTimeout(() => { this.api_get_project_id() }, 1000)
        },

        update_note(i){
            if (i == 1){
                let status_note = {"note":this.status_note, "fullname":""}

                this.api_update_status_id(this.projects.id, this.projects.status_id, status_note, this.note)
                setTimeout(() => { this.api_get_project_id() }, 1000)
            }else{
                this.note = this.projects.note
            }
        },
        
        select_page(i){
            this.page = i
        }
    }
};
</script>

<template >
    <NavBar/>
    <div class="container">
        <nav aria-label="breadcrumb" style="margin-top:47px;">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="../">โครงการทั้งหมด</a></li>
                <li class="breadcrumb-item active fw-bold" aria-current="page">โครงการเปิดโอกาส</li>
            </ol>
        </nav>
    </div>
    <div v-if="this.projects.length != 0" class="container p-3" style="margin-top: 44px;">
        <div class="row ef">
            <div class="col-md-8">
                <div class="d-flex align-items-center">
                    <div class="col fw-bold fs-4">
                        <span>{{ this.projects.name }}</span>
                    </div>
                    <div class="col-auto">
                        <button v-if="this.projects.status_id === 1 || this.projects.status_id === 2 || this.projects.status_id === 3 || this.projects.status_id === 4" type="button" class="btn btn-primary" style="border-color:#000000;background:#000000;color:#FFFFFF;font-size:14px;">ดำเนินการอยู่</button>
                        <button v-if="this.projects.status_id === 5 " type="button" class="btn btn-primary" style="border-color:#000000;background:#000000;color:#FFFFFF;font-size:14px;">ระงับการดำเนินการโครงการ</button>
                        <button v-if="this.projects.status_id === 6 " type="button" class="btn btn-primary" style="border-color:#000000;background:#000000;color:#FFFFFF;font-size:14px;">ดำเนินการเสร็จสิ้นแล้ว</button>
                    </div>
                </div>
                <div>
                    <span class="pe-1 fw-bolder" style="font-size:13px;">{{ this.projects.communityname }}</span>
                    <span style="color: rgb(151, 151, 151); font-size:13px;">{{ this.projects.districtname }}</span>
                </div>

                <!-- img -->
                <div class="pt-2">
                    <img style="width: 100%; height: auto;" :src="imageData" alt="">
                </div>
                
            
                <div style="padding-top: 30px; padding-bottom: 10px;">
                    <span v-if="this.page == 1" class="fw-bolder fs-4" @click="select_page(1)">รายละเอียดโครงการ </span>
                    <span v-else class="fw-bolder fs-4" style="color: #b4b4b4;" @click="select_page(1)">รายละเอียดโครงการ </span>

                    <span v-if="this.page == 2" class="fs-4"  @click="select_page(2)"> | อัปเดต </span>
                    <span v-else class="fs-4" style="color: #b4b4b4;" @click="select_page(2)"> | อัปเดต </span>

                    <span v-if="this.page == 3" class="fs-4"  @click="select_page(3)"> | เอกสารโครงการ และ แผนการใช้เงิน </span>
                    <span v-else class="fs-4" style="color: #b4b4b4;" @click="select_page(3)"> | เอกสารโครงการ และ แผนการใช้เงิน </span>
                </div>

                <!-- รายละเอียดโครงการ -->
                <div v-if="page == 1" class="ef" v-html="this.projects.description"></div>
                <!-- อัปเดต -->
                <update v-if="page == 2" :data_list_props="this.projects.list_update.data"></update>
                <!-- เอกสารโครงการ และ แผนการใช้เงิน -->
                <docs v-if="page == 3" :data_list_props="this.projects"></docs>
                
            </div>
            
            <div class="col-md-4">
 
                <!-- การมีส่วนรวมจากชุมชน -->
                <div class="p-2" style="width-min: 250px;  border: 3px solid rgb(175, 175, 175); border-radius: 10px">
                    <p class="fw-bold">การมีส่วนรวมจากชุมชน</p>
                    <!-- role != 1 -->
                    <p v-if="this.role != 1 || this.projects.create_email != this.email" >{{ this.projects.note}}</p>

                    <!-- role == 1 -->
                    <div  v-if="this.role == 1 && this.projects.create_email == this.email ">
                        <div class="mb-3">
                            <textarea class="form-control" rows="3" style="height: 200px;" v-model="note">{{ this.projects.note}}</textarea>
                        </div>
                        <div v-if="this.projects.note != this.note" class="text-center">
                            <button type="button" class="btn btn-primary m-2 ef" @click="update_note(1)">บันทึก</button>
                            <button type="button" class="btn btn-danger ef" @click="update_note(0)">ยกเลิก</button>
                        </div>
                    </div>
                    <!-- <div v-if="this.projects.note == this.note" class="text-center">
                        <button type="button" class="btn" style="background-color: #EF4D4E; color : white; width : 100%">Follow โครงการ</button>
                    </div> -->
                </div>

                <!-- ประเมินโครงการโดยภาครัฐ -->
                <div v-if="this.role != 4" class="p-2" style="width-min: 250px;  border: 3px solid rgb(75, 75, 75); border-radius: 10px; margin-top : 50px;">
                    <p class="fw-bold">ประเมินโครงการโดยภาครัฐ</p>
                    <p>{{ this.projects.date }}</p>
                    <p>สถานะ :</p>
                    <p class="fw-bold mt-1" style="font-size: 14px">{{ this.status_text }}</p>
                    <!-- ยกเลิก -->
                    <div v-if="this.projects.status_note.note != ''" style="background-color: #3f3f3f; color : white;" class="alert mt-2 ef" role="alert">
                        <span>เหตุผลการยกเลิก :</span><br>
                        <span >{{ this.projects.status_note.note}}</span><br>
                        <p class="pt-3">ลงชื่อ : {{ this.projects.status_note.fullname}} (เจ้าหน้าที่)</p>
                    </div>
                </div>
                
                <!-- ประเมินโครงการโดยภาครัฐ -->
                <div v-if="this.role == 4" class="p-2" style="width-min: 250px;  border: 3px solid rgb(75, 75, 75); border-radius: 10px; margin-top : 50px;">
                    <p class="fw-bold">ประเมินโครงการโดยภาครัฐ</p>
                    <p class="fw-bold">{{ this.projects.date }}</p>
                    <p>สถานะ :</p>
                    <select class="form-select mt-1" aria-label="Default select example" v-model="selected">
                        <option :value="status_text">{{ status_text }}</option>
                        <option value="6">ดำเนินการเสร็จสิ้น</option>
                        <option value="5">ระงับการดำเนินโครงการ</option>
                    </select>
                    
                    <!-- ยกเลิก -->
                    <div v-if="this.projects.status_note.note != ''" style="background-color: #3f3f3f; color : white;" class="alert mt-2 ef" role="alert">
                        <span>เหตุผลการยกเลิก :</span><br>
                        <span >{{ this.projects.status_note.note}}</span><br>
                        <p class="pt-3">ลงชื่อ : {{ this.projects.status_note.fullname}} (เจ้าหน้าที่)</p>
                    </div>
                    <div v-if="this.status_text != this.selected" class="text-center pt-2">
                        <div v-if="this.selected == '5'" class="form-floating ">
                            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px" v-model="status_note"></textarea>
                            <label for="floatingTextarea2">เหตุผลการยกเลิก</label>
                        </div>
                        <div v-if="this.status_note != '' || this.selected === '6'">
                            <button type="button" class="btn btn-primary m-2 ef" @click="update_status()">บันทึก</button>
                            <button type="button" class="btn btn-danger ef" @click="update_status()">ยกเลิก</button>
                        </div>
                    </div>
                    
                </div>

            </div>
            
        </div>
    </div>

    <!-- load projects.length === 0 -->
    <div v-if="this.projects.length === 0" class="border-grey bg-white p-3 tab-content" style="margin-top:64px;">
        <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div v-for="i in 1" class="col-sm-3 mb-4">
                        <div class="card ef">
                            <div class="overlay-container p-2">
                                <i class="load-3"></i><br>
                                <i class="load-4"></i><br>
                                <i class="load-3"></i><br>
                                <i class="load-4"></i><br>
                                <i class="load-3"></i><br>
                                <i class="load-4"></i><br>
                                <i class="load-3"></i><br>
                                <i class="load-4"></i><br>
                            </div>
                            <div class="card-body"> 
                                <p class="card-text" style="font-size: 14px; font-weight: 400;"><i class="load-3"></i></p>
                                <p style="font-size: 14px; font-weight: 400;"></p>
                                <p style="font-size: 14px; font-weight: 400;"><i class="load-4"></i><span style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <i class="load-1"></i>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <i class="load-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>

</template>

<style scoped>
.btn-outline-secondary:hover {
    background-color: white !important;
    color: #606060;
}
.c-1{
    /* background-color: rgb(121, 121, 121); */
    border: 2px solid rgb(78, 78, 78);
}

.c-2{
    border: 2px solid rgb(0, 88, 110);
}
</style>
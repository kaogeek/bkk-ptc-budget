<script>
import Swal from 'sweetalert2'
// token ใช้ใน api
const token = '***REMOVED***>'
// const link_API = 'http://bkkpb.ath.cx/'
const link_API = 'http://localhost:8090/'


export default {
    data() {
        return {
            districts: [],
            districtOption: '',
            subdistricts: [],
            subDistrictOption: '',
            zipcode: {
                zip_code: '',
            },
            roles: [],
            communities: [],
            communitiesOption: '',
            form: {
                title: "",
                fullname: "",
                position: "",
                address: "",
                phone: "",
                email: "",
                district: "",
                subdistrict: "",
                zipcode: "",
                community: "",
                password: "",
            },
        };
    },
    mounted() {
        // api/districts
        this.fetchDistrictData();
        this.fetchRoleData();
    },
    methods: {
        // api/districts
        async fetchDistrictData() {
            try {
                const response = await fetch(link_API+'api/districts');
                const data = await response.json();
                this.districts = data['data'];
            } catch (error) {
                console.error(error);
            }
        },

        districtSelect(event) {
            this.selected = event.target.value;
            this.fetchSubDistrictData(this.selected);
            this.fetchCommunityData(this.selected);
        },
        subDistrictSelect(event) {
            this.selected = event.target.value;
            this.fetchZipCodeData(this.selected);
        },
        async fetchSubDistrictData(id) {
            try {
                const response = await fetch(link_API+'api/subdistrict/' + id);
                const data = await response.json();
                this.subdistricts = data['data'];
            } catch (error) {
                console.error(error);
            }
        },
        // ชุมชน
        async fetchCommunityData(id) {
            try {
                const response = await fetch(link_API+'api/community/district/' + id);
                const data = await response.json();
                this.communities = data['data'];
            } catch (error) {
                console.error(error);
            }
        },

        // ตำแหน่ง
        async fetchRoleData() {
            try {
                const response = await fetch(link_API+'api/role');
                const data = await response.json();
                this.roles = data['data'];
            } catch (error) {
                console.error(error);
            }
        },

        // รหัสไปรษณีย์
        async fetchZipCodeData(id) {
            try {
                const response = await fetch(link_API+'api/zipcode/' + id);
                const data = await response.json();
                this.form.zipcode = data['data'][0].zip_code;

            } catch (error) {
                console.error(error);
            }
        },
        
        // pi/user/register
        handleSubmit: async function () {
            
            if (this.form.title != "" && this.form.fullname != "" 
                && this.form.position != "" && this.form.address != "" 
                && this.form.phone != "" && this.form.email != "" 
                && this.form.district != "" && this.form.subdistrict != "" 
                && this.form.zipcode != "" && this.form.community != "" 
                && this.form.password != ""){
                try {
                const response = await fetch(link_API+'api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                if (response.status === 200) {

                    // แปลงข้อมูลเป็น json
                    const res_json = await response.json();
            
                    // สมัครสมาชิกเรียบร้อยแล้ว
                    if (res_json.status === 200 ){
                        sessionStorage.setItem('auth-token', res_json.token)
                        Swal.fire({
                            icon: 'success',
                            title: '',
                            text: res_json.statusMsg,
                            timer: 1500
                            }).then((result) => {
                                this.$router.push('/signin')
                            })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Opos',
                            text: res_json.statusMsg,
                            timer: 2000
                        })
                    }


                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Opos',
                        text: 'สมัครสมาชิกล้มเหลว',
                        timer: 2000
                    })
                    console.error('Request failed with status');
                }

                } catch (error) {
                    console.error(error);
                }
            }else{
                // กรอกข้อมูลให้ครบถ้วน
                Swal.fire({
                    icon: 'warning',
                    title: 'Opos',
                    text: 'กรอกข้อมูลให้ครบถ้วน !!',
                    timer: 2000
                })
            }
        }
    }
};

</script>'

<template>
    <Head>
        <Title>ชุมชนโปร่งใส - สมัครสมาชิก</Title>
    </Head>
    <NavBar />
    <div class="container" style="margin-top:94px;">
        <!-- test -->
        <!-- <p class="c-1" style="color :rgba(1, 243, 102, 0.699)">dev_msg : {{ this.form }}</p> -->

        <p style="font-size:36px;font-weight:100;" class="text-center">สมัครสมาชิก</p>
        <div class="row">
            <section class="h-100 h-custom">
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-lg-8 col-xl-6">
                            <div class="card rounded-3">
                                <div class="card-body p-4 p-md-5">
                                    <form class="px-md-2" @submit.prevent="handleSubmit">
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">คำนำหน้าชื่อ</label>
                                            <select class="select form-control" v-model="form.title">
                                                <option value="">นาย นาง นางสาว</option>
                                                <option value="นาย">นาย</option>
                                                <option value="นาง">นาง</option>
                                                <option value="นางสาว">นางสาว</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">ชื่อ นามสกุล</label>
                                            <input type="text" id="fullname" class="form-control" placeholder="ชื่อจริง และนามสกุล"
                                                v-model="form.fullname" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">ตำแหน่ง</label>
                                            <select class="select form-control" v-model="form.position">
                                                <option value="">ตำแหน่ง</option>
                                                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.rolename }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">ที่อยู่</label>
                                            <textarea id="address" class="form-control" placeholder="ที่อยู่"
                                                v-model="form.address" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">เบอร์โทรศัพท์</label>
                                            <input type="text" id="phone" class="form-control" placeholder="เบอร์โทรศัพท์"
                                                v-model="form.phone" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">อีเมล์</label>
                                            <input type="email" id="email" class="form-control" placeholder="อีเมล์"
                                                v-model="form.email" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">เขต/อำเภอ</label>
                                            <select class="select form-control" v-model="form.district" @change="districtSelect($event)">
                                                <option value="">เขต/อำเภอ</option>
                                                <option v-for="district in districts" :key="district.district_id" :value="district.district_id">{{ district.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">แขวง/ตำบล</label>
                                            <select class="select form-control" readonly v-model="form.subdistrict"
                                                @change="subDistrictSelect($event)">
                                                <option value="">แขวง/ตำบล</option>
                                                <option v-for="subdistrict in subdistricts" :key="subdistrict.id"
                                                    :value="subdistrict.id">{{ subdistrict.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">รหัสไปรษณีย์</label>
                                            <input type="text" id="zipcode" class="form-control" placeholder="รหัสไปรษณีย์"
                                                v-model="form.zipcode" readonly />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">ชุมชน</label>
                                            <select class="select form-control" readonly v-model="form.community">
                                                <option value="">ชุมชน</option>
                                                <option v-for="community in communities" :key="community.id" :value="community.id">{{ community.communityname }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">รหัสผ่าน</label>
                                            <input type="password" id="password" class="form-control" placeholder="รหัสผ่าน" v-model="form.password" />
                                        </div>
                                        <div class="text-center">
                                            <button type="submit" class="btn btn-success btn-lg mb-1 pull-right" style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;">สมัครสมาชิก</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <Footer/>
    </div>
</template>

<style>
.c-1{
    background-color: #494949
}
</style>

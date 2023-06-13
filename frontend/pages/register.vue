<template>
    <NavBar />
    <div class="container" style="margin-top:94px;">
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
                                            <select class="select form-control" v-model="form.title">
                                                <option value="">คำนำหน้าชื่อ</option>
                                                <option value="นาย">นาย</option>
                                                <option value="นาง">นาง</option>
                                                <option value="นางสาว">นางสาว</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="firstname" class="form-control" placeholder="ชื่อ"
                                                v-model="form.firstname" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="lastname" class="form-control" placeholder="นามสกุล"
                                                v-model="form.lastname" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <select class="select form-control" v-model="form.position">
                                                <option value="">ตำแหน่ง</option>
                                                <option v-for="role in roles" :key="role.id" :value="role.id">{{
                                                    role.rolename }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="phone" class="form-control" placeholder="เบอร์โทร"
                                                v-model="form.phone" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="email" id="email" class="form-control" placeholder="อีเมล์"
                                                v-model="form.email" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <select class="select form-control" v-model="form.district"
                                                @change="districtSelect($event)">
                                                <option value="">เขต/อำเภอ</option>
                                                <option v-for="district in districts" :key="district.district_id"
                                                    :value="district.district_id">{{ district.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <select class="select form-control" readonly v-model="form.subdistrict"
                                                @change="subDistrictSelect($event)">
                                                <option value="">แขวง/ตำบล</option>
                                                <option v-for="subdistrict in subdistricts" :key="subdistrict.id"
                                                    :value="subdistrict.id">{{ subdistrict.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="zipcode" class="form-control" placeholder="รหัสไปรษณีย์"
                                                v-model="form.zipcode" readonly />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="community" class="form-control" placeholder="ชุมชน"
                                                v-model="form.community" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="password" id="password" class="form-control" placeholder="รหัสผ่าน"
                                                v-model="form.password" />
                                        </div>
                                        <button type="submit" class="btn btn-success btn-lg mb-1">สมัครสมาชิก</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
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
            form: {
                title: "",
                firstname: "",
                lastname: "",
                position: "",
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
        this.fetchDistrictData();
        this.fetchRoleData();
    },
    methods: {
        async fetchDistrictData() {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/districts');
                const data = await response.json();
                this.districts = data['data'];
            } catch (error) {
                console.error(error);
            }
        },
        districtSelect(event) {
            this.selected = event.target.value;
            this.fetchSubDistrictData(this.selected);
        },
        subDistrictSelect(event) {
            this.selected = event.target.value;
            this.fetchZipCodeData(this.selected);
        },
        async fetchSubDistrictData(id) {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/subdistrict/' + id);
                const data = await response.json();
                this.subdistricts = data['data'];
            } catch (error) {
                console.error(error);
            }
        },
        async fetchRoleData() {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/role');
                const data = await response.json();
                this.roles = data['data'];
            } catch (error) {
                console.error(error);
            }
        },
        async fetchZipCodeData(id) {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/zipcode/' + id);
                const data = await response.json();
                this.form.zipcode = data['data'][0].zip_code;

            } catch (error) {
                console.error(error);
            }
        },
        handleSubmit: async function () {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                if (response.ok) {

                    const responseData = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: 'สมัครสมาชิกเรียบร้อยแล้ว',
                        timer: 1500
                    }).then((result) => {
                        this.$router.push('/')
                    })

                } else {

                    console.error('Request failed with status', response.status);
                }
            } catch (error) {

                console.error(error);
            }
        }
    }
};
</script>
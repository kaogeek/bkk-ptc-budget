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
                                    <form class="px-md-2">
                                        <div class="form-outline mb-4">
                                            <select class="select form-control">
                                                <option value="">คำนำหน้าชื่อ</option>
                                                <option value="นาย">นาย</option>
                                                <option value="นาง">นาง</option>
                                                <option value="นางสาว">นางสาว</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="firstname" class="form-control" placeholder="ชื่อ" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="lastname" class="form-control" placeholder="นามสกุล" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="position" class="form-control" placeholder="ตำแหน่ง" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="phone" class="form-control" placeholder="เบอร์โทร" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="email" id="email" class="form-control" placeholder="อีเมล์" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <select class="select form-control" v-model="districtOption"
                                                @change="districtSelect($event)">
                                                <option value="">อำเภอ</option>
                                                <option v-for="district in districts" :key="district.district_id"
                                                    :value="district.district_id">{{ district.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <select class="select form-control" readonly v-model="subDistrictOption"
                                                @change="subDistrictSelect($event)">
                                                <option value="">ตำบล</option>
                                                <option v-for="subdistrict in subdistricts" :key="subdistrict.id"
                                                    :value="subdistrict.id">{{ subdistrict.name_th }}</option>
                                            </select>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="text" id="zipcode" class="form-control" placeholder="รหัสไปรษณีย์" v-model="zipcode.zip_code"
                                                readonly />
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
        };
    },
    mounted() {
        this.fetchDistrictData();
    },
    methods: {
        async fetchDistrictData() {
            try {
                const response = await fetch('http://localhost:8090/api/districts');
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
                const response = await fetch('http://localhost:8090/api/subdistrict/' + id);
                const data = await response.json();
                this.subdistricts = data['data'];
            } catch (error) {
                console.error(error);
            }
        },
        async fetchZipCodeData(id) {
            try {
                const response = await fetch('http://localhost:8090/api/zipcode/' + id);
                const data = await response.json();
                this.zipcode = data['data'][0];
            } catch (error) {
                console.error(error);
            }
        },
    }
};
</script>
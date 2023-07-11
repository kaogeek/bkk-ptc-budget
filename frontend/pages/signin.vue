<script>
import Swal from 'sweetalert2'

import {baseUrl} from '../lib/config'


export default {
    data() {
        return {
            dev_msg: '',
            form: {
                email: "",
                password: ""
            },
        };
    },
    mounted() {

    },
    methods: {
        handleSubmit: async function () {
            if (this.form.email != "" && this.form.password){
                try {
                const response = await fetch(baseUrl+'api/user/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

            
                if (response.status === 200) {

                    const res_json = await response.json();

                    // เข้าสู่ระบบเรียบร้อยแล้ว
                    if (res_json.status === 200 ){
                        sessionStorage.setItem('auth-token', res_json.token)
                        Swal.fire({
                            icon: 'success',
                            title: '',
                            text: res_json.statusMsg,
                            timer: 1500
                        }).then((result) => {
                            this.$router.push('/')
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
                        text: '404 (584684)',
                        timer: 2000
                    })
                    console.error('Request failed with status', response.status);
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
</script>

<template>
    <Head>
        <Title>ชุมชนโปร่งใส - เข้าสู่ระบบ</Title>
    </Head>
    <NavBar />
    <!-- test -->
    <!-- <p class="c-1" style="color :rgba(1, 243, 102, 0.699)">dev_msg : {{ this.dev_msg }}</p> -->
    <div class="container" style="margin-top:94px;">
        <p style="font-size:36px;font-weight:100;" class="text-center">เข้าสู่ระบบ</p>
        <div class="row">
            <section class="h-100 h-custom">
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-lg-8 col-xl-6">
                            <div class="card rounded-3">
                                <div class="card-body p-4 p-md-5">
                                    <form class="px-md-2" @submit.prevent="handleSubmit">
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">อีเมล์</label>
                                            <input type="email" id="email" class="form-control" placeholder="อีเมล์"
                                                v-model="form.email" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label style="margin-bottom:15px;">รหัสผ่าน</label>
                                            <input type="password" id="password" class="form-control" placeholder="รหัสผ่าน"
                                                v-model="form.password" />
                                        </div>
                                        <div class="text-center">
                                            <button type="submit" class="btn btn-success btn-lg mb-1 pull-right"
                                                style="background:#EF4D4E;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;margin-right:32px;">เข้าสู่ระบบ</button>
                                                <NuxtLink to="forgot-password">
                                                    <button type="button" class="btn btn-lg mb-1 pull-right d-none"
                                                style="border-radius: 4px;color:#000000;font-size:14px;">ลืมรหัสผ่าน</button>
                                                </NuxtLink>
                                                
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <Footer/>
</template>
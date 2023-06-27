<template>
    <Head>
        <Title>ชุมชนโปร่งใส - เข้าสู่ระบบ</Title>
    </Head>
    <NavBar />
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
                                            <input type="email" id="email" class="form-control" placeholder="อีเมล์"
                                                v-model="form.email" />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <input type="password" id="password" class="form-control" placeholder="รหัสผ่าน"
                                                v-model="form.password" />
                                        </div>
                                        <div class="text-center">
                                            <button type="submit" class="btn btn-success btn-lg mb-1 pull-right"
                                                style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;">เข้าสู่ระบบ</button>
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
</template>
<script>
import Swal from 'sweetalert2'
export default {
    data() {
        return {
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
            try {
                const response = await fetch('http://localhost:8090/api/user/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                

                if (response.ok) {

                    const responseData = await response.json();
                    sessionStorage.setItem('auth-token', responseData.token)
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: 'เข้าสู่ระบบเรียบร้อยแล้ว',
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
<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4"
            style="margin-top:32px;">
            <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M62.4 28.6726C62.4 20.4179 55.2326 13.76 46.7853 14.9126C43.4553 9.34515 37.568 5.95264 31.04 5.95264C23.1053 5.95264 16.1926 11.0076 13.6947 18.4326H13.6297C7.03961 18.4326 1.59961 23.8726 1.59961 30.5274C1.59961 35.0724 4.15961 39.04 7.93459 41.0874C7.61459 43.7748 7.99958 46.5274 9.21459 49.0874L7.61459 53.8874C7.22959 55.0399 7.54959 56.3199 8.38207 57.1524C9.02207 57.7924 9.78956 58.1124 10.6221 58.1124C10.9421 58.1124 11.3271 58.0474 11.6471 57.9199L16.4471 56.3199C21.6321 58.7524 27.6471 57.9849 32.0618 54.3999C36.4768 57.9849 42.4292 58.7524 47.6765 56.3199L52.4765 57.9199C52.7965 58.0474 53.1816 58.1124 53.5016 58.1124C54.3341 58.1124 55.1666 57.7924 55.7416 57.1524C56.5741 56.3199 56.8941 55.0399 56.5091 53.8874L54.9091 49.0874C56.1891 46.2724 56.5741 43.2623 56.124 40.3821C59.839 37.8246 62.399 33.5347 62.399 28.672L62.4 28.6726ZM17.3453 52.8653C16.8977 52.6728 16.4503 52.6103 16.0002 52.7378L11.0727 54.4003L12.7378 49.4728C12.8653 49.0253 12.8653 48.5128 12.6103 48.1278C10.2428 43.6478 11.0753 38.2731 14.5953 34.7531C16.8353 32.5131 19.7803 31.4256 22.6606 31.4256C25.6056 31.4256 28.4856 32.5131 30.7258 34.7531C35.2058 39.2331 35.2058 46.4657 30.7258 50.8804C27.2009 54.4655 21.826 55.2329 17.346 52.8655L17.3453 52.8653ZM48 52.7353C47.8075 52.6703 47.615 52.6703 47.425 52.6703C47.17 52.6703 46.85 52.7353 46.5925 52.8628C42.5599 54.9753 37.8251 54.5278 34.3672 51.8378C38.4622 46.5252 38.4622 39.103 34.3672 33.7904C38.8472 30.3354 45.3125 30.5904 49.4072 34.7504C52.9272 38.2704 53.7597 43.6451 51.3922 48.1251C51.1997 48.5726 51.1372 49.0201 51.2647 49.4701L52.9297 54.3976L48 52.7353ZM51.905 32.3206C49.09 29.5056 45.3776 27.9681 41.345 27.9681C37.89 27.9681 34.625 29.1206 31.9997 31.2955C29.3747 29.183 26.1122 27.9681 22.6544 27.9681C18.6869 27.9681 14.9092 29.503 12.0944 32.3206C10.5595 33.8555 9.46941 35.6481 8.76694 37.5681C6.52694 36.0331 5.11946 33.4731 5.11946 30.5281C5.11946 25.7931 8.95946 21.9533 13.6942 21.9533C13.9492 21.9533 14.2067 22.0183 14.5267 22.0183L14.7817 22.0833C15.6767 22.2108 16.5092 21.6358 16.7017 20.8033C18.3042 14.0808 24.1916 9.40813 31.039 9.40813C36.6715 9.40813 41.7263 12.5431 44.2863 17.5355C44.6713 18.2405 45.4388 18.623 46.2063 18.4305C47.0388 18.238 47.7413 18.1755 48.4463 18.1755C54.2063 18.1755 58.879 22.848 58.879 28.6081C58.879 31.9356 57.279 34.8156 54.9115 36.7355C54.2065 35.1355 53.2465 33.6005 51.904 32.3205L51.905 32.3206Z"
                        fill="#EF4D4E" />
                    <path
                        d="M24.96 42.7526C24.96 45.8251 20.3525 45.8251 20.3525 42.7526C20.3525 39.6801 24.96 39.6801 24.96 42.7526Z"
                        fill="#EF4D4E" />
                    <path
                        d="M18.5601 42.7526C18.5601 45.8251 13.9526 45.8251 13.9526 42.7526C13.9526 39.6801 18.5601 39.6801 18.5601 42.7526Z"
                        fill="#EF4D4E" />
                    <path
                        d="M31.3599 42.7526C31.3599 45.8251 26.7524 45.8251 26.7524 42.7526C26.7524 39.6801 31.3599 39.6801 31.3599 42.7526Z"
                        fill="#EF4D4E" />
                </svg>

                <span style="font-size:32px;margin-left:19px;color:#606060;">ชุมชนโปร่งใส</span>
            </a>
            <div class="col-md-3 text-end">
                <button type="button" class="btn btn-outline-primary me-2"
                    style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;"
                    v-if="role == 1">เพิ่มโครงการ</button>

                <NuxtLink to="signin">
                    <button type="button" class="btn btn-outline-secondary me-2"
                        style="border:none;color:#606060;border-color:#EF4D4E;font-size:14px;">เข้าสู่ระบบ</button>
                </NuxtLink>
                <NuxtLink to="register">
                    <button type="button" class="btn btn-outline-secondary me-2"
                        style="border:none;color:#606060;border-color:#EF4D4E;font-size:14px;">สมัครสมาชิก</button>
                </NuxtLink>
            </div>
        </header>
    </div>
</template>
<style scoped>
.btn-outline-secondary:hover {
    background-color: white !important;
    color: #606060;
}
</style>
<script>
import jwt_decode from "jwt-decode";
const role = '';
export default {
    data() {
        return {
            role: ''
        }
    },
    mounted() {
        this.asyncData();

    },
    methods: {
        async asyncData() {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlMS5jb20iLCJyb2xlIjoiMSIsImlhdCI6MTY4NjY1MDMwOCwiZXhwIjoxNjg2NjUzOTA4fQ.iswSCk3QRJmdtvmXhzD0TaPGRiosSIm-XpT6BJLemxQ';
            // const token = sessionStorage.getItem('auth-token');
            var decoded = jwt_decode(token);

            this.role = decoded.role
        }
    }
}
</script>
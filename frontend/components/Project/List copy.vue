
<script >
import axios from 'axios'
import Swal from 'sweetalert2'

export default  {
    data() {
        return {
            projects           : [],
            projects_ongoing   : [],
            projects_completed : [],
            projects_suspended : [],
            imageData          : null,
            recordCount        : false,
            search             : '',
            api_url            : '',
            api_token          : '',
            show_items_now     : 2,
            show_items_set     : 6,
            show_items_start   : 0,
            show_items_end     : 6,
        };
    },
    watch: {
        search(newDate) {
            this.api_get_fetchProjectData()
        }
    },

    setup() {
        this.api_url = this.$config.public.baseApiUrl
        this.api_token = this.$config.tokenApi
    },

    mounted() {
        setTimeout(() => { this.api_get_fetchProjectData() }, 1500) 
    },

    methods: {
        // รับข้อมูล เก็บใน projects
        async api_get_fetchProjectData () {
        try {
            const url     = this.api_url+'api/project'
            const params  = {}
            const json    = {}
            const options = {
                headers: {
                    'Authorization': 'Bearer ' + this.api_token
                }
            }

            const res = await axios.get(url, json, options)

            if (res.status === 200){
                let res_data =  res.data.data.slice(this.show_items_start, this.show_items_end)
 
                for (let item of res_data) {
                    if (item.og_image ===''){
                        item.image = await this.api_get_img('0');
                    }else{
                        item.image = await this.api_get_img(item.og_image);
                    }
                }
                this.recordCount = false

                if (this.search === ''){
                    this.projects = res_data;
                    this.projects_ongoing = this.projects.filter(item => item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4);
                    this.projects_completed = this.projects.filter(item => item.status_id === 6);
                    this.projects_suspended = this.projects.filter(item => item.status_id === 5);
                    if ( res_data.length === 0){this.recordCount = true}

                }else{
                    const filteredItems = [];
                    this.projects = []
                    this.projects_ongoing = []
                    this.projects_suspended = []
                    for (const item of res_data) {
                        if (item.name.includes(this.search) || item.communityname.includes(this.search) || item.districtname.includes(this.search)) {
                            filteredItems.push(item);
                        }
                    }
                    this.projects = filteredItems
                    this.projects_ongoing = this.projects.filter(item => item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4);
                    this.projects_completed = this.projects.filter(item => item.status_id === 6);
                    this.projects_suspended = this.projects.filter(item => item.status_id === 5);
                    if ( filteredItems.length === 0){this.recordCount = true}
                }
            }else{
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'api/project status : '+res.status
                })
            }

        } catch (error) {
            console.error(error)
            }
        },
        async api_get_img(filename) {
            try {
                const url = this.api_url + 'api/images/' + filename;
                const options = {
                headers: {
                    'Authorization': 'Bearer ' + this.api_token
                },
                responseType: 'blob' // กำหนดให้รับข้อมูลเป็นไบนารี
                };

                const res = await axios.get(url, options);

                if (res.status === 200) {
                    const imageUrl = URL.createObjectURL(res.data); // สร้าง URL ของรูปภาพจากข้อมูลที่ได้รับ
                    return imageUrl
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
        click_search (){
            this.api_get_fetchProjectData()
        },
        previous() {
            if (this.show_items_start - this.show_items_set >=0){
                this.projects = [];
                this.projects_ongoing = [];
                this.projects_completed = [];
                this.projects_suspended = [];
                this.show_items_start = this.show_items_start - this.show_items_set
                this.show_items_end =  this.show_items_end - this.show_items_set
                if (this.show_items_now >= 0){
                    this.show_items_now     = this.show_items_now -1
                }
                this.api_get_fetchProjectData();
            }
        },
        next(){
            if (this.projects.length != 0){
                this.projects           = []
                this.projects_ongoing   = []
                this.projects_completed = []
                this.projects_suspended = []
                this.show_items_start   = this.show_items_end
                this.show_items_end     =  this.show_items_end + this.show_items_set
                this.show_items_now     = this.show_items_now +1
                this.api_get_fetchProjectData ()
            }
        },
        goToPage(pageNumber) {
            this.projects           = []
            this.projects_ongoing   = []
            this.projects_completed = []
            this.projects_suspended = []
            this.show_items_start = (pageNumber - 1) * this.show_items_set
            this.show_items_end = pageNumber * this.show_items_set
            this.api_get_fetchProjectData()
        }
    }
};

</script>

<template>
    <!-- ค้นหา -->
    <div class="container" style="margin-top: 94px;">
        <div class="row justify-content-center">
            <div class="col-sm-8 col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="ชื่อโครงการ, แขวง, ชื่อชุมชน"
                        style="font-size: 20px; color: #606060;" v-model="search">
                    <div class="input-group-append ps-2">
                        <button class="btn btn-primary" type="button" style="background: #EF4D4E; font-size: 14px; height: 100%;border-color:#EF4D4E;" @click="click_search">ค้นหา</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container d-flex justify-content-center align-items-center" style="margin-top:16px;">
        <div class="statuses">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation" style="margin-right:16px;">
                    <button class="active nav-link" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all" aria-selected="true" style="width: 74px;height: 34px;">ทั้งหมด</button>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation"> 
                    <a class="nav-link" id="ongoing-tab" data-bs-toggle="tab" data-bs-target="#ongoing" role="tab" aria-controls="all" aria-selected="true"> ดำเนินการอยู่</a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" role="tab" aria-controls="all" aria-selected="true"> ดำเนินการเสร็จสิ้นแล้ว </a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="suspended-tab" data-bs-toggle="tab" data-bs-target="#suspended" role="tab" aria-controls="all" aria-selected="true"> ระงับการดำเนินการโครงการ </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="container d-flex justify-content-center align-items-center" style="margin-top:16px;">
        <div class="statuses">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation" style="margin-right:16px;">
                    <button class="active nav-link" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all" aria-selected="true" style="width: 74px;height: 34px;">ทั้งหมด</button>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation"> 
                    <a class="nav-link" id="ongoing-tab" data-bs-toggle="tab" data-bs-target="#ongoing" role="tab" aria-controls="all" aria-selected="true"> ดำเนินการอยู่</a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" role="tab" aria-controls="all" aria-selected="true"> ดำเนินการเสร็จสิ้นแล้ว </a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="suspended-tab" data-bs-toggle="tab" data-bs-target="#suspended" role="tab" aria-controls="all" aria-selected="true"> ระงับการดำเนินการโครงการ </a>
                </li>
            </ul>
        </div>
    </div>

    
    <div v-if="recordCount === true">
        <div class="container" style="margin-top:64px;">
            <div class="alert alert-danger text-center" role="alert">
                ขณะนี้ยังไม่มีข้อมูลโครงการ !
            </div>
        </div>
    </div>
    
    <!-- load projects.length === 0 -->
    <div v-if="this.projects.length === 0 && recordCount != true"  class="border-grey bg-white p-3 tab-content" style="margin-top:64px;">
        <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-sm-3 mb-4" v-for="i in 1">
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
    
    <!-- projects.length != 0 -->
    <div class="border-grey bg-white p-3 tab-content" style="margin-top:64px;" v-if="this.projects.length != 0">
        <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-sm-4 mb-4" v-for="item in projects">
                        <div class="card ef">
                            <div class="overlay-container">
                                <img style="height: 300px" class="card-img-top" :src="item.image" alt="Card image cap ">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label" v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้น</span>
                                </div>
                            </div>
                            <div class="card-body"> 
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px;">{{ item.short_description}}</p>
                                <p class="fw-bolder" style="font-size: 15px; font-weight: 400;">{{ item.hashtag}}<span style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                                <p class="fw-bolder" style="font-size: 14px; font-weight: 400;">{{item.communityname}}<span class="fw-normal ps-1"> {{item.districtname}}</span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between d-none">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <i class="bi bi-person-plus"></i>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <i class="bi bi-share"></i>
                                        <span class="count" style="margin-left:15px;">500</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav class="text-center">
                        <span v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                            <nuxt-link :to="`/${page}`">{{ page }}</nuxt-link>
                        </span>
                    </nav>
                </div>
            </div>
        </div>
        
        <div class="tab-pane" id="ongoing" role="tabpanel" aria-labelledby="ongoing-tab">
            <div class="container">
                <div class="row justify-content-center">
                    
                    <div v-if="this.projects_ongoing.length == 0" class="container ef" style="margin-top:64px;">
                        <div class="alert alert-danger text-center" role="alert">
                            ขณะนี้ยังไม่มีข้อมูลโครงการ !
                        </div>
                    </div>

                    <div class="col-sm-4 mb-4" v-for="item in projects_ongoing">
                        <div class="card ef">
                            <div class="overlay-container">
                                <img style="height: 300px" class="card-img-top" :src="item.image" alt="Card image cap ">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label" v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้น</span>
                                </div>
                            </div>
                            <div class="card-body"> 
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px;">{{ item.short_description}}</p>
                                <p class="fw-bolder" style="font-size: 15px; font-weight: 400;">{{ item.hashtag}}<span style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                                <p class="fw-bolder" style="font-size: 14px; font-weight: 400;">{{item.communityname}}<span class="fw-normal ps-1"> {{item.districtname}}</span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between d-none">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <i class="bi bi-person-plus"></i>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <i class="bi bi-share"></i>
                                        <span class="count" style="margin-left:15px;">500</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                      <nav class="text-center">
                            <span v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                                <nuxt-link :to="`/${page}`">{{ page }}</nuxt-link>
                            </span>
                    </nav>
                </div>
            </div>
        </div>
       
        <div class="tab-pane" id="completed" role="tabpanel" aria-labelledby="completed-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div v-if="this.projects_completed.length == 0" class="container ef" style="margin-top:64px;">
                        <div class="alert alert-danger text-center" role="alert">
                            ขณะนี้ยังไม่มีข้อมูลโครงการ !
                        </div>
                    </div>
                    <div class="col-sm-4 mb-4" v-for="item in projects_completed">
                        <div class="card ef">
                            <div class="overlay-container">
                                <img style="height: 300px" class="card-img-top" :src="item.image" alt="Card image cap ">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label" v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้น</span>
                                </div>
                            </div>
                            <div class="card-body"> 
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px;">{{ item.short_description}}</p>
                                <p class="fw-bolder" style="font-size: 15px; font-weight: 400;">{{ item.hashtag}}<span style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                                <p class="fw-bolder" style="font-size: 14px; font-weight: 400;">{{item.communityname}}<span class="fw-normal ps-1"> {{item.districtname}}</span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between d-none">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <i class="bi bi-person-plus"></i>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <i class="bi bi-share"></i>
                                        <span class="count" style="margin-left:15px;">500</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav class="text-center">

                        <span v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                            <nuxt-link :to="`/${page}`">{{ page }}</nuxt-link>
                        </span>

                    </nav>
                </div>
            </div>
        </div>
        
        <div class="tab-pane" id="suspended" role="tabpanel" aria-labelledby="suspended-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div v-if="this.projects_suspended.length == 0" class="container ef" style="margin-top:64px;">
                        <div class="alert alert-danger text-center" role="alert">
                            ขณะนี้ยังไม่มีข้อมูลโครงการ !
                        </div>
                    </div>
                    <div class="col-sm-4 mb-4" v-for="item in projects_suspended">
                        <div class="card ef">
                            <div class="overlay-container">
                                <img style="height: 300px" class="card-img-top" :src="item.image" alt="Card image cap ">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label" v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้น</span>
                                </div>
                            </div>
                            <div class="card-body"> 
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px;">{{ item.short_description}}</p>
                                <p class="fw-bolder" style="font-size: 15px; font-weight: 400;">{{ item.hashtag}}<span style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                                <p class="fw-bolder" style="font-size: 14px; font-weight: 400;">{{item.communityname}}<span class="fw-normal ps-1"> {{item.districtname}}</span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between d-none">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <i class="bi bi-person-plus"></i>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <i class="bi bi-share"></i>
                                        <span class="count" style="margin-left:15px;">500</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav class="text-center">

                        <span v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                            <nuxt-link :to="`/${page}`">{{ page }}</nuxt-link>
                        </span>

                    </nav>
                </div>
            </div>
        </div>
    </div>
   
    <div class="text-center">
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item disabled" @click="previous()">
                <a class="page-link m-2" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>
                <li class="page-item"><a class="page-link m-2" href="#" @click="goToPage(show_items_now - 1)">{{ this.show_items_now - 1 }}</a></li>
                <li class="page-item"><a class="page-link m-2" href="#" @click="goToPage(show_items_now)">{{ this.show_items_now }}</a></li>
                <li class="page-item"><a class="page-link m-2" href="#" @click="goToPage(show_items_now + 1)">{{ this.show_items_now + 1 }}</a></li>
                <li class="page-item">
                <a class="page-link m-2" @click="next()">Next</a>
                </li>
            </ul>
        </nav>
    </div>

</template>

<style scoped>
.c-1{
    background-color: #494949
}
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
    color: #EF4D4E;
    background-color: var(--bs-nav-tabs-link-active-bg);
    border: none !important;

}

.nav-tabs .nav-link {
    margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width));
    border: none !important;
    color: #606060;
}

.nav-tabs {
    --bs-nav-tabs-border-width: var(--bs-border-width);
    --bs-nav-tabs-border-color: var(--bs-border-color);
    --bs-nav-tabs-border-radius: var(--bs-border-radius);
    --bs-nav-tabs-link-hover-border-color: var(--bs-secondary-bg) var(--bs-secondary-bg) var(--bs-border-color);
    --bs-nav-tabs-link-active-color: var(--bs-emphasis-color);
    --bs-nav-tabs-link-active-bg: var(--bs-body-bg);
    --bs-nav-tabs-link-active-border-color: var(--bs-border-color) var(--bs-border-color) var(--bs-body-bg);
    border-bottom: none !important;
}

.card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-body {
    flex: 1;
}

.overlay-container {
    position: relative;
}

.overlay {
    position: absolute;
    width: 105px;
    height: 26px;
    right: 4px;
    top: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
}

.status-label {
    font-family: 'Sarabun';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    text-align: center;

    /* Wireframe/White */
    color: #FFFFFF;
}
</style>
<template>
    <div class="container d-flex justify-content-center align-items-center" style="margin-top:16px;">
        <div class="statuses">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation" style="margin-right:16px;">
                    <button class="active nav-link" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab"
                        aria-controls="all" aria-selected="true" style="width: 74px;height: 34px;">
                        ทั้งหมด
                    </button>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="ongoing-tab" data-bs-toggle="tab" data-bs-target="#ongoing" role="tab"
                        aria-controls="all" aria-selected="true">
                        ดำเนินการอยู่
                    </a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" role="tab"
                        aria-controls="all" aria-selected="true">
                        ดำเนินการเสร็จสิ้นแล้ว
                    </a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="suspended-tab" data-bs-toggle="tab" data-bs-target="#suspended" role="tab"
                        aria-controls="all" aria-selected="true">
                        ระงับการดำเนินการโครงการ
                    </a>
                </li>
            </ul>
        </div>

    </div>
    <div v-if="recordCount == 0">
        <div class="container" style="margin-top:64px;">
            <div class="alert alert-danger" role="alert">
                ขณะนี้ยังไม่มีข้อมูลโครงการ !
            </div>
        </div>
    </div>
    <div class="border-grey bg-white p-3 tab-content" style="margin-top:64px;" v-else>
        <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-sm-3 mb-4" v-for="item in projects">
                        <div class="card">
                            <div class="overlay-container">
                                <img class="card-img-top" src="https://placehold.co/267x142?text=No+Image"
                                    alt="Card image cap">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label"
                                        v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับการดำเนินการโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้นแล้ว</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400;">
                                    {{ item.short_description }}
                                </p>
                                <p style="font-size: 14px; font-weight: 400;"></p>
                                <p style="font-size: 14px; font-weight: 400;">ชุมชน<span
                                        style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <span class="bi bi-person-plus"></span>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <span class="bi bi-share"></span>
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
                    <div class="col-sm-3 mb-4" v-for="item in projects_ongoing">
                        <div class="card">
                            <div class="overlay-container">
                                <img class="card-img-top" src="https://placehold.co/267x142?text=No+Image"
                                    alt="Card image cap">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label"
                                        v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับการดำเนินการโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้นแล้ว</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400;">
                                    {{ item.short_description }}
                                </p>
                                <p style="font-size: 14px; font-weight: 400;"></p>
                                <p style="font-size: 14px; font-weight: 400;">ชุมชน<span
                                        style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <span class="bi bi-person-plus"></span>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <span class="bi bi-share"></span>
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
                    <div class="col-sm-3 mb-4" v-for="item in projects_completed">
                        <div class="card">
                            <div class="overlay-container">
                                <img class="card-img-top" src="https://placehold.co/267x142?text=No+Image"
                                    alt="Card image cap">
                                <div class="overlay">
                                    <!-- Status Labels -->
                                    <span class="status-label"
                                        v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับการดำเนินการโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้นแล้ว</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size: 20px; font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size: 14px; font-weight: 400;">
                                    {{ item.short_description }}
                                </p>
                                <p style="font-size: 14px; font-weight: 400;"></p>
                                <p style="font-size: 14px; font-weight: 400;">ชุมชน<span
                                        style="color: #B8B8B8; font-size: 14px; font-weight: 400;"></span></p>
                            </div>
                            <!-- Card Footer -->
                            <div class="card-footer d-flex justify-content-between">
                                <div class="follow-container">
                                    <button class="btn btn-primary btn-transparent">
                                        <span class="bi bi-person-plus"></span>
                                        <span class="count" style="margin-left:15px;">1000</span>
                                    </button>

                                </div>
                                <div class="share-container">
                                    <button class="btn btn-secondary btn-transparent">
                                        <span class="bi bi-share"></span>
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
                    <div class="col-sm-3 mb-4" v-for="item in projects_suspended">
                        <div class="card">
                            <div class="overlay-container">
                                <img class="card-img-top" src="https://placehold.co/267x142?text=No+Image"
                                    alt="Card image cap">
                                <div class="overlay">
                                    <span class="status-label"
                                        v-if="item.status_id === 1 || item.status_id === 2 || item.status_id === 3 || item.status_id === 4">ดำเนินการอยู่</span>
                                    <span class="status-label" v-if="item.status_id === 5">ระงับการดำเนินการโครงการ</span>
                                    <span class="status-label" v-if="item.status_id === 6">ดำเนินการเสร็จสิ้นแล้ว</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <nuxt-link :to="`/project/${item.id}`">
                                    <h5 class="card-title" style="font-size:20px;font-weight: 700;">{{ item.name }}</h5>
                                </nuxt-link>
                                <p class="card-text" style="font-size:14px;font-weight:400;">
                                    {{ item.short_description }}
                                </p>
                                <p style="font-size:14px;font-weight:400;"></p>
                                <p style="font-size:14px;font-weight:400;"><span
                                        style="color:#B8B8B8;font-size:14px;font-weight:400;"></span></p>
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
</template>
<script>
export default {
    computed: {
        currentPage() {
            return Number(this.$route.params.page) || 1;
        },
        totalPages() {
            return Math.ceil(this.recordCount / 12);
        },
        pages() {
            const range = [];
            for (let i = 1; i <= this.totalPages; i++) {
                range.push(i);
            }
            return range;
        },
    },
    data() {
        return {
            projects: [],
            projects_ongoing: [],
            projects_completed: [],
            projects_suspended: [],
            recordCount: ''
        };
    },
    mounted() {
        this.fetchProjectData();
    },
    methods: {
        async fetchProjectData() {
            try {
                const response = await fetch('http://bkkpb.ath.cx/api/project');
                const data = await response.json();
                const dataLength = data.data.length;
                this.recordCount = dataLength;
                this.projects = data.data;
                this.projects_ongoing = this.projects.filter(item => item.status_id === 2 || item.status_id === 3 || item.status_id === 4);
                this.projects_completed = this.projects.filter(item => item.status_id === 6);
                this.projects_suspended = this.projects.filter(item => item.status_id === 5);


            } catch (error) {
                console.error(error);
            }
        },
    }
};
</script>

<style scoped>
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
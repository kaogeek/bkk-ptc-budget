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
                        ดำเนินอยู่
                    </a>
                </li>
                <span style="margin-right:16px;">|</span>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" role="tab"
                        aria-controls="all" aria-selected="true">
                        เสร็จแล้ว
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
                                    <span class="status-label">ดำเนินการอยู่</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title" style="font-size:20px;font-weight: 700;">{{ item.name }}</h5>
                                <p class="card-text" style="font-size:14px;font-weight:400;">
                                    {{ item.description }}
                                </p>
                                <p style="font-size:14px;font-weight:400;"></p>
                                <p style="font-size:14px;font-weight:400;"><span
                                        style="color:#B8B8B8;font-size:14px;font-weight:400;"></span></p>

                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
        <div class="tab-pane" id="ongoing" role="tabpanel" aria-labelledby="ongoing-tab">
            <div class="container">
                <div class="row justify-content-center">


                </div>
            </div>
        </div>
        <div class="tab-pane" id="completed" role="tabpanel" aria-labelledby="completed-tab">
            <div class="container">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            projects: [],
            projects_ongoing: [],
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
                this.projects_ongoing = data.data.filter(item => item.status === "2" && item.status ==="3" && item.status ==="4" && item.status ==="5");

                console.log(this.projects_ongoing);
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
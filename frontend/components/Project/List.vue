<script>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { NPagination } from "naive-ui";

export default {
  data() {
    return {
      projects: [], //ทั้งหมด
      projects_ongoing: [],
      projects_completed: [],
      projects_suspended: [],
      projectStatus: [
        { id: 1, name: "ยื่นข้อเสนอโครงการ" },
        { id: 2, name: "กำลังพิจารณา" },
        { id: 3, name: "ปรับปรุงเอกสารเสนอโครงการ" },
        { id: 4, name: "ดำเนินการโครงการ" },
        { id: 5, name: "ระงับการดำเนินการโครงการ" },
        { id: 6, name: "ดำเนินการโครงการเสร็จสิ้น" },
      ],
      imageData: null,
      recordCount: false,
      search: "",
      api_url: "",
      api_token: "",
      status: 0,
      show_items_now: 2,
      show_items_set: 6,
      show_items_start: 0,
      show_items_end: 6,
      page: ref(1),
      pageSize: ref(6),
      pageSizes: [6, 12, 18],
      filteredProjects: null,
      isLoading: false,
      currentProjectsCount: 0,
    };
  },
  watch: {
    search() {
      if (!this.search) {
        this.filteredProjects = null;
        this.recordCount = false;
      }
    },
  },
  mounted() {
    const runtimeConfig = useRuntimeConfig();
    this.api_url = runtimeConfig.public.baseApiUrl;
    this.api_token = runtimeConfig.tokenApi;
    
    setTimeout(() => {
      this.api_get_fetchProjectData();
    }, 0);
    this.currentProjectsCount = this.projects.length;

    if (this.projects) this.projectsCount = this.projects.length;
  },
  components: {
    NPagination,
  },
  methods: {
    // รับข้อมูล เก็บใน projects
    async api_get_fetchProjectData() {
      try {
        const url = this.api_url + "api/project";
        const params = {};
        const json = {};
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };

        this.isLoading = true;

        const res = await axios.get(url, json, options);

        if (res.status === 200) {
          for (let item of res.data.data) {
            if (item.og_image === "") {
              item.image = await this.api_get_img("0");
            } else {
              item.image = await this.api_get_img(item.og_image);
            }
          }
          this.recordCount = false;
          this.isLoading = false;
          this.projects = res.data.data;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "api/project status : " + res.status,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async api_get_img(filename) {
      try {
        const url = this.api_url + "api/images/" + filename;
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
          responseType: "blob", // กำหนดให้รับข้อมูลเป็นไบนารี
        };

        const res = await axios.get(url, options);

        if (res.status === 200) {
          const imageUrl = URL.createObjectURL(res.data); // สร้าง URL ของรูปภาพจากข้อมูลที่ได้รับ
          return imageUrl;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "404 (515816)",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    click_search() {
      this.isLoading = true;
      const result = this.projects.filter((project) =>
        this.search.length
          ? this.search
            .toLowerCase()
            .split("")
            .every((v) => project.name.toLowerCase().includes(v))
          : true
      );

      this.recordCount = result.length > 0 ? false : true;
      this.filteredProjects = result;
      this.isLoading = false;
    },
    bun_status(i) {
      this.status = i;
    },
    onChangePage(page) {
      this.pageOfProjects = page;
    },
  },
  computed: {
    currentPageProjects() {
      const currentProjects = this.filteredProjects
        ? [
          ...this.filteredProjects.filter((project) => {
            if (this.status === 0) return project;
            return project.status_id === this.status;
          }),
        ]
        : [
          ...this.projects.filter((project) => {
            if (this.status === 0) return project;
            return project.status_id === this.status;
          }),
        ];

      if (!currentProjects) {
        this.recordCount = true;
      }

      this.currentProjectsCount = currentProjects.length;
      const startIndex = this.pageSize * (this.page - 1);
      const endIndex = startIndex + this.pageSize;
      return currentProjects.slice(startIndex, endIndex);
    },
  },
};
</script>

<template>
  <!-- ค้นหา -->
  <div class="container" style="margin-top: 94px">
    <div class="row justify-content-center">
      <div class="col-sm-8 col-md-6">
        <div class="input-group">
          <input type="search" class="form-control" placeholder="ชื่อโครงการ, แขวง, ชื่อชุมชน"
            style="font-size: 20px; color: #606060" v-model="search" />
          <div class="input-group-append ps-2">
            <button class="btn btn-primary" type="button" style="
                background: #ef4d4e;
                font-size: 14px;
                height: 100%;
                border-color: #ef4d4e;
              " @click="click_search">
              ค้นหา
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container d-flex justify-content-center align-items-center" style="margin-top: 16px">
    <div class="statuses">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <!-- ทั้งหมด -->
        <li class="nav-item" role="presentfation">
          <button class="active nav-link" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab"
            aria-controls="all" aria-selected="true" @click="bun_status(0)">
            ทั้งหมด
          </button>
        </li>

        <!-- กำลังพิจารณา -->
        <span>|</span>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="ongoing-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all"
            aria-selected="true" @click="bun_status(2)">
            กำลังพิจารณา</a>
        </li>

        <!-- ปรับปรุงเอกสารเสนอโครงการ -->
        <span>|</span>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all"
            aria-selected="true" @click="bun_status(3)">
            ปรับปรุงเอกสารเสนอโครงการ
          </a>
        </li>

        <!-- ดำเนินการโครงการ -->
        <span>|</span>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="suspended-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all"
            aria-selected="true" @click="bun_status(4)">
            ดำเนินการโครงการ
          </a>
        </li>

        <!-- ดำเนินการเสร็จสิ้นแล้ว -->
        <span>|</span>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all"
            aria-selected="true" @click="bun_status(5)">
            ดำเนินการเสร็จสิ้นแล้ว
          </a>
        </li>

        <!-- ระงับการดำเนินโครงการ -->
        <span>|</span>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="ongoing-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all"
            aria-selected="true" @click="bun_status(6)">
            ระงับการดำเนินโครงการ</a>
        </li>
      </ul>
    </div>
  </div>

  <div v-show="recordCount">
    <div class="container" style="margin-top: 64px">
      <div class="alert alert-danger text-center" role="alert">
        ขณะนี้ยังไม่มีข้อมูลโครงการ !
      </div>
    </div>
  </div>

  <div v-show="this.status && currentProjectsCount <= 0">
    <div class="container" style="margin-top: 64px">
      <div class="alert alert-danger text-center" role="alert">
        ขณะนี้ยังไม่มีโครงการใดที่อยู่ในขั้นตอนนี้!
      </div>
    </div>
  </div>

  <!-- load projects.length === 0 -->
  <div v-if="currentPageProjects.length <= 0 && isLoading" class="border-grey bg-white p-3 tab-content"
    style="margin-top: 64px">
    <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-sm-3 mb-4" v-for="i in 1">
            <div class="card ef">
              <div class="overlay-container p-2">
                <i class="load-3"></i><br />
                <i class="load-4"></i><br />
                <i class="load-3"></i><br />
                <i class="load-4"></i><br />
                <i class="load-3"></i><br />
                <i class="load-4"></i><br />
                <i class="load-3"></i><br />
                <i class="load-4"></i><br />
              </div>
              <div class="card-body">
                <p class="card-text" style="font-size: 14px; font-weight: 400">
                  <i class="load-3"></i>
                </p>
                <p style="font-size: 14px; font-weight: 400"></p>
                <p style="font-size: 14px; font-weight: 400">
                  <i class="load-4"></i><span style="color: #b8b8b8; font-size: 14px; font-weight: 400"></span>
                </p>
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
  <div class="border-grey bg-white p-3 tab-content" style="margin-top: 64px" v-if="projects">
    <div class="tab-pane active" id="all" role="tabpanel" aria-labelledby="all-tab">
      <div class="container">
        <div class="row">
          <template v-for="item in currentPageProjects">
            <div v-if="this.status === 0" class="col-sm-4 mb-4">
              <div class="card ef">
                <div class="overlay-container">
                  <img class="card-img-top card-image" :src="item.image" alt="Card image cap " />
                  <div class="overlay">
                    <!-- Status Labels -->
                    <span class="status-label">{{
                      projectStatus[item.status_id - 1].name
                    }}</span>
                  </div>
                </div>
                <div class="card-body">
                  <nuxt-link :to="`/project/${item.id}`">
                    <h5 class="card-title" style="font-size: 20px; font-weight: 700">
                      {{ item.name }}
                    </h5>
                  </nuxt-link>
                  <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px">
                    {{ item.short_description }}
                  </p>
                  <p class="fw-bolder" style="font-size: 15px; font-weight: 400">
                    {{ item.hashtag
                    }}<span style="color: #b8b8b8; font-size: 14px; font-weight: 400"></span>
                  </p>
                  <p v-if="item.communityname" class="fw-bolder" style="font-size: 14px; font-weight: 400">
                    {{ item.communityname
                    }}<span class="fw-normal ps-1">
                      {{ item.districtname }}</span>
                  </p>
                </div>
                <!-- Card Footer -->
                <div class="card-footer d-flex justify-content-between d-none">
                  <div class="follow-container">
                    <button class="btn btn-primary btn-transparent">
                      <i class="bi bi-person-plus"></i>
                      <span class="count" style="margin-left: 15px">1000</span>
                    </button>
                  </div>
                  <div class="share-container">
                    <button class="btn btn-secondary btn-transparent">
                      <i class="bi bi-share"></i>
                      <span class="count" style="margin-left: 15px">500</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="this.status > 0 && item.status_id == this.status" class="col-sm-4 mb-4">
              <div class="card ef">
                <div class="overlay-container">
                  <img style="height: 300px" class="card-img-top card-image" :src="item.image" alt="Card image cap " />
                  <div class="overlay">
                    <span class="status-label">{{
                      projectStatus[item.status_id - 1].name
                    }}</span>
                  </div>
                </div>
                <div class="card-body">
                  <nuxt-link :to="`/project/${item.id}`">
                    <h5 class="card-title" style="font-size: 20px; font-weight: 700">
                      {{ item.name }}
                    </h5>
                  </nuxt-link>
                  <p class="card-text" style="font-size: 14px; font-weight: 400; height: 100px">
                    {{ item.short_description }}
                  </p>
                  <p class="fw-bolder" style="font-size: 15px; font-weight: 400">
                    {{ item.hashtag
                    }}<span style="color: #b8b8b8; font-size: 14px; font-weight: 400"></span>
                  </p>
                  <p class="fw-bolder" style="font-size: 14px; font-weight: 400">
                    {{ item.communityname
                    }}<span class="fw-normal ps-1">
                      {{ item.districtname }}</span>
                  </p>
                </div>
                <div class="card-footer d-flex justify-content-between d-none">
                  <div class="follow-container">
                    <button class="btn btn-primary btn-transparent">
                      <i class="bi bi-person-plus"></i>
                      <span class="count" style="margin-left: 15px">1000</span>
                    </button>
                  </div>
                  <div class="share-container">
                    <button class="btn btn-secondary btn-transparent">
                      <i class="bi bi-share"></i>
                      <span class="count" style="margin-left: 15px">500</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- <nav class="text-center">
            <span
              v-for="page in pages"
              :key="page"
              :class="{ active: page === currentPage }"
            >
              <nuxt-link :to="`/${page}`">{{ page }}</nuxt-link>
            </span>
          </nav> -->
        </div>
      </div>
    </div>
  </div>

  <div class="text-center">
    <n-pagination class="justify-content-center" v-model:page="page" v-model:page-size="pageSize"
      :item-count="currentProjectsCount" :page-sizes="pageSizes" show-size-picker />
  </div>
</template>

<style scoped>
.c-1 {
  background-color: #494949;
}

.nav {
  align-items: center;
}

.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
  color: #ef4d4e;
  background-color: var(--bs-nav-tabs-link-active-bg);
  border: none !important;
}

.nav-tabs .nav-link {
  margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width));
  border: none !important;
  cursor: pointer;
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

.card-image {
  height: 300px;
  object-fit: cover;
}

.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  top: 50%;
  right: 1%;
  padding: 0.25rem;
  max-width: 150px;
}

.status-label {
  font-family: "Sarabun";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;

  /* Wireframe/White */
  color: #ffffff;
}
</style>

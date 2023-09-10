<script>
import Swal from "sweetalert2";
import { NPagination } from "naive-ui";
import { ref } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      projects: [],
      communities: ["กำลังโหลด"],
      communities_select: "ชุมชน ...",
      districtname: ["กำลังโหลด"],
      districtname_select: "เขต ...",
      statusname: ["กำลังโหลด"],
      statusname_select: "สถานะ ...",
      search: "",
      projectStatus: [
        { id: 1, name: "ยื่นข้อเสนอโครงการ" },
        { id: 2, name: "กำลังพิจารณา" },
        { id: 3, name: "ปรับปรุงเอกสารเสนอโครงการ" },
        { id: 4, name: "ดำเนินการโครงการ" },
        { id: 5, name: "ระงับการดำเนินการโครงการ" },
        { id: 6, name: "ดำเนินการโครงการเสร็จสิ้น" },
      ],
      api_url: "",
      api_token: "",
      dev_msg: "",
      page: ref(1),
      pageSize: ref(6),
      pageSizes: [6, 12, 18],
      filteredProjects: null,
      isLoading: false,
      currentProjectsCount: 0,
      form: {
        email: "",
        password: "",
      },
      status: 0,
    };
  },
  mounted() {
    const runtimeConfig = useRuntimeConfig();
    this.api_url = runtimeConfig.public.baseApiUrl;
    this.api_token = runtimeConfig.tokenApi;
    this.api_get_fetchProjectData();

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
          this.communities = [];
          this.districtname = [];
          this.statusname = [];

          for (let item of this.projects) {
            if (
              item.communityname !== "" &&
              !this.communities.includes(item.communityname)
            ) {
              this.communities.push(item.communityname);
            }
            if (
              item.districtname !== "" &&
              !this.districtname.includes(item.districtname)
            ) {
              this.districtname.push(item.districtname);
            }
            if (item.status_id !== "") {
              const status = this.projectStatus.find(
                (status) => status.id === item.status_id
              );
              if (status && !this.statusname.includes(status.name)) {
                this.statusname.push(status.name);
              }
            }
          }
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
    // ชุมชน
    async CommunityData() {
      try {
        const url = this.api_url + "api/community";
        const params = {};
        const json = {};
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.get(url, json, options);

        if (res.status === 200) {
          this.communities = res.data.data;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "api/community status : " + res.status,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    currentPageProjects() {
      let data_list = this.projects;

      if (this.communities_select != "ชุมชน ...") {
        const filteredData = data_list.filter((item) => {
          return item.communityname
            .toString()
            .includes(this.communities_select);
        });
        data_list = filteredData;
      }

      if (this.districtname_select != "เขต ...") {
        const filteredData = data_list.filter((item) => {
          return item.districtname
            .toString()
            .includes(this.districtname_select);
        });
        data_list = filteredData;
      }

      if (this.statusname_select != "สถานะ ...") {
        let statusid = null;
        for (let item of this.projectStatus) {
          if (item.name === this.statusname_select) {
            statusid = item.id;
          }
        }
        const filteredData = data_list.filter((item) => {
          return item.status_id.toString().includes(statusid);
        });
        data_list = filteredData;
      }

      if (this.search != "") {
        const filteredData = data_list.filter((item) => {
          return (
            item.communityname.toString().includes(this.search) ||
            item.districtname.toString().includes(this.search) ||
            item.short_description.toString().includes(this.search)
          );
        });
        data_list = filteredData;
      }

      this.currentProjectsCount = data_list.length;
      const startIndex = this.pageSize * (this.page - 1);
      const endIndex = startIndex + this.pageSize;
      return data_list.slice(startIndex, endIndex);
    },
  },
};
</script>
<template>
  <Head>
    <Title>ชุมชนโปร่งใส - หน้าจัดการโครงการ</Title>
  </Head>
  <NavBar />
  <div class="container" style="margin-top: 20px">
    <div class="row">
      <!-- รายการ -->
      <div class="d-flex align-items-center">
        <h1 style="width: 150px">รายการ</h1>
      </div>

      <!-- Dropdown -->
      <div class="dropdown d-flex align-items-center justify-content-between">
        <div class="pe-2">
          <h6>ชุมชน</h6>
          <select
            style="width: 300px"
            class="form-select"
            aria-label="Default select example"
            v-model="communities_select"
          >
            <option selected>ชุมชน ...</option>

            <template v-for="item in communities">
              <option>{{ item }}</option>
            </template>
          </select>
        </div>
        <div class="pe-2">
          <h6>เขต</h6>
          <select
            style="width: 200px"
            class="form-select"
            aria-label="Default select example"
            v-model="districtname_select"
          >
            <option selected>เขต ...</option>
            <template v-for="item in districtname">
              <option>{{ item }}</option>
            </template>
          </select>
        </div>
        <div class="pe-2">
          <h6>สถานะ</h6>
          <select
            style="width: 200px"
            class="form-select"
            aria-label="Default select example"
            v-model="statusname_select"
          >
            <option selected>สถานะ ...</option>
            <template v-for="item in statusname">
              <option>{{ item }}</option>
            </template>
          </select>
        </div>
        <div class="pe-2">
          <h6>ค้นหา</h6>
          <div
            style="width: 300px; border: 1px solid #929292"
            class="btn-group"
          >
            <input
              type="text"
              class="form-control"
              aria-label="Text input with dropdown button"
              placeholder="ชื่อโครงการ, แขวง, ชื่อชุมชน"
              v-model="search"
            />
          </div>
        </div>
      </div>

      <!-- load projects.length === 0 -->
      <div
        v-if="currentPageProjects.length <= 0 && isLoading"
        class="border-grey bg-white p-3 tab-content"
        style="margin-top: 64px"
      >
        <div
          class="tab-pane active"
          id="all"
          role="tabpanel"
          aria-labelledby="all-tab"
        >
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
                    <p
                      class="card-text"
                      style="font-size: 14px; font-weight: 400"
                    >
                      <i class="load-3"></i>
                    </p>
                    <p style="font-size: 14px; font-weight: 400"></p>
                    <p style="font-size: 14px; font-weight: 400">
                      <i class="load-4"></i
                      ><span
                        style="
                          color: #b8b8b8;
                          font-size: 14px;
                          font-weight: 400;
                        "
                      ></span>
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

      <div v-else style="margin-top: 50px" class="table-scroll">
        <table class="table table-hover">
          <thead>
            <tr class="fs-5">
              <th scope="col">ชุมชน</th>
              <th scope="col">เขต</th>
              <th scope="col">รูป</th>
              <th scope="col">รายละเอียด</th>
              <th scope="col">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in currentPageProjects">
              <tr class="small font-weight-normal">
                <td>{{ item.communityname }}</td>
                <td>{{ item.districtname }}</td>
                <td>
                  <div class="pt-2">
                    <img
                      :src="item.image"
                      style="width: 120px; height: 120px"
                    />
                  </div>
                </td>
                <td>
                  <span class="multiline">{{ item.short_description }}</span>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-primary me-2"
                    style="
                      background: rgb(239, 77, 78);
                      border-radius: 4px;
                      color: rgb(255, 255, 255);
                      border-color: rgb(239, 77, 78);
                      font-size: 14px;
                    "
                  >
                    {{ projectStatus[item.status_id - 1].name }}
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="text-center">
        <n-pagination
          class="justify-content-center"
          v-model:page="page"
          v-model:page-size="pageSize"
          :item-count="currentProjectsCount"
          :page-sizes="pageSizes"
          show-size-picker
        />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.c-1 {
  background-color: #494949;
}

.multiline {
  max-width: 250px;
  display: block;
  white-space: pre-wrap;
  /* ช่องว่างและตัวขึ้นบรรทัดใหม่จะถูกเก็บไว้ */
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
  --bs-nav-tabs-link-hover-border-color: var(--bs-secondary-bg)
    var(--bs-secondary-bg) var(--bs-border-color);
  --bs-nav-tabs-link-active-color: var(--bs-emphasis-color);
  --bs-nav-tabs-link-active-bg: var(--bs-body-bg);
  --bs-nav-tabs-link-active-border-color: var(--bs-border-color)
    var(--bs-border-color) var(--bs-body-bg);
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

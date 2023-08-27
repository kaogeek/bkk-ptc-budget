<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import update from "./update.vue";
import docs from "./docs.vue";
import edit from "./edit.vue";

export default {
  data() {
    return {
      projects: [],
      imageData: null,
      id: null,
      dev_msg: null,
      edit: false,
      page: 1,
      role: 0,
      selected: "",
      status_text: "",
      note: "",
      status_note: "",
      api_url: "",
      api_token: "",
      email: "",
      fullname: "",
      projectOwnerId: null,
      currentUserId: null,
    };
  },
  mounted() {
    const runtimeConfig = useRuntimeConfig();
    this.api_url = runtimeConfig.public.BASE_API_URL;
    this.api_token = runtimeConfig.public.TOKEN_API;
    this.id = this.$route.params.id;
    this.asyncData();
    setTimeout(() => {
      this.api_get_project_id();
    }, 500);
  },
  components: {
    update,
    docs,
    edit,
  },
  methods: {
    async asyncData() {
      const token = sessionStorage.getItem("auth-token");

      if (token != null) {
        var decoded = jwt_decode(token);

        this.role = decoded.role;
        this.email = decoded.email;
        this.fullname = decoded.fullname;
        this.currentUserId = decoded.id;
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
          this.imageData = imageUrl; // เก็บ URL ของรูปภาพ
          // console.log(imageUrl)
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
    // รับข้อมูล เก็บใน projects
    async api_get_project_id() {
      try {
        const url = this.api_url + "api/project/" + this.id;
        const params = {};
        const json = {};
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.get(url, json, options);

        if (res.status === 200) {
          this.projects = res.data.data[0];
          this.projectOwnerId = this.projects.owner_id;

          this.note = this.projects.note.note;
          if (this.projects.og_image != "") {
            this.api_get_img(this.projects.og_image);
          } else {
            this.api_get_img("0");
          }

          if (this.projects.status_id === 1) {
            this.status_text = "ยื่นข้อเสนอโครงการ";
            this.selected = "ยื่นข้อเสนอโครงการ";
          }
          if (this.projects.status_id === 2) {
            this.status_text = "กำลังพิจารณา";
            this.selected = "กำลังพิจารณา";
          }
          if (this.projects.status_id === 3) {
            this.status_text = "ปรับปรุงเอกสารเสนอโครงการ";
            this.selected = "ปรับปรุงเอกสารเสนอโครงการ";
          }
          if (this.projects.status_id === 4) {
            this.status_text = "ดำเนินการโครงการ";
            this.selected = "ดำเนินการโครงการ";
          }

          if (this.projects.status_id === 5) {
            this.status_text = "ระงับการดำเนินการโครงการ";
            this.selected = "ระงับการดำเนินการโครงการ";
          }

          if (this.projects.status_id === 6) {
            this.status_text = "ดำเนินการโครงการเสร็จสิ้น";
            this.selected = "ดำเนินการโครงการเสร็จสิ้น";
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "api_get_project_id : " + res.status,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    // update status_id
    async api_update_status_id(row_id, status_id, status_note) {
      try {
        const url = this.api_url + "api/update/status_id";
        const params = {};
        const json = {
          row_id: row_id,
          status_id: status_id,
          status_note: status_note,
        };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);
        console.log(res.status);

        if (res.status === 200) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "อัพเดทสำเร็จ",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "ไม่สามารถอัพเดทได้",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    // update status_id
    async api_update_note_id(row_id, note) {
      try {
        const url = this.api_url + "api/update/note_id";
        const params = {};
        const json = { row_id: row_id, note: note };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);
        console.log(res.status);

        if (res.status === 200) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "อัพเดทสำเร็จ",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "ไม่สามารถอัพเดทได้",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    update_status() {
      let status_note = { note: this.status_note, fullname: this.fullname };
      this.api_update_status_id(this.projects.id, this.selected, status_note);
      setTimeout(() => {
        this.api_get_project_id();
      }, 1000);
    },
    update_note(i) {
      if (i == 1) {
        let note = {
          note: this.note,
          date: "",
          sign: this.fullname,
          role: this.role,
        };
        this.api_update_note_id(this.projects.id, note);
        setTimeout(() => {
          this.api_get_project_id();
        }, 1000);
      } else {
        this.note = this.projects.note.note;
      }
    },
    select_page(i) {
      this.page = i;
    },
    bun_edit(i) {
      this.edit = i;
    },
  },
};
</script>

<template>
  <NavBar />
  <div class="container">
    <nav aria-label="breadcrumb" style="margin-top: 47px">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="../">โครงการทั้งหมด</a></li>
        <li class="breadcrumb-item active fw-bold" aria-current="page">
          {{ this.projects.name }}
        </li>
      </ol>
    </nav>
  </div>

  <div
    v-if="this.projects.length != 0"
    class="container p-3"
    style="margin-top: 44px"
  >
    <div class="row ef">
      <div class="col-md-8">
        <div class="d-flex align-items-center">
          <div class="col fw-bold fs-4">
            <span>{{ this.projects.name }}</span>
          </div>
          <div class="col-auto">
            <button
              v-if="this.projects.status_id === 1"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              ยื่นข้อเสนอโครงการ
            </button>
            <button
              v-if="this.projects.status_id === 2"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              กำลังพิจารณา
            </button>
            <button
              v-if="this.projects.status_id === 3"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              ปรับปรุงเอกสารเสนอโครงการ
            </button>
            <button
              v-if="this.projects.status_id === 4"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              ดำเนินการโครงการ
            </button>
            <button
              v-if="this.projects.status_id === 5"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              ระงับการดำเนินการโครงการ
            </button>
            <button
              v-if="this.projects.status_id === 6"
              type="button"
              class="btn btn-primary"
              style="
                border-color: #000000;
                background: #000000;
                color: #ffffff;
                font-size: 14px;
              "
            >
              ดำเนินการโครงการเสร็จสิ้น
            </button>
          </div>
        </div>
        <div>
          <span class="pe-1 fw-bolder" style="font-size: 13px">{{
            this.projects.communityname
          }}</span>
          <span style="color: rgb(151, 151, 151); font-size: 13px">{{
            this.projects.districtname
          }}</span>
        </div>

        <!-- img -->
        <div v-if="this.edit == false" class="pt-2">
          <img style="width: 100%; height: auto" :src="imageData" alt="" />
        </div>

        <div style="padding-top: 30px; padding-bottom: 10px">
          <span
            v-if="this.page == 1"
            class="fw-bolder fs-4"
            @click="select_page(1)"
            >รายละเอียดโครงการ
          </span>
          <span
            v-else
            class="fw-bolder fs-4"
            style="color: #b4b4b4"
            @click="select_page(1)"
            >รายละเอียดโครงการ
          </span>

          <span v-if="this.page == 2" class="fs-4" @click="select_page(2)">
            | อัปเดต
          </span>
          <span
            v-else
            class="fs-4"
            style="color: #b4b4b4"
            @click="select_page(2)"
          >
            | อัปเดต
          </span>

          <span v-if="this.page == 3" class="fs-4" @click="select_page(3)">
            | เอกสารโครงการ และ แผนการใช้เงิน
          </span>
          <span
            v-else
            class="fs-4"
            style="color: #b4b4b4"
            @click="select_page(3)"
          >
            | เอกสารโครงการ และ แผนการใช้เงิน
          </span>
        </div>

        <template v-if="page == 1">
          <div class="text-end">
            <button
              v-if="
                this.edit == false && this.projects.create_email == this.email
              "
              type="button"
              class="btn btn-outline-dark m-1"
              @click="bun_edit(true)"
            >
              แก้ไข
            </button>
            <button
              v-if="
                this.edit == true && this.projects.create_email == this.email
              "
              type="button"
              class="btn btn-outline-danger"
              @click="bun_edit(false)"
            >
              ยกเลิก
            </button>
          </div>
          <!-- รายละเอียดโครงการ -->
          <div
            v-if="this.edit == false"
            class="ef"
            v-html="this.projects.description"
          ></div>
          <div v-if="this.edit == false" class="text-end">
            <p>{{ this.projects.date }}</p>
          </div>
          <edit
            v-if="this.edit == true"
            class="ef"
            :data_list_props="this.projects"
          ></edit>
        </template>
        <!-- อัปเดต -->
        <update
          v-if="page == 2"
          :data_list_props="this.projects.list_update.data"
          :projectOwnerId="this.projectOwnerId"
        ></update>
        <!-- เอกสารโครงการ และ แผนการใช้เงิน -->
        <docs
          v-if="page == 3"
          :data_list_props="this.projects"
          :project-owner-id="projectOwnerId"
        ></docs>
      </div>

      <div class="col-md-4">
        <!-- การมีส่วนรวมจากชุมชน -->
        <div
          class="p-2"
          style="
            width-min: 250px;
            border: 3px solid rgb(175, 175, 175);
            border-radius: 10px;
          "
        >
          <p class="fw-bold">การมีส่วนรวมจากชุมชน</p>
          <!-- role != 1 -->
          <p
            v-if="
              (this.role != 1 && this.role != 5) ||
              this.currentUserId === this.projectOwnerId ||
              this.projects.note.note == '' ||
              this.projects.note.note == 'ไม่มีโน๊ต'
            "
          >
            ไม่มีโน๊ต
          </p>

          <template
            v-if="
              (this.role != 1 && this.role != 5) ||
              this.currentUserId === this.projectOwnerId ||
              (this.projects.note.note != 'ไม่มีโน๊ต' &&
                this.projects.note.note != '')
            "
          >
            <p>{{ this.projects.note.note }}</p>
            <p class="p-0 m-0">
              ลงชื่อ : {{ this.projects.note.sign }} (คณะกรรมการชุมชน)
            </p>
            <br />
            <p class="m-0 p-0">{{ this.projects.note.date }}</p>
          </template>

          <template v-if="this.currentUserId === this.projectOwnerId">
            <div class="mb-3">
              <textarea class="form-control" rows="3" v-model="note">{{
                this.projects.note.note
              }}</textarea>
            </div>
            <template
              v-if="
                this.projects.note.note != 'ไม่มีโน๊ต' &&
                this.projects.note.note != ''
              "
            >
              <p v-if="this.projects.note.role == 1" class="p-0 m-0">
                ลงชื่อ : {{ this.projects.note.sign }} (คณะกรรมการชุมชน)
              </p>
              <br />
              <p v-if="this.projects.note.role == 5" class="p-0 m-0">
                ลงชื่อ : {{ this.projects.note.sign }} (เจ้าหน้าที่
                ศูนย์เด็กเล็ก)
              </p>
              <br />
              <p class="m-0 p-0">{{ this.projects.note.date }}</p>
            </template>
            <div
              v-if="this.projects.note.note != this.note"
              class="text-center"
            >
              <button
                type="button"
                class="btn btn-primary m-2 ef"
                @click="update_note(1)"
              >
                บันทึก
              </button>
              <button
                type="button"
                class="btn btn-danger ef"
                @click="update_note(0)"
              >
                ยกเลิก
              </button>
            </div>
          </template>
        </div>

        <!-- ประเมินโครงการโดยภาครัฐ role != 4 -->
        <div
          v-if="this.role != 4"
          class="p-2"
          style="
            width-min: 250px;
            border: 3px solid rgb(75, 75, 75);
            border-radius: 10px;
            margin-top: 50px;
          "
        >
          <p class="fw-bold">ประเมินโครงการโดยภาครัฐ</p>
          <p class="fw-bold mt-1" style="font-size: 14px">
            {{ this.status_text }}
          </p>
          <!-- ระงับการดำเนินการโครงการ -->
          <div
            v-if="this.projects.status_note.note"
            style="background-color: #3f3f3f; color: white"
            class="alert mt-2 ef"
            role="alert"
          >
            <span>{{ this.projects.status_note.note }}</span
            ><br />
            <p class="pt-3">
              ลงชื่อ : {{ this.projects.status_note.fullname }} (เจ้าหน้าที่)
            </p>
          </div>
        </div>

        <!-- ประเมินโครงการโดยภาครัฐ role == 4-->
        <div
          v-if="this.role == 4"
          class="p-2"
          style="
            width-min: 250px;
            border: 3px solid rgb(75, 75, 75);
            border-radius: 10px;
            margin-top: 50px;
          "
        >
          <p class="fw-bold">ประเมินโครงการโดยภาครัฐ</p>
          <select
            class="form-select mt-1"
            aria-label="Default select example"
            v-model="selected"
          >
            <option :value="status_text">{{ this.status_text }}</option>
            <option value="2">กำลังพิจารณา</option>
            <option value="3">ปรับปรุงเอกสารเสนอโครงการ</option>
            <option value="4">ดำเนินการโครงการ</option>
            <option value="6">ดำเนินการเสร็จสิ้น</option>
            <option value="5">ระงับการดำเนินโครงการ</option>
          </select>

          <!-- ระงับการดำเนินการโครงการ -->
          <div
            v-if="this.projects.status_note.note != ''"
            style="background-color: #3f3f3f; color: white"
            class="alert mt-2 ef"
            role="alert"
          >
            <span>{{ this.projects.status_note.note }}</span
            ><br />
            <p class="pt-3">
              ลงชื่อ : {{ this.projects.status_note.fullname }} (เจ้าหน้าที่)
            </p>
          </div>
          <div
            v-if="this.status_text != this.selected"
            class="text-center pt-2"
          >
            <div v-if="this.selected != '1'" class="form-floating">
              <textarea
                class="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style="height: 100px"
                v-model="status_note"
              ></textarea>
              <label for="floatingTextarea2">หมายเหตุ</label>
            </div>
            <div
              v-if="
                this.status_note != '' ||
                this.selected === '6' ||
                this.selected == '5'
              "
            >
              <button
                type="button"
                class="btn btn-primary m-2 ef"
                @click="update_status()"
              >
                บันทึก
              </button>
              <button
                type="button"
                class="btn btn-danger ef"
                @click="update_status()"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- load projects.length === 0 -->
  <div
    v-if="this.projects.length === 0"
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
          <div v-for="i in 1" class="col-sm-3 mb-4">
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
                  <i class="load-4"></i
                  ><span
                    style="color: #b8b8b8; font-size: 14px; font-weight: 400"
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

  <Footer />
</template>

<style scoped>
.btn-outline-secondary:hover {
  background-color: white !important;
  color: #606060;
}
.c-1 {
  /* background-color: rgb(121, 121, 121); */
  border: 2px solid rgb(78, 78, 78);
}

.c-2 {
  border: 2px solid rgb(0, 88, 110);
}
</style>

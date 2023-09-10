<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: {
    data_list_props: { type: Array, required: true },
    ownerEmail: { type: String, required: true },
  },
  data() {
    return {
      item: [],
      data_list: [],
      edit: false,
      loading: true,
      role: null,
      create_email: null,
      id: null,
      user_id: null,
      selectedFile: null,
      event: null,
      imageData: null,
      api_url: "",
      api_token: "",
      fullname: "",
      title: "",
      content: "",
    };
  },
  created() {
    this.data_list = this.data_list_props;
  },
  mounted() {
    const runtimeConfig = useRuntimeConfig();
    this.api_url = runtimeConfig.public.baseApiUrl;
    this.api_token = runtimeConfig.tokenApi;
    this.asyncData();
    this.id = this.$route.params.id;
    this.fetchChartImages();
  },
  watch: {
    data_list(newDate) {
      this.fetchChartImages();
    },
  },
  methods: {
    async fetchChartImages() {
      for (let i = 0; i < this.data_list.length; i++) {
        setTimeout(async () => {
          const item = this.data_list[i];

          if (item.img_name != "") {
            const imageUrl = await this.api_get_chart_img(item.img_name);
            item.imageUrl = imageUrl;
          } else {
            item.imageUrl = "";
          }
        }, i * 100);
      }
      setTimeout(async () => {
        this.loading = false;
      }, 2000);
    },
    async asyncData() {
      const token = sessionStorage.getItem("auth-token");

      if (token != null) {
        var decoded = jwt_decode(token);
        this.role = decoded.role;
        this.create_email = decoded.email || "";
        this.fullname = decoded.fullname;
        this.user_id = decoded.id;
      }
    },
    async api_get_chart_img(filename) {
      try {
        const url = this.api_url + "api/get/chart_img/" + filename;
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
          responseType: "blob", // กำหนดให้รับข้อมูลเป็นไบนารี
        };

        const res = await axios.get(url, options);
        if (res.status === 200) {
          const imageUrl = URL.createObjectURL(res.data);
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
          this.data_list = res.data.data[0].list_update.data;
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
    // update chat_id
    async api_update_chat_id(row_id, img_name) {
      try {
        const url = this.api_url + "api/update/chat_id";
        const params = {};
        const json = {
          list_update: {
            title: this.title,
            content: this.content,
            fullname: this.fullname,
            Staff_name: this.role,
            user_id: this.user_id,
            img_name: img_name,
          },
          row_id: row_id,
        };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);

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
          this.title = "";
          this.content = "";
          this.event.target.value = null;
          this.selectedFile = null;
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
    // update edit chat_id
    async api_edit_chat_id(row_id, id, img_name) {
      try {
        const url = this.api_url + "api/edit/chat_id";
        const params = {};
        const json = {
          id: id,
          title: this.title,
          content: this.content,
          row_id: row_id,
          img_name: img_name,
        };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);

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
    async api_update_image_id() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        const response = await axios.post(
          this.api_url + "api/upload/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          let img_name = response.data.filename;
          return img_name;
        } else {
          Swal.fire({
            icon: "error",
            title: "Opos",
            text: "อัพโหลล้มเหลว",
            timer: 2000,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async button_updater() {
      this.loading = true;
      if (this.selectedFile == null) {
        this.api_update_chat_id(this.id, "");
      } else {
        const img_name = await this.api_update_image_id();
        this.api_update_chat_id(this.id, img_name);
      }
      setTimeout(() => {
        this.api_get_project_id();
      }, 500);
    },
    delete_file(file_name) {
      axios
        .delete(this.api_url + "api/delete/chart_img/" + file_name)
        .then((response) => {
          // pass
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "ลบเอกสารล้มเหลว",
          });
          console.error(error);
        });
    },
    bun_edit(item) {
      this.edit = true;
      this.title = item.title;
      this.content = item.content;
      this.item = item;
    },
    async button_edit_chat(i) {
      if (i === 0) {
        this.edit = false;
        this.title = "";
        this.content = "";
      } else {
        this.loading = true;
        if (this.selectedFile == null) {
          this.api_edit_chat_id(this.id, this.item.id, "");
        } else {
          const img_name = await this.api_update_image_id();

          this.api_edit_chat_id(this.id, this.item.id, img_name);
          this.delete_file(this.item.img_name);
        }
        setTimeout(() => {
          this.api_get_project_id();
          this.edit = false;
          this.title = "";
          this.content = "";
        }, 500);
      }
    },
    handleFileUpload(event) {
      this.event = event;
      this.selectedFile = event.target.files[0];
    },
  },
};
</script>

<template>
  <div class="container m-0 p-0" style="margin-top: 44px">
    <div class="row">
      <!-- <p>role :{{ this.role }}</p> -->
      <!-- load projects.length === 0 -->
      <div
        v-if="this.loading === true"
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
              <div v-for="i in 1" class="col-sm-6 mb-4">
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

      <template v-if="this.loading === false">
        <!-- ไม่มี แชท -->
        <div v-if="this.data_list.length == 0" class="col-md-10 p-2 ef">
          <div
            class="p-2 text-center"
            style="background-color: rgb(221, 221, 221); border-radius: 10px"
          >
            <p class="fw-bold">ไม่มีรายการอัพเดท</p>
          </div>
        </div>

        <div
          v-if="this.data_list.length != 0 && this.edit == false"
          v-for="item in this.data_list"
          class="col-md-10 p-2"
        >
          <div
            class="p-2 ef"
            style="background-color: rgb(221, 221, 221); border-radius: 10px"
          >
            <!-- <p>item : {{ item }}</p> -->
            <div
              class="text-center d-flex align-items-center justify-content-center"
            >
              <p class="fw-bold" style="margin-right: auto">{{ item.title }}</p>
              <template v-if="item.user_id == this.user_id">
                <a style="color: #535353" class="p-1" @click="bun_edit(item)">
                  <i class="bi bi-pencil-square"></i>
                </a>
              </template>
            </div>
            <div
              style="background-color: rgb(138, 138, 138); height: 2px"
            ></div>
            <p class="pt-3">{{ item.content }}</p>
            <div
              style="background-color: rgb(138, 138, 138); height: 2px"
            ></div>

            <!-- img -->
            <div v-if="item.imageUrl != 0" class="pt-2 text-center">
              <img style="width: 250px" :src="item.imageUrl" />
            </div>

            <div class="d-flex justify-content-between">
              <span v-if="item.Staff_name == 5" class="pt-3 text-start"
                >อัพเดทโดย {{ item.fullname }} (เจ้าหน้าที่ ศูนย์เด็กเล็ก)</span
              >
              <span v-if="item.Staff_name == 4" class="pt-3 text-start"
                >อัพเดทโดย {{ item.fullname }} (เจ้าหน้าที่ กทม)</span
              >
              <span v-if="item.Staff_name == 1" class="pt-3 text-start"
                >อัพเดทโดย {{ item.fullname }} (คณะกรรมการชุมชน)</span
              >
              <span class="pt-3 text-end">{{ item.date }}</span>
            </div>
          </div>
        </div>

        <template v-if="this.edit == false">
          <div
            v-if="
              ((role === 1 || role === 5) && create_email === ownerEmail) ||
              role === 4
            "
            class="col-md-10 p-2"
          >
            <div
              class="p-2"
              style="background-color: rgb(221, 221, 221); border-radius: 10px"
            >
              <input
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="หัวข้อ"
                v-model="title"
              />
              <div class="form-floating pt-2">
                <textarea
                  style="height: 150px"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea"
                  v-model="content"
                ></textarea>
                <label for="floatingTextarea">เนื้อหา</label>
                <div class="input-group pt-2">
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="handleFileUpload"
                  />
                </div>
              </div>
              <div class="pt-2 text-end">
                <button
                  v-if="this.title != '' && this.content != ''"
                  type="button"
                  class="btn btn-light ef"
                  @click="button_updater()"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- แก้ไข -->
        <div v-if="this.edit == true" class="col-md-10 p-2 ef">
          <div
            class="p-2"
            style="background-color: rgb(221, 221, 221); border-radius: 10px"
          >
            <p class="fw-bold p-1 text-center">แก้ไข</p>
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="หัวข้อ"
              v-model="title"
            />
            <div class="form-floating pt-2">
              <textarea
                style="height: 150px"
                class="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea"
                v-model="content"
              ></textarea>
              <label for="floatingTextarea">เนื้อหา</label>
              <div class="input-group pt-2">
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </div>
            </div>
            <div class="pt-2 text-end">
              <button
                type="button"
                class="btn btn-danger ef m-2"
                @click="button_edit_chat(0)"
              >
                Cancel
              </button>
              <button
                v-if="this.title != '' && this.content != ''"
                type="button"
                class="btn btn-light ef m-2"
                @click="button_edit_chat(1)"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
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

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: {
    data_list_props: { type: Array, required: true },
    ownerEmail: { type: Number, required: true },
  },
  data() {
    return {
      data_list: [],
      role: null,
      create_email: null,
      id: null,
      selectedFile: null,
      showInput: false,
      edit: false,
      edit_table: false, // true == show edit table
      edit_item: false,
      fullname: "",
      file_name: "",
      file_name_db: "",
      title: "",
      api_url: "",
      api_token: "",
      list_name: "",
      budget: "",
      edit_item_id: "",
      budget_all: 0,
      budget_all_format: 0,
      userId: null,
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
  },
  watch: {
    data_list(newDate) {
      this.budget_all = 0;
      for (let i = 0; i < this.data_list.list_budget.data.length; i++) {
        const budget = Number(this.data_list.list_budget.data[i].budget);
        this.budget_all += budget;
      }
      this.budget_all_format = this.budget_all.toLocaleString(); // 1,000,000
    },
  },
  methods: {
    async asyncData() {
      const token = sessionStorage.getItem("auth-token");

      if (token != null) {
        var decoded = jwt_decode(token);
        this.role = decoded.role;
        this.create_email = decoded.email || "";
        this.fullname = decoded.fullname;
        this.userId = decoded.owner_id;
        // console.log("decoded ", decoded);
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
          this.data_list = res.data.data[0];
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
    // update file_doc_id
    async api_update_file_doc_id(row_id, file_name_db) {
      try {
        const url = this.api_url + "api/update/doc_id";
        const params = {};
        const json = {
          list_update: {
            file_name: this.file_name,
            file_name_db: file_name_db,
            email: this.create_email,
          },
          row_id: row_id,
        };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);
        // console.log(res.status)

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
            title: "อัพโหลดเอกสารสำเร็จ",
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
    // update file_name id
    async api_update_file_name_id(row_id, file_name_db) {
      try {
        const url = this.api_url + "api/update/file_name_id";
        const params = {};
        const json = {
          file_name_db: file_name_db,
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
            title: "ทำรายการสำเร็จ",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "ทำรายการล้มเหลว",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    // add_list_budget_id
    async api_add_list_budget_id(row_id, list_name, budget) {
      try {
        const url = this.api_url + "api/add/list_budget";
        const params = {};
        const json = { list_name: list_name, budget: budget, row_id: row_id };
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
            title: "ทำรายการสำเร็จ",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "ทำรายการล้มเหลว",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    // edit_list_budget_id
    async api_edit_list_budget_id(id, row_id, list_name, budget) {
      try {
        const url = this.api_url + "api/edit/list_budget";
        const params = {};
        const json = {
          id: id,
          list_name: list_name,
          budget: budget,
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
            title: "แก้ไขรายการสำเร็จ",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "แก้ไขรายการล้มเหลว",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    showFileInput() {
      this.showInput = true;
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    handleFormSubmit() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      axios
        .post(this.api_url + "api/upload/doc", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.file_name_db = response.data.filename;
            this.api_update_file_doc_id(this.id, this.file_name_db);
            setTimeout(() => {
              this.api_get_project_id();
              this.showInput = false;
              this.file_name = "";
            }, 500);
          } else {
            Swal.fire({
              icon: "error",
              title: "Opos",
              text: "อัพโหลล้มเหลว",
              timer: 2000,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    download_file(file_name) {
      const url = this.api_url + "api/download/doc/" + file_name;
      window.open(url, "_blank");
    },
    delete_file(file_name) {
      Swal.fire({
        title: "ต้องการลบใช่หรือไม่?",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(this.api_url + "api/delete/doc/" + file_name)
            .then((response) => {
              setTimeout(() => {
                this.api_update_file_name_id(this.id, file_name);
              }, 500);
              setTimeout(() => {
                this.api_get_project_id();
              }, 2500);
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "ลบเอกสารล้มเหลว",
              });
              console.error(error);
            });
        }
      });
    },
    bun_edit(file_name, file_name_db) {
      this.file_name = file_name;
      this.file_name_db = file_name_db;
      this.edit = true;
      this.showInput = true;
      this.file_name = file_name;
      this.selectedFile = null;
    },
    bun_edit_doc(i) {
      if (i === 1) {
        axios
          .delete(this.api_url + "api/delete/doc/" + this.file_name_db)
          .then((response) => {
            setTimeout(() => {
              this.api_update_file_name_id(this.id, this.file_name_db);
            }, 500);
            setTimeout(() => {
              this.api_get_project_id();
              this.handleFormSubmit();
              this.edit = false;
              this.showInput = false;
              this.selectedFile = null;
            }, 2500);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "แก้ไขเอกสารล้มเหลว",
            });
            console.error(error);
          });
      } else {
        this.edit = false;
        this.showInput = false;
        this.selectedFile = null;
        this.file_name = "";
      }
    },
    bun_edit_table(i) {
      if (i === "") {
        this.edit_table = true;
      }
      if (i === 0) {
        this.edit_table = false;
        this.edit_item = false;
        this.list_name = "";
        this.budget = 0;
        this.edit_item_id = "";
      }
      if (i === 1) {
        this.api_edit_list_budget_id(
          this.edit_item_id,
          this.id,
          this.list_name,
          this.budget
        );
        setTimeout(() => {
          this.api_get_project_id();
          this.edit_table = false;
          this.edit_item = false;
          this.list_name = "";
          this.budget = 0;
          this.edit_item_id = "";
        }, 500);
      }
    },
    bun_add_list() {
      this.api_add_list_budget_id(this.id, this.list_name, this.budget);
      setTimeout(() => {
        this.api_get_project_id();
        this.list_name = "";
        this.budget = "";
      }, 500);
    },
    bun_edit_item(item) {
      console.log("item", item);
      this.edit_item_id = item.id;
      this.list_name = item.list_name;
      this.budget = item.budget;
      this.edit_table = false;
      this.edit_item = true;
    },
  },
};
</script>

<template>
  <div class="container m-0 p-0 pt-2">
    <div class="row ef">
      <div class="col-md-10 ef">
        <span>ตารางแผนการใช้เงินสำหรับโครงการ</span>
        <span>{{ this.data_list.name }}</span>

        <!-- table -->
        <div>
          <!-- Edit -->
          <template
            v-if="
              this.edit_table == false &&
              this.edit_item == false &&
              this.role == 4
            "
          >
            <div class="text-end p-1" @click="bun_edit_table('')">
              <i class="bi bi-pencil-square"></i>
            </div>
          </template>
          <div class="table-scroll">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">รายการ</th>
                  <th scope="col" class="text-end">งบประมาณ</th>
                  <th
                    v-if="this.edit_table == true"
                    scope="col"
                    class="text-end"
                  >
                    แก้ไข
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in this.data_list.list_budget.data">
                  <tr class="small ef" style="font-size: 17px">
                    <template v-if="item.id == this.edit_item_id">
                      <th class="fw-normal bg-warning">{{ item.list_name }}</th>
                      <th class="text-end fw-normal bg-warning">
                        {{ item.budget }} บาท
                      </th>
                    </template>
                    <template v-else>
                      <th class="fw-normal">{{ item.list_name }}</th>
                      <th class="text-end fw-normal">{{ item.budget }} บาท</th>
                    </template>

                    <th
                      v-if="this.edit_table == true"
                      class="text-center"
                      style="width: 10px"
                    >
                      <i
                        class="bi bi-pencil-square"
                        @click="bun_edit_item(item)"
                      ></i>
                    </th>
                  </tr>
                </template>

                <!--ไม่มีรายการ-->
                <template v-if="this.data_list.list_budget.data.length == 0">
                  <tr class="small" style="font-size: 17px">
                    <th class="fw-normal">ไม่มีรายการ</th>
                    <th class="text-end">0 บาท</th>
                    <th class="text-end"></th>
                  </tr>
                </template>

                <!--ยอดรวม-->
                <template
                  v-if="
                    this.edit_table == false &&
                    this.data_list.list_budget.data.length != 0
                  "
                >
                  <tr class="small" style="font-size: 17px">
                    <th>รวมทั้งสิ้น</th>
                    <th class="text-end">{{ this.budget_all_format }} บาท</th>
                    <th class="text-end"></th>
                  </tr>
                </template>

                <!--เพิ่มรายการ-->
                <template v-if="this.edit_table == false && this.role == 4">
                  <tr class="small" style="font-size: 17px">
                    <th style="width: 70%">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="รายการ"
                        v-model="list_name"
                      />
                    </th>
                    <th class="text-end">
                      <div class="text-end">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="งบประมาณ"
                          v-model="budget"
                          min="0"
                        />
                      </div>
                    </th>
                  </tr>

                  <tr class="small" style="font-size: 17px">
                    <th style="width: 70%"></th>
                    <th class="text-end">
                      <div class="text-end">
                        <button
                          v-if="
                            this.list_name != '' &&
                            this.budget != '' &&
                            this.edit_item == false
                          "
                          style="width: 100px"
                          type="button"
                          class="btn btn-primary ef m-2"
                          @click="bun_add_list()"
                        >
                          เพิ่ม
                        </button>
                      </div>
                    </th>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ยกเลิก or แก้ไข -->
        <template v-if="this.edit_item == true">
          <div class="pt-2 text-end">
            <button
              type="button"
              class="btn btn-danger ef m-2"
              @click="bun_edit_table(0)"
            >
              ยกเลิก
            </button>
            <button
              v-if="this.list_name != '' && this.budget != ''"
              type="button"
              class="btn btn-primary ef m-2"
              @click="bun_edit_table(1)"
            >
              แก้ไข
            </button>
          </div>
        </template>

        <p v-if="this.data_list.file_doc.data.length == 0" class="fw-bold pt-4">
          ไม่มีเอกสารการที่อัพโหลด
        </p>
        <p v-else class="fw-bold pt-4">เอกสารการเก็บข้อมูล</p>
        <template
          v-if="this.edit == false"
          v-for="item in this.data_list.file_doc.data"
        >
          <div class="row mb-3 d-flex ef">
            <div class="col-1" style="font-size: 40px">
              <i
                v-if="item.file_name_db.includes('.pdf')"
                class="bi bi-filetype-pdf"
              ></i>
              <i
                v-if="item.file_name_db.includes('.xlsx')"
                class="bi bi-filetype-xlsx"
              ></i>
              <i
                v-if="item.file_name_db.includes('.doc')"
                class="bi bi-filetype-docx"
              ></i>
            </div>
            <div class="col-9">
              <div class="row">
                <div
                  v-if="item.email == this.create_email && this.role != 4"
                  class="col-12 fw-bold"
                >
                  {{ item.file_name }}
                  <i
                    class="bi bi-pencil-square"
                    @click="bun_edit(item.file_name, item.file_name_db)"
                  ></i>
                </div>
                <div v-else class="col-12 fw-bold">{{ item.file_name }}</div>
                <div class="col-12">
                  <button
                    v-if="item.email == this.create_email || this.role == 4"
                    style="color: black"
                    type="button"
                    class="btn btn-link m-0 p-0"
                    @click="download_file(item.file_name_db)"
                  >
                    Download
                  </button>
                  <button
                    v-if="item.email == this.create_email && this.role != 4"
                    style="color: black"
                    type="button"
                    class="btn btn-link m-0 ps-2"
                    @click="delete_file(item.file_name_db)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <button
          v-if="
            this.showInput == false &&
            this.data_list.file_doc.data.length <= 4 &&
            ownerEmail === create_email
          "
          type="button"
          class="btn btn-primary"
          @click="showFileInput"
        >
          Add
        </button>
        <!-- form -->
        <form
          v-if="this.showInput == true"
          action="#"
          @submit.prevent="handleFormSubmit"
        >
          <div class="row mb-3">
            <span class="m-1">ชื่อเอกสาร</span>
            <div class="col-sm-10 pt-1">
              <input
                type="text"
                class="form-control"
                id="projectname"
                placeholder="ชื่อเอกสาร"
                required
                v-model="file_name"
              />
            </div>
          </div>
          <span class="m-1">เลือกไฟล์</span>
          <div class="row mb-3 pt-1">
            <div class="col-sm-10">
              <input
                type="file"
                class="form-control"
                accept=".doc,.docx,.pdf,.xlsx"
                required
                @change="handleFileUpload"
              />
            </div>
          </div>
          <div class="row">
            <div class="text-center">
              <template v-if="this.edit == false">
                <button
                  type="submit"
                  class="btn btn-success btn-lg mb-1 pull-right m-1"
                  style="
                    background: #ef4d4e;
                    border-radius: 4px;
                    color: #ffffff;
                    border-color: #ef4d4e;
                    font-size: 14px;
                  "
                >
                  อัพโหลด
                </button>
              </template>

              <template v-else>
                <button
                  type="button"
                  class="btn btn-success btn-lg mb-1 pull-right m-1"
                  style="
                    background: #ef4d4e;
                    border-radius: 4px;
                    color: #ffffff;
                    border-color: #ef4d4e;
                    font-size: 14px;
                  "
                  @click="bun_edit_doc(0)"
                >
                  ยกเลิก
                </button>
                <button
                  v-if="this.file_name != '' && this.selectedFile != null"
                  type="button"
                  class="btn btn-success btn-lg mb-1 pull-right m-1"
                  style="
                    background: #ef4d4e;
                    border-radius: 4px;
                    color: #ffffff;
                    border-color: #ef4d4e;
                    font-size: 14px;
                  "
                  @click="bun_edit_doc(1)"
                >
                  แก้ไข
                </button>
              </template>
            </div>
          </div>
        </form>
      </div>
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

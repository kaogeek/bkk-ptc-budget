<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import Editor from "@tinymce/tinymce-vue";

export default {
  props: {
    data_list_props: { type: Object, required: true },
  },
  data() {
    return {
      id: null,
      role: null,
      create_email: null,
      selectedFile: null,
      owner_id: null,
      name: "",
      short_description: "",
      og_image: "",
      api_url: "",
      api_token: "",
      editorConfig: {
        plugins: "lists link image table code help wordcount textpattern",
      },
    };
  },
  created() {
    this.name = this.data_list_props.name;
    this.short_description = this.data_list_props.short_description;
    this.description = this.data_list_props.description;
  },
  mounted() {
    const runtimeConfig = useRuntimeConfig();
    this.api_url = runtimeConfig.public.baseApiUrl;
    this.api_token = runtimeConfig.tokenApi;
    this.asyncData();
    this.id = this.$route.params.id;
  },
  components: {
    Editor,
  },
  methods: {
    async asyncData() {
      const token = sessionStorage.getItem("auth-token");
      if (token != null) {
        var decoded = jwt_decode(token);
        this.role = decoded.role;
        this.owner_id = decoded.role;
        this.create_email = decoded.email || "";
        // console.log('decoded ',decoded)
      }
    },
    async api_upload_project(row_id) {
      try {
        const url = this.api_url + "api/upload/project";
        const params = {};
        const json = {
          name: this.name,
          short_description: this.short_description,
          description: this.description,
          og_image: this.og_image,
          row_id: row_id,
        };
        const options = {
          headers: {
            Authorization: "Bearer " + this.api_token,
          },
        };
        const res = await axios.post(url, json, options);
        // console.log('response', res.data.data[0])
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "",
            text: res.data.statusMsg,
            timer: 1500,
          });
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          Swal.fire({
            icon: "error",
            title: "Opos",
            text: res.data.statusMsg,
            timer: 2000,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleFormSubmit() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        axios
          .post(this.api_url + "api/upload/img", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            // Handle the response from the server
            if (response.status === 200) {
              this.og_image = response.data.filename;
            } else {
              Swal.fire({
                icon: "error",
                title: "Opos",
                text: "อัพโหลดรูปภาพล้มเหลว",
                timer: 2000,
              });
            }
            // add_project
            this.api_upload_project(this.id);
          })
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
      } else {
        // add_project
        this.api_upload_project(this.id);
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
  },
};
</script>

<template>
  <div>
    <div class="container" style="margin-top: 10px">
      <div class="row">
        <div class="card">
          <div class="card-body">
            <form action="#" @submit.prevent="handleFormSubmit">
              <div class="row mb-3">
                <label for="projectname" class="col-sm-2 col-form-label"
                  >ชื่อโครงการ</label
                >
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="projectname"
                    placeholder="ชื่อโครงการ"
                    required
                    v-model="name"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="projectgoal" class="col-sm-2 col-form-label"
                  >รูปภาพ</label
                >
                <div class="col-sm-10">
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="onFileChange"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="projectname" class="col-sm-2 col-form-label"
                  >รายละเอียดโครงการย่อ</label
                >
                <div class="col-sm-10">
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    v-model="short_description"
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <label for="projectscope" class="col-sm-2 col-form-label"
                  >รายละเอียดโครงการเต็ม</label
                >
                <div class="col-sm-10">
                  <Editor
                    api-key="editorToken"
                    v-model="description"
                    :init="editorConfig"
                  />
                </div>
              </div>
              <div class="row">
                <div class="text-center">
                  <button
                    type="submit"
                    class="btn btn-success btn-lg mb-1 pull-right"
                    style="
                      background: #ef4d4e;
                      border-radius: 4px;
                      color: #ffffff;
                      border-color: #ef4d4e;
                      font-size: 14px;
                    "
                  >
                    แก้ไขฟอร์มโครงการ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

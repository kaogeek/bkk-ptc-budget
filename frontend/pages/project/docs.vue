<script>
    import jwt_decode from "jwt-decode";
    import axios from 'axios'
    import Swal from 'sweetalert2'
 
    // token ใช้ใน api
    const token = '***REMOVED***>'
    // const link_API = 'http://bkkpb.ath.cx/'
    const link_API = 'http://localhost:8090/'

  export default {
    props: {
      data_list_props: {type: Array, required: true}
    },
    data() {
      return {
        data_list: [],
        role: null,
        create_email: null,
        id: null,
        fullname: '',
        title: '',
        showInput: false,
        selectedFile: null,
      }
    },
    created() {
      this.data_list = this.data_list_props;
    },
    mounted(){
      this.asyncData();
      this.id = this.$route.params.id;

    },
    components: {
    },
    methods: {

      async asyncData() {
          const token = sessionStorage.getItem('auth-token');

          if (token != null) {
              var decoded = jwt_decode(token);
              this.role = decoded.role
              this.create_email = decoded.email
              this.fullname = decoded.fullname
              // console.log('decoded ',decoded)
          }
      },

      // รับข้อมูล เก็บใน projects
      async api_get_project_id () {
      try {
          const url     = link_API+'api/project/'+this.id
          const params  = {}
          const json    = {}
          const options = {
          headers: {
              'Authorization': 'Bearer ' + token
          }
          }
          const res = await axios.get(url, json, options)

          if (res.status === 200){
              this.data_list = res.data.data[0]

          }else{
              Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'api_get_project_id : '+res.status
              })
          }

      } catch (error) {
          console.error(error)
        }
      },

      // update file_doc_id
      async api_update_file_doc_id (row_id, file_name_db) {
        try {
            const url     = link_API+'api/update/doc_id'
            const params  = {}
            const json    = {
                "list_update" : {"file_name":this.file_name,"file_name_db": file_name_db, "email":this.create_email},
                "row_id" : row_id
            }
            const options = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
            }
            const res = await axios.post(url, json, options)
            console.log(res.status)

            if (res.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                icon: 'success',
                title: 'อัพโหลดเอกสารสำเร็จ'
                })

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ไม่สามารถอัพเดทได้'
                })
            }

        } catch (error) {
            console.error(error)
        }
      },

      // update file_name id
      async api_update_file_name_id (row_id, file_name_db) {
        try {
            const url     = link_API+'api/update/file_name_id'
            const params  = {}
            const json    = {
                "file_name_db" : file_name_db,
                "row_id" : row_id
            }
            const options = {
              headers: {
                  'Authorization': 'Bearer ' + token
              }
            }
            const res = await axios.post(url, json, options)
            if (res.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                icon: 'success',
                title: 'ลบเอกสารสำเร็จ'
                })

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ลบเอกสารล้มเหลว'
                })
            }

        } catch (error) {
            console.error(error)
        }
      },

      showFileInput(){
        this.showInput  = true;
      },

      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },

      handleFormSubmit(){
          let file_name_db = ''
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          axios.post(link_API+'api/upload/doc', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            if (response.status === 200){
              file_name_db = response.data.filename
              this.api_update_file_doc_id (this.id, file_name_db)
              setTimeout(() => { 
                this.api_get_project_id() 
                this.showInput  = false;
                this.file_name = ''
              }, 500)

              
            }else{
              Swal.fire({
                  icon: 'error',
                  title: 'Opos',
                  text: 'อัพโหลล้มเหลว',
                  timer: 2000
              })
            }
          })
          .catch(error => {
            console.error(error);
          });
      },

      download_file(file_name){
        const url  = link_API+'api/download/doc/'+file_name
        window.open(url, '_blank');
      },

      delete_file(file_name){
        Swal.fire({
        title: 'ต้องการลบใช่หรือไม่?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(link_API+'api/delete/doc/'+file_name)
            .then(response => {
              setTimeout(() => { this.api_update_file_name_id (this.id, file_name) }, 500)
              setTimeout(() => { this.api_get_project_id()},2500)
            })
            .catch(error => {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'ลบเอกสารล้มเหลว'
              })
              console.error(error);
            });
          }
       });
      }
    }
  }
</script>

<template >
  <!-- <p> data_list : {{ this.data_list.file_doc }}</p> -->
  <div class="container m-0 p-0 pt-2">
      <div class="row ef">
        <div  class="col-md-10  ef">
          <span>ตารางแผนการใช้เงินสำหรับโครงการ</span> <span class="fw-bold">{{ this.data_list.name }}</span>
          <p v-if="this.data_list.file_doc.data.length == 0" class="fw-bold pt-4">ไม่มีเอกสารการที่อัพโหลด</p>
          <p v-else class="fw-bold pt-4">เอกสารการเก็บข้อมูล</p>

          <template v-for="item in this.data_list.file_doc.data">
            <div class="row mb-3 d-flex ef">
              <div class="col-1" style="font-size:40px">
                <i v-if="item.file_name_db.includes('.pdf')" class="bi bi-filetype-pdf"></i>
                <i v-if="item.file_name_db.includes('.xlsx')" class="bi bi-filetype-xlsx"></i>
                <i v-if="item.file_name_db.includes('.doc')" class="bi bi-filetype-docx"></i>
              </div>
              <div class="col-9">
                <div class="row">
                  <div class="col-12">{{ item.file_name }}</div>
                  <div class="col-12">
                    <!-- role 1 โหลดได้ ลบ ได้  และ เมล์ ต้องตรงกันด้วย -->
                    <button v-if="item.email == this.create_email" style="color : black" type="button" class="btn btn-link m-0 p-0" @click="download_file(item.file_name_db)">Download</button>
                    <button v-if="item.email == this.create_email && this.role != 4" style="color : black" type="button" class="btn btn-link m-0 ps-2" @click="delete_file(item.file_name_db)">Delete</button>
                  </div>
                </div>
              </div>
          </div>
          </template>
          <button v-if="this.showInput == false && this.data_list.file_doc.data.length <= 4 && this.role == 1 || this.role == 4" type="button" class="btn btn-primary" @click="showFileInput">Add</button>
          <!-- form -->
          <form v-if="this.showInput == true" action="#" @submit.prevent="handleFormSubmit">
              <div class="row mb-3">
                <span class="m-1">ชื่อเอกสาร</span>
                <div class="col-sm-10 pt-1">
                  <input type="text" class="form-control" id="projectname" placeholder="ชื่อเอกสาร" required v-model="file_name">
                </div>
              </div>
              <span class="m-1">เลือกไฟล์</span>
              <div class="row mb-3 pt-1">
                  <div class="col-sm-10">
                    <input type="file" class="form-control" accept=".doc,.docx,.pdf,.xlsx" required @change="handleFileUpload">
                  </div>
              </div>
              <div class="row">
                <div class="text-center">
                  <button type="submit" class="btn btn-success btn-lg mb-1 pull-right" style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;">อัพโหลด</button>
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
.c-1{
    /* background-color: rgb(121, 121, 121); */
    border: 2px solid rgb(78, 78, 78);
}
.c-2{
    border: 2px solid rgb(0, 88, 110);
}
</style>
  
  
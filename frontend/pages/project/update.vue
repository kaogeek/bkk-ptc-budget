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
        content: ''
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
              console.log('decoded ',decoded)
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
                this.data_list = res.data.data[0].list_update.data
                // console.log('....',res.data.data[0].list_update.data)

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

      // update chat_id
      async api_update_chat_id (row_id) {
      try {
          const url     = link_API+'api/update/chat_id'
          const params  = {}
          const json    = {
              "list_update" : {"title": this.title, "content": this.content, "fullname":this.fullname, "Staff_name":this.role},
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
              title: 'อัพเดทสำเร็จ'
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
      
      button_updater(){
        this.api_update_chat_id (this.id)
        setTimeout(() => { this.api_get_project_id() }, 500)
        this.title = ''
        this.content = ''

      }
    }
  }
</script>

<template >
  <div class="container m-0 p-0" style="margin-top: 44px;">
      <div class="row ef">
        <!-- ไม่มี แชท -->
        <div v-if="this.data_list.length == 0" class="col-md-10 p-2 ef">
            <div class="p-2 text-center" style="background-color: rgb(221, 221, 221); border-radius: 10px">
                <p class="fw-bold">ไม่มีรายการอัพเดท</p>
            </div>
        </div>

        <div v-if="this.data_list.length != 0" v-for="item in this.data_list" class="col-md-10 p-2 ef">
            <div class="p-2" style="background-color: rgb(221, 221, 221); border-radius: 10px">
                <p class="fw-bold">{{item.title}}</p>
                <div style="background-color: rgb(138, 138, 138); height: 2px;"></div>
                <p class="pt-3">{{item.content}}</p>
                <div style="background-color: rgb(138, 138, 138); height: 2px;"></div>
                <div class="d-flex justify-content-between">
                  <span v-if="item.Staff_name == 4" class="pt-3 text-start">อัฟเดทโดย {{item.fullname}} (เจ้าหน้าที่ กทม)</span>
                  <span v-if="item.Staff_name == 1" class="pt-3 text-start">อัฟเดทโดย {{item.fullname}} (คณะกรรมการชุมชน)</span>
                  <span class="pt-3 text-end">{{item.date}}</span>
              </div>
            </div>
        </div>
        
        <div v-if="this.role == 4 || this.role == 1" class="col-md-10 p-2">
          <div class="p-2" style="background-color: rgb(221, 221, 221); border-radius: 10px">
            <input type="email" class="form-control" id="floatingInput" placeholder="หัวข้อ" v-model="title">
            <div class="form-floating pt-2">
              <textarea style="height :150px" class="form-control" placeholder="Leave a comment here" id="floatingTextarea" v-model="content"></textarea>
              <label for="floatingTextarea">เนื้อหา</label>
            </div>
            <div class=" pt-2 text-end">
              <button v-if="this.title != '' && this.content != ''" type="button" class="btn btn-light ef" @click="button_updater()">Update</button>
            </div>
          </div>
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
  
  
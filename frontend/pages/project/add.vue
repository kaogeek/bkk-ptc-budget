<script>
import jwt_decode from "jwt-decode";
import axios from 'axios'
import Swal from 'sweetalert2'
import Editor from '@tinymce/tinymce-vue'

import {token, baseUrl} from '../../lib/config'

export default {
	data() {
		return {
			role: null,
			create_email: null,
			hashtag: '',
			selectedFile: null,
			status_id: '1',
			owner_id: null,
			name: '',
			short_description: '',
			og_image: '',
			description: '',
			participation: '',
			evaluation: '',
			financial_plan: '',
			communityname: '',
			districtname: '',
			editorConfig: {
				plugins: 'lists link image table code help wordcount textpattern'
			}
		}
	},
	mounted() {
		this.asyncData();
	},
	components: {
		Editor
	},
	methods: {

		async asyncData() {
			const token = sessionStorage.getItem('auth-token');

			if (token != null) {
				var decoded = jwt_decode(token);
				this.role = decoded.role
				this.owner_id = decoded.role
				this.create_email = decoded.email
				this.api_get_community(decoded.community)
				this.api_get_district(decoded.district)
				console.log('decoded ', decoded)
			}
		},

		async api_add_project() {
			try {
				const url = baseUrl + 'api/add/project'
				const params = {}
				const json = {
					"status_id": this.status_id,
					"owner_id": this.owner_id,
					"name": this.name,
					"short_description": this.short_description,
					"og_image": this.og_image,
					"description": this.description,
					"participation": this.participation,
					"evaluation": this.evaluation,
					"financial_plan": this.financial_plan,
					"hashtag": this.hashtag,
					"create_email": this.create_email,
					"note": 'โน้ด การมีส่วนรวมจากชุมชน',
					"status_note": { "note": "", "fullname": "" },
					"communityname": this.communityname,
					"districtname": this.districtname,
				}
				const options = {
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}
				const res = await axios.post(url, json, options)
				// console.log('response', res.data.data[0])
				if (res.status === 200) {
					Swal.fire({
						icon: 'success',
						title: '',
						text: res.data.statusMsg,
						timer: 1500
					}).then((result) => {
						this.$router.push('../project/' + res.data.data[0].id)
					})
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Opos',
						text: res.data.statusMsg,
						timer: 2000
					})
				}
			} catch (error) {
				console.error(error)
			}
		},

		// api/get/community/id
		async api_get_community(id) {
			try {
				const url = baseUrl + 'api/get/community/id'
				const params = {}
				const json = { "id": id }
				const options = {
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}
				const res = await axios.post(url, json, options)
				if (res.status === 200) {
					this.communityname = res.data.data[0].communityname

				}
			} catch (error) {
				console.error(error)
			}
		},

		// get district name by id
		async api_get_district(id) {
			try {
				const url = baseUrl + 'api/get/district/id'
				const params = {}
				const json = { "id": 1003 }
				const options = {
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}
				const res = await axios.post(url, json, options)
				if (res.status === 200) {
					this.districtname = res.data.data[0].name_th

				}
			} catch (error) {
				console.error(error)
			}
		},

		handleFormSubmit() {
			if (this.selectedFile) {
				const formData = new FormData();
				formData.append('file', this.selectedFile);

				axios.post(baseUrl + 'api/upload/img', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
					.then(response => {
						// Handle the response from the server
						if (response.status === 200) {
							this.og_image = response.data.filename
						} else {
							Swal.fire({
								icon: 'error',
								title: 'Opos',
								text: 'อัพโหลดรูปภาพล้มเหลว',
								timer: 2000
							})
						}
						// add_project
						this.api_add_project()
					})
					.catch(error => {
						// Handle the error
						console.error(error);
					});
			} else {
				// add_project
				this.api_add_project()
			}
		},

		onFileChange(event) {
			this.selectedFile = event.target.files[0];
		},
	}
}
</script>

<template>
	<div>

		<Head>
			<Title>ชุมชนโปร่งใส - เพิ่มข้อมูลโครงการ</Title>
		</Head>
		<NavBar />
		<div class="container" style="margin-top:94px;">
			<p style="font-size:36px;font-weight:100;" class="text-center">แบบฟอร์มโครงการ</p>
			<div class="row">
				<div class="card">
					<div class="card-body">
						<form action="#" @submit.prevent="handleFormSubmit">
							<div class="row mb-3">
								<label for="projectname" class="col-sm-2 col-form-label">ชื่อโครงการ</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="projectname" placeholder="ชื่อโครงการ" required
										v-model="name">
								</div>
							</div>
							<div class="row mb-3">
								<label for="projectbudgetyear" class="col-sm-2 col-form-label">ปีงบประมาณ</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="projectbudgetyear" placeholder="ปีงบประมาณ" required>
								</div>
							</div>
							<div class="row mb-3">
								<label for="projectname" class="col-sm-2 col-form-label">แฮชแท็ก</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="projectname" placeholder="แฮชแท็ก" required
										v-model="hashtag">
								</div>
							</div>
							<div class="row mb-3">
								<label for="projectgoal" class="col-sm-2 col-form-label">รุปภาพ</label>
								<div class="col-sm-10">
									<input type="file" class="form-control" accept="image/*" @change="onFileChange">
								</div>
							</div>
							<div class="row mb-3">
								<label for="projectname" class="col-sm-2 col-form-label">รายละเอียดโครงการย่อ</label>
								<div class="col-sm-10">
									<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
										v-model="short_description"></textarea>
								</div>
							</div>

							<div class="row mb-3">
								<label for="projectscope" class="col-sm-2 col-form-label">รายละเอียดโครงการเต็ม</label>
								<div class="col-sm-10">
									<Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" v-model="description"
										:init="editorConfig" />
								</div>
							</div>
							<div class="row">
								<div class="text-center">
									<button type="submit" class="btn btn-success btn-lg mb-1 pull-right"
										style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;">ยื่นแบบฟอร์มโครงการ</button>
								</div>
							</div>

						</form>
					</div>
				</div>

			</div>
	</div>
</div></template>
  
  
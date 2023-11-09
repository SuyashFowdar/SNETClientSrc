<template>
	<div class="w-flex">
		<div class="marginTop20">
			<div class="borderRadius5 shadow-15 layout-padding8 x-center marginTop20 column">
				<div class="w-flex row x-center marginTop20" v-if="me">
					<MyImage :imgId="me.myImage"></MyImage>
					<div class="row y-center padding4 snetUpload snetButton">
						<div class="uploadBG">Upload New Image</div>
						<input type="file" class="input" @change="uploadMyImage" accept="image/*">
					</div>
				</div>
				<div class="row x-center" :style="{ color: result.success ? 'green' : 'red' }">{{ result.message }}</div>
				<div>
					Username:
					<input type="text" v-model="userUpdate.username" class="snetInput">
				</div>
				<div class="row x-center">
					<div class="options w-50 padding8" @click="updatePassword = !updatePassword">Click here to update password</div>
				</div>
				<div class="column layout-padding8" v-if="updatePassword">
					<div>
						Current Password:
						<input type="text" v-model="userUpdate.currentPass" class="snetInput">
					</div>
					<div>
						New Password:
						<input type="text" v-model="userUpdate.newPass" class="snetInput">
					</div>
					<div>
						Confirm New Password:
						<input type="text" v-model="userUpdate.confirmPass" class="snetInput">
					</div>
				</div>
				<div class="x-center layout-margin8">
					<button class="snetButton sub">Cancel</button>
					<button class="snetButton">Save</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';
	import MyImage from '../components/MyImage.vue';
	import _ from 'lodash';

	export default {
		name: 'InfoEdit',
		components: {
			MyImage
		},
		data() {
			return {
				result: {},
				updatePassword: false,
				userUpdate: {}
			}
		},
		computed: {
			me() {
				return this.$store.getters.getUser;
			}
		},
		created() {
			this.userUpdate.username = _.clone(this.me.username);
		},
		methods: {
			uploadMyImage(e) {
				var formData = new FormData();
				var opts = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				var files = e.target.files;
				if (files) {
					for (var i = 0; i < files.length; i++) {
						formData.append('file', files[i]);
					}
					this.$http.post(BASEURL + 'ctrl/uploadMyImage', formData, opts)
						.then(response => {
							this.result.success = true;
							this.result.message = 'Upload Successful!';
							this.$set(this.me, 'myImage', response.body.id);
						})
			            .catch(() => {
			                this.$router.push({ name: 'Error', query: { sess: 'on' } });
			            })
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.marginTop20 {
		margin-top: 20px !important;
	}

	.snetUpload {
		width: 150px;

		.uploadBG {
			position: absolute;
		}
	}
</style>
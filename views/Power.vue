<template>
	<div>
		<div class="row shadow-15">
			<div class="w-flex layout-margin8">
				<button class="snetButton" @click="getSchool()">View Schools</button>
				<button class="snetButton">View Posts</button>
				<button class="snetButton">View Reports</button>
			</div>
			<button class="snetButton margin8" @click="destroySession()">Destroy Session</button>
		</div>
		<div v-if="option === 'school'" class="column">
			<div class="shadow-15 margin8 x-center">
				<div class="row layout-margin8 x-center y-center">
					<div>School Name:</div>
					<input type="text" class="snetInput" v-model="newSchool.name">
				</div>
				<div class="row layout-margin8 x-center y-center">
					<div>Admin Name:</div>
					<input type="text" class="snetInput" v-model="newSchool.adminName">
				</div>
				<button class="snetButton margin8" @click="createSchool()" :class="{ disabled: !newSchool.name || !newSchool.adminName }">Add School</button>
			</div>
			<div v-for="(school, schoolIndex) in schools" class="row layout-padding8" :class="{ 'bg-lightgrey': schoolIndex % 2 === 0 }">
				<div class="row w-flex y-center">{{ school.name }}</div>
				<div class="row w-flex y-center">{{ school.adminId }}</div>
				<div class="w-flex">
					<button class="snetButton" @click="deleteSchool(school._id, schoolIndex)">Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants.js'

	export default {
		name: 'Power',
		data() {
			return {
				option: '',
				newSchool: {},
				schools: [{ name: 'JKC' }, { name: 'RTSS' }]
			}
		},
		created() {
			if (localStorage.token) {
				this.$http.get(BASEURL + 'power/getFirst')
					.catch(() => {
						this.$router.push({ name: 'Error' });
					})
			} else {
				this.$router.push({ name: 'Error' });
			}
		},
		methods: {
			destroySession() {
				this.$http.delete(BASEURL + 'power/destroy')
					.then(() => {
						localStorage.clear();
                		window.location.href = '/';
					})
			},
			getSchool() {
				this.$http.get(BASEURL + 'power/school')
					.then(response => {
						this.schools = response.body;
						this.option = 'school';
					})
			},
			createSchool() {
				this.$http.post(BASEURL + 'power/school', this.newSchool)
					.then(response => {
						this.newSchool.adminId = response.body.adminId;
						this.schools.push(this.newSchool);
						this.newSchool = {};
					})
			},
			deleteSchool(schoolId, schoolIndex) {
				this.$http.delete(BASEURL + 'power/school/' + schoolId)
					.then(response => {
						this.schools.splice(schoolIndex, 1);
					})
			}
		}
	}
</script>
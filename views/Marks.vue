<template>
	<div class="margin8 w-flex">
		<div class="row layout-margin4">
			<Select title="Subject" :options="subjects" v-model="marksQuery.subject" v-if="$route.query.give === 'marks'"></Select>
			<Select title="Year" :options="dates.years" v-model="marksQuery.year" v-if="$route.query.give === 'marks'"></Select>
			<Select title="Semester" :options="[{ value: 1 }, { value: 2 }, { value: 3 }]" v-model="marksQuery.semester" v-if="$route.query.give === 'marks'"></Select>
			<div class="row w-flex x-center">
				<button class="snetButton" @click="fetchMarks()" :class="{ disabled: !marksQuery.subject || !marksQuery.year || !marksQuery.semester }">Fetch</button>
			</div>
		</div>
		<div class="marks shadow-15 margin8 border1black" v-if="$route.query.give === 'marks' && students.length > 0">
			<div class="row header y-center padding8 wrap">
				<div class="w-40">Name</div>
				<div class="w-40">Remarks</div>
				<div class="w-20">Marks</div>
			</div>
			<div class="divider-black w-100"></div>
			<div class="scrollable-y list">
				<div class="row y-center student wrap" v-for="(student, index) in students">
					<div class="w-35 padding8">{{ student.name }}</div>
					<div class="row w-flex y-center" v-if="!editMarks">
						<div class="w-65 padding8">
							{{ student.performance ? student.performance.remark : 'No remarks updated' }}
						</div>
						<div class="w-35 margin8 x-center y-center row pointCount">
							<div>{{ student.performance ? student.performance.mark : '' }}</div>
						</div>
					</div>
					<div class="row w-flex" v-if="editMarks" @click="addToSend(student)">
						<textarea-autosize class="snetInput w-55 remarkEdit margin8" v-model="student.newData.remark"></textarea-autosize>
						<div class="w-35 margin8 y-center row">
							<input type="number" class="markEdit snetInput w-90" v-model="student.newData.mark">
						</div>
					</div>
					<div class="divider-black w-100" v-if="index !== (students.length - 1)"></div>
				</div>
			</div>
		</div>
		<div class="marks shadow-15" v-if="$route.query.give !== 'marks'">
			<div class="row header y-center padding8">
				<div class="w-60">Student</div>
				<div class="w-40">Attendance</div>
			</div>
			<div v-for="(student, index) in students" :class="{ 'bg-lightgrey': index % 2 === 0 }" class="row layout-padding4 y-center" v-if="students.length > 0">
				<div class="w-60 options">{{ student.name }}</div>
				<div class="w-40">
					<Check :radio="true" :items="[{ name: 'Absent', name2: 'Present', value: true, action: 'selectAttendance'}]" @selectAttendance="selectAttendance(student)" v-model="student.attendance"></Check>
				</div>
			</div>
		</div>
		<div class="w-flex row x-center">
			<button class="snetButton sub margin8" @click="cancelEdit()" v-if="editMarks">Cancel</button>
			<button class="snetButton margin8" @click="save()" v-if="editMarks || !$route.query.give">Save</button>
			<button class="margin8 snetButton" v-if="!editMarks && $route.query.give === 'marks' && students.length > 0" @click="setEdit()">
				Update marks
			</button>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';
	import Select from '../components/Select.vue';
	import Check from '../components/Check.vue';
	import _ from 'lodash';

	export default {
		name: 'Marks',
		components: {
			Select,
			Check
		},
		computed: {
			dates() {
				return this.$store.getters.getDates;
			}
		},
		data () {
			return {
				objToSend: {
					users: [],
					usersNot: []
				},
				students: [],
				editMarks: false,
				subjects: [],
				marksQuery: {}
			}
		},
		created() {
			if (this.$route.query.give === 'marks') {
				if (localStorage.subjects) {
					this.subjects = JSON.parse(localStorage.subjects);
					setTimeout(function() {
						delete localStorage.subjects;
					}, 1000);
				} else {
					this.$router.push({ name: 'class', query: { id: this.$route.params.classId } });
				}
			} else {
				this.$http.get(BASEURL + 'ctrl/class/students/' + this.$route.params.classId)
					.then(response => {
						this.students = response.body.students;
					})
					.catch(() => {
						this.$router.push({ name: 'Error', query: { sess: 'on' } });
					})
			}
		},
		methods: {
			fetchMarks() {
				this.$http.get(BASEURL + 'ctrl/class/students/' + this.$route.params.classId
					+ '?subject=' + this.marksQuery.subject
					+ '&year=' + this.marksQuery.year
					+ '&semester=' + this.marksQuery.semester)
					.then(response => {
						this.students = response.body.students;
					})
			},
			setEdit() {
				for (var i = 0; i < this.students.length; i++) {
					this.students[i].newData = {};
					if (this.students[i].performance) {
						this.students[i].newData.mark = this.students[i].performance.mark;
						this.students[i].newData.remark = this.students[i].performance.remark;
						this.students[i].newData.performId = this.students[i].performance._id;
					}
				}
				this.editMarks = true;
			},
			addToSend(student) {
				student.newData.id = student._id;
			},
			cancelEdit() {
				for (var i = 0; i < this.students.length; i++) {
					this.students[i].newData = {};
				}
				this.editMarks = false;
			},
			selectAttendance(user) {
				if (user.attendance) {
					for (var i = 0; i < this.objToSend.usersNot.length; i++) {
						if (this.objToSend.usersNot[i] == user._id) {
							this.objToSend.usersNot.splice(i, 1);
						}
					}
					this.objToSend.users.push(user._id);
				} else {
					for (var i = 0; i < this.objToSend.users.length; i++) {
						if (this.objToSend.users[i] == user._id) {
							this.objToSend.users.splice(i, 1);
						}
					}
					this.objToSend.usersNot.push(user._id);
				}
			},
			save() {
				if (this.$route.query && this.$route.query.give === 'marks') {
					//Save function
					this.objToSend.subject = this.marksQuery.subject;
					this.objToSend.year = this.marksQuery.year;
					this.objToSend.semester = this.marksQuery.semester;
					for (var i = 0; i < this.students.length; i++) {
						if (this.students[i].newData.id) {
							this.objToSend.users.push(this.students[i].newData);
						}
					}
					this.$http.post(BASEURL + 'ctrl/class/students', this.objToSend)
						.then(() => {
							for (var i = 0; i < this.students.length; i++) {
								if (this.students[i].newData.id) {
									this.students[i].performance.mark = this.students[i].newData.mark;
									this.students[i].performance.remark = this.students[i].newData.remark;
								}
							}
							this.editMarks = false;
						})
				} else {
					var date = new Date();
					this.objToSend.field = 'attendances';
					this.objToSend.value = {
						date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
					}
					if (this.objToSend.users.length > 0 || this.objToSend.usersNot.length > 0) {
						this.$http.post(BASEURL + 'ctrl/list/updateMany', this.objToSend)
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.marks {
		overflow: hidden;
		border-radius: 10px;

		.header {
			background-image: linear-gradient(white, #E6E6E6);
			font-weight: bold;
			height: 50px;
		}

		.list {
			max-height: 500px;

			.student {
				min-height: 50px;

				.pointCount {
					height: 50px;

					div {
						font-size: 16px;
						font-family: snetComic;
					}
				}

				.remarkEdit {
					resize: none;
				}

				.markEdit {
					min-width: unset;
				}
			}
		}
	}
</style>
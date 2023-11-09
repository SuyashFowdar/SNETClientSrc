<template>
	<div class="w-flex">
		<div v-for="(container, containerIndex) in containerList" class="margin8 w-flex shadow-15 userContainer" :key="container.id">
			<div class="row header">
				<div class="title padding8 w-flex capitalize">{{ type === 'student' ? container.name : type }}</div>
				<div class="w-10">
					<Option @addStudent="toggleAddUser(container)" @toggleAddUser="toggleAddUser(container)" @updateSalary="fetchSalary(container)" @updateFee="fetchFee(container)" @removeClass="modal = { deleteUser: { userId: container._id, userIndex: containerIndex, container } }" :menus="[
					{ name: 'Add student', option: 'addStudent', condition: type === 'student'},
					{ name: 'Remove class', option: 'removeClass', condition: (type === 'student' && container.students && container.students.length === 0)},
					{ name: 'Update fee', option: 'updateFee', condition: type === 'student'},
					{ name: 'Update salary', option: 'updateSalary', condition: type !== 'student'},
					{ name: type === 'teacher' ? 'Add teacher' : 'Add administrator', option: 'toggleAddUser', condition: type !== 'student'}]" width="30" :right="true"></Option>
				</div>
			</div>
			<div v-if="container.addUser">
				<form name="addUser" @submit="updateUser()" class="layout-padding4">
					<div class="row bg-lightgrey">
						<div class="w-40 padding4">Full name:</div>
						<input class="snetInput" type="text" v-model="newUser.name">
					</div>
					<div class="row">
						<div class="w-40 padding4 row y-center">Gender (Select only 1): </div>
						<Check :radio="true" :items="[{ name: 'Male', value: true, selected: false}, { name: 'Female', value: false, selected: false}]" v-model="newUser.info.male" />
					</div>
					<div class="row bg-lightgrey">
						<div class="w-40 padding4">DOB:</div>
						<Select title="DD" size="small" :options="dates.dates" v-model="date"></Select>
						<Select title="MM" size="small" :options="dates.months" v-model="month"></Select>
						<Select title="YYYY" size="small" :options="dates.years" v-model="year"></Select>
					</div>
					<div class="row">
						<div class="w-40 padding4">Address:</div>
						<input class="snetInput" type="text" v-model="newUser.info.address">
					</div>
					<div class="row bg-lightgrey">
						<div class="w-40 padding4">{{ type === 'student' ? 'Home' : 'Mobile'}} Phone Number</div>
						<input class="snetInput" type="number" v-model="newUser.info.phone.home" v-if="type === 'student'">
						<input class="snetInput" type="number" v-model="newUser.info.phone.mobile" v-else>
					</div>
					<div class="row" v-if="type !== 'schoolAdmin'">
						<div class="w-40 padding4">Subjects (Multiple selection allowed): </div>
						<div class="row">
							<Chips url="subjects" @select="addSubject"></Chips>
							<!-- Add list -->
						</div>
					</div>
					<div class="row w-flex x-center y-center layout-margin4">
						<button type="button" class="snetButton sub" @click="selectedClass.addUser = false;">Cancel</button>
						<button type="submit" class="snetButton">{{ newUser.id ? 'Update': 'Add' }} {{ type !== 'schoolAdmin' ? type : 'administrator' }}</button>
					</div>
				</form>
			</div>
			<div v-else-if="container.viewUser" class="layout-padding8">
				<div class="row w-flex x-center name fwBold">
					{{ newUser.name }}
				</div>
				<div>
					<b>Gender:</b>
					{{ newUser.info.male && newUser.info.male !== 'false' ? 'Male' : 'Female' }}
				</div>
				<div>
					<b>Date of birth:</b>
					{{ newUser.info.DOB }}
				</div>
				<div>
					<b>Home phone number:</b>
					{{ newUser.info.phone.home }}{{ newUser.info.phone.mobile }}
				</div>
				<div class="row" v-if="type !== 'schoolAdmin'">
					<b>Subjects: </b>
					<div v-for="(subject, subjectIndex) in newUser.subjectList" :key="subjectIndex">
						<span v-if="subjectIndex !== 0">,</span>&nbsp;{{ subject }}
					</div>
				</div>
				<div>
					<b>Address: </b>
					{{ newUser.info.address }}
				</div>
				<div v-if="newUser.hasCode">
					<b>First login code: </b>
					{{ newUser.id }}
				</div>
				<div class="row w-flex x-center y-center layout-margin4">
					<button type="button" class="snetButton" @click="container.viewUser = false;">Done</button>
				</div>
			</div>
			<div v-else>
				<div v-for="(user, userIndex) in container[type + 's']" class="user" :class="{ 'bg-lightgrey': userIndex % 2 === 0 }" :key="user.id">
					<div class="row">
						<div class="row layout-padding8 w-flex options" @click="viewDetails(user, container)">
							<div class="w-flex">{{ user.name }}</div>
							<div class="row w-flex" v-if="!container.paymentUpdate">
								<div class="w-flex">
									{{ user.info.male && user.info.male !== 'false' ? 'Male' : 'Female' }}
								</div>
								<div class="w-flex">{{ user.info.DOB }}</div>
								<div class="w-flex">{{ user.info.phone.home }}{{ user.info.phone.mobile }}</div>
							</div>
						</div>
						<div class="w-flex row y-center" v-if="container.paymentUpdate">
							<Check :radio="true" :items="[{ name: 'Not Paid', name2: 'Paid', value: true, action: 'selectPayment'}]" @selectPayment="selectPayment(user)" v-model="user.paymentUpdate"></Check>
						</div>
						<div class="w-10 options row x-center y-center menu" @click="toggleAddUser(container, user)">Edit</div>
						<div class="w-10 options row x-center y-center menu" @click="modal = { deleteUser: { userId: user.id, userIndex, container } }">Remove</div>
					</div>
				</div>
				<div v-if="container.paymentUpdate" class="w-flex row x-center">
					<button class="snetButton sub margin8" @click="container.paymentUpdate = false;">Cancel</button>
					<button class="snetButton margin8" @click="savePayment(container)">Save</button>
				</div>
			</div>
		</div>
		<form name="addClass" class="w-flex layout-margin8" @submit="createClass" v-if="type === 'student'">
			<input type="text" placeholder="Class Name" class="snetInput" v-model="newClass.name" v-if="addClass">
			<div class="row w-30">
				<Chips url="teachers" @select="addFormTeacher" placeholder="Add form teacher(s)" v-if="addClass"></Chips>
			</div>
			<div class="row" v-if="newClass.coordinatorsList && newClass.coordinatorsList.length > 0">
				<b class="padding4">Form teachers:</b>
				<div v-for="(coordinator, index) in newClass.coordinatorsList" class="row layout-padding4" :key="coordinator.id">
					<div v-if="index !== 0">,</div>&nbsp;
					<router-link :to="{ name: 'mypage', params: { id: coordinator.id } }" class="options">
						{{ coordinator.name }}
					</router-link>
				</div>
			</div>
			<div class="row x-center y-center layout-margin8">
				<button type="button" class="snetButton sub" @click="addClass = false; newClass = { coordinatorsList: [], coordinators: [] }" v-if="addClass">Cancel</button>
				<button type="submit" class="snetButton" v-if="addClass">Create Class</button>
				<button type="button" class="snetButton sub" @click="addClass = true" v-else>Add Class</button>
			</div>
		</form>
		<div class="modal" v-if="modal">
			<div class="content" v-if="modal.deleteUser">
				<div class="row w-flex y-center x-center">Are you sure you want to delete?</div>
				<div class="w-flex row y-bottom layout-margin8">
					<button class="snetButton sub" @click="modal = false;">Cancel</button>
					<button class="snetButton" @click="removeUser(modal.deleteUser.userId, modal.deleteUser.userIndex, modal.deleteUser.container); modal = false;">Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { BASEURL } from '../constants';
import _ from 'lodash';
import Check from '../components/Check.vue';
import Select from '../components/Select.vue';
import Option from '../components/Option.vue';
import Chips from '../components/Chips.vue';

export default {
	name: 'userlist',
	components: {
		Check,
		Select,
		Option,
		Chips
	},
	data() {
		return {
			school: {},
			userToAdd: {
				info: {
					phone: {}
				},
				subjects: []
			},
			newUser: {},
			containerList: [],
			selectedClass: {},
			addClass: false,
			newClass: {
				coordinatorsList: [],
				coordinators: []
			},
			date: '',
			month: '',
			year: '',
			type: this.$route.params.userType,
			objToSend: { users: [], usersNot: [] },
			modal: false
		}
	},
	computed: {
		dates() {
			return this.$store.getters.getDates;
		}
	},
	created() {
		this.fetchUsers();
	},
	methods: {
		addUser() {
			if (this.type === 'student') {
				this.newUser.studentDetails.class = this.selectedClass._id;
			}
			this.newUser.school = this.school.id;
			this.$http.post(BASEURL + 'ctrl/list/update/' + this.type, this.newUser)
				.then(response => {
					this.newUser.id = response.body.id;
					this.selectedClass[this.type + 's'].push(copyNewUser(this.newUser));
					this.newUser = {};
					this.selectedClass.addUser = false;

					function copyNewUser(user) {
						return user;
					}
				})
		},
		createClass(e) {
			e.preventDefault();
			this.newClass.coordinatorsList = [];
			this.$http.post(BASEURL + 'ctrl/list/update/class', this.newClass)
				.then(response => {
					this.containerList.push({ name: this.newClass.name, _id: response.body.id, students: [] });
					this.newClass = {
						coordinatorsList: [],
						coordinators: []
					}
					this.addClass = false;
				})
		},
		fetchUsers() {
			var sClass, subjectFind, i, j;
			this.$http.get(BASEURL + 'ctrl/list/' + this.type)
				.then(response => {
					this.school = response.body;
					this.objToSend = { users: [], usersNot: [] };
					if (this.type === 'student') {
						this.containerList = this.school.classes;
						for (i = 0; i < this.containerList.length; i++) {
							sClass = this.containerList[i];
							sClass.subjectList = [];
							for (j = 0; j < sClass.subjects.length; j++) {
								sClass.subjectList.push({
									name: sClass.subjects[j].subject.name,
									value: sClass.subjects[j].subject.id,
									selected: false
								})
							}
						}
					} else {
						this.containerList = [this.school];
						if (this.type === 'teacher') {
							this.school.subjectList = [];
							for (i = 0; i < this.school.classes.length; i++) {
								sClass = this.school.classes[i];
								for (j = 0; j < sClass.subjects.length; j++) {
									subjectFind = _.find(this.school.subjectList, { value: sClass.subjects[j].subject.id });
									if (!subjectFind) {
										this.school.subjectList.push({
											name: sClass.subjects[j].subject.name,
											value: sClass.subjects[j].subject.id,
											selected: false
										})
									} else {
										subjectFind = null;
									}
								}
							}
						}
						this.$set(this.containerList[0], 'paymentUpdate', false);
					}
				})
				.catch(() => {
					this.$router.push({ name: 'Error', query: { sess: 'on' } });
				})
		},
		editUser() {
			this.$http.put(BASEURL + 'ctrl/list/update/' + this.type, this.newUser)
				.then(() => {
					for (var i = 0; i < this.selectedClass[this.type + 's'].length; i++) {
						if (this.selectedClass[this.type + 's'][i].id === this.newUser.id) {
							Object.assign(this.selectedClass[this.type + 's'][i], this.newUser);
							this.newUser = {};
							this.selectedClass.addUser = false;
						}
					}
				})
		},
		updateUser() {
			this.newUser.info.DOB = this.date + '/' + this.month + '/' + this.year;
			// console.log('this.newUser', this.newUser);
			if (this.newUser.id) {
				this.editUser();
			} else {
				this.addUser();
			}
		},
		removeUser(userId, userIndex, container) {
			var api;
			if (this.type === 'student') {
				if (userId == container._id) {
					api = BASEURL + 'ctrl/list/update/class/' + userId;
				} else {
					api = BASEURL + 'ctrl/list/update/' + this.type + '/' + userId + '?classId=' + container._id;
				}
			} else {
				api = BASEURL + 'ctrl/list/update/' + this.type + '/' + userId;
			}
			this.$http.delete(api)
				.then(() => {
					if (userId == container._id) {
						this.containerList.splice(userIndex, 1);
					} else {
						container[this.type + 's'].splice(userIndex, 1);
					}
				})
		},
		viewDetails(user, container) {
			if (this.type !== 'schoolAdmin') {
				if (!user.subjectList) {
					user.subjectList = [];
					for (var i = 0; i < user[this.type + 'Details'].subjects.length; i++) {
						for (var j = 0; j < container.subjectList.length; j++) {
							if (container.subjectList[j].value === user[this.type + 'Details'].subjects[i]) {
								user.subjectList.push(container.subjectList[j].name);
							}
						}
					}
				}
			}
			if (user) {
				this.newUser = _.cloneDeep(user);
			} else {
				this.newUser = _.cloneDeep(this.userToAdd);
			}
			var toggled = container.viewUser == undefined || container.viewUser == false ? true : false;
			this.$set(container, 'viewUser', toggled);
		},
		toggleAddUser(container, user) {
			container.aValue = 0;
			var toggled = container.addUser == undefined || container.addUser == false ? true : false;
			if (user) {
				var date = user.info.DOB.split('/');
				this.newUser = _.cloneDeep(user);
				this.newUser.studentDetails.subjects = [];
				this.date = date[0];
				this.month = date[1];
				this.year = date[2];
			} else {
				this.date = null;
				this.month = null;
				this.year = null;
				this.newUser = _.cloneDeep(this.userToAdd);
				this.newUser[this.type + 'Details'] = {
					subjects: []
				};
			}
			this.selectedClass = container;
			this.$set(container, 'addUser', toggled);
			container.aValue++;
		},
		savePayment(container) {
			var date = new Date();
			if (this.type === 'student') {
				this.objToSend.field = 'studentDetails.feePayment';
			} else {
				this.objToSend.field = 'teacherDetails.salaryPayment';
			}
			this.objToSend.value = {
				month: date.getMonth(),
				year: date.getFullYear()
			};
			if (this.objToSend.users.length > 0 || this.objToSend.usersNot.length > 0) {
				this.$http.post(BASEURL + 'ctrl/list/updateMany', this.objToSend)
					.then(() => {
						this.$set(container, 'paymentUpdate', false);
					})
			} else {
				this.$set(container, 'paymentUpdate', false);
			}
		},
		fetchSalary(container) {
			this.$http.get(BASEURL + 'ctrl/list/specific/' + this.type)
				.then(response => {
					var user, salary, date = new Date();
					for (var i = 0; i < this.containerList[0][this.type + 's'].length; i++) {
						user = this.containerList[0][this.type + 's'][i];
						for (var j = 0; j < response.body.length; j++) {
							salary = response.body[j].teacherDetails.salaryPayment;
							if (response.body[j].id == user.id && salary[salary.length - 1] && salary[salary.length - 1].month === date.getMonth() && salary[salary.length - 1].year === date.getFullYear()) {
								this.$set(user, 'paymentUpdate', true);
							}
						}
					}
					this.$set(container, 'paymentUpdate', true);
				})
		},
		fetchFee(container) {
			container.aValue = 0;
			this.$http.get(BASEURL + 'ctrl/list/specific/' + this.type + '?classId=' + container._id)
				.then(response => {
					var user, fee;
					for (var i = 0; i < container[this.type + 's'].length; i++) {
						user = container[this.type + 's'][i];
						for (var j = 0; j < response.body.length; j++) {
							fee = response.body[j].studentDetails.feePayment;
							if (response.body[j].id == user.id && fee[fee.length - 1] && fee[fee.length - 1].year === new Date().getFullYear()) {
								this.$set(user, 'paymentUpdate', true);
							}
						}
					}
					this.$set(container, 'paymentUpdate', true);
					container.aValue++;
				})
		},
		selectPayment(user) {
			var i;
			if (user.paymentUpdate) {
				for (i = 0; i < this.objToSend.usersNot.length; i++) {
					if (this.objToSend.usersNot[i] == user.id) {
						this.objToSend.usersNot.splice(i, 1);
					}
				}
				this.objToSend.users.push(user.id);
			} else {
				for (i = 0; i < this.objToSend.users.length; i++) {
					if (this.objToSend.users[i] == user.id) {
						this.objToSend.users.splice(i, 1);
					}
				}
				this.objToSend.usersNot.push(user.id);
			}
		},
		addFormTeacher(coordinator) {
			var coordinatorAdded;
			for (var i = 0; i < this.newClass.coordinatorsList.length; i++) {
				if (this.newClass.coordinatorsList[i].id === coordinator.id) {
					coordinatorAdded = true;
					break;
				}
			}
			if (!coordinatorAdded) {
				this.newClass.coordinators.push(coordinator.id);
				this.newClass.coordinatorsList.push(coordinator);
			}
		},
		addSubject(subject) {
			var subjectAdded;
			for (var i = 0; i < this.newUser[this.type + 'Details'].subjects.length; i++) {
				if (this.newUser[this.type + 'Details'].subjects === subject.id) {
					subjectAdded = true;
					break;
				}
			}
			if (!subjectAdded) {
				this.newUser[this.type + 'Details'].subjects.push(subject.id);
			}
		}
	},
	watch: {
		'$route'(to) {
			this.type = to.params.userType;
			this.fetchUsers(this.type);
		}
	}
}
</script>
<style lang="scss" scoped>
.userContainer {
	border-radius: 5px;
	min-height: 100px;

	.header {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background-image: linear-gradient(white, #E6E6E6);

		.title {
			font-size: 30px;
		}
	}

	.name {
		font-size: 18px;
	}

	.user {
		&:hover {
			.menu {
				opacity: 1;
			}
		}

		.menu {
			opacity: 0;
		}
	}
}
</style>
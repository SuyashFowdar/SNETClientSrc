<template>
	<div class="w-flex">
		<div class="row x-center y-center" v-if="loading" style="height: 300px;">
			<Loading></Loading>
		</div>
		<div v-else>
			<div class="row x-center margin8">
				<b class="fs24">{{ userClass.name }}</b>
			</div>
			<div class="w-flex row-lg row-md timetable shadow-15" v-if="me.userType === 'student'">
				<div v-for="day in userClass.weeklyTimetable" class="w-flex shadow-15" :key="day.id">
					<div class="w-flex x-center y-center fwBold padding4">
						{{ day.day }}
					</div>
					<div class="divider"></div>
					<div v-for="(period, index) in day.periods" :key="period.id">
						<div class="padding4">{{ period.subject.name }}</div>
						<div class="divider" v-if="index == 2 || index == 5"></div>
					</div>
				</div>
			</div>
			<div v-else-if="me.userType === 'teacher'">
				<div v-if="subjectId && userClass.taught">
					<Homework :teacher="true" :subjectId="subjectId" :classId="classId" :timetable="userClass.teacherTimetable" :subjects="userClass.teacherSubjects"></Homework>
				</div>
				<!-- {{userClass.teacherSubjects}} -->
				<div class="row layout-margin8">
					<button class="snetButton sub" @click="goToUpdateMark()" v-if="userClass.taught">Update marks</button>
					<button class="snetButton sub" @click="$router.push({ name: 'Marks', params: { classId: classId } })" v-if="userClass.coordinated">Update attendance</button>
				</div>
			</div>
			<div class="row margin8 x-center">
				<div class="divider-black w-70"></div>
			</div>
			<div class="row w-flex">
				<IdeaContainer :ideaList="userClass.ideaList" :container="{ id: classId, type: 'class' }" :me="me"></IdeaContainer>
			</div>
			<div class="row x-center y-center padding8" v-if="userClass.ideaList && userClass.ideaList.length === 0">
				<b class="fs24">No ideas to display!</b>
			</div>
		</div>
	</div>
</template>
<script>
	import IdeaInput from '../components/IdeaInput.vue';
	import IdeaContainer from '../components/IdeaContainer.vue';
	import Loading from '../components/Loading.vue';
	import Homework from '../components/Homework.vue';
	import { BASEURL } from '../constants';
	// import _ from 'lodash';

	export default {
		name: 'home',
		data() {
			return {
				userClass: {},
				classId: '',
				subjectId: '',
				loading: true
			}
		},
		computed: {
			me() {
				return this.$store.getters.getUser;
			}
		},
		components: {
			IdeaInput,
			Loading,
			Homework,
			IdeaContainer
		},
		created() {
			this.fetchClass(this.$route.query.id);
		},
		methods: {
			fetchClass(id) {
				var classQuery;
				if (id) {
					classQuery = '?id=' + id;
					this.classId = id;
				} else {
					classQuery = '';
					this.classId = '-';
				}
				this.$http.get(BASEURL + 'ctrl/class' + classQuery)
					.then(response => {
						var book, homework;
						this.userClass = response.body;
						if (this.me.userType === 'teacher' && this.userClass.taught) {
							if (this.userClass.teacherSubjects.length === 1) {
								this.subjectId = this.userClass.teacherSubjects[0].id;
							}
						}
						this.loading = false;
					})
	                .catch(() => {
	                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
	                })
			},
			postIdea(text) {
				var idea = {
					what: {
						text: text
					},
					viewable: {
						by: 'friends'
					}
				}
				this.$http.post(BASEURL + 'ctrl/ideas/class/' + this.classId, idea)
					.then(response => {
						response.body.who = this.me;
						response.body.when = 'now';
						response.body.pointCount = 0;
						response.body.noteCount = 0;
						response.body.reLiveCount = 0;
						idea = '';
						this.userClass.ideaList.unshift(response.body);
					})
			},
			postIdeaDetail(ideaId, detailType, detail) {
				var body = {};
				if (detail) {
					body.what = {
						text: detail
					}
				}
				return this.$http.post(BASEURL + 'ctrl/ideas/details/class/' + this.classId + '/' + ideaId + '/' + detailType, body);
			},
			getIdeaDetails(ideaId, detailType, detailId) {
				if (detailId) {
					return this.$http.get(BASEURL + 'ctrl/ideas/details/class/' + this.classId + '/' + ideaId + '/' + detailType + '?noteAPlus=' + detailId);
				} else {
					return this.$http.get(BASEURL + 'ctrl/ideas/details/class/' + this.classId + '/' + ideaId + '/' + detailType)
				}
			},
			deleteIdeaDetail(ideaId, detailType, detailId) {
				return this.$http.delete(BASEURL + 'ctrl/ideas/details/class/' + this.classId + '/' + ideaId + '/' + detailType + '/' + detailId);
			},
			deleteIdea(ideaId) {
				this.$http.delete(BASEURL + 'ctrl/ideas/class/' + this.classId + '/' + ideaId)
					.then(() => {
						for (var i = 0; i < this.userClass.ideaList.length; i++) {
							if (this.userClass.ideaList[i].id === ideaId) {
								this.userClass.ideaList.splice(i, 1);
							}
						}
					})
			},
			goToUpdateMark() {
				var subjects = [];
				for (var i = 0; i < this.userClass.teacherSubjects.length; i++) {
					subjects.push({
						name: this.userClass.teacherSubjects[i].name,
						value: this.userClass.teacherSubjects[i].id
					});
				}
				localStorage.subjects = JSON.stringify(subjects);
				this.$router.push({ name: 'Marks', params: { classId: this.classId }, query: { give: 'marks'} })
			}
		},
		watch: {
			'$route'(to) {
				this.fetchClass(to.query.id);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.timetable {
		margin-bottom: 10px;
		border-radius: 5px;
	}
</style>
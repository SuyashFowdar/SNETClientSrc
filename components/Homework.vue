<template>
	<div>
		<div class="shadow-15 w-flex padding8 margin8 copybook paper">
			<div class="row w-100 line">
				<b class="w-flex row x-center y-center content subTitle">Class timetable</b>
			</div>
			<div v-for="(day, dayName) in timetable" :key="day.name">
				<div class="row line">
					<b class="row y-bottom content">{{ dayName }}</b>
				</div>
				<div class="row line">
					<div class="row y-bottom content">
						Periods:&nbsp;
						<div v-for="(period, index) in day" :key="period.which">
							{{ index === 0 ? '' : '&nbsp;& ' }}{{ period.which + getRank(period.which)}}
						</div>
					</div>
				</div>
			</div>
			<div class="line"><div class="content"></div></div>
		</div>
		<div class="shadow-15 w-flex padding8 margin8 copybook paper">
			<div v-if="!addHomework">
				<div class="row line w-flex">
					<div class="content x-center row w-flex subTitle relative">
						<b class="row y-center x-center">Homeworks</b>
						<button class="snetButton sub margin8 absolute-right" @click="addHomework = true;" v-if="teacher">Add Homework</button>
					</div>
				</div>
				<div v-for="(subject, subjectIndex) in subjects" :key="subject.subject">
					<div v-for="(homework, homeworkIndex) in subject.homeworks" :key="homework._id" class="relative homework">
						<div class="row line" v-if="homework.bookName">
							<div class="row y-bottom content">Book: {{ homework.bookName }}</div>
						</div>
						<div class="row line" v-if="homework.page">
							<div class="row y-bottom content">Page: {{ homework.page }}</div>
						</div>
						<div class="row line" v-if="homework.exercise">
							<div class="row y-bottom content">Exercise: {{ homework.exercise }}</div>
						</div>
						<div class="row line" v-if="homework.description">
							<div class="row y-bottom content">Description: {{ homework.description }}</div>
						</div>
						<div class="row line">
							<div class="row y-bottom content">Due date: {{ homework.dueDay }} {{ homework.dueDate }}</div>
						</div>
						<div class="line"><div class="content"></div></div>
						<div class="edit" v-if="teacher">
							<div class="row layout-margin4 layout-padding4">
								<div class="options x-center" @click="toggleEdit(homework, homeworkIndex, subjectIndex)">Edit</div>
								<div class="options x-center" @click="modal = { delete: { homeworkId: homework._id, homeworkIndex, subjectIndex } }">Delete</div>
							</div>
							
						</div>
					</div>
				</div>
				<div v-if="noHomework" class="row line">
					<div class="row y-bottom content">No homework updated!</div>
				</div>
				<div class="line"><div class="content"></div></div>
			</div>
			<div v-else class="column layout-margin4">
				<div class="row x-center">
					<div class="row w-85 y-center date">
						<div>Due date:</div>
						<Select title="DD" size="small" :options="dates.dates" v-model="date"></Select>
						<Select title="MM" size="small" :options="dates.months" v-model="month"></Select>
						<Select title="YYYY" size="small" :options="dates.yearsNext" v-model="year"></Select>
						<div v-if="newHomework.errorMessage" class="formError padding4">Please input proper date.</div>
					</div>
				</div>
				<div class="row x-center">
					<input type="text" v-model="newHomework.bookName" placeholder="Book(s)" class="snetInput w-85">
				</div>
				<div class="row x-center">
					<input type="text" v-model="newHomework.page" placeholder="Page(s)" class="snetInput w-85">
				</div>
				<div class="row x-center">
					<input type="text" v-model="newHomework.exercise" placeholder="Exercise(s)" class="snetInput w-85">
				</div>
				<div class="row x-center">
					<IdeaInput placeholder="Description" buttonText="Update homework" :open="true" :single="true" :noEmoji="true" @share="addNewHomework($event)" @close="addHomework = false; newHomework = {}; date = '', month = '', year = '';" :valid="date !== '' && month !== '' && year !== '' && !newHomework.errorMessage" :required="newHomework.bookName || newHomework.page || newHomework.exercise ? false : true"></IdeaInput>
				</div>
			</div>
		</div>
		<div class="modal" v-if="modal">
			<div class="content" v-if="modal.delete">
				<div class="row w-flex y-center x-center">Are you sure you want to delete?</div>
				<div class="w-flex row y-bottom layout-margin8">
					<button class="snetButton sub" @click="modal = false;">Cancel</button>
					<button class="snetButton" @click="deleteHomework(modal.delete.homeworkId, modal.delete.homeworkIndex, modal.delete.subjectIndex); modal = false;">Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Select from '../components/Select.vue';
	import IdeaInput from './IdeaInput.vue';
	import { BASEURL } from '../constants';
	import _ from 'lodash';

	export default {
		name: 'Homework',
		props: {
			timetable: Object,
			subjects: Array,
			subjectId: String,
			classId: String,
			teacher: Boolean
		},
		components: {
			Select,
			IdeaInput
		},
		data() {
			return {
				addHomework: false,
				newHomework: {},
				noHomework: true,
				date: '',
				month: '',
				year: '',
				modal: false,
				currentDate: new Date()
			}
		},
		computed: {
			dates() {
				return this.$store.getters.getDates;
			}
		},
		created() {
			this.castHomeworks();
		},
		methods: {
			castHomeworks() {
				var homework, book;
				var thisYear = this.currentDate.getFullYear();
				for (var i = 0; i < this.subjects.length; i++) {
					if (this.subjects[i].homeworks) {
						if (this.subjects[i].homeworks.length > 0) {
							this.noHomework = false;
						} else {
							this.noHomework = true;
						}
						for (var j = 0; j < this.subjects[i].homeworks.length; j++) {
							homework = this.subjects[i].homeworks[j];
							book = homework.book.split('/-/');
							this.$set(homework, 'bookName', book[0] != 'undefined' ? book[0] : '');
							this.$set(homework, 'page', book[1] != 'undefined' ? book[1] : '');
							this.$set(homework, 'exercise', book[2] != 'undefined' ? book[2] : '');
						}
					}
				}
			},
			addNewHomework(homework) {
				this.newHomework.description = homework.text;
				if (homework.files) {
					this.newHomework.file = homework.files[0];
				}
				this.newHomework.dueDate = this.date + '/' + this.month + '/' + this.year;
				this.newHomework.book = (this.newHomework.bookName || '') + '/-/' + (this.newHomework.page || '') + '/-/' + (this.newHomework.exercise || '');
				if(this.newHomework._id) {
					this.$http.put(BASEURL + 'ctrl/homework/' + this.classId + '/' + this.subjectId + '/' + this.newHomework._id, this.newHomework)
					.then(() => {
						Object.assign(this.subjects[this.newHomework.subjectIndex].homeworks[this.newHomework.homeworkIndex], this.newHomework);
						this.newHomework = {};
						this.date = '';
						this.month = '';
						this.year = '';
						this.addHomework = false;
					})
				} else {
					this.$http.post(BASEURL + 'ctrl/homework/' + this.classId + '/' + this.subjectId, this.newHomework)
					.then(() => {
						this.newHomework = {};
						this.date = '';
						this.month = '';
						this.year = '';
						this.addHomework = false;
					})
				}
			},
			toggleEdit(homework, homeworkIndex, subjectIndex) {
				this.addHomework = true;
				this.newHomework = _.cloneDeep(homework);
				this.newHomework.homeworkIndex = homeworkIndex;
				this.newHomework.subjectIndex = subjectIndex;
				this.newHomework.dueDate = this.newHomework.dueDate.split('/');
				this.date = this.newHomework.dueDate[0];
				this.month = this.newHomework.dueDate[1];
				this.year = this.newHomework.dueDate[2];
			},
			deleteHomework(id, homeworkIndex, subjectIndex) {
				this.$http.delete(BASEURL + 'ctrl/homework/' + this.classId + '/' + this.subjectId + '/' + id)
				.then(() => {
					this.subjects[subjectIndex].homeworks.splice(homeworkIndex, 1);
				})
			},
			getRank(number) {
				if (number === 1) {
					return 'st';
				} else if (number === 2) {
					return 'nd';
				} else if (number === 3) {
					return 'rd';
				} else {
					return 'th';
				}
			},
			validateHomework() {
				var vm = this,
					thisYear = vm.currentDate.getFullYear(),
					thisMonth = vm.currentDate.getMonth(),
					thisDate = vm.currentDate.getDate();
				if (vm.year && vm.month && vm.date) {
					if (vm.year === thisYear) {
						var index = false;
						getIndex();
						if (index !== false && index === thisMonth){
							if (vm.date > thisDate) {
								vm.newHomework.errorMessage = false;
							} else {
								vm.newHomework.errorMessage = true;
							}
						} else if (index !== false && index > thisMonth) {
							vm.newHomework.errorMessage = false;
						} else {
							vm.newHomework.errorMessage = true;
						}
					} else {
						vm.newHomework.errorMessage = false;
					}
				}

				function getIndex() {
					for (var i = 0; i < vm.dates.months.length; i++) {
						if (vm.dates.months[i].value === vm.month) {
							index = i;
							break;
						}
					}
				}
			}
		},
		watch: {
			'subjects'() {
				this.castHomeworks();
			},
			date() {
				this.validateHomework();
			},
			month() {
				this.validateHomework();
			},
			year() {
				this.validateHomework();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.homework {
		.edit {
			position: absolute;
			right: 20%;
			top:40%;
			display: none;
		}

		&:hover {
			.edit {
				display: block;
			}
		}
	}

	.date {
		font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
	}
</style>
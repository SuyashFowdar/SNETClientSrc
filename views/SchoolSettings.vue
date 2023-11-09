<template>
	<div class="w-flex">
		<div class="layout-margin8 margin8">
			<b>School</b>
			<div class="row y-center layout-margin8">
				<div class="w-30">School Name:</div>
				<input type="text" class="snetInput" v-model="school.name">
			</div>
			<div class="row y-center layout-margin8">
				<div class="w-30">School Code:</div>
				<input type="text" class="snetInput" v-model="school.code">
			</div>
			<b>Periods</b>
			<div class="row layout-margin8 y-center" v-for="(periodTime, timeIndex) in school.periodTimes">
				<div>{{ timeIndex + 1 }}.</div>
				<div class="w-15">Start Time:</div>
				<div class="row w-30 y-center">
					<Select title="HH" size="small" :options="times.hours" v-model="periodTime.start.hours"></Select>:
					<Select title="MM" size="small" :options="times.minutes" v-model="periodTime.start.minutes"></Select>
				</div>
				<div class="w-15">End Time:</div>
				<div class="row w-30 y-center">
					<Select title="HH" size="small" :options="times.hours" v-model="periodTime.end.hours"></Select>:
					<Select title="MM" size="small" :options="times.minutes" v-model="periodTime.end.minutes"></Select>
				</div>
			</div>
			<!-- <pre>{{ school }}</pre> -->
			<div class="row">
				<div class="options raised padding8" @click="getTimetable()">Add period</div>
			</div>
			<div class="row x-center y-center layout-margin8">
				<button class="snetButton" @click="saveSettings()">Save</button>
			</div>
			<b>Timetable</b>
			<div class="row">
				<Select title="Select Class" :options="school.classes" v-model="schoolClass"></Select>
			</div>
		</div>
		<div v-if="schoolClass" class="row">
			<div v-for="i in 5" class="w-flex layout-margin4">
				<div class="row x-center y-center" v-for="(period, periodIndex) in periodTimes" style="border: 1px solid grey; min-height: 50px;">
					<!-- <div v-if="i === 1" style="margin-left: -15px;">{{ periodIndex + 1 }}</div> -->
					<div class="column x-center y-center layout-margin4">
						<input type="text" class="snetInput" style="min-width: unset; max-width: 100px;">
						<input type="text" class="snetInput" style="min-width: unset; max-width: 100px;">
					</div>
				</div>
			</div>
		</div>
		<div class="row x-center y-center layout-margin8">
			<button class="snetButton">Save</button>
		</div>
	</div>
</template>
<script>
import Select from '../components/Select.vue'
import { BASEURL } from '../constants.js'

export default {
	name: 'SchoolSettings',
	components: {
		Select
	},
	data() {
		return {
			timetableEdit: false,
			periodTimes: [{ start: {}, end: {} }, { start: {}, end: {} }],
			times: {
				hours: [{ value: 8 }, { value: 9 }, { value: 10 }, { value: 11 }, { value: 12 }, { value: 13 }, { value: 14 }],
				minutes: [{ value: 0 }, { value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 45 }, { value: 50 }, { value: 55 }]
			},
			classes: [{ value: 'G11S1' }, { value: 'G12S1' }],
			schoolClass: '',
			school: {}
		}
	},
	created() {
		this.$http.get(BASEURL + 'ctrl/school/settings')
			.then(response => {
				this.school = response.body;
			})
	},
	methods: {
		cancel() {
			if (this.timetableEdit) {
				this.timetableEdit = false;
			} else {
				this.$router.push({ name: 'board' });
			}
		},
		saveSettings() {
			this.$http.put(BASEURL + 'ctrl/school/settings', this.school)
		},
		addPeriod() {
			this.school.periodTimes.push({ start: {}, end: {} });
		},
		getTimetable() {
			this.$http.get(BASEURL + 'ctrl/school/settings/' + this.school.classes[0]._id)
				.then(response => {
					console.log('response.body', response.body);
				})
		}
	}
}
</script>
<style lang="scss" scoped></style>
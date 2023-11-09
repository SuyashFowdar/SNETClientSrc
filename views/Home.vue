<template class="height100n">
	<div id="home" class="snet-container">
		<div class="row-md row-lg wrap">
			<div class="snetBarSpace hide-sm hide-xs"></div>
			<router-view class="w-flex homeRoute hide-sm hide-xs"></router-view>
			<SnetBar />
		</div>
	</div>
</template>
<script>
import SnetBar from '../components/SnetBar.vue';

export default {
	name: 'home',
	components: {
		SnetBar
	},
	data() {
		return {
			months: [{
					name: 'March',
					events: [{
							date: 21,
							day: 'Thu',
							type: 'Regrouped',
							name: 'Sri Gaura Purnima'
						},
						{
							date: 28,
							day: 'Thu',
							type: 'Festival',
							name: 'Appearance of Srila Srivas Pandit'
						},
					]
				},
				{
					name: 'April',
					events: [{
							date: 1,
							day: 'Mon',
							type: 'Ekadashi',
							name: 'Papamocani Ekadasi',
							dwadasi: 'Vyanjuli Mahadvadasi',
							time: '06:17 to 07:08'
						},
						{
							date: 13,
							day: 'Sat',
							type: 'Regrouped',
							name: 'Sri Rama Navami'
						},
						{
							date: 16,
							day: 'Tue',
							type: 'Ekadashi',
							name: 'Kamada Ekadasi ',
							time: '06:21 to 10:13'
						},
						{
							date: 16,
							day: 'Tue',
							type: 'Regrouped',
							name: 'Disappearance of Srila Bhakti Sundar Govinda Dev-Goswami Maharaj'
						},
						{
							date: 29,
							day: 'Mon',
							type: 'Festival',
							name: 'Disappearance of Srila Vrindavan Das Thakur'
						},
						{
							date: 30,
							day: 'Tue',
							type: 'Ekadashi',
							name: 'Varuthini Ekadasi',
							time: '06:26 to 10:13'
						},
					]
				},
				{
					name: 'May',
					events: [{
							date: 4,
							day: 'Sat',
							type: 'Festival',
							name: 'Appearance of Srila Gadadhar Pandit Goswami'
						},
						{
							date: 15,
							day: 'Wed',
							type: 'Ekadashi',
							name: 'Mohini Ekadasi ',
							time: '06:32 to 06:45'
						},
						{
							date: 18,
							day: 'Sat',
							type: 'Regrouped',
							name: 'Sri Nrisimha Chaturdashi + Appearance of Srila Srinivas Acharya'
						},
						{
							date: 30,
							day: 'Thu',
							type: 'Ekadashi',
							name: 'Apara Ekadasi',
							time: '06:38 to 10:18'
						},
					]
				},
				{
					name: 'June',
					events: [{
							// 	date: 12,
							// 	day: 'Wed',
							// 	type: 'Festival',
							// 	name: 'Disappearance of Srila Baladev Vidyabhushan Prabhu.'
							// },
							// {
							date: 13,
							day: 'Thu',
							type: 'Ekadashi',
							name: 'Pandava Nirjala Ekadasi',
							time: '06:43 to 10:21'
						},
						{
							date: 28,
							day: 'Fri',
							type: 'Ekadashi',
							name: 'Yogini Ekadasi',
							time: 'after 11:07',
						},
						{
							date: 31,
							day: 'Fri',
							type: 'Festival',
							name: 'Appearance of Srila Vrindavan Das Thakur.'
						},
					]
				},
				{
					name: 'July',
					events: [{
							date: 2,
							day: 'Tue',
							type: 'Festival',
							name: 'Disappearance of Srila Gadadhar Pandit and Srila Sachchidananda Bhakti Vinod Thakur'
						},
						{
							date: 4,
							day: 'Thu',
							type: 'Festival',
							name: 'Sri Jagannath Ratha Yatra (in India) + Disappearance of Srila Svarup Damodar Goswami Prabhu'
						},
						{
							date: 12,
							day: 'Fri',
							type: 'Ekadashi',
							name: 'Sayana Ekadasi ',
							time: '06:46 to 10:26'
						},
						{
							date: 28,
							day: 'Sun',
							type: 'Ekadashi',
							name: 'Kamika Ekadasi ',
							time: '06:42 to 10:25'
						},
					]
				},
				{
					name: 'August',
					events: [{
							date: 1,
							day: 'Thu',
							type: 'Regrouped',
							name: 'Disappearance of Srila Bhakti Raksak Sridhar Dev-Goswami Maharaj'
						},
						{
							date: 11,
							day: 'Sun',
							type: 'Ekadashi',
							name: 'Pavitropana Ekadasi',
							time: '06:34 to 10:22'
						},
						{
							date: 15,
							day: 'Thu',
							type: 'Regrouped',
							name: 'Sri Balaram Jayanti'
						},
						{
							date: 23,
							day: 'Fri',
							type: 'Regrouped',
							name: 'Sri Sri Krishna Janmashtami'
						},
						{
							date: 24,
							day: 'Sat',
							type: 'Regrouped',
							name: 'Sri Nandotsav + Appearance of Bhaktivedanta Swami Maharaj Prabhupad'
						},
						{
							date: 27,
							day: 'Tue',
							type: 'Ekadashi',
							name: 'Annada Ekadasi ',
							time: '06:22 to 10:15'
						},
					]
				},
				{
					name: 'September',
					events: [{
							date: 5,
							day: 'Thu',
							type: 'Festival',
							name: 'Sri Lalita Saptami '
						},
						{
							date: 6,
							day: 'Fri',
							type: 'Regrouped',
							name: 'Sri Radhashtami'
						},
						{
							date: 10,
							day: 'Tue',
							type: 'Ekadashi',
							name: 'Parsva Ekadasi',
							dwadasi: 'Paksa Vardhini Mahadvadasi',
							time: '06:10 to 10:08'
						},
						{
							date: 11,
							day: 'Wed',
							type: 'Festival',
							name: 'Appearance of Srila Sachchidananda Bhakti Vinod Thakur '
						},
						{
							date: 12,
							day: 'Thu',
							type: 'Festival',
							name: 'Disappearance of Srila Haridas Thakur'
						},
						{
							date: 25,
							day: 'Wed',
							type: 'Ekadashi',
							name: 'Indira Ekadasi ',
							time: '05:56 to 09:33'
						},
						{
							date: 29,
							day: 'Sun',
							type: 'Regrouped',
							name: 'Appearance of Srila Bhakti Nirmal Acharya Maharaj'
						},
					]
				},
				{
					name: 'October',
					events: [{
							date: 9,
							day: 'Wed',
							type: 'Ekadashi',
							name: 'Pasankusa Ekadasi',
							time: '05:44 to 09:53'
						},
						// {
						// 	date: 10,
						// 	day: 'Thu',
						// 	type: 'Festival',
						// 	name: 'Disappearance of Srila Raghunath Das Goswami, Srila Raghunath Bhatta Goswami, and Srila Krishnadas Kaviraj Goswami '
						// },
						{
							date: 13,
							day: 'Sun',
							type: 'Regrouped',
							name: 'Kartik Maas Starts '
						},
						{
							date: 18,
							day: 'Fri',
							type: 'Festival',
							name: 'Disappearance of Srila Narottam Das Thakur '
						},
						{
							date: 21,
							day: 'Mon',
							type: 'Festival',
							name: 'Sannyas day of Srila Bhakti Sundar Govinda Dev-Goswami Maharaj '
						},
						{
							date: 22,
							day: 'Tue',
							type: 'Regrouped',
							name: '125th Appearance celebration of Srila Bhakti Raksak Sridhar Dev-Goswami Maharaj'
						},
						{
							date: 24,
							day: 'Thu',
							type: 'Ekadashi',
							name: 'Rama Ekadasi',
							time: '05:33 to 09:47'
						},
						{
							date: 29,
							day: 'Tue',
							type: 'Regrouped',
							name: 'Sri Govardhan Puja '
						},
						{
							date: 31,
							day: 'Thu',
							type: 'Festival',
							name: 'Disappearance of Bhaktivedanta Swami Maharaj Prabhupad.'
						},
					]
				},
				{
					name: 'November',
					events: [{
							date: 4,
							day: 'Mon',
							type: 'Festival',
							name: 'Disappearance of Srila Srinivas Acharya Prabhu '
						},
						{
							date: 8,
							day: 'Fri',
							type: 'Festival',
							name: 'Disappearance of Srila Gaura Kishor Das Babaji Maharaj '
						},
						{
							date: 8,
							day: 'Fri',
							type: 'Ekadashi',
							name: 'Utthana Ekadasi',
							time: '05:25 to 09:44'
						},
						{
							date: 12,
							day: 'Tue',
							type: 'Regrouped',
							name: 'Ganga Snaan + Kartik Maas Ends'
						},
						{
							date: 23,
							day: 'Sat',
							type: 'Ekadashi',
							name: 'Utpanna Ekadasi',
							time: '05:21 to 09:45'
						},
					]
				},
				{
					name: 'December',
					events: [{
							date: 8,
							day: 'Sun',
							type: 'Ekadashi',
							name: 'Moksada Ekadasi',
							time: '05:23 to 08:24'
						},
						{
							date: 14,
							day: 'Sat',
							type: 'Regrouped',
							name: '91st Appearance celebration of Srila Bhakti Sundar Govinda Dev-Goswami Maharaj.'
						},
						{
							date: 16,
							day: 'Mon',
							type: 'Festival',
							name: 'Disappearance Srila Bhakti Siddhanta Saraswati Goswami Prabhupad'
						},
						{
							date: 22,
							day: 'Sun',
							type: 'Ekadashi',
							name: 'Saphala Ekadasi',
							time: '05:28 to 09:55'
						},
						{
							date: 27,
							day: 'Fri',
							type: 'Festival',
							name: 'Appearance of Srila Lochan Das Thakur'
						},
					]
				},
				{
					name: 'January',
					events: [{
							date: 6,
							day: 'Mon',
							type: 'Ekadashi',
							name: 'Putrada Ekadasi',
							time: '08:35 to 10:03'
						},
						{
							date: 16,
							day: 'Thu',
							type: 'Festival',
							name: 'Disappearance of Srila Jayadev Goswami '
						},
						{
							date: 18,
							day: 'Sat',
							type: 'Festival',
							name: 'Disappearance of Srila Lochan Das Thakur'
						},
						{
							date: 20,
							day: 'Mon',
							type: 'Ekadashi',
							name: 'Sat tila Ekadasi',
							time: '06:30 to 10:10'
						},
						// {
						// 	date: 30,
						// 	day: 'Thu',
						// 	type: 'Festival',
						// 	name: 'Appearance of Srila Raghunath Das Goswami + Disappearance of Srila Visvanath Chakravarti Thakur'
						// },
					]
				},
				{
					name: 'February',
					events: [{
							date: 1,
							day: 'Sat',
							type: 'Festival',
							name: 'Appearance of day Sri Advaita Acharya'
						},
						{
							date: 5,
							day: 'Wed',
							type: 'Ekadashi',
							name: 'Bhaimi Ekadasi ',
							time: '05:56 to 10:15'
						},
						{
							date: 7,
							day: 'Fri',
							type: 'Regrouped',
							name: 'Sri Nityananda Trayodashi'
						},
						{
							date: 9,
							day: 'Sun',
							type: 'Festival',
							name: 'Appearance of Srila Narottam Das Thakur'
						},
						{
							date: 13,
							day: 'Thu',
							type: 'Festival',
							name: '147th Appearance celebration of Srila Bhakti Siddhanta Saraswati Goswami Prabhupad '
						},
						{
							date: 19,
							day: 'Wed',
							type: 'Ekadashi',
							name: 'Vijaya Ekadasi ',
							time: '06:04 to 10:17'
						},
						{
							date: 24,
							day: 'Mon',
							type: 'Festival',
							name: 'Disappearance of Srila Jagannath Das Babaji Maharaj'
						},
					]
				},
				{
					name: 'March',
					events: [{
							date: 6,
							day: 'Fri',
							type: 'Ekadashi',
							name: 'Amalaki Ekadasi',
							time: '06:10 to 07:58'
						},
						{
							date: 9,
							day: 'Mon',
							type: 'Regrouped',
							name: 'Sri Gaura Purnima'
						}, {
							date: 10,
							day: 'Tue',
							type: 'Regrouped',
							name: 'Sri Jagannath Utsav'
						},
					]
				}
			]
		}
	}
}
</script>
<style scoped lang="scss">
.homeRoute {
	padding: 0 20px;
}

.snetBarSpace {
	min-width: 300px;
}
</style>
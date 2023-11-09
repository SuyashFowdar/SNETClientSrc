<template>
	<div class="w-flex">
		<div class="w-flex margin8" v-if="settings">
			<div class="fwBold padding8">Info Settings</div>
			<div class="layout-padding8 shadow-15">
				<div>{{settings}}</div>
				<!-- <div class="row y-center bg-lightgrey">
					<div class="w-flex">Who can see my image?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(viewerOptions).splice(0, 2)" v-model="settings.image" />
					</div>
				</div> -->
				<div class="row y-center bg-lightgrey">
					<div class="w-flex">Who can see ideas on my page?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(viewerOptions)" v-model="settings.ideas" />
					</div>
				</div>
				<div class="row y-center">
					<div class="w-flex">Who can see my details?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(viewerOptions)" v-model="settings.details" />
					</div>
				</div>
				<div class="row y-center bg-lightgrey">
					<div class="w-flex">Who can see my friend list?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(viewerOptions)" v-model="settings.friendList" />
					</div>
				</div>
			</div>
			<div class="fwBold padding8">Activities Settings</div>
			<div class="layout-padding8 shadow-15">
				<!-- <div class="row y-center bg-lightgrey">
					<div class="w-flex">Allow everyone to find me?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(boolOptions)" v-model="settings.allowFind" />
					</div>
				</div> -->
				<div class="row y-center">
					<div class="w-flex">Who are allowed to share ideas on my page?</div>
					<div class="w-40">
						<Check :radio="true" class="capitalize" :items="lodash.cloneDeep(viewerOptions)" v-model="settings.shareOnMyPage" />
					</div>
				</div>
			</div>
			<div class="x-center layout-margin8">
				<button class="snetButton sub" @click="$router.push({ name: 'home' })">Cancel</button>
				<button class="snetButton" @click="saveSettings">Save</button>
			</div>
		</div>
	</div>
</template>
<script>
import { BASEURL } from '../constants';
import Check from '../components/Check.vue';
import _ from 'lodash';

export default {
	name: 'Settings',
	components: {
		Check
	},
	data() {
		return {
			settings: {},
			viewerOptions: [{ value: 'friends', selected: false }, { value: 'everyone', selected: false }, { value: 'me', selected: false }],
			boolOptions: [{ name: 'Yes', value: true, selected: false }, { name: 'No', value: false, selected: false }],
			lodash: {}
		}
	},
	computed: {
		me() {
			return this.$store.getters.getUser;
		}
	},
	beforeCreate() {
		this.$http.get(BASEURL + 'ctrl/me/settings')
			.then(response => {
				this.settings = response.body.settings;
			})
			.catch(() => {
				this.$router.push({ name: 'Error', query: { sess: 'on' } });
			})
	},
	created() {
		this.lodash = _;
	},
	methods: {
		saveSettings() {
			this.$http.post(BASEURL + 'ctrl/me/settings', this.settings)
				.then(() => {
					this.$router.push({ name: 'home' });
				})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
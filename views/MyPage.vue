<template>
	<div class="w-flex">
		<Greenboard :user="user"></Greenboard>
		<div class="row x-right layout-margin4 friend">
			<router-link :to="{ name: 'Message', params: { id: 'new' }, query: { user: user.id, name: user.name } }" v-if="!user.mine">
				<button class="snetButton sub">Send message</button>
			</router-link>
			<button class="snetButton" v-if="!user.mine && !user.friend" :class="{ disabled: user.requested }" @click="addFriend()">
				{{ user.requested ? 'Friendship requested' : 'Add friend' }}
			</button>
			<button class="snetButton sub" v-if="user.friend" @click="removeFriend()">
				Remove friend
			</button>
		</div>
		<div class="borderRadius5 shadow-15 padding8 info layout-margin4 column y-top" v-if="user.info">
			<div>
				<b>Gender:</b>
				{{ user.info.male && user.info.male !== 'false' ? 'Male' : 'Female' }}
			</div>
			<div>
				<b>Date of birth:</b>
				{{ user.info.DOB }}
			</div>
			<div>
				<b>Address: </b>
				{{ user.info.address }}
			</div>
			<div v-if="user.school">
				<b>School: </b>
				{{ user.school.name }}
			</div>
			<div v-if="user.school && user.school.classes[0]">
				<b>Class: </b>
				{{ user.school.classes[0].name }}
			</div>
		</div>
		<Loading v-if="loading"></Loading>
		<div class="row w-flex" v-if="!loading">
			<IdeaContainer :ideaList="user.ideas" :container="{ id: $route.params.id, type: 'user' }" :me="me"></IdeaContainer>
		</div>
		<div class="row x-center y-center padding8" v-if="user.ideas && user.ideas.length === 0 && !loading">
			<b class="fs24">No ideas to display!</b>
		</div>
		<div class="row" style="height: 200px;"></div>
	</div>
</template>
<script>
import Vue from 'vue';
import IdeaContainer from '../components/IdeaContainer.vue';
import { BASEURL } from '../constants';
import IdeaInput from '../components/IdeaInput.vue';
import Greenboard from '../components/Greenboard.vue';
import Loading from '../components/Loading.vue';
import ClickOutside from 'vue-click-outside';

export default {
	name: 'mypage',
	directives: {
		ClickOutside
	},
	components: {
		IdeaContainer,
		IdeaInput,
		Greenboard,
		Loading
	},
	data() {
		return {
			user: {},
			loading: true
		}
	},
	computed: {
		me() {
			return this.$store.getters.getUser;
		}
	},
	created() {
		this.getMypageData(this.$route.params.id)
	},
	methods: {
		getMypageData(id) {
			this.$http.get(BASEURL + 'ctrl/mypage/' + id)
				.then(response => {
					// this.$set(this, 'user', response.body);
					this.user = response.body;
					this.loading = false;
				})
				.catch(() => {
					this.$router.push({ name: 'Error', query: { sess: 'on' } });
				})
		},
		addFriend() {
			this.$http.post(BASEURL + 'ctrl/friend/' + this.$route.params.id)
				.then(() => {
					Vue.set(this.user, 'requested', true);
				})
		},
		removeFriend() {
			this.$http.delete(BASEURL + 'ctrl/friend/' + this.$route.params.id)
				.then(() => {
					Vue.set(this.user, 'friend', false);
				})
		}
	},
	watch: {
		'$route'(to) {
			this.getMypageData(to.params.id);
		}
	}
}
</script>
<style lang="scss" scoped>
.friend {
	margin-top: 10px;
}

.info {
	margin: 15px 0.5%;
	// width: 98%;
	// max-width: 100%;
}
</style>
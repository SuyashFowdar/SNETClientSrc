<template>
	<div id="row board w-flex">
		<!-- <Greenboard :user="{ ideaOfTheDay: 'Education is the most powerful weapon the world can use', byWhom: '- Nelson Mandela' }"></Greenboard> -->
		<Loading v-if="loading"></Loading>
		<div class="row w-flex" v-if="boardIdeas.length && boardIdeas.length > 0 && me._id && !loading">
			<IdeaContainer :ideaList="boardIdeas" :container="{ type: 'board', notPost: true }" :me="me"></IdeaContainer>
		</div>
		<button class="hide" id="loadMoreButton" @click="loadCount++; loadIdeas();">Click</button>
		<div class="row x-center y-center padding8" v-if="boardIdeas.length === 0 && !loading">
			<b class="fs24">No ideas to display!</b>
		</div>
	</div>
</template>
<script>
import IdeaContainer from '../components/IdeaContainer.vue';
import Greenboard from '../components/Greenboard.vue';
import Loading from '../components/Loading.vue';
import { BASEURL } from '../constants';
var bottomTriggered = false;

export default {
	name: 'board',
	props: {
		msg: String
	},
	components: {
		IdeaContainer,
		Greenboard,
		Loading
	},
	data() {
		return {
			boardIdeas: [],
			loading: true,
			bottomTriggered: false,
			loadCount: 0,
			items: [{ name: 'Suyash' }],
			stopLoad: false
		};
	},
	computed: {
		me() {
			return this.$store.getters.getUser;
		}
	},
	created() {
		window.onscroll = this.windowScroll;

		this.loadIdeas();
	},
	methods: {
		windowScroll(ev) {
			var el;
			if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
				if (!bottomTriggered) {
					this.loadCount++;
					el = document.getElementById('loadMoreButton');
					el.click();
					bottomTriggered = true;
				}
			}
		},
		loadIdeas() {
			if (!this.stopLoad) {
				this.$http.get(BASEURL + 'ctrl/board/' + this.loadCount)
					.then(response => {
						if (response.body) {
							if (response.body.over) {
								this.stopLoad = true;
							}
							for (var i = 0; i < response.body.ideas.length; i++) {
								this.boardIdeas.push(response.body.ideas[i]);
							}
							bottomTriggered = false;
							this.loading = false;
						}
					})
					.catch(() => {
						this.$router.push({ name: 'Error' });
					})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.board {
	width: 100% !important;
}
</style>
<template>
	<div class="w-flex">
		<div class="row w-flex margin8" v-if="idea.what">
			<IdeaContainer :ideaList="[ idea ]" :container="{ id: $route.params.whereId, type: $route.params.whereType, notPost: true }" :me="me"></IdeaContainer>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';
	import IdeaContainer from '../components/IdeaContainer.vue';

	export default {
		name: 'Idea',
		components: {
			IdeaContainer
		},
		data() {
			return {
				idea: {},
				modal: false,
				disappear: false
			}
		},
		computed: {
			me() {
				return this.$store.getters.getUser;
			}
		},
		created() {
			this.$http.get(BASEURL + 'ctrl/ideas/' + this.$route.params.whereType + '/' + this.$route.params.whereId + '/' + this.$route.params.ideaId)
				.then(response => {
					this.idea = response.body;
					// console.log('response.body', response.body);
				})
                .catch(() => {
                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
                })
		}
	}
</script>
<style lang="scss" scoped>
	.padding3 {
		padding: 3px;
	}
</style>
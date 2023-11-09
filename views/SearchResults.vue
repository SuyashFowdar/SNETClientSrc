<template>
	<div class="row wrap w-flex">
		<router-link :to="{ name:'mypage', params: { id: result.id } }" v-for="result in searchResults" :key="result.id" class="row w-30 options margin8 y-center">
			<MyImage :imgId="result.myImage" where="sideBarImg"></MyImage>
			<div class="padding4">
				<b>{{ result.name }}</b>
				<div class="capitalize">{{ result.userType }}</div>
			</div>
		</router-link>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';
    import MyImage from '../components/MyImage.vue';

	export default {
		name: 'searchresults',
        components: {
            MyImage
        },
		data() {
			return {
				searchResults: []
			}
		},
		created() {
			this.$http.get(BASEURL + 'ctrl/search/snet/' + this.$route.params.search)
				.then(response => {
					this.searchResults = response.body;
				})
                .catch(() => {
                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
                })
		}
	}
</script>
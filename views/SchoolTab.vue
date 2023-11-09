<template>
	<div class="schoolTab">
		<div v-for="content in contents" :key="content._id" class="" :style="content.style">
			<div class="snet-container tabContent">
				<div class="title row x-center y-center">{{ content.title }}</div>
				<div class="row">
					<div v-for="col in content.cols" :key="col._id" class="col row w-flex x-left y-center">
						<div v-if="col.contentType == 'text'" class="text">
							{{ col.content }}
						</div>
					</div>
				</div>
				<div v-if="content.border" class="row x-center y-center">
					<div class="border"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { BASEURL } from '../constants.js'

	export default {
		name: 'schooltab',
		data() {
			return {
				schoolID: this.$route.params.id,
				tabTitle: '',
				tabsAtTop: false,
				offsetTop: 0,
				contents: []
			}
		},
		watch: {
			'$route'(to) {
				this.updateTab(to.params.tab);
				this.getContents(to.params.tab);
			}  
		},
		created() {
			this.updateTab(this.$route.params.tab);
			this.getContents(this.$route.params.tab);
		},
		methods: {
			updateTab: function(tabTitle) {
				this.tabTitle = tabTitle;
			},
			getContents: function(tab) {
				this.$http.get(BASEURL + 'ctrl/school/' + this.schoolID + '?tab=' + tab)
					.then(function (response) {
						this.contents = response.body.contents;
					})
	                .catch(() => {
	                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
	                })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.schoolTab {
		.tabContent {
			padding: 30px;
		}

		.title {
			font-size: 36px;
			text-align: center;
		}

		.col {
			min-height: 250px;

			.text {
				font-size: 20px;
				padding: 15px;
				text-align: justify;
			}
		}

		.border {
			margin-top: 25px;
			border: 1px solid grey;
			width: 300px;
		}
	}
</style>
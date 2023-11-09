<template>
	<div class="school">
		<div class="snet-container">
			<div class="header">
				<img src="../assets/images/app/greenboard.png" alt="">
			</div>
			<div class="tabs row" id="tabs" :class="{ tabsAtTop: tabsAtTop }">
				<router-link to="/" class="options homeButton">
					<img src="../assets/images/app/board.png" class="homeIcon opacity-80">
				</router-link>
				<div class="w-flex row x-center y-center">
					<router-link v-for="tab in tabs" class="tab options row x-center y-center" :key="tab.title" :to="{ name: 'schooltab', params: { tab: tab.title } }" :class="{ selectedTab: tab.title == selectedTabTitle }">
						{{ tab.title }}
					</router-link>
				</div>
			</div>
			<div class="shadow-15" style="height: 100px; margin: 15px;">
				AD
			</div>
		</div>
		<div class="content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import { BASEURL } from '../constants.js';

	export default {
		name: 'school',
		data() {
			return {
				schoolID: this.$route.params.id,
				tabs: [],
				selectedTab: {},
				selectedTabTitle: this.$route.params.tab,
				tabsAtTop: false
			}
		},
		created() {
			this.$http.get(BASEURL + 'ctrl/school/' + this.schoolID)
				.then(function (response) {
					this.tabs = response.body.tabs;
					if(!this.selectedTabTitle) {
						this.selectedTabTitle = this.tabs[0].title;
						this.$router.push({ name: 'schooltab', params: { tab: this.selectedTabTitle }});
					}
					var vm = this
					setTimeout(function() {
						var offsetTop = document.getElementById('tabs').offsetTop;

						window.onscroll = function() {
							if(window.scrollY > offsetTop) {
								vm.tabsAtTop = true;
							} else {
								vm.tabsAtTop = false;
							}
						}
					}, 1000)
				})
				.catch(() => {
					this.$router.push({ name: 'Error' });
				})
		},
		methods: {
			goToTab: function(tab) {
				this.selectedTab = tab;
				location.hash = 'school/' + this.schoolID + '/' + tab.title;
			}
		},
		watch: {
			'$route'(to) {
				this.selectedTabTitle = to.params.tab;
			}  
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		max-height: 100px;
		overflow: hidden;
	}

	.school {
		.tabs {
			width: 100%;
			max-width: 1000px;
			background-color: rgba(255, 255, 255, 0.9);
		}

		.tab {
			min-width: 100px;
			height: 40px;
		}

		.selectedTab {
			border-bottom: 2px solid black;
		}

		.tabsAtTop {
			position: fixed;
			top: 0;

			.tab {
				height: 30px;
			}
		}

		.homeIcon {
			max-height: 20px;
			margin: 12.5px;
		}
	}
</style>
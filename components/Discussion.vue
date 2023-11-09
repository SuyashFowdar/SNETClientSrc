<template>
	<div class="discussion w-flex row" :class="{ 'x-right': discussion.mine }">
		<div class="shadow-15" :class="{ note: type == 'note', chatMessage: type == 'chat' }">
			<div class="stick row" v-if="type == 'note'">
				<div class="w-45 row y-center options">
					<MyImage class="row border-box x-center y-center" :imgId="discussion.who.myImage" where="sideBarImg"></MyImage>
					<div>
						<div>{{ discussion.who.name }}</div>
						<div class="time-small">{{ discussion.when }}</div>
					</div>
				</div>
				<div class="w-10">
					<img src="../assets/images/app/bluepin.png" style="width:20px;" alt="">
				</div>
				<div class="w-45 row optionList x-right">
					<!-- <div class="w-flex options row x-center y-center">Reply</div>
					<div class="w-flex options row x-center y-center" :class="{ given: discussion.pointGiven }" @click="$emit('postNotePoint')">+1 point</div> -->
					<div class="w-15">
						<Option :menus="[{ name: 'Delete', option: 'deleteDiscussion', condition: true }]" @deleteDiscussion="deleteDiscussion()" :right="true"></Option>
					</div>
				</div>
			</div>
			<div class="relative">
				<!-- <div class="pointCount row x-center y-center">
					<div>{{ discussion.pointCount }} pts</div>
				</div> -->
			</div>
			<div class="what">{{ discussion.what.text }}</div>
		</div>
	</div>
</template>
<script>
	import ClickOutside from 'vue-click-outside';
	import MyImage from './MyImage.vue';
	import Option from './Option.vue';

	export default {
		name: 'discussion',
		props: {
			type: String,
			discussion: Object,
			discussionMethods: Object
		},
		components: {
			MyImage,
			Option
		},
		data() {
			return {
				menus: [{
					name: 'Delete',
					option: this.deleteDiscussion
				}],
				showMenu: false
			}
		},
		methods: {
			hideMenu() {
				this.showMenu = false;
			},
			deleteDiscussion() {
				this.$emit('deleteDiscussion');
			}
		},
		directives: {
			ClickOutside
		}
	}
</script>
<style lang="scss" scoped>
	.note {
		margin:10px;
		background-color: #EFFBFB;
		width:75%;
		transform: rotate(-0.7deg);
		background: radial-gradient(#EFFBFB, #EFFBFB, #CEF6F5);
		font-family: snetComic;

		.stick {
			height:25px;

			.optionList {
				div {
					font-size: 11px !important;
				}
				margin-right: 5px;
			}
		}

		.given {
			border-bottom: 2px solid black;
		}

	}

	.pointCount {
		height: 35px;
		width: 35px;

		div {
			font-size: 10px;
		}
	}

	.what {
		padding:10px;
	}

	.chatMessage {
		border-radius: 5px;
		background: linear-gradient(#A9E2F3, #81DAF5);
	}
</style>
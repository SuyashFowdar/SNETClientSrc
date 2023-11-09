<template>
	<div class="w-flex">
		<div class="row w-flex x-center">
			<IdeaInput @share="postIdea($event)" :required="true" :valid="true" v-if="!container.notPost" class="w-flex"></IdeaInput>
		</div>
		<!-- <virtual-list :remain="3" :bench="3" :size="windowHeight/3" :debounce="0" class="row w-flex"> -->
		<div class="column ideas border-box" v-for="(idea, ideaIndex) in ideaList" :key="idea.id">
			<div class="shadow-30 idea w-100">
				<div class="header row relative">
					<div class="row w-65-lg w-65-md w-90-sm w-90-xs">
						<router-link :to="{ name: 'mypage', params: { id: idea.who.id } }" class="options row height100n y-center" :class="{ 'w-60': idea.where.name, 'w-100': !idea.where.name }">
							<MyImage class="row border-box x-center y-center" :imgId="idea.who.myImage" where="ideaImg"></MyImage>
							<div class="scrollable-hidden">
								<div class="holder ellipsis">{{idea.who.name}}</div>
								<div class="time">{{idea.when}}</div>
							</div>
						</router-link>
						<router-link :to="getRoute(idea.where)" v-if="idea.where.name" class="options row w-40 y-center">
							<div class="holder ellipsis">> {{ idea.where.name }}</div>
						</router-link>
					</div>
					<div class="options row x-center y-center w-flex padding8 view hide-sm hide-xs" @click="viewOptionSection(idea, 'notes')">
						{{idea.noteCount}} notes
					</div>
					<div class="options row x-center y-center w-flex padding8 view hide-sm hide-xs" @click="viewOptionSection(idea, 'reLives')">
						{{idea.reLiveCount}} re-lives
					</div>
					<div class="w-5-lg w-5-md w-15-sm w-15-xs">
						<Option :menus="[{ name: 'Hide', option: 'hideIdea', condition: !(idea.mine || idea.where.id == me.id) }, { name: 'Delete', option: 'deleteIdea', condition: idea.mine || idea.where.id == me.id }]" @hideIdea="hideIdea(idea, ideaIndex)" @deleteIdea="modal = { delete: { idea, ideaIndex } }" :right="true"></Option>
					</div>
				</div>
				<div class="row">
					<div class="options row x-center y-center w-flex padding8 view hide-lg hide-md" @click="viewOptionSection(idea, 'notes')">
						{{idea.noteCount}} notes
					</div>
					<div class="options row x-center y-center w-flex padding8 view hide-lg hide-md" @click="viewOptionSection(idea, 'reLives')">
						{{idea.reLiveCount}} re-lives
					</div>
					<div class="options row x-center y-center w-flex padding8 view hide-lg hide-md" @click="viewOptionSection(idea, 'points')">
						{{idea.pointCount}} points
					</div>
				</div>
				<div class="row">
					<div class="padding8 text row x-left y-center w-80">
						<div>{{idea.what.text}}</div>
					</div>
					<div class="pointCount row x-center y-center hide-sm hide-xs w-flex" @click="viewOptionSection(idea, 'points')">
						<div>{{ idea.pointCount }} pts</div>
					</div>
				</div>
				<div class="row x-center">
					<FileView :files="idea.what.files"></FileView>
					<!-- <div v-for="file in idea.what.files" class="row w-flex x-center" :key="file.id">
						<div v-if="file.content_type.includes('image')" class="x-center" style="margin: 20px 0;">
								<MyImage :imgId="file.id" where="ideaWhatImg"></MyImage>
						</div>
					</div> -->
				</div>
				<div class="optionsToDo row">
					<div class="option note row x-center y-center" @click="viewOptionSection(idea, 'newNote')">
						Leave <b>&nbsp;note</b>
					</div>
					<div class="option reLive row x-center y-center">
						<b>Re-Live&nbsp;</b> idea
					</div>
					<div class="option point row x-center y-center" @click="givePoint(idea)" :class="{ given: idea.pointGiven }">
						+ <b>&nbsp;1 point</b>
					</div>
					<div class="empty"></div>
				</div>
				<div class="optionSection paper shadow-30 w-100" v-if="idea.optionSection">
					<div v-if="idea.optionSection == 'notes'">
						<div v-for="(note, $i) in idea.notes" :key="setKey(note, $i)">
							<Discussion :discussion="note" type="note" @postNotePoint="postNotePoint(idea, note)" @deleteDiscussion="deleteDetail(idea, 'notes', note._id, $i)"></Discussion>
						</div>
					</div>
					<div v-if="idea.optionSection == 'newNote'" class="padding8">
						<IdeaInput :share="shareNote" @share="shareNote(idea, $event)" placeholder="Leave a note" :required="true" :valid="true"></IdeaInput>
					</div>
					<div v-if="idea.optionSection == 'points'" class="padding8 row wrap">
						<div v-for="point in idea.points" class="row y-center padding4 options points" :key="point.id">
							<MyImage class="row border-box x-center y-center" :imgId="point.who.myImage" where="sideBarImg"></MyImage>
							<div>
								{{ point.who.name }}
							</div>
						</div>
					</div>
					<div v-if="idea.optionSection == 'reLives'" class="padding8">No relives yet!</div>
					<div class="row x-right">
						<div class="pageCorner row x-right y-bottom">
							<div class="end"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- </virtual-list> -->
		<div class="modal" v-if="modal">
			<div class="content" v-if="modal.delete">
				<div class="row w-flex y-center x-center">Are you sure you want to delete?</div>
				<div class="w-flex row y-bottom layout-margin8">
					<button class="snetButton sub" @click="modal = false;">Cancel</button>
					<button class="snetButton" @click="deleteIdea(modal.delete.idea, modal.delete.ideaIndex); modal = false;">Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Discussion from './Discussion.vue';
import IdeaInput from './IdeaInput.vue';
import MyImage from './MyImage.vue';
import FileView from './FileView.vue';
import Option from './Option.vue';
import { BASEURL } from '../constants';
import virtualList from 'vue-virtual-scroll-list'

export default {
	name: 'IdeaContainer',
	props: {
		ideaList: Array,
		container: Object,
		me: Object
	},
	components: {
		Discussion,
		IdeaInput,
		MyImage,
		FileView,
		Option,
		'virtual-list': virtualList
	},
	data() {
		return {
			url: BASEURL + 'ctrl/ideas',
			where: {},
			fileUrl: BASEURL + 'ctrl/file/',
			modal: false,
			windowHeight: 0
		}
	},
	created() {
		// console.log('window.height', window.innerHeight);
		this.windowHeight = window.innerHeight;
		this.castIdeas();
	},
	methods: {
		castIdeas() {
			if (this.container.type === 'board') {
				this.where = { type: 'user', id: this.$route.params.id };
			} else {
				this.where = { type: this.container.type, id: this.container.id };
			}
			for (var i = 0; i < this.ideaList.length; i++) {
				this.setWhere(this.ideaList[i]);
			}
		},
		deleteDetail(idea, option, detailId, index) {
			this.deleteDetailAPI(idea, option, detailId)
				.then(() => {
					if (option === 'notes') {
						idea[option].splice(index, 1);
						idea.noteCount--;
					} else if (option === 'points') {
						idea.pointCount--;
						idea.pointGiven = false;
					}
				})
		},
		deleteIdea(idea, index) {
			this.$http.delete(this.url + '/' + idea.where.type + '/' + idea.where.id + '/' + idea.id)
				.then(() => {
					this.ideaList.splice(index, 1);
				})
		},
		deleteDetailAPI(idea, detailType, detailId, notePoint) {
			if (notePoint) {
				return this.$http.delete(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType + '/-?notePoint=' + detailId);
			} else {
				return this.$http.delete(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType + '/' + detailId);
			}
		},
		getDiscussionDetail(id) {
			this.getDetailsAPI(this.idea, 'notes', id);
		},
		getDetailsAPI(idea, detailType, detailId) {
			if (detailId) {
				return this.$http.get(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType + '?notePoint=' + detailId);
			} else {
				return this.$http.get(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType)
			}
		},
		getRoute(where) {
			if (where.type === 'user') {
				return { name: 'mypage', params: { id: where.id } };
			} else if (where.type === 'class') {
				if (this.me.userType === 'teacher') {
					return { name: 'class', query: { id: where.id } }
				} else {
					return { name: 'class' }
				}
			}
		},
		givePoint(idea) {
			if (idea.pointGiven) {
				this.deleteDetail(idea, 'points', '-');
			} else {
				this.postDetail(idea, 'points');
			}
		},
		hideIdea() {

		},
		postDetail(idea, option, detail) {
			this.postDetailAPI(idea, option, detail)
				.then(response => {
					response.body.mine = true;
					response.body.who = this.me;
					if (idea[option]) {
						idea[option].push(response.body);
					}
					if (option === 'notes') {
						response.body.pointCount = 0;
						response.body.when = 'now';
						idea.noteCount++;
						this.viewOptionSection(idea, 'notes');
					} else if (option === 'points') {
						idea.pointCount++;
						idea.pointGiven = true;
					}
				})
		},
		postIdea(what) {
			var idea = {
				viewable: {
					by: 'friends'
				}
			}
			idea.what = what;
			this.$http.post(this.url + '/' + this.where.type + '/' + this.where.id, idea)
				.then(response => {
					response.body.who = this.me;
					response.body.when = 'now';
					response.body.where = this.where;
					response.body.pointCount = 0;
					response.body.noteCount = 0;
					response.body.reLiveCount = 0;
					response.body.mine = true;
					this.ideaList.unshift(response.body);
				})
		},
		postDetailAPI(idea, detailType, detail, detailId) {
			var body = {};
			if (detail) {
				body.what = detail;
			}
			if (detailId) {
				return this.$http.post(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType + '?notePoint=' + detailId);
			} else {
				return this.$http.post(this.url + '/details/' + idea.where.type + '/' + idea.where.id + '/' + idea.id + '/' + detailType, body);
			}
		},
		postNotePoint(idea, detail) {
			if (detail.pointGiven) {
				this.deleteDetailAPI(idea, 'notes', detail._id, true)
					.then(() => {
						detail.pointCount--;
						this.$set(detail, 'pointGiven', false);
					})
			} else {
				this.postDetailAPI(idea, 'notes', detail, detail._id)
					.then(() => {
						detail.pointCount++;
						this.$set(detail, 'pointGiven', true);
					})
			}
		},
		setKey(object, index) {
			object.index = index;
			return object.id;
		},
		setWhere(idea) {
			if (!idea.where) {
				if (this.container.type === 'board') {
					this.$set(idea, 'where', { type: 'user', id: idea.who.id });
				} else {
					this.$set(idea, 'where', { type: this.container.type, id: this.container.id });
				}
			} else if (idea.where.type === 'class') {
				if (this.me.userType === 'student') {
					this.$set(idea.where, 'id', '-');
				} else {
					this.$set(idea.where, 'id', this.$route.query.id);
				}
			}
		},
		shareNote(idea, note) {
			this.postDetail(idea, 'notes', note);
		},
		showMenu(ideaEvent, idea) {
			var vm = this;
			vm.$set(idea, 'showMenu', true);
			window.addEventListener('click', function(event) {
				if (!ideaEvent.toElement.contains(event.target)) {
					vm.$set(idea, 'showMenu', false);
				}
			})
		},
		viewOptionSection(idea, option) {
			if (idea.optionSection == option) {
				this.$set(idea, 'optionSection', false);
			} else {
				this.$set(idea, 'optionSection', option);
				if (!idea[option] && option !== 'newNote') {
					this.getDetailsAPI(idea, option)
						.then(response => {
							this.$set(idea, option, response.body);
						})
				}
			}
		}
	},
	watch: {
		'ideaList'() {
			this.castIdeas();
		}
	}
}
</script>
<style lang="scss" scoped>
.padding5 {
	padding: 5px;
}

.optionSection {
	margin-top: 25px;
	margin-bottom: -25px;
	position: relative;
	padding-top: 5px;

	.pageCorner {
		height: 33px;
		width: 25px;
		// background-color: transparent;
		background: linear-gradient(to bottom right, white, white, #D8D8D8, lightgrey);

		.end {
			height: 20px;
			width: 15px;
			// background-color: transparent;
			background: linear-gradient(to bottom right, #BDBDBD, #BDBDBD, lightgrey, #FAFAFA, #FAFAFA, lightgrey, #A4A4A4, #BDBDBD, #939393, #939393, #a4a4a4, #a4a4a4, #acacac, #acacac);

		}
	}

	.points {
		font-family: snetComic;
		margin-bottom: 20px;
	}
}

.idea {
	max-width: 550px;
	margin: 20px auto;
	font-family: snetComic;
	background-color: white;
	border-radius: 5px;
	border: 1px solid lightgrey;
	border-bottom: 0px;
	padding-bottom: 25px;

	.header {
		position: relative;
		z-index: 5;
		border-bottom: 1px solid lightgrey;
	}

	.holder {
		font-size: 14px;
	}

	.pointCount {
		height: 50px;
		width: 50px;
		cursor: pointer;

		div {
			font-size: 12px;
		}
	}

	.optionsToDo {
		position: relative;

		.empty {
			background: linear-gradient(#FFF, #F2F2F2);
			border-bottom-right-radius: 5px;
			border-bottom-left-radius: 5px;
			position: absolute;
			box-shadow: -1px 2px 3px 0px rgba(0, 0, 0, 0.3);
			z-index: 4;
			width: 10%;
			margin-left: 90%;
		}

		.point {
			background: linear-gradient(#F6CECE, #F5A9A9);
			z-index: 3;
			width: 31%;
			margin-left: 60%;

			&.given {
				border-bottom: 2px solid black;
			}
		}

		.reLive {
			background: linear-gradient(#BEF781, #ACFA58);
			z-index: 2;
			width: 31%;
			margin-left: 30%;
		}

		.note {
			background: linear-gradient(#A9E2F3, #81DAF5);
			z-index: 1;
			width: 31%;
		}
	}


	.option {
		box-shadow: -1px 2px 3px 0px rgba(0, 0, 0, 0.3), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
		border-bottom-right-radius: 5px;
		border-bottom-left-radius: 5px;
		cursor: pointer;
		outline: none;
		position: absolute;

		&:hover {
			box-shadow: -1px 2px 10px 0px rgba(0, 0, 0, 0.4), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
		}
	}


	.text {
		margin-top: 5px;
		min-height: 50px;
		position: relative;
		z-index: 4;
		background-color: white;
		white-space: pre-line;
	}
}

@media only screen and (max-width: 959px) {
	.ideas {
		padding: 0 8px;
	}

	.idea {
		.header {
			height: 40px;
		}

		.view {
			height: 40px;
		}

		.option {
			-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
			height: 35px;

			&:active {
				height: 38px;
			}
		}

		.empty {
			height: 35px;
		}

		.text {
			margin-top: 0;
		}
	}
}

@media only screen and (min-width: 960px) {
	.idea {
		.option {
			height: 25px;

			&:hover {
				height: 28px;
			}
		}

		.empty {
			height: 25px;
		}
	}
}
</style>
<template>
	<div class="snetBar column height100n shadow-15-md shadow-15-lg w-flex">
		<div class="row" :class="{ 'hide-sm hide-xs': selectedNavMenu === 'board' }">
			<Search searchType="SNET.com" :search="searchSnet"></Search>
		</div>
		<div class="row hide-md hide-lg optionTitle y-center x-center capitalize" :class="{ 'hide-sm hide-xs': selectedNavMenu === 'board' }">
			{{ selectedNavMenu }}
		</div>
		<div class="height30 marginTopBottom5 row x-left y-top " :class="{ 'hide-sm hide-xs': selectedNavMenu === 'board' }">
			<router-link to="/" class="options column x-center y-center w-flex" @click="showAdditionalMenu = !showAdditionalMenu">
				<img src="../assets/images/app/board.png" class="boardIcon opacity-80">
			</router-link>
			<router-link :to="{ name:'mypage', params: { id: me._id } }" class="options padding8 w-75-lg w-75-md w-60-sm w-60-xs row x-left y-center">
				<MyImage :imgId="me.myImage" where="sideBarImg"></MyImage>
				<div>{{ me.name }}</div>
			</router-link>
			<Option :menus="menus" :right="true" @toggleSettings="$router.push({ name: 'Settings' })" @toggleEdit="$router.push({ name: 'InfoEdit' })" @logOut="logOut()"></Option>
		</div>
		<!-- <div class="column w-flex"> -->
		<div class="snetNavMenuDiv row">
			<div class="snetNavMenu x-center y-center row w-flex hide-md hide-lg hide-xl" :class="{ selectedNavMenu: selectedNavMenu == 'board' }" @click="selectedNavMenu === 'board' ? $router.push({ name: 'board' }) : selectedNavMenu = 'board'">
				<img src="../assets/images/app/board.png" width="20">
			</div>
			<div class="snetNavMenu x-center y-center row w-flex relative" v-for="(tab, tabName) in tabs" :key="tabName" :class="{ selectedNavMenu: selectedNavMenu == tabName }" @click="loadTab(tabName)">
				<img :src="require('../assets/images/app/' + tabName + '.png')" width="20" class="opacity-80">
				<div class="updateCount absolute" v-if="tab.updateCount && selectedNavMenu !== tabName">{{ tab.updateCount }}</div>
			</div>
		</div>
		<div class="scrollable-y tabData bottomNavMenuSpace w-flex" v-if="selectedNavMenu !== 'board' && tabs[selectedNavMenu]">
			<div class="row">
				<!-- <Search :searchType="selectedNavMenu"></Search> -->
			</div>
			<div v-for="(menuCategory, categoryTitle) in tabs[selectedNavMenu].menuCategories" :key="categoryTitle">
				<div v-if="categoryTitle !== 'single' && menuCategory.length !== 0">
					<div class="categoryTitle">{{ categoryTitle }}</div>
					<div class="divider"></div>
				</div>
				<div v-for="(menuItem, itemIndex) in menuCategory" class="menuItem row" :key="menuItem.id">
					<div class="options row x-left y-center w-flex">
						<div v-if="selectedNavMenu !== 'personal' && !menuItem.noImage" class="photoSpace padding8">
							<MyImage :imgId="menuItem.myImage" where="sideBarImg"></MyImage>
						</div>
						<router-link v-if="menuItem.url" :to="menuItem.url" class="w-65 padding8 content" :class="{ 'opacity-80': menuItem.old }">
							<b>{{ menuItem.title }}</b>
							<div>{{ menuItem.body }}</div>
							<div class="time">{{ menuItem.when }}</div>
						</router-link>
						<div v-else class="w-65 padding8 content" @click="menuItem.action(menuItem.actionParams)">
							<b>{{ menuItem.title }}</b>
							<div>{{ menuItem.body }}</div>
							<div class="timeDisplay">{{ menuItem.when }}</div>
						</div>
					</div>
					<div class="subOptions row w-15" v-for="opt in menuItem.subOptions" :key="opt.id" @click="opt.action(menuItem, itemIndex)">
						<div class="w-flex height100n options column x-center y-center">
							<div>{{ opt.symbol }}</div>
							<div>{{ opt.name }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-show="selectedNavMenu === 'board'" class="hide-md hide-lg hide-xl">
			<router-view class="bottomNavMenuSpace"></router-view>
		</div>
		<!-- </div> -->
	</div>
</template>
<script>
import IdeaInput from './IdeaInput.vue';
import Search from './Search.vue';
import MyImage from './MyImage.vue';
import Option from './Option.vue';
import { BASEURL, removeFromArray } from '../constants';
// import Store from '../store';

export default {
	name: 'SnetBar',
	props: {
		msg: String
	},
	components: {
		IdeaInput,
		Search,
		Option,
		MyImage
	},
	data() {
		return {
			selectedNavMenu: '',
			me: {},
			tabs: {},
			menus: [{ name: 'Settings', condition: true, option: 'toggleSettings' }, { name: 'Edit my info', condition: true, option: 'toggleEdit' }, { name: 'Log out', condition: true, option: 'logOut' }],
			tabMore: {}
		}
	},
	sockets: {
		connect() {
			this.$socket.emit('start', localStorage.token);
		},
		checkUpdates(tab) {
			var result = {};
			if (this.selectedNavMenu === tab) {
				result.current = true;
			}
			this.$socket.emit('updatesChecked', result);
		},
		updatesCount(countList) {
			var keys = Object.keys(countList);
			if (keys[0] === 'notifications') {
				this.getNotifObj([countList.notifications]);
				if (this.tabs.notifications.menuCategories) {
					this.tabs.notifications.menuCategories['New Notifications'].unshift(countList.notifications);
				}
			} else if (keys[0] === 'messages') {
				this.getMessageObj({ unread: [countList.messages], read: [], sent: [] });
				if (this.tabs.messages.menuCategories) {
					this.tabs.messages.menuCategories['New Messages'].unshift(countList.messages);
				}
			}
			this.tabs[keys[0]].updateCount++;
			countList = {};
		}
	},
	created() {
		this.$http.get(BASEURL + 'ctrl/me')
			.then(response => {
				this.me = response.body;
				this.me.id = this.me._id;
				if (window.innerWidth < 960) {
					this.selectedNavMenu = 'board';
				} else {
					this.selectedNavMenu = 'personal';
				}
				this.$store.commit('updateUser', this.me);
				this.tabs = {
					personal: {
						menuCategories: {},
						updateCount: 0
					},
					messages: {
						updateCount: this.me.newMessages,
						updates: [],
						moreCount: 1,
						moreSentCount: 1
					},
					notifications: {
						updateCount: this.me.newNotifications,
						updates: [],
						moreCount: 1
					},
					friends: {
						updateCount: 0,
						updates: [],
						moreCount: 1
					}
				}
				var i;
				if (this.me.userType === 'student') {
					castStudentPersonal(this.tabs.personal.menuCategories, this.me.school, this.me.studentDetails.subjects);
				} else if (this.me.userType === 'teacher') {
					castTeacherPersonal(this.tabs.personal.menuCategories, this.me.school, this.me.teacherDetails.subjects);
				} else if (this.me.userType === 'schoolAdmin') {
					castSchoolAdminPersonal(this.tabs.personal.menuCategories, this.me.school);
				}

				function castStudentPersonal(menuCategories, school, subjects) {
					if (school.class) {
						menuCategories.School = [
							{ body: school.name, url: { name: 'school', params: { id: school.code } } },
							{ body: school.class.name, url: { name: 'class', params: { school: school.code, class: school.class.code } } }
						];
					}
					menuCategories.Subjects = subjects || [];
					for (i = 0; i < menuCategories.Subjects.length; i++) {
						menuCategories.Subjects[i].body = menuCategories.Subjects[i].name;
						menuCategories.Subjects[i].url = { name: 'subject', params: { id: menuCategories.Subjects[i]._id } };
					}
				}

				function castTeacherPersonal(menuCategories, school, subjects) {
					menuCategories.School = subjects;
					for (i = 0; i < menuCategories.School.length; i++) {
						menuCategories.School[i].body = menuCategories.School[i].name;
						menuCategories.School[i].url = { name: 'subject', params: { id: menuCategories.School[i]._id } };
					}
					menuCategories.School.unshift({
						body: school.name,
						url: { name: 'school', params: { id: school.code } }
					});
					if (school.coordinated) {
						for (var i = 0; i < school.coordinated.length; i++) {
							school.coordinated[i].body = school.coordinated[i].name;
							school.coordinated[i].url = { name: 'class', query: { id: school.coordinated[i]._id } };
						}
						menuCategories['Coordinated classes'] = school.coordinated;
					}
					menuCategories.Classes = school.classes;
					for (i = 0; i < menuCategories.Classes.length; i++) {
						menuCategories.Classes[i].body = menuCategories.Classes[i].name;
						menuCategories.Classes[i].url = { name: 'class', query: { id: menuCategories.Classes[i]._id } };
					}
				}

				function castSchoolAdminPersonal(menuCategories, school) {
					menuCategories.School = [
						{ body: school.name, url: { name: 'school', params: { id: school.code } } },
						{ body: 'School Settings', url: { name: 'SchoolSettings' } },
						{ body: 'Administrators', url: { name: 'userlist', params: { userType: 'schoolAdmin' } } },
						{ body: 'Teachers', url: { name: 'userlist', params: { userType: 'teacher' } } },
						{ body: 'Classes & Students', url: { name: 'userlist', params: { userType: 'student' } } }
					];
				}
			})
			.catch(() => {
				this.$router.push({ name: 'Error' });
			})

	},
	methods: {
		logOut() {
			localStorage.clear();
			window.location.href = '/';
		},
		searchSnet(search) {
			this.$router.push({ name: 'searchresult', params: { search: search } });
		},
		loadTab(tab) {
			var updates = [],
				vm = this;
			if (!this.tabs[tab].menuCategories) {
				this.$http.get(BASEURL + 'ctrl/me/tab/' + tab)
					.then(response => {
						if (tab === 'notifications') {
							this.getNotifObj(response.body.newNotifications);
							this.getNotifObj(response.body.oldNotifications, true);
							response.body.oldNotifications.push({ body: '⛛ Show more', noImage: true, action: this.getMore, actionParams: 'notifs' });
							this.tabs.notifications.menuCategories = {
								'New Notifications': response.body.newNotifications || [],
								'Old Notifications': response.body.oldNotifications || []
							}
							this.tabs[tab].updateCount = this.tabs.notifications.menuCategories['New Notifications'].length;
						} else if (tab === 'messages') {
							this.getMessageObj(response.body);
							this.tabs.messages.menuCategories = {
								single: [{
									body: '+ New Message',
									url: { name: 'Message', params: { id: 'new' } },
									noImage: true
								}],
								'New Messages': response.body.unread || [],
								'Read Messages': response.body.read || [],
								'Sent Messages': response.body.sent || []
							}
						} else if (tab === 'friends') {
							getFriendObj(response.body);
							this.tabs.friends.menuCategories = {
								single: response.body
							}
						}
						this.selectedNavMenu = tab;
					})
			} else if (this.selectedNavMenu === 'board' && tab === 'board') {
				this.$router.push({ name: 'board' });
			} else {
				this.selectedNavMenu = tab;
			}

			function getFriendObj(friends) {
				for (var i = 0; i < friends.length; i++) {
					friends[i].body = friends[i].name;
					// friends[i].subOptions = [{ name: 'Chat', symbol: '🗩' }];
					friends[i].url = { name: 'mypage', params: { id: friends[i].id } };
				}
			}
		},
		ignoreFriend(notif, notifIndex) {
			this.$http.delete(BASEURL + 'ctrl/friend/' + notif.user.id + '?ignore=true')
				.then(() => {
					notif.special = 'has not been';
					notif.subOptions = [];
					notif.url = JSON.stringify(notif.url);
					this.getNotifObj([notif], true);
					this.tabs.notifications.menuCategories['Old Notifications'].unshift(notif);
					this.tabs.notifications.menuCategories['New Notifications'].splice(notifIndex, 1);
					this.tabs.notifications.updateCount--;
				})
		},
		addFriend(notif, notifIndex) {
			this.$http.put(BASEURL + 'ctrl/friend/' + notif.user.id)
				.then(() => {
					notif.special = 'has been';
					notif.subOptions = [];
					notif.url = JSON.stringify(notif.url);
					this.getNotifObj([notif], true);
					this.tabs.notifications.menuCategories['Old Notifications'].unshift(notif);
					this.tabs.notifications.menuCategories['New Notifications'].splice(notifIndex, 1);
					this.tabs.notifications.updateCount--;
				})
		},
		getNotifObj(notifs, old) {
			var vm = this;
			for (var i = 0; i < notifs.length; i++) {
				if (notifs[i].user) {
					notifs[i].title = notifs[i].user.name;
					notifs[i].myImage = notifs[i].user.myImage;
				} else {
					notifs[i].title = 'Somebody';
				}
				if (notifs[i].others) {
					if (notifs[i].others === 1) {
						notifs[i].title += ' and ' + notifs[i].others + ' other';
					} else {
						notifs[i].title += ' and ' + notifs[i].others + ' others';
					}
				}
				if (notifs[i].url) {
					notifs[i].url = JSON.parse(notifs[i].url);
				}
				if (notifs[i].notifType === 'friend') {
					if (!old) {
						notifs[i].body = 'would like to be your friend';
						notifs[i].subOptions = [{ name: 'Add', symbol: '✔', action: this.addFriend }, { name: 'Ignore', symbol: '✘', action: this.ignoreFriend }];
					} else {
						notifs[i].body = notifs[i].special + ' accepted as friend';
					}
				} else if (notifs[i].notifType === 'notes') {
					notifs[i].body = 'added a note to your idea';
					if (!old) {
						notifs[i].subOptions = [{ name: 'Check', symbol: '✔', action: this.markChecked }];
					}
				} else if (notifs[i].notifType === 'points') {
					notifs[i].body = 'gave you 1 idea point';
					if (!old) {
						notifs[i].subOptions = [{ name: 'Check', symbol: '✔', action: this.markChecked }];
					}
				} else if (notifs[i].notifType === 'homework') {
					notifs[i].body = notifs[i].special + ' a homework';
				} else if (notifs[i].notifType === 'subjectNotes') {
					notifs[i].body = notifs[i].special + ' a set of notes';
				}
			}
		},
		markChecked(notif, index) {
			this.$http.get(BASEURL + 'ctrl/me/check/notifications/' + notif._id)
				.then(() => {
					this.tabs.notifications.menuCategories['New Notifications'].splice(index, 1);
					delete notif.subOptions;
					this.tabs.notifications.menuCategories['Old Notifications'].unshift(notif);
					this.tabs.notifications.updateCount--;
				})
		},
		getMessageObj(messages) {
			var i;
			for (i = 0; i < messages.unread.length; i++) {
				castMessage(messages.unread[i]);
				messages.unread[i].myImage = messages.unread[i].sender.myImage;
				messages.unread[i].title = '• ' + messages.unread[i].sender.name;
				// messages.unread[i].subOptions = [{ name: 'Mark read', symbol: '✔' }];
			}
			for (i = 0; i < messages.read.length; i++) {
				castMessage(messages.read[i]);
				messages.read[i].myImage = messages.read[i].sender.myImage;
				messages.read[i].title = messages.read[i].sender.name;
				// messages.read[i].subOptions = [{ name: 'Mark unread', symbol: '•' }];
				messages.read[i].old = true;
			}
			messages.read.push({ body: '⛛ Show more', noImage: true, action: this.getMore, actionParams: 'read' });
			for (i = 0; i < messages.sent.length; i++) {
				castMessage(messages.sent[i]);
				messages.sent[i].title = 'To: ' + messages.sent[i].recipients[0].name;
				messages.sent[i].myImage = messages.sent[i].recipients[0].myImage;
				messages.sent[i].old = true;
			}
			messages.sent.push({ body: '⛛ Show more', noImage: true, action: this.getMore, actionParams: 'sent' });

			function castMessage(message) {
				message.body = message.subject;
				message.date = new Date(parseInt(message.id.toString().substring(0, 8), 16) * 1000);
				message.when = 'on ' + message.date.getDate() + ' / ' + (message.date.getMonth() + 1) + ' / ' + message.date.getFullYear() + ' at ' + message.date.getHours() + ':' + message.date.getMinutes();
				message.url = { name: 'Message', params: { id: message.id } };
			}
		},
		getMore(category) {
			var vm = this,
				count;
			if (category === 'notifs') {
				count = vm.tabs.notifications.moreCount;
			} else if (category === 'read') {
				count = vm.tabs.messages.moreCount;
			} else if (category === 'sent') {
				count = vm.tabs.messages.moreSentCount;
			} else if (category === 'friends') {
				count = vm.tabs.friends.moreCount;
			}
			vm.$http.get(BASEURL + 'ctrl/me/tabMore/' + category + '/' + count)
				.then(response => {
					if (category === 'notifs') {
						getNotifObj(response.body, true);
						addToCategory(vm.tabs.notifications.menuCategories['Old Notifications']);
						vm.tabs.notifications.moreCount++;
						vm.tabs.notifications.updateCount++;
						vm.tabs.notifications.updateCount--;
					} else if (category === 'read') {
						vm.getMessageObj({ unread: [], read: response.body, sent: [] });
						response.body.pop();
						addToCategory(vm.tabs.messages.menuCategories['Read Messages']);
						vm.tabs.messages.moreCount++;
						vm.tabs.notifications.updateCount++;
						vm.tabs.notifications.updateCount--;
					} else if (category === 'sent') {
						vm.getMessageObj({ unread: [], sent: response.body, read: [] });
						response.body.pop();
						addToCategory(vm.tabs.messages.menuCategories['Sent Messages']);
						vm.tabs.messages.moreSentCount++;
						vm.tabs.notifications.updateCount++;
						vm.tabs.notifications.updateCount--;
					} else if (category === 'friends') {
						// count = vm.tabs.friends.moreCount;
					}

					function addToCategory(categoryArray) {
						categoryArray.pop();
						for (var i = 0; i < response.body.length; i++) {
							categoryArray.push(response.body[i]);
						}
						if (response.body.length === 3) {
							categoryArray.push({ body: '⛛ Show more', noImage: true, action: vm.getMore, actionParams: category });
						}
					}
				})
		}
	},
	watch: {
		'$route'() {
			if (window.innerWidth < 960) {
				this.selectedNavMenu = 'board';
			}
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.snetBar {
	border-left: 1px solid lightgrey;
	border-right: 1px solid lightgrey;
	height: 100%;
	background-color: white;
	top: 0;
	bottom: 0;

	.barTop {
		box-shadow: inset 0px -1px 2px 0px rgba(0, 0, 0, 0.3);
		background-image: linear-gradient(#a37e6e, #5f443d);
	}

	.categoryTitle {
		color: grey;
		margin: 4px;
	}

	.additionalMenuList {
		margin-top: 25px;
	}

	.additionalMenu {
		.icon {
			height: 24px;
			margin: 3px 0;
		}

		.backIcon {
			height: 18px;
			margin: 6px 0;
		}
	}

	.snetNavMenu {
		margin-top: 20px;
		cursor: pointer;
		outline: none;
		z-index: 1;

		.updateCount {
			background-image: linear-gradient(#FA5858, #FF0000);
			// display: block;
			color: white;
			border-radius: 2px;
			background-size: 1px 1px;
			font-size: 10px;
			padding: 2.5px 4px;
			top: -4px;
			right: 25%;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
		}
	}

	.boardIcon {
		width: 20px;
		margin: 5.5px 0;
	}

	.selectedNavMenu {
		border-bottom: 0px;
		z-index: 2;
	}

	.menuItem {
		.subOptions {
			opacity: 0;
		}

		&:hover {
			.subOptions {
				opacity: 1;
			}
		}

		.photoSpace {
			width: 30px;
			display: flex;
		}
	}
}


@media only screen and (max-width: 959px) {
	.snetNavMenu {
		height: 50px;
		box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
		background: linear-gradient(#E6E6E6, #FAFAFA);
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	}

	.tabData {
		margin-top: 10px;
	}

	.selectedNavMenu {
		background: linear-gradient(#FFFFFF, #F2F2F2);
		box-shadow: none;
		border-bottom-right-radius: 4px;
		border-bottom-left-radius: 4px;
	}

	.bottomNavMenuSpace {
		margin-bottom: 50px;
	}

	.menuItem {
		.content {
			padding: 16px;
		}
	}

	.optionTitle {
		height: 200px;
		font-weight: bold;
		font-size: 25px;
	}

	.snetNavMenuDiv {
		position: fixed;
		bottom: 0;
		z-index: 10;
		width: 100%;
	}
}

@media only screen and (min-width: 960px) {
	.snetBar {
		position: fixed;
		width: 300px;
	}

	.tabData {
		padding-top: 10px;
		background-color: #F2F2F2;
	}

	.snetNavMenu {
		box-shadow: inset 0px -1px 2px 0px rgba(0, 0, 0, 0.3);
		height: 30px;
		background-image: linear-gradient(#FAFAFA, #E6E6E6);
	}

	.selectedNavMenu {
		box-shadow: 2px -2.5px 1px 0px rgba(0, 0, 0, 0.2), -2px -2.5px 1px 0px rgba(0, 0, 0, 0.2);
		background-image: linear-gradient(#FFFFFF, #F2F2F2);
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
	}
}
</style>
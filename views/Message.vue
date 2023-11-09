<template>
	<div class="margin8 padding8 w-flex">
		<div class="column layout-margin8" v-if="$route.params && $route.params.id === 'new'">
			<input type="text" placeholder="Subject" class="snetInput inputSet" v-model="message.subject">
			<Chips url="friends" :listProp="[{ name: 'Nirmal', id: 1 }, { name: 'Shikha', id: 2 }, { name: 'Suyash', id: 3 }]" @select="addRecipient" placeholder="Add recipient (A username or a friend's name)" class="inputSet"></Chips>
			<div class="row" v-if="message.recipients.length > 0">
				<b class="padding4">To</b>
				<div v-for="(recipient, index) in message.recipients" class="row layout-padding4" :key="recipient.id || recipient.username">
					<div v-if="index !== 0">,</div>&nbsp;
					<router-link :to="{ name: 'mypage', params: { id: recipient.id } }" class="options" v-if="recipient.name">
						{{ recipient.name }}
					</router-link>
					<div v-else>{{ recipient.username }}</div>
				</div>
			</div>
			<div class="row x-center">
				<IdeaInput @share="sendMessage($event)" placeholder="Type message here" buttonText="Send Message"></IdeaInput>
			</div>
		</div>
		<div class="layout-margin8" v-else>
			<div class="borderRadius5 shadow-15 layout-margin8 padding8">
				<div class="w-flex row">
					<b class="w-flex row x-center">{{ message.subject }}</b>
					<div class="w-5 row x-center y-center" @click="showMenu($event)">
						<img src="../assets/images/app/Settings-01.png" class="options settings">
					</div>
					<div class="relative" v-if="menu">
						<div class="settingsMenu shadow-15">
							<div class="padding4 options content" @click="deleteMessage()">Delete</div>
						</div>
					</div>
				</div>
				<div v-if="message.sender && message.sender.id != me.id" class="padding8">
					<b>From</b> 
					<router-link :to="{ name: 'mypage', params: { id: message.sender.id } }" class="options padding4">
						{{ message.sender.name }}
					</router-link>
				</div>
				<div class="row" v-if="message.recipients.length > 0 && message.sender.id == me.id">
					<b class="padding4">To</b>
					<div v-for="(recipient, index) in message.recipients" class="row layout-padding4" :key="recipient.id || recipient.username">
						<div v-if="index !== 0">,</div>&nbsp;
						<router-link :to="{ name: 'mypage', params: { id: recipient.id } }" class="options" v-if="recipient.name">
							{{ recipient.name }}
						</router-link>
						<div v-else>{{ recipient.username }}</div>
					</div>
				</div>
				<div>{{ message.text }}</div>
			</div>
		</div>
	</div>
</template>
<script>
	import IdeaInput from '../components/IdeaInput.vue'
	import Chips from '../components/Chips.vue'
	import { BASEURL } from '../constants';

	export default {
		name: 'Message',
		components: {
			IdeaInput,
			Chips
		},
		data() {
			return {
				message: {},
				menu: false
			}
		},
		computed: {
			me() {
				return this.$store.getters.getUser;
			}
		},
		created() {
			this.load(this.$route.params, this.$route.query);
		},
		methods: {
			sendMessage(message) {
				message.subject = this.message.subject;
				message.recipients = [];
				for (var i = 0; i < this.message.recipients.length; i++) {
					message.recipients.push(this.message.recipients[i].id);
				}
				this.$http.post(BASEURL + 'ctrl/message/', message)
					.then(response => {
						this.$router.push({ name: 'Message', params: { id: response.body.id } });
					})
			},
			addRecipient(recipient) {
				var recipientAdded;
				for (var i = 0; i < this.message.recipients.length; i++) {
					if (this.message.recipients[i].id === recipient.id) {
						recipientAdded = true;
						break;
					}
				}
				if (!recipientAdded) {
					this.message.recipients.push(recipient);
				}
			},
			showMenu(parentEvent) {
				var vm = this;
				vm.menu = true;
				window.addEventListener('click', function(event){
					if(!parentEvent.toElement.contains(event.target)) {
						vm.menu = false;
					}
				})
			},
			deleteMessage() {
				this.$http.delete(BASEURL + 'ctrl/message/' + this.$route.params.id)
			},
			load(params, query) {
				this.message = {
					recipients: []
				}
				if (query && query.name) {
					this.message.recipients.push({ id: query.user, name: query.name });
				}
				if (params.id !== 'new') {
					this.$http.get(BASEURL + 'ctrl/message/' + params.id)
						.then(response => {
							this.message = response.body;
						})
		                .catch(() => {
		                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
		                })
				}
			}
		},
		watch: {
			'$route'(to) {
				this.load(to.params, to.query);
			}
		}
	}
</script>
<style scoped>
	.inputSet {
		margin: 8px 45px;
	}

	.settings {
		width: 25px;
	}

	.settingsMenu {
		position: absolute;
		right: 0;
		top: 30px;
		min-width: 100px;
	}
</style>
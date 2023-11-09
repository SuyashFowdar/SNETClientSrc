<template>
	<div class="w-flex error">
		<div class="column x-center y-center container">
			<b class="title">Error</b>
			<div class="body margin8">The page you're trying to find is either not available or not accessible!</div>
			<div v-if="$route.name === 'Powera'" class="body options padding4" @click="errorView = true;">Click here to send error report.</div>
			<router-link v-if="$route.query.sess === 'on'" to="/" class="body options padding4" >Click here to go to board.</router-link>
			<div v-if="errorView" class="column layout-margin8">
				<textarea name="error" v-model="errorText" cols="30" rows="10" class="snetInput errorText" placeholder="Add a description (optional)"></textarea>
				<button class="snetButton" @click="sendError()">Send</button>
			</div>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';

	export default {
		name: 'Error',
		data () {
			return {
				errorView: false,
				errorText: ''
			}
		},
		methods: {
			sendError() {
				this.$http.post(BASEURL + 'power/senderrorreport', { text: this.errorText })
					.then(response => {
						if (response.body.token) {
							localStorage.token = response.body.token;
                			window.location.href = '/#/power';
						} else {
							this.$router.push({ name: 'board' });
						}
					})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.error {

		.container {
			margin-top: 100px;

			.title {
				font-size: 36px;
			}

			.body {
				font-size: 18px;
			}

			.errorText {
				resize: none;
			}
		}
	}
</style>
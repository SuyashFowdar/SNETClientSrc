<template>
	<div layout-column flex style="height:100%;">
		<div class="row x-center y-center login">
			<form name="loginForm" @submit="login" class="loginForm">
				<div class="row x-center y-center layout-margin8">
					<input type="text" v-model="user.username" @focus="error = '';" class="snetInput" placeholder="Username">
					<input type="password" v-model="user.password" @focus="error = '';" class="snetInput" placeholder="Password">
					<button class="snetButton" type="submit">Login</button>
				</div>
				<div class="row x-center y-center">
					Forgot
					<div class="padding4 options underline" @click="error = 'Please contact administration to recover username.'">Username</div>
					/<div class="padding4 options underline" @click="error = '';view = 'forgot';">Password</div>?
				</div>
				<div class="x-center fcRed margin8">
					<div>{{ error }}</div>
				</div>
			</form>
		</div>
		<form name="codeForm" @submit="loginWithCode" v-if="view === 'code'">
			<div class="row x-center y-center padding8">
				<input type="text" v-model="user.code" class="snetInput" placeholder="Code">
			</div>
			<div class="row x-center y-center layout-margin8">
				<button class="snetButton sub" type="button" @click="view = ''; errorSub = '';">Cancel</button>
				<button class="snetButton" type="submit">Initialise</button>
			</div>
		</form>
		<form v-else-if="view === 'forgot'">
			<div class="row x-center margin8">
				<div class="">Enter your username and a code will be sent to administration. <br>Click on 'Renew Password' button and enter the code.</div>
			</div>
			<div class="row layout-margin8 x-center">
				<input type="text" class="snetInput" placeholder="Username" v-model="forgotPass">
				<button type="submit" class="snetButton" :class="{ disabled: !forgotPass }">Send code</button>
				<button class="snetButton sub" type="button" @click="view = '';">Cancel</button>
			</div>
		</form>
		<div class="row x-center y-center layout-margin8 snet-container" v-else>
			<div class="column y-center w-flex">
				<button type="button" class="snetButton sub" @click="view = 'code'; error = '';">Initialize account</button>
				<div class="description margin8">Click to insert the code given to you by the administration, to activate your account for the first time.</div>
			</div>
			<div class="column y-center layout-margin8 w-flex">
				<button class="snetButton sub">Renew Password</button>
				<div>OR</div>
				<button class="snetButton sub">Unblock Account</button>
			</div>
			<div class="row x-center w-flex">
				<div class="underline options padding8">Register a school / service</div>
			</div>
		</div>
		<div class="row x-center y-center padding8 fcRed">
			<div>{{ errorSub }}</div>
		</div>
	</div>
</template>
<script>
import { BASEURL } from '../constants.js'

export default {
	name: 'login',
	data() {
		return {
			user: {},
			error: '',
			errorSub: '',
			view: '',
			forgotPass: ''
		}
	},
	methods: {
		login(e) {
			e.preventDefault();
			if (this.user.username && this.user.password) {
				this.$http.post(BASEURL + 'ctrl/login', this.user)
					.then(response => {
						if (response.body.noAccess) {
							this.error = "Access to this account is blocked. Please contact administrator to continue the login process!";
							this.hasCode = true;
						} else if (response.body.noUser) {
							this.error = "Username does not exist!";
						} else if (response.body.noPass) {
							this.error = "Wrong password!";
						} else {
							localStorage.token = response.body;
							location.reload();
						}
					})
			} else {
				this.error = 'Please enter both username and password!'
			}
		},
		loginWithCode(e) {
			e.preventDefault();
			if (this.user.code) {
				this.$router.push({ name: 'Register', params: { userCode: this.user.code } });
			} else {
				this.errorSub = 'Please enter code!'
			}
		}
	}
}
</script>
<style lang="scss">
.description {
	font-size: 10px;
	max-width: 250px;
}

.underline {
	text-decoration: underline;
}

.login {
	background-image: url('../assets/images/login/loginMain.jpg');
	background-position: center;
	background-repeat: no-repeat;
	height: 500px;
	overflow: hidden;

	.loginForm {
		// background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(200, 200, 200, 0.9));
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 10px;
		height: 100px;
		padding: 20px 20px 0;
	}
}
</style>
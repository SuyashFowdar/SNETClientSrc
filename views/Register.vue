<template>
	<div class="w-flex">
		<div v-if="success" class="column y-center layout-padding8">
			<div class="fs18">Welcome to SNET.com, {{ user.name }}!</div>
			<div>Please register to get access to the exeptional experience of SNET.</div>
			<form name="loginForm" @submit="register" class="md-alignment-center-center">
				<div class="column x-center y-center layout-margin8">
					<input type="text" v-model="user.username" @focus="usernameValid = null;" @blur="checkUsername" class="snetInput" placeholder="Username" :class="{ error: usernameValid === false }">
					<div v-if="usernameValid !== null">
						<div v-if="usernameValid">✔ Good username!</div>
						<div v-else class="formError">✘ Username already exists!</div>
					</div>
				</div>
				<div class="column x-center y-center layout-margin8">
					<input type="password" v-model="user.password" @focus="passwordValid = null;" @keyup="checkPassword" class="snetInput" placeholder="Password">
					<div v-if="passwordValid !== null">
						<div v-if="passwordValid">✔ Good password!</div>
						<div v-else class="formError">
							<div>✘ Include: </div>
							<div>- At least 8 character. </div>
							<div>- At least a symbol. </div>
							<div>- At least a lowercase alphabet. </div>
							<div>- At least an uppercase alphabet. </div>
						</div>
					</div>
				</div>
				<div class="column x-center y-center layout-margin8">
					<input type="password" v-model="user.passwordCheck" class="snetInput" placeholder="Confirm Password" :class="{ disabled: !passwordValid }">
					<div v-if="user.passwordCheck">
						<div v-if="user.passwordCheck === user.password">✔ Password matched</div>
						<div v-else class="formError">✘ Password not matched!</div>
					</div>
				</div>
				<div class="row x-center y-center padding8 fcRed" v-if="error">
					<div>{{ error }}</div>
				</div>
				<div class="row x-center y-center padding8">
					<button class="snetButton" type="submit" :class="{ disabled: !(usernameValid && passwordValid && user.username && user.password && user.passwordCheck && user.passwordCheck === user.password) }">Register</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import { BASEURL } from '../constants.js'

export default {
	name: 'Register',
	data() {
		return {
			success: true,
			user: {},
			error: '',
			usernameValid: null,
			passwordValid: null
		}
	},
	created() {
		this.$http.get(BASEURL + 'ctrl/login/verify/' + this.$route.params.userCode)
			.then(response => {
				this.user = response.body;
				this.success = true;
			})
			.catch(() => {
				this.success = false;
			})
	},
	methods: {
		register(e) {
			e.preventDefault();
			if (this.user.password === this.user.passwordCheck) {
				delete this.user.passwordCheck;
				this.$http.post(BASEURL + 'ctrl/login/register/' + this.$route.params.userCode, this.user)
					.then(response => {
						localStorage.token = response.body;
						this.$router.push({ name: 'home' });
					})
			} else {
				this.error = 'Please confirm password!'
			}
		},
		checkUsername() {
			if (this.user.username) {
				this.$http.get(BASEURL + 'ctrl/login/checkUsername/' + this.user.username)
					.then(response => {
						if (response.body.valid) {
							this.usernameValid = true;
						} else {
							this.usernameValid = false;
						}
					})
			} else {
				this.usernameValid = false;
			}
		},
		checkPassword() {
			var valid = /(?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(this.user.password);
			this.passwordValid = valid;
			// console.log(valid);
		}
	}
}
</script>
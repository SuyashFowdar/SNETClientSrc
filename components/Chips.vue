<template>
	<div class="w-flex">
		<div class="row">
			<input type="text" class="snetInput w-flex" v-model="listInput" @keyup="keyup" :placeholder="placeholder">
		</div>
			<div class="relative">
				<div class="absolute w-100 shadow-15 list">
					<div v-for="obj in list" :key="obj.id" @click="select(obj)" class="padding8 options row x-left" :class="{ hover: obj.hover }">
						{{ obj.name }}
					</div>
				</div>
			</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants.js';

	export default {
		name: 'Chips',
		props: {
			local: Boolean,
			listProp: Array,
			url: String,
			placeholder: String
		},
		data() {
			return {
				listInput: '',
				list: []
			}
		},
		methods: {
			keyup(e) {
				var i;
				if (e.code.includes('Key') || e.code === 'Backspace') {
					this.list = [];
					if (this.listInput !== '') {
						if (this.local) {
							for (i = 0; i < this.listProp.length; i++) {
								if (this.listProp[i].name.toLowerCase().includes(this.listInput.toLowerCase())) {
									this.list.push(this.listProp[i]);
								}
								if (this.list.length > 5) {
									break;
								}
							}
						} else {
							this.$http.get(BASEURL + 'ctrl/chips/' + this.url + '/' + this.listInput)
								.then(response => {
									this.list = response.body;
								})
						}
					}
				} else if (e.code === 'Escape') {
					this.list = [];
				} else if (e.code === 'ArrowDown') {
					for (i = 0; i < this.list.length; i++) {
						if (this.list[i].hover && (i + 1) !== this.list.length) {
							this.$set(this.list[i], 'hover', false);
							this.$set(this.list[i + 1], 'hover', true);
							break;
						} else if ((i + 1) === this.list.length) {
							this.$set(this.list[i], 'hover', false);
							this.$set(this.list[0], 'hover', true);
						}
					}
				} else if (e.code === 'ArrowUp') {
					for (i = this.list.length - 1; i >= 0; i--) {
						if (this.list[i].hover && i !== 0) {
							this.$set(this.list[i], 'hover', false);
							this.$set(this.list[i - 1], 'hover', true);
							break;
						} else if (i === 0) {
							this.$set(this.list[i], 'hover', false);
							this.$set(this.list[this.list.length - 1], 'hover', true);
						}
					}
				} else if (e.code === 'Enter') {
					for (i = 0; i < this.list.length; i++) {
						if (this.list[i].hover) {
							this.select(this.list[i]);
							break;
						}
					}
				}
			},
			select(obj) {
				this.$emit('select', obj);
				this.listInput = '';
				this.list = [];
			}
		}
	}
</script>
<style scoped>
	.list {
		z-index: 5;
		background-color: white;
	}
</style>
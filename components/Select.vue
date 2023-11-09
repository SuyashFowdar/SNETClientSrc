<template>
	<div class="row margin4">
		<div class="snet-select">
			<div class="options padding4 row relative y-center" :class="classBoolean" @click="showMenu = !showMenu" v-click-outside="hideMenu">
				<div>{{ selectedTitle }}</div>
				<div class="arrow">&#x27A4;</div>
			</div>
			<div class="list layout-padding4 shadow-15 w-100-sm" :class="classBoolean" v-if="showMenu">
				<div class="options row y-center" v-for="option in options" :key="option.value" @click="select(option)">{{ option.name || option.value }}</div>
			</div>
		</div>
	</div>
</template>
<script>
	import _ from 'lodash';
	import ClickOutside from 'vue-click-outside';

	export default {
		name: 'Select',
		props: ['title', 'options', 'size', 'value'],
		directives: {
			ClickOutside
		},
		data() {
			return {
				showMenu: false,
				selectedTitle: _.cloneDeep(this.value || this.title),
				classBoolean: {}
			}
		},
		created() {
			if (this.value) {
				if (this.options[0].name) {
					for (var i = 0; i < this.options.length; i++) {
						if (this.options[i].value === this.value) {
							this.selectedTitle = this.name;
						}
					}
				} else {
					this.selectedTitle = this.value;
				}
			}
			if (this.size) {
				this.classBoolean[this.size] = true;
			} else {
				this.classBoolean.medium = true;
			}
		},
		methods: {
			select(option) {
				this.selectedTitle = option.name || option.value;
				this.$emit('input', option.value);
			},
			hideMenu() {
				this.showMenu = false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.snet-select {
		.small {
			min-width: 50px;
		}

		.medium {
			min-width: 100px;
		}

		.arrow {
			position: absolute;
			right: 0;
			transform: rotate(90deg);
		}

		.list {
			background-color: white;
			position: absolute;
			z-index: 10;
			max-height: 150px;
			overflow-y: auto;
		}
	}

</style>
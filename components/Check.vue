<template>
	<div class="row w-flex wrap">
		<div v-for="item in list" :key="item.value" @click="selectItem(item)" class="options item row y-center padding8">
			<div v-if="item.selected">✔</div>
			<div :class="{ fwBold: item.selected }">{{ item.specialName || item.name || item.value }}</div>
		</div>
	</div>
</template>
<script>
	import _ from 'lodash';

	export default {
		name: 'Check',
		props: ['items', 'radio', 'value'],
		data() {
			return {
				list: _.clone(this.items),
				resultArray: []
			}
		},
		created() {
			var i;
			if (this.value || this.value === false) {
				if (typeof this.value === 'object' && this.value.length) {
					for (i = 0; i < this.value.length; i++) {
						for (var j = 0; j < this.list.length; j++) {
							if (this.value[i] === this.list[j].value) {
								this.resultArray.push(this.list[j].value);
								this.$set(this.list[j], 'selected', true);
							}
						}
					}
				} else {
					for (i = 0; i < this.list.length; i++) {
						if (this.value === this.list[i].value) {
							this.$set(this.list[i], 'selected', true);
							if (this.list[i].name2) {
								this.$set(this.list[i], 'specialName', this.list[i].name2);
							}
						} else {
							this.$set(this.list[i], 'selected', false);
						}
					}
				}
			} else {
				for (i = 0; i < this.list.length; i++) {
					this.$set(this.list[i], 'selected', false);
				}
			}
		},
		methods: {
			selectItem(item) {
				var i;
				if (this.radio) {
					for (i = 0; i < this.list.length; i++) {
						if (this.list[i].value === item.value) {
							if (item.name2) {
								if (item.selected) {
									this.$set(this.list[i], 'selected', false);
									this.$set(item, 'specialName', item.name);
									this.$emit('input', false);
								} else {
									this.$set(this.list[i], 'selected', true);
									this.$set(item, 'specialName', item.name2);
									this.$emit('input', true);
								}
								this.$emit(item.action);
							} else {
								this.$set(this.list[i], 'selected', true);
								this.$emit('input', item.value);
							}
						} else {
							this.$set(this.list[i], 'selected', false);
						}
					}
				} else {
					if (item.selected) {
						for (i = 0; i < this.resultArray.length; i++) {
							if (this.resultArray[i] === item.value) {
								this.resultArray.splice(i, 1);
							}
						}
						this.$set(item, 'selected', false);
					} else {
						this.$set(item, 'selected', true);
						this.resultArray.push(item.value);
					}
					this.$emit('input', this.resultArray);
				}
			}
		}
	}
</script>
<style scoped>
	.item {
		border-radius: 2px;
		min-width: 75px;
		height: 25px;
	}
</style>
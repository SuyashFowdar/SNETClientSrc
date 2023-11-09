<template>
	<div class="w-flex height100n">
		<div class="options row w-flex x-center y-center height100n padding4" @click="showMenu($event)">
			<img src="../assets/images/app/options.png" :style="{ width: width ? width + 'px' : '20px' }">
		</div>
		<div class="relative" v-if="showOptions">
			<div class="dropDownMenu shadow-15" :class="{ right: right }">
				<div class="padding8 options row y-center" v-for="(menu, $i) in menus" :key="$i" @click="$emit(menu.option)" v-if="menu.condition">
					{{ menu.name }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Option',
	props: {
		width: String,
		menus: Array,
		condition: Boolean,
		right: Boolean
	},
	data() {
		return {
			showOptions: false
		}
	},
	methods: {
		showMenu(parentEvent) {
			var vm = this;
			vm.showOptions = true;
			window.addEventListener('click', function(event) {
				if (!parentEvent.toElement.contains(event.target)) {
					vm.showOptions = false;
					window.removeEventListener('click', this);
				}
			})
		}
	}
}
</script>
<style scoped>
.right {
	right: 0;
}
</style>
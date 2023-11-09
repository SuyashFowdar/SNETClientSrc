<template>
	<div class="w-flex row x-center y-center loadContainer">
		<div class="loader row y-center">
			<div class="bar"></div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Loading',
	props: {
		size: String
	}
}
</script>
<style lang="scss" scoped>
.loadContainer {
	height: 200px;
}

.loader {
	box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
	width: 300px;
	height: 20px;
	border-radius: 10px;

	.bar {
		width: 50px;
		height: 15px;
		border-radius: 10px;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
		background: linear-gradient(lightgrey, grey);
		animation: fluctuate 1s;
		animation-iteration-count: infinite;
	}
}

@keyframes fluctuate {
	0% {
		margin-left: 0;
	}

	50% {
		margin-left: 250px;
	}

	100% {
		margin-left: 0;
	}
}
</style>
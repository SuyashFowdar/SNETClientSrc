<template>
	<div class="w-flex">
		<div v-if="files[fileIndex]">
			<div v-if="!docView" class="row w-flex">
				<div class="row w-10">
					<div class="row y-center options arrowContainer" @click="showOther()" v-if="files[fileIndex - 1]">
						<img src="../assets/images/app/arrow.png" class="arrow">
					</div>
				</div>
				<div class="w-flex" v-if="!transition">
					<div v-if="files[fileIndex].content_type.includes('image')">
						<div class="row x-center" style="margin: 20px 0;">
							<MyImage :imgId="files[fileIndex].id" where="ideaWhatImg"></MyImage>
						</div>
					</div>
					<div v-else>
						<div class="row x-center">
							<img src="../assets/images/app/file.png" height="100">
						</div>
						<div class="row x-center layout-margin8 layout-padding8">
							<div class="options" @click="docView = true">View</div>
							<a :href="url + files[fileIndex].id" class="options" download="File" target="_blank">Download</a>
						</div>
					</div>
					<div class="row x-center margin8" v-if="files.length > 1">{{ fileIndex + 1 }} of {{ files.length }}</div>
				</div>
				<div class="w-flex transition" v-if="transition">
					<div class="row x-center y-center">
						<div v-if="files[transitionIndex1].content_type.includes('image')" class="fileSpace" :class="{forward: !back, backward: back}">
							<div class="row x-center" style="margin: 20px 0;">
								<MyImage :imgId="files[transitionIndex1].id" where="ideaWhatImg"></MyImage>
							</div>
						</div>
						<div v-else class="fileSpace">
							<div class="row x-center">
								<img src="../assets/images/app/file.png" height="100">
							</div>
							<div class="row x-center layout-margin8 layout-padding8">
								<div class="options">View</div>
								<a href="#" class="options">Download</a>
							</div>
						</div>
						<div v-if="files[transitionIndex2].content_type.includes('image')" class="fileSpace">
							<div class="row x-center" style="margin: 20px 0;">
								<MyImage :imgId="files[transitionIndex2].id" where="ideaWhatImg"></MyImage>
							</div>
						</div>
						<div v-else class="fileSpace">
							<div class="row x-center">
								<img src="../assets/images/app/file.png" height="100">
							</div>
							<div class="row x-center layout-margin8 layout-padding8">
								<div class="options">View</div>
								<a href="#" class="options">Download</a>
							</div>
						</div>
					</div>
					<div class="row x-center margin8" v-if="files.length > 1">{{ fileIndex + 1 }} of {{ files.length }}</div>
				</div>
				<div class="row w-10">
					<div class="row y-center options arrowContainer" @click="showOther(true)" v-if="files[fileIndex + 1]">
						<img src="../assets/images/app/arrow.png" class="arrow" style="transform: rotate(180deg);">
					</div>
				</div>
			</div>
			<div v-else>
				<div class="row x-center w-flex">
					<div class="options padding8 margin8" @click="docView = false">Back</div>
				</div>
				<iframe :src="url + files[fileIndex].id" :type="files[fileIndex].content_type" width="100%" height="400px" />
			</div>
		</div>
	</div>
</template>
<script>
    import { BASEURL } from '../constants.js'
	import MyImage from './MyImage.vue';

	export default {
		name: 'FileView',
		components: {
			MyImage
		},
		props: {
			files: Array
		},
		data() {
			return {
				fileIndex: 0,
				url: BASEURL + 'ctrl/file/',
				docView: false,
				transition: false,
				transitionIndex1: 0,
				transitionIndex2: 0,
				back: false
			}
		},
		methods: {
			showOther(next) {
				var vm = this;
				this.transition = true;
				if (next) {
					this.back = false;
					this.transitionIndex1 = this.fileIndex;
					this.transitionIndex2 = this.fileIndex + 1;
					this.fileIndex++;
				} else {
					this.back = true;
					this.transitionIndex1 = this.fileIndex - 1;
					this.transitionIndex2 = this.fileIndex;
					this.fileIndex--;
				}
				setTimeout(function(){
					vm.transition = false;
				}, 500);
			}
		}
	}
</script>
<style lang="scss" scoped>
	@media only screen and (min-width: 960px) {
		@keyframes moveForward {
			from {margin-left: 0;}
			to {margin-left: -440px;}
		}

		@keyframes moveBackward {
			from {margin-left: -440px;}
			to {margin-left: 440px;}
		}

		.transition {
			max-width: 440px;
			overflow: hidden;
			
			.forward {
				animation: moveForward 0.5s;
			}

			.backward {
				animation: moveBackward 0.5s;
			}

			.fileSpace {
				min-width: 440px;
			}
		}

		.arrow {
			height: 40px;
		}

		.arrowContainer {
			padding: 8px;
		}
	}

    @media only screen and (max-width: 959px) {
		@keyframes moveForward {
			from {margin-left: 0;}
			to {margin-left: -350px;}
		}

		@keyframes moveBackward {
			from {margin-left: -350px;}
			to {margin-left: 350px;}
		}

		.transition {
			max-width: 350px;
			overflow: hidden;
			
			.forward {
				animation: moveForward 0.5s;
			}

			.backward {
				animation: moveBackward 0.5s;
			}

			.fileSpace {
				min-width: 350px;
			}
		}
    	.arrow {
    		height: 25px;
    	}

    	.arrowContainer {
    		padding: 4px;
    	}
    }
</style>
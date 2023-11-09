<template>
	<div class="ideainput w-flex x-center">
		<div class="row" @click="editable = true;">
			<textarea-autosize  v-model="ideaInput" name="idea" id="ideaInput" :placeholder="placeholder || 'Share an idea...'" :min-height="50" :max-height="350" class="input w-flex" :class="{ 'areaNotEditable': !editable }"></textarea-autosize>
		</div>
		<div class="row w-flex">
			<div class="w-flex bottom">
				<div class="row preview" v-if="previews.length > 0">
					<div class="margin8" v-for="(preview, previewIndex) in previews" style="width: 75px;" :key="preview.url">
						<div class="row x-center">
							<div style="height: 40px;">
								<img :src="preview.url" alt="" style="max-height: 40px;max-width: 40px;" v-if="preview.url">
								<img src="../assets/images/app/file.png" height="40" v-else>
							</div>
							<img src="../assets/images/app/close.png" height="20" class="options" @click="previews.splice(previewIndex, 1)">
						</div>
						<div class="ellipsis">{{ preview.name }}</div>
					</div>
				</div>
				<div class="row">
					<div class="row w-20" v-if="editable">
						<div class="row options padding4 x-center y-center closebutton" @click="closeEditable()">
							<img src="../assets/images/app/close.png" height="20">
						</div>
						<!-- <div class="row">
							<Option :menus="[{ name: 'Viewable', condition: true }]" width="20"></Option>
						</div> -->
					</div>
					<div class="w-flex row optionList y-center x-right" :class="{ notEditable: !editable }">
						<div class="row options snetUpload file" v-if="(single && !fileAdded) || !single">
							<input type="file" @change="selectUpload" class="input" v-if="single">
							<input type="file" @change="selectUpload" class="input" multiple v-else>
						</div>
						<div class="row options snetUpload image" v-if="(single && !fileAdded) || !single">
							<input type="file" @change="selectUpload" class="input" accept="image/*" v-if="single">
							<input type="file" @change="selectUpload" class="input" accept="image/*" multiple v-else>
						</div>
						<button class="share snetButton margin4" :class="{ disabled: !valid || (required && !ideaInput && previews.length === 0) }" @click="share()" v-if="editable">{{ buttonText || 'Share' }}</button>
					</div>
				</div>
			</div>
		</div>
		<div class="emoji hide-sm hide-xs" v-if="editable && !noEmoji">
			<emoji-picker @emoji="insert" :search="search" style="position: relative;">
				<div class="options emoji-invoker button row y-center x-center" slot="emoji-invoker" slot-scope="{ events }" v-on="events">
					<div class="row x-center y-center">😄</div>
				</div>
				<div slot="emoji-picker" slot-scope="{ emojis, insert, display }" class="list shadow-30">
					<div>
						<div class="row x-center y-center">
							<input type="text" v-model="search">
						</div>
						<div>
							<div v-for="(emojiGroup, category) in emojis" :key="category">
								<div class="category">{{ category === 'Frequently used' ? 'Popular' : category }}</div>
								<div class="row wrap">
									<span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" @click="insert(emoji)" :title="emojiName" class="options padding8 icon">{{ emoji }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</emoji-picker>
		</div>
	</div>
</template>
<script>
	import { BASEURL } from '../constants';
	import Option from './Option.vue';

	export default {
		name: 'ideainput',
		props: {
			idea: String,
			placeholder: String,
			buttonText: String,
			open: Boolean,
			single: Boolean,
			required: Boolean,
			valid: Boolean,
			noEmoji: Boolean
		},
		components: {
			Option
		},
		data() {
			return {
				ideaInput: this.idea || '',
				search: '',
				previews: [],
				editable: this.open || false,
				fileAdded: false
			}
		},
		methods: {
			insert(emoji) {
				this.ideaInput += emoji;
			},
			share() {
				var formData = new FormData(),
					opts = {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					},
					idea = {
						text: this.ideaInput
					};
				if (this.previews.length > 0) {
					for (var i = 0; i < this.previews.length; i++) {
						formData.append('file', this.previews[i].file);
					}
					this.$http.post(BASEURL + 'ctrl/file', formData, opts)
						.then(response => {
							idea.files = response.body;
							this.$emit('share', idea);
							this.closeEditable();
						})
				} else {
					this.$emit('share', idea);
					this.closeEditable();
				}
			},
			selectUpload(input) {
				var reader = new FileReader(),
					vm = this,
					index = 0;

				this.editable = true;

				reader.onload = function(e) {
					if (input.target.files[index].type.includes('image')) {
						vm.previews.push({ url: e.target.result, file: input.target.files[index], name: input.target.files[index].name });
					} else {
						vm.previews.push({ local: true, file: input.target.files[index], name: input.target.files[index].name });
					}
					if (input.target.files[index + 1]) {
						index ++;
						reader.readAsDataURL(input.target.files[index]);
					} 
				}

				if (this.single) {
					this.fileAdded = true;
				}
				reader.readAsDataURL(input.target.files[index]);
			},
			triggerUpload(event) {
				var uploadElement = event.srcElement.querySelector('#upload');
				uploadElement.focus();
			},
			closeEditable() {
				this.previews = [];
				this.editable = false;
				this.ideaInput = '';
				this.$emit('close');
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ideainput {
		position: relative;
		font-family: "Helvetica Neue","Helvetica","Arial",sans-serif !important;
		font-style: normal;
		color: black;
		margin-bottom: 25px;
		max-width: 550px;
		width: 100%;

		.areaNotEditable {
			max-height: 30px;
			padding-top: 15px;
		}

		.preview {
			border: 1px solid grey;
			z-index: 4;
			background-color: white;
		}

		.bottom {
			border-radius: 5px;
			background-color: rgba(255, 255, 255, 0.5);
		}

		.optionList {

			&.notEditable {
				position: absolute;
				right: 0;
				margin-top: -37px;
			}

			.snetUpload {
				height: 25px;
				
				&.file {
					background-image: url('../assets/images/app/file.png');
				}

				&.image {
					background-image: url('../assets/images/app/imageUpload.png');
				}
			}
		}

		.emoji {

			.button {
				width: 32px;
				height: 28px;
				position: absolute;
				// z-index: 3;
				margin-top: -30px;
				margin-left: 32px;
			}

			.list {
				height: 200px;
				width: 250px;
				overflow-y: auto;
				position: absolute;
				background-color: white;
				z-index: 6;
				border-radius: 2px;

				.category {
					padding: 10px;
				}

				.icon {
					// font-family: "Helvetica Neue","Helvetica","Arial",sans-serif !important;
				}
			}
		}

		.input {
			border-radius: 5px;
			resize: none;
			font-family: "Helvetica Neue","Helvetica","Arial",sans-serif;
			padding: 5px;
			background-image: linear-gradient(#F2F2F2, white, white, white);

			&:focus {
				outline: none;
			}
		}
		
		.share {
			z-index: 3;
			padding: 4px 8px;
		}
	}

	@media only screen and (min-width: 960px) {
		.bottom {
			// margin-top: -17.5px;

			.preview {
				height: 75px;
			}

			.optionList {
				height: 30px;
			}

			.snetUpload {
				width: 40px;
			}
		}
	}

	@media only screen and (max-width: 959px) {
		.ideainput {
			margin-bottom: 40px;
			margin-left: 5px;
			margin-right: 5px;
		}

		.input {
			font-size: 16px !important;
		}

		.optionList {
			height: 40px;
		}

		.snetUpload {
			width: 60px;
		}

		.closebutton {
			width: 60px;
		}
	}
</style>
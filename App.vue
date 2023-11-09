<template class="height100n">
	<router-view></router-view>
</template>
<script>
export default {
	name: 'app'
}
</script>
<style lang="scss">
/* General CSS */
* {
	font-size: 13px;
	text-shadow: 0 0 0.5px #000000;
	line-height: normal;
}

::-webkit-scrollbar {
	background: linear-gradient(to right, #BDBDBD, #F2F2F2);
	width: 16px;
	height: 15px;
	border: 1px solid grey;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(to right, #F2F2F2, #BDBDBD);
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
	border-radius: 6px;
	border-left: 2px solid grey;
	border-right: 2px solid grey;
}

::-webkit-scrollbar-thumb:active {
	background: linear-gradient(to right, #BDBDBD, #F2F2F2);
}

::-webkit-scrollbar-button {
	background: linear-gradient(to right, lightgrey, #BDBDBD);
	border-left: 1px solid grey;
	border-right: 1px solid grey;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
}

@font-face {
	font-family: chalk;
	src: url('assets/fonts/chawp/chawp.ttf');
}

@font-face {
	font-family: snetComic;
	src: url('assets/fonts/comic.ttf');
}

@font-face {
	font-family: emoji;
	src: url('assets/fonts/emojione-android.ttf');
}

body {
	font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
	margin: 0;
}

/* End General CSS */

/* Layout CSS */
.row {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	box-sizing: border-box;
}

.column {
	display: flex;
	flex-direction: column;
}

.border-box {
	box-sizing: border-box;
}

.w-flex {
	flex: 1 1;
}

@for $i from 1 through 20 {
	$width: percentage($i*5/100);

	.w-#{$i*5} {
		width: $width;
	}
}

$xs:(xs, 0px, 599px);
$sm:(sm, 600px, 959px);
$md:(md, 960px, 1279px);
$lg:(lg, 1280px, 1919px);
$xl:(xl, 1920px, 4000px);

$breakpoints: ($xs, $sm, $md, $lg, $xl);

@each $breakpoint in $breakpoints {
	$point: nth($breakpoint, 1);
	$min: nth($breakpoint, 2);
	$max: nth($breakpoint, 3);

	@media screen and (min-width: $min) and (max-width: $max) {
		.hide-#{$point} {
			display: none;
		}

		.row-#{$point} {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			box-sizing: border-box;
		}

		.w-flex-#{$point} {
			flex: 1 1;
		}

		@for $i from 1 through 20 {
			$width: percentage($i*5/100);

			.w-#{$i*5}-#{$point} {
				width: $width;
			}
		}

		.shadow-15-#{$point} {
			box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
		}
	}
}

.wrap {
	flex-wrap: wrap;
}

.hide {
	display: none;
}

.x-left {
	justify-content: flex-start;
}

.x-center {
	justify-content: center;
	text-align: center;
}

.x-right {
	justify-content: flex-end;
}

.y-top {
	align-items: flex-start;
}

.y-center {
	align-items: center;
}

.y-bottom {
	align-items: flex-end;
}

.absolute-right {
	position: absolute;
	right: 0;
}

.layout-padding8 {

	&>div,
	&>b,
	&>button,
	&>a,
	&>input {
		padding: 8px;
	}
}

.layout-padding4 {

	&>div,
	&>b,
	&>button,
	&>a,
	&>input {
		padding: 4px;
	}
}

.layout-margin8 {

	&>div,
	&>b,
	&>button,
	&>a,
	&>input {
		margin: 8px;
	}
}

.layout-margin4 {

	&>div,
	&>b,
	&>button,
	&>a,
	&>input {
		margin: 4px;
	}
}

.padding8 {
	padding: 8px;
}

.padding4 {
	padding: 4px;
}

.margin8 {
	margin: 8px;
}

.margin4 {
	margin: 4px;
}

/* End Layout CSS */

/* SNET CSS */
.pointCount {
	// position: absolute;
	// z-index: 5;
	top: 0;
	right: 20px;
	background-image: url('assets/images/idea/point.png');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	color: blue;
	text-shadow: 0 0 0 transparent;

	div {
		transform: rotate(-10deg);
	}
}

.copybook {
	font-family: snetComic;

	.line {
		padding-left: 30px;
		border-bottom: 1px solid lightblue;

		.content {
			border-left: 1px solid #F5A9A9;

			&:not(.subTitle) {
				height: 22px;
				padding-left: 5px;
			}

			&.subTitle {
				height: 40px;
			}
		}
	}
}

.options {
	cursor: pointer;
	color: black;
	text-decoration: none;
	outline: none;

	a {
		text-decoration: none;
		color: inherit;
	}

	&:hover,
	&.hover {
		// color: #FAFAFA;
		// box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
		background-image: linear-gradient(#95CAFF, #3198ff);
		text-decoration: none !important;
		border-radius: 2px;

		a {
			text-decoration: none !important;
		}
	}

	&.raised {
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
		border-radius: 3px;
	}
}

.dropDownMenu {
	width: 200px;
	position: absolute;
	z-index: 5;
	top: 0;
	// right: 0;
	background-color: white;
}

.formError {
	font-size: 10px;
	color: red;
}

.modal {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.5);
	top: 0;
	left: 0;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	text-align: center;

	.content {
		background-image: linear-gradient(white, lightgrey);
		min-width: 200px;
		height: 100px;
		margin-top: 50px;
		border-radius: 5px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 0px 30px 0px rgb(0, 0, 0);
		animation: modalAppear 0.3s;
	}

	@keyframes modalAppear {
		from {
			margin-top: -100px;
		}

		to {
			margin-top: 50px;
		}
	}
}

.paper {
	background-color: white;
	background-image: radial-gradient(white, white, white, #F2F2F2);
}

.snetButton {
	border-radius: 4px;
	border: 1px solid lightgrey;
	min-width: 100px;
	min-height: 25px;
	background: grey;
	cursor: pointer;
	outline: none;

	&:not(.sub) {
		color: #FAFAFA;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
		background-image: linear-gradient(#7dbaf6, #3198ff, #067fff);
		text-shadow: 0 0 0.5px rgba(255, 255, 255, 0.7);
	}

	&.sub {
		background-image: linear-gradient(#FAFAFA, #BDBDBD);
		box-shadow: none;
		color: black;

		&:hover {
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
		}

		&:active {
			background-image: linear-gradient(#D8D8D8, #F2F2F2);
		}
	}

	&:hover:not(.disabled):not(.sub) {
		box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.35);
	}

	&:active {
		background-image: linear-gradient(#067fff, #3198ff, #7dbaf6);
	}
}

.snetInput {
	border: 1px solid lightgrey;
	padding: 5px;
	min-width: 200px;
	border-radius: 3px;
	background-image: linear-gradient(#F2F2F2, white);

	&:focus {
		outline: none;
	}

	&.error {
		border-color: red;
	}
}

.snetUpload {
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	overflow: hidden;

	.input {
		opacity: 0;
	}
}

/* End SNET CSS */

/* Specific CSS */
.bg-lightgrey {
	background-color: #F2F2F2;
}

.border1black {
	border: 1px solid black;
}

.borderRadius5 {
	border-radius: 5px;
}

.capitalize {
	text-transform: capitalize;
}

.disabled {
	opacity: 0.5;
	cursor: normal;
	pointer-events: none;
}

.divider {
	height: 1px;
	background-color: lightgrey;
}

.divider-black {
	height: 1px;
	background-color: black;
}

.editable:hover {
	background-color: rgba(255, 255, 255, 0.1);
	cursor: text;
	box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
}

.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.fcRed {
	color: red;
}

.fs18 {
	font-size: 18px;
}

.fs24 {
	font-size: 24px;
}

.fwBold {
	font-weight: bold;
}

.imgRotation {
	transform: rotate(-5deg);
}

.height30 {
	height: 30px;
}

.height100n {
	height: 100% !important;
}

.marginTopBottom5 {
	margin-top: 5px;
	margin-bottom: 5px;
}

.opacity-80 {
	opacity: 0.8;
}

.relative {
	position: relative;
}

.absolute {
	position: absolute;
}

.snet-container {
	max-width: 1000px;
	margin: 0 auto;
}

.time {
	font-size: 10px;
	// color: grey;
}

.time-small {
	font-size: 8px;
	// color: grey;
}

.scrollable-x {
	overflow-x: auto;
	overflow-y: hidden;
}

.scrollable-y {
	overflow-y: auto;
	overflow-x: hidden;
}

.scrollable-xy {
	overflow-x: auto;
	overflow-y: auto;
}

.scrollable-hidden {
	overflow: hidden;
}

.shadow-60 {
	box-shadow: 0px 0px 30px 0px rgb(0, 0, 0);
}

.shadow-30 {
	box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
}

.shadow-15 {
	box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
}

@media only screen and (min-width: 960px) {
	.options {
		&:hover {
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
		}
	}
}

@media only screen and (max-width: 959px) {
	.options {
		min-height: 40px;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);

		&:active,
		&:hover {
			box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 0.3);
		}
	}

	.snetInput {
		height: 30px;
		font-size: 16px;
	}

	.snetButton {
		height: 35px;
	}

	* {
		font-size: 14px;
		text-shadow: 0 0 0.3px rgba(0, 0, 0, 0.5);
	}
}

/* End Specific CSS */
</style>
<template>
    <div class="">
        <img :src="BASEURL + 'ctrl/file/' + imgId" :class="imgClass" v-if="imgId">
        <img :src="require('../' + imgUrl)" :class="imgClass" v-else-if="imgUrl">
        <img src="../assets/images/app/default.jpeg" :class="imgClass" v-else>
	</div>
</template>
<script>
import { BASEURL } from '../constants';

export default {
    name: 'MyImage',
    props: {
        imgId: String,
        imgUrl: String,
        where: String
    },
    data() {
        return {
            imgClass: {},
            BASEURL: BASEURL
        }
    },
    created() {
        if (this.where) {
            this.imgClass[this.where] = true;
        } else {
            this.imgClass.ideaImg = true;
        }
        this.imgClass['photoContainer imgRotation'] = this.where !== 'ideaWhatImg';
        this.imgClass['photoContainerWhat'] = this.where === 'ideaWhatImg';
        
    }
}
</script>
<style scoped>
    .ideaImg {
        max-height: 50px;
        max-width: 50px;
    }

    .sideBarImg {
        max-height: 25px;
        max-width: 25px;
    }

    .miniImg {
        max-height: 15px;
        max-width: 15px;
    }

    .greenboardImg {
        max-height: 100px;
        max-width: 90px;
    }

    .ideaWhatImg {
        max-height: 300px;
        max-width: 300px;
    }

    .photoContainer {
        margin: -10px 10px -10px 3px;
        padding: 3px;
        box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.7);
        background-color: white;
    }

    .photoContainerWhat {
        padding: 10px;
        box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.9);
        background-color: white;
    }
</style>
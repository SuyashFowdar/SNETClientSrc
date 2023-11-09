<template>
    <div class="greenboard row x-center">
        <div class="content row" id="myPageGreenboardInput">
            <div class="column x-top y-center w-flex" :class="{ editable: user.mine }" @click="user.mine && editIdeaOfTheDay()" v-if="!ideaOfTheDayEditable">
                <div style="font-size:30px;">"{{ user.ideaOfTheDay || '...' }}"</div>
                <div style="font-size: 12px;" v-if="user.byWhom" class="row w-100 x-left">{{ user.byWhom }}</div>
            </div>
            <div v-else class="column x-left y-center w-flex">
                <IdeaInput :share="shareIdeaOfTheDay" :idea="user.ideaOfTheDay" @close="ideaOfTheDayEditable = false;" :open="true"></IdeaInput>
                <!-- <div class="row x-center y-top options padding4" @click="cancelIdeaOfTheDay">Cancel</div> -->
            </div>
            <div class="column x-center y-center border-box w-25" v-if="user.name">
                <div class="row">
                    <div>
                        <div class="row x-center y-center">
                            <img src="../assets/images/app/bluepin.png" class="bluepin">
						</div>
                            <!-- <img src="../assets/images/app/portrait.jpg" class="image"> -->
                            <MyImage :imgId="user.myImage" where="greenboardImg"></MyImage>
                        </div>
                    </div>
                    <div class="row x-center y-center w-flex name">
                        {{ user.name }}
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import IdeaInput from './IdeaInput.vue';
import MyImage from './MyImage.vue';
import { BASEURL } from '../constants';

export default {
    name: 'greenboard',
    components: {
        IdeaInput,
        MyImage
    },
    props: {
        user: Object
    },
    data() {
        return {
            ideaOfTheDayEditable: false
        }
    },
    methods: {
        editIdeaOfTheDay() {
            this.ideaOfTheDayEditable = true;
            setTimeout(function() {
                var myPageGreenboardInput = document.querySelector('#myPageGreenboardInput');
                var ideaInput = myPageGreenboardInput.querySelector('#ideaInput');
                ideaInput.focus();
                ideaInput.select();
            }, 100);
        },
        cancelIdeaOfTheDay() {
            this.ideaOfTheDayEditable = false;
        },
        shareIdeaOfTheDay(idea) {
            this.$http.put(BASEURL + 'schema/users/' + this.user.id, { ideaOfTheDay: idea })
                .then(response => {
                    this.user.ideaOfTheDay = response.body.ideaOfTheDay;
                    this.ideaOfTheDayEditable = false;
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.greenboard {
    background-color: #8A4B08;
    box-shadow: inset 0px 0px 15px 2px rgba(0, 0, 0, 1), 0px 0px 15px 0px rgba(0, 0, 0, 0.7);
    min-height: 200px;
    max-width: 100%;
    border-radius: 0 0 3px 3px;

    .content {
        width: calc(100% - 30px);
        margin-bottom: 15px;
        min-height: 185px;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 1), inset 0px 0px 10px 0px rgba(0, 0, 0, 1);
        background-image: radial-gradient(#088A29, #0B6121, #0B3B17);
        border-radius: 2px;
        padding: 20px 40px;
        font-family: chalk;
        color: white;
        font-style: italic;

        .bluepin {
            width: 20px;
            position: absolute;
            margin-top: -5px;
            z-index: 1;
        }

        .name {
            margin-top: 10px;
            font-size: 16px;
            text-align: center;
        }
    }
}
</style>
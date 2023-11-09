<template>
    <div class="w-flex">
        <div class="x-center padding8 title">{{ subject.name }}</div>
        <div v-if="user.userType === 'student'">
            <Homework :timetable="subject.week" :subjects="[{ homeworks: subject.homeworks}]"></Homework>
        </div>
        <div class="w-flex row timetable shadow-15" v-else-if="user.userType === 'teacher'">
            <div v-for="day in weekDays" class="w-flex shadow-15" :key="day.id">
                <div class="w-flex x-center y-center fwBold padding4">
                    {{ day }}
                </div>
                <div class="divider"></div>
                <div v-if="subject.week">
                    <div v-for="(period, index) in subject.week[day]" :key="period.id">
                        <div class="padding4">{{ period.className }}</div>
                        <div class="divider" v-if="index == 2 || index == 5"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="shadow-15 w-flex layout-padding8 margin8 relative borderRadius5" v-if="(subject.notes && subject.notes.length > 0) || user.userType === 'teacher'">
            <div v-if="addNotes" class="y-center layout-margin8 column">
                <div class="row w-100 x-center">
                    <input type="text" v-model="newNotes.name" placeholder="Name" class="snetInput w-85">
                </div>
                <div class="row w-85" v-if="classes.length > 0">
                    <div class="row y-center">Viewable by: </div>
                    <div class="row">
                        <Check :items="classes" v-model="newNotes.viewableBy" />
                    </div>
                </div>
                <IdeaInput placeholder="Description" buttonText="Update notes" :valid="newNotes.name ? true : false" :required="newNotes.file ? false : true" :open="true" :single="true" :noEmoji="true" @close="addNotes = false;" @share="saveNotes($event)"></IdeaInput>
            </div>
            <div v-else-if="viewNotes">
                <b class="row w-100 x-center margin8">{{ newNotes.name }}</b>
                <div class="row w-100 y-center margin8">{{ newNotes.description }}</div>
                <div class="row w-100 y-center margin8" v-if="user.userType === 'teacher'"> Viewable By: {{ newNotes.viewableBy.toString() }}</div>
                <div class="margin8" v-if="newNotes.file">
                    <FileView :files="[newNotes.file]"></FileView>
                    <!-- <img src="../assets/images/app/file.png" height="40" class="options"> -->
                </div>
                <div class="layout-margin8 x-center row">
                    <button class="snetButton" @click="newNotes = { viewableBy: [] }; viewNotes = false;">Done</button>
                </div>
            </div>
            <div v-else>
                <button class="snetButton sub absolute-right addNote" @click="castClasses();addNotes = true;" v-if="user.userType === 'teacher'">Add Notes</button>
                <b class="row w-100 x-center margin8">Notes</b>
                <div class="row notes" v-for="(notes, noteIndex) in subject.notes" :key="notes.id">
                    <div class="options row y-center w-flex padding8" @click="newNotes = notes; viewNotes = true;">{{ notes.name }}</div>
                    <div class="edit w-20 row" v-if="user.userType === 'teacher'">
                        <div class="options w-flex row x-center y-center padding8" @click="castClasses();newNotes = notes; addNotes = true;">Edit</div>
                        <div class="options w-flex row x-center y-center padding8" @click="modal = { delete : { notes, noteIndex } }">Delete</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="shadow-15 w-flex padding8 margin8 column borderRadius5">
            <b class="row w-100 x-center">Past papers</b>
            <b class="padding4">May / June 2018</b>
            <a href="https://pastpapers.papacambridge.com/view.php?id=Cambridge%20International%20Examinations%20%28CIE%29/AS%20and%20A%20Level/Mathematics%20%289709%29/2018-May-June/9709_s18_qp_11.pdf" target="_blank" class="padding8 options row y-center">Paper 1: Question paper</a>
            <div class="padding8 options row y-center">Paper 1: Mark Scheme</div>
            <b class="padding4">October / November 2017</b>
            <div class="padding8 options row y-center">Paper 1: Question paper</div>
            <div class="padding8 options row y-center">Paper 1: Mark Scheme</div>
        </div>
        <div class="modal" v-if="modal">
            <div class="content" v-if="modal.delete">
                <div class="row w-flex y-center x-center">Are you sure you want to delete?</div>
                <div class="w-flex row y-bottom layout-margin8">
                    <button class="snetButton sub" @click="modal = false;">Cancel</button>
                    <button class="snetButton" @click="deleteNotes(modal.delete.notes, modal.delete.noteIndex); modal = false;">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { BASEURL } from '../constants.js'
import Homework from '../components/Homework.vue';
import IdeaInput from '../components/IdeaInput.vue';
import FileView from '../components/FileView.vue';
import Check from '../components/Check.vue';

export default {
    name: 'subject',
    components: {
        Homework,
        FileView,
        IdeaInput,
        Check
    },
    data() {
        return {
            subject: {},
            weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            addNotes: false,
            viewNotes: false,
            newNotes: {
                viewableBy: []
            },
            classes: [],
            modal: false
        }
    },
    computed: {
        user() {
            return this.$store.getters.getUser;
        }
    },
    created() {
        this.getSubject(this.$route.params.id);
    },
    methods: {
        getSubject(id) {
            this.$http.get(BASEURL + 'ctrl/subject/' + id)
                .then(response => {
                    this.subject = response.body;
                })
                .catch(() => {
                    this.$router.push({ name: 'Error', query: { sess: 'on' } });
                })
        },
        castClasses() {
            var vm = this;
            if (vm.classes.length === 0) {
                for (var i = 0; i < vm.weekDays.length; i++) {
                    for (var j = 0; j < vm.subject.week[vm.weekDays[i]].length; j++) {
                        addToClasses(vm.subject.week[vm.weekDays[i]][j].className);
                    }
                }
            }

            function addToClasses(className) {
                var hasClass;
                for (var i = 0; i < vm.classes.length; i++) {
                    if (vm.classes[i].value === className) {
                        hasClass = true;
                    }
                }
                if (!hasClass) {
                    vm.classes.push({ value: className, selected: false });
                }
            }
        },
        getRank(number) {
            if (number === 1) {
                return 'st';
            } else if (number === 2) {
                return 'nd';
            } else if (number === 3) {
                return 'rd';
            } else {
                return 'th';
            }
        },
        saveNotes(what) {
            this.newNotes.description = what.text;
            if (what.files) {
                this.newNotes.file = what.files[0];
            }
            this.$http.post(BASEURL + 'ctrl/subject/notes/' + this.$route.params.id, this.newNotes)
                .then(response => {
                    if (!this.newNotes._id) {
                        this.newNotes._id = response.body._id;
                        if (this.subject.notes) {
                            this.subject.notes.push(this.newNotes);
                        } else {
                            this.subject.notes = [this.newNotes];
                        }
                    }
                    this.newNotes = { viewableBy: [] };
                })
        },
        deleteNotes(notes, index) {
            this.$http.delete(BASEURL + 'ctrl/subject/notes/' + this.$route.params.id + '/' + notes._id)
                .then(() => {
                    this.subject.notes.splice(index, 1);
                })
        }
    },
    watch: {
        '$route'(to) {
            this.getSubject(to.params.id);
        }
    }
}
</script>
<style lang="scss" scoped>
.title {
    font-weight: bold;
    font-size: 18px;
}

.addNote {
    margin-right: 8px;
}

.notes {
    .edit {
        opacity: 0;
    }

    &:hover {
        .edit {
            opacity: 1;
        }
    }
}
</style>
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Board from './views/Board.vue'
import MyPage from './views/MyPage.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import School from './views/School.vue'
import SchoolTab from './views/SchoolTab.vue'
import Class from './views/Class.vue'
import Subject from './views/Subject.vue'
import UserList from './views/UserList.vue'
import SearchResults from './views/SearchResults.vue'
import InfoEdit from './views/InfoEdit.vue'
import Settings from './views/Settings.vue'
import Message from './views/Message.vue'
import Marks from './views/Marks.vue'
import Idea from './views/Idea.vue'
import ErrorVue from './views/Error.vue'
import Power from './views/Power.vue'
import SchoolSettings from './views/SchoolSettings.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'home',
        component: localStorage.token ? Home : Login,
        children: [{
            path: '/board',
            name: 'board',
            component: Board
        }, {
            path: '/mypage/:id',
            name: 'mypage',
            component: MyPage
        }, {
            path: '/search/:search',
            name: 'searchresult',
            component: SearchResults
        }, {
            path: '/class',
            name: 'class',
            component: Class
        }, {
            path: '/subject/:id',
            name: 'subject',
            component: Subject
        }, {
            path: '/list/:userType',
            name: 'userlist',
            component: UserList
        }, {
            path: '/editinfo',
            name: 'InfoEdit',
            component: InfoEdit
        }, {
            path: '/settings',
            name: 'Settings',
            component: Settings
        }, {
            path: '/message/:id',
            name: 'Message',
            component: Message
        }, {
            path: '/marks/:classId',
            name: 'Marks',
            component: Marks
        }, {
            path: '/idea/:ideaId/:whereType/:whereId',
            name: 'Idea',
            component: Idea
        }, {
            path: '/schoolsettings',
            name: 'SchoolSettings',
            component: SchoolSettings
        }],
        redirect: '/board'
    }, {
        path: '/register/:userCode',
        name: 'Register',
        component: Register
    }, {
        path: '/power',
        name: 'Power',
        component: localStorage.token ? Power : ErrorVue
    }, {
        path: '/error',
        name: 'Error',
        component: ErrorVue
    }, {
        path: '/1901powera',
        name: 'Powera',
        component: ErrorVue
    }, {
        path: '/:id',
        name: 'school',
        component: School,
        children: [{
            path: '/:id/:tab',
            name: 'schooltab',
            component: SchoolTab
        }]
    }]
})
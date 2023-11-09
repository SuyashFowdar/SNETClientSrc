import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {},
		dates: [],
		months: [],
		years: [],
		yearsNext: []
	},
	getters: {
		getUser(state) {
			return state.user;
		},
		getDates(state) {
			var thisYear = new Date().getFullYear(),
				months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				i;
			if (state.dates.length === 0) {
				for (i = 0; i < 31; i++) {
					state.dates.push({ value: i + 1 });
				}
				for (i = 0; i < 12; i++) {
					state.months.push({ value: months[i] });
				}
				for (i = 1900; i <= thisYear; i++) {
					state.years.unshift({ value: i });
				}
				state.yearsNext = [{ value: thisYear }, { value: thisYear + 1 }];
			}
			return {
				dates: state.dates,
				months: state.months,
				years: state.years,
				yearsNext: state.yearsNext
			}
		}
	},
	mutations: {
		updateUser(state, user) {
			state.user = user;
		}
	},
	actions: {

	}
})
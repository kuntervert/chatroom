import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		LOGIN(state, user) {
			state.user = user;
		},
		LOGOUT(state) {
			state.user = null;
		}
	},
	actions: {
		async login({ commit }, userInfo) {
			const user = userInfo;
			commit('LOGIN', user);
		},
		logout({ commit }) {
			commit('LOGOUT');
		}
	},
	getters: {
		userData(state) {
			return state.user.userId;
		}
	}
});
export default store;

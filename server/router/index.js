import Vue from 'vue';
import Router from 'vue-router';
import store from '../../src/store';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'login',
			component: () => import('../../src/components/Login.vue')
		},
		{
			path: '/chat',
			name: 'chat',
			component: () => import('../../src/components/Chat.vue'),
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '*',
			name: 'notFound',
			component: () => import('../../src/components/NotFound.vue')
		}
	]
});

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (store.state.user) {
			next();
		} else {
			next('/');
		}
	} else {
		next();
	}
});

export default router;

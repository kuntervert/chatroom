// src/plugins/vuetify.js

import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
	theme: {
		dark: false,
		themes: {
			dark: {
				primary: '#FA98CB'
			},
			light: {
				primary: '#D5AAFC'
			}
		}
	}
});

export default vuetify;

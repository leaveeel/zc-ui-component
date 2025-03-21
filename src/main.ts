import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import { loadingDirective } from './packages'


createApp(App).directive('loading', loadingDirective).mount('#app')
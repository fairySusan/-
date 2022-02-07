import App from "./App.js";
import {createApp} from './reactivity/index.js'

const app = createApp(App)
app.mount(document.querySelector('#app'))
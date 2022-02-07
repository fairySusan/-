import {reactive} from './reactivity/reactive.js'
import {h} from './reactivity/h.js'

const App = {
  render(context) {
    return h('div', {
      class: 'red',
      id: 'redDiv'
    }, String(context.state.count))
  },
  setup() {
    const state = reactive({
      count: 0
    })

    window.state = state


    return {
      state
    }
  }
}

export default App
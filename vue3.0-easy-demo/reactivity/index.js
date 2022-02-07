import {watchEffect} from './reactive.js'
import {mountElement, diff} from './renderer.js'
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup()
      let isMounted = false
      let preSubTree  
      watchEffect(() => {
        const subTree = rootComponent.render(context)
        if (!isMounted) {
          mountElement(subTree, rootContainer)
          preSubTree = subTree
          isMounted = true
        } else {
          diff(preSubTree, subTree)
          preSubTree = subTree
        }
      })
    }
  }
}
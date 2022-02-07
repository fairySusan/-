/* n1：老节点 n2：新的结点 */
export function diff(n1, n2) {
  const el = n1.el
  // 1. tag
  if (n1.tag !== n2.tag) {
    el.replaceWith(document.createElement(n2.tag))
  } else {
    // 2. props
    // 增、改
    const {props: oldProps} = n1
    const {props: newProps} = n2
    if(newProps && oldProps) {
      Object.keys(newProps).forEach(key => {
        const newValue = newProps[key]
        const oldValue = oldProps[key]
        if (newValue !== oldValue) {
          el.setAttribute(key, newValue)
        }
      })
    }
    // 删
    if (oldProps) {
      Object.keys(oldProps).forEach(key => {
        if (!newProps[key]) {
          el.removeAttribute(key)
        } 
      })
    }
    // 3. children 
    // 1. newChildren === string (oldChildren === string  || oldChildren === Array)
    // 2. newChildren === Array (newChildren === string || newChildren === Array)
    const {children: oldChildren} = n1
    const {children: newChildren} = n2

    if (typeof newChildren === "string") {
      if (typeof oldChildren === 'string') {
        if (newChildren !== oldChildren) {
          el.textContent = n2.children
        }
      } else if (Array.isArray(oldChildren)) {
        el.textContent = n2.children
      }
    } else if(Array.isArray(newChildren)) {
      if (typeof oldChildren === 'string') {
        el.innerText = ''
        mountElement(n2, el)
      } else if (Array.isArray(oldChildren)) {
        // 增删改
        const length = Math.min(newChildren.length, oldChildren.length)

        for (let i = 0; index < length; index++) {
          const newVnode = newChildren[index]
          const oldVnode = oldChildren[index]
          diff(oldVnode, newVnode)
        }

        if (newChildren.length > length) {
          for (let index = length; index < newChildren.length; index++) {
            const newVnode = newChildren[index]
            mountElement(newVnode, el)
          }
        }

        if (oldChildren.length > length) {
          for (let i=0;i< oldChildren.length; i++) {
            oldValue = oldChildren[index]
            oldValue.el.parent.removeChild(oldValue.el)
          }
        }
      }
    }
  }
  // 别忘记这一行
  n2.el = n1.el
}
export function mountElement(vnode, container) {
  const { tag, props, children } = vnode
  const el = document.createElement(tag)
  vnode.el = el

  for (let key in props) {
    el.setAttribute(key, props[key])
  }

  if (typeof children === 'string') {
    el.innerText = children
  } else if (Array.isArray(children)) {
    children.forEach(v => {
      mountElement(v, el)
    })
  }

  container.append(el)
}

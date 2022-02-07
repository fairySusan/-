class Dep {
  deps = [];

  constructor () {}

  addDeps () {
    if (Dep.currentEffect) {
      this.deps.push(Dep.currentEffect)
    }
  }

  notify () {
    this.deps.forEach(dep => {
      dep()
    })
  }
}

Dep.currentEffect = null;

class Ref {
  _value;

  constructor (value) {
    this._value = value
  }

  get value () {
    DepIns.addDeps();
    return this._value;
  }

  set value (value) {
    this._value = value;
    DepIns.notify();
  }
}

function ref (value) {
  return new Ref(value)
}

export function watchEffect (cb) {
  Dep.currentEffect = cb;
  cb();
  Dep.currentEffect = null
}

const DepIns = new Dep()


const targetMap = new Map();

export function reactive (obj) {
  const proxy = new Proxy(obj, {
    set: (target, key, value) => {
      const depMap = targetMap.get(target)
      const dep = depMap.get(key);
     
      // 更改值以后再notify, 很重要
      const result = Reflect.set(target, key, value)
      dep.notify();
      return result
    },
    get: (target, key) => {
      let depsMap = targetMap.get(target)
      if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap)
      }

      let dep = depsMap.get(key);

      if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep)
      }

      dep.addDeps()
      return Reflect.get(target, key)
    }
  })

  return proxy
}


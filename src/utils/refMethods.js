import { unref, toRef } from 'vue'

export const useUnwrapped = refVal => {
  return unref(refVal)
}

export const useWrapped = (state, key) => {
  return toRef(state, key)
}

// isRef
// 检查一个值是否为一个 ref 对象。

// #isProxy
// 检查一个对象是否是由 reactive 或者 readonly 方法创建的代理。

// #isReactive
// 检查一个对象是否是由 reactive 创建的响应式代理。

// 如果这个代理是由 readonly 创建的，但是又被 reactive 创建的另一个代理包裹了一层，那么同样也会返回 true。

// #isReadonly
// 检查一个对象是否是由 readonly 创建的只读代理。

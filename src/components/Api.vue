<template>
  <div @click="click">
    <div>count: {{ count }}</div>
    <div>state.foo: {{ state.foo }}</div>
    <div>otherCount: {{ otherCount }}</div>
    <div>plusOne: {{ plusOne }}</div>
    <div>{{ theme }}</div>
  </div>
  <!-- <slot name="footer">footer</slot> -->
  <div v-for="(item, i) in list" :ref="el => { divs[i] = el }">
    {{ item }}
  </div>
  <input type="text" v-model="text">
</template>

<script>
import { ref, reactive, h, watchEffect, computed, readonly, watch, onMounted, onUpdated, onUnmounted, inject, onBeforeUpdate, toRefs, markRaw, isReactive, shallowReactive, shallowReadonly, shallowRef, toRaw, isReadonly } from 'vue'
import { ThemeSymbol } from '../utils/inject-provide'
import { useUnwrapped, useWrapped } from '../utils/refMethods'
import { useDebouncedRef } from '../utils/debouncedRef'

export default {
  props: {
    name: String
  },
  // 不要解构 props 对象，那样会使其失去响应性
  // setup({ name }, ctx)

  // attrs 和 slots 都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。
  // 所以可以解构，无需担心后面访问到过期的值
  // setup(props, { attrs, slots, emit })
  setup(props, ctx) {
    const count = ref(0)

    const otherCount = ref(2)

    const arr = reactive([ref('arr[0]')])

    const map = reactive(new Map([['foo', ref('map')]]))

    const original = reactive({ count: 0 })

    const copy = readonly(original)

    const theme = inject(ThemeSymbol, ref('light'))

    const data = ref(22222)

    const data2 = reactive({
      data: 333333,
      data2: 24123
    })

    // 在 v-for 中使用 模版ref
    const list = reactive([1, 2, 3])
    const divs = ref([])

    const state = reactive({
      foo: 'foo',
      count
    })

    const text = useDebouncedRef('hello')

    const plusOne = computed({
      get: () => count.value + 1,
      set: val => count.value = val - 1
    })

    // console.log(props.name)
    // console.log(state.count)

    // state.count = 1

    // console.log(count.value)
    
    // 注意如果将一个新的 ref 分配给现有的 ref， 将替换旧的 ref
    // state.count = otherCount
    // console.log(state.count)
    // console.log(count.value)

    // 注意当嵌套在 reactive Object 中时，ref 才会解套。
    // 从 Array 或者 Map 等原生集合类中访问 ref 时，不会自动解套
    // console.log(arr[0].value)
    // console.log(map.get('foo').value)

    // plusOne.value = 10

    onBeforeUpdate(() => {
      console.log(text.value)
      divs.value = []
    })

    const stop = watchEffect((cancel) => {
      // console.log(`theme set to: ${theme.value}`)
      // console.log(divs.value)
      // 清除副作用
      // cancel(() => {
      //   console.log('emmmamsdma')
      // })
      // console.log(ctx.attrs)
      // console.log(ctx.slots)
      // console.log(ctx.emit)
      // console.log(props.name)
      // console.log(copy.count)
      console.log(useUnwrapped(data))
      console.log(useWrapped(data2, 'data').value)
      console.log(toRefs(data2))
    }, {
      // 同步运行 sync
      // 组件更新前执行 pre
      // 默认 post
      flush: 'post',
      // 当一个 reactive 对象属性或一个 ref 作为依赖被追踪时，将调用 onTrack
      // 依赖项变更导致副作用被触发时，将调用 onTrigger
      // onTrack 和 onTrigger 仅在开发模式下生效
      onTrigger(e) {
        // debugger
      },
      onTrack(e) {
        // debugger
      }
    })

    // setTimeout(() => {
    //   // 停止侦听
    //   stop()
    // }, 3000)

    // setTimeout(() => {
    //   original.count++
    // }, 1000)

    original.count++

    // copy.count++

    const click = e => {
      ctx.emit('update', 'asdasdadasd')
    }

    // setTimeout(() => {
    //   count.value += 1
    // }, 500)


    // watch 和 watchEffect 在停止侦听, 清除副作用 (相应地 onInvalidate 会作为回调的第三个参数传入)
    // 副作用刷新时机 和 侦听器调试 等方面行为一致
    // watch(
    //   () => state.count,
    //   (count, prevCount) => {
    //     console.log(count, prevCount)
    //   }
    // )

    // watch(
    //   count,
    //   (count, prevCount) => {
    //     console.log(count, prevCount)
    //   },
    //   // {
    //   //   immediate: false,
    //   //   deep: false
    //   // }
    // )

    // watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {})

    // beforeCreate -> 使用 setup()
    // created -> 使用 setup()
    // beforeMount -> onBeforeMount
    // mounted -> onMounted
    // beforeUpdate -> onBeforeUpdate
    // updated -> onUpdated
    // beforeDestroy -> onBeforeUnmount
    // destroyed -> onUnmounted
    // errorCaptured -> onErrorCaptured

    // onRenderTracked
    // onRenderTriggered
    // 两个钩子函数都接收一个 DebuggerEvent，与 watchEffect 参数选项中的 onTrack 和 onTrigger 类似

    // onMounted(() => {
    //   console.log('mounted!')
    // })
    // onUpdated(() => {
    //   console.log('updated!')
    // })
    // onUnmounted(() => {
    //   console.log('unmounted!')
    // })

    // markRaw
    // 显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身
    const foo = markRaw({})
    console.log(isReactive(reactive(foo)))

    // 如果被 markRaw 标记了，即使在响应式对象中作属性，也依然不是响应式的
    const bar = reactive({ foo })
    console.log(isReactive(bar.foo))

    // shallowReactive
    // 只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样
    const state2 = shallowReactive({
      foo: 1,
      nested: {
        bar: 2,
      },
    })
    // 变更 state 的自有属性是响应式的
    state2.foo++
    // 但不会深层代理
    isReactive(state2.nested) // false
    state2.nested.bar++ // 非响应式

    // shallowReadonly
    // 只为某个对象的自有（第一层）属性创建浅层的只读响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的
    const state3 = shallowReadonly({
      foo: 1,
      nested: {
        bar: 2,
      },
    })
    // 变更 state 的自有属性会失败
    // state3.foo++
    // 但是嵌套的对象是可以变更的
    isReadonly(state3.nested) // false
    state3.nested.bar++ // 嵌套属性依然可修改

    // shallowRef
    // 创建一个 ref ，将会追踪它的 .value 更改操作，但是并不会对变更后的 .value 做响应式代理转换（即变更不会调用 reactive）
    const fff = shallowRef({})
    // 更改对操作会触发响应
    fff.value = {}
    // 但上面新赋的这个对象并不会变为响应式对象
    isReactive(fff.value) // false

    // toRaw
    // 返回由 reactive 或 readonly 方法转换成响应式代理的普通对象。
    // 这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发更改。
    // 不建议一直持有原始对象的引用。请谨慎使用
    const foo2 = {}
    const reactiveFoo2 = reactive(foo2)

    console.log(toRaw(reactiveFoo2) === foo2) // true

    return {
      state,
      count,
      otherCount,
      plusOne,
      click,
      theme,
      list,
      divs,
      text
    }
  }
}
</script>

<style>

</style>
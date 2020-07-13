<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <input type="text" name="" id="" v-model="state.count">
  </div>
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <input type="text" name="name" id="name" v-model="name">
  <Api :name="name" />
  <Flip />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Flip from './components/Flip.vue'
import Api from './components/Api.vue'
import { provideStore } from './utils/store'
import { reactive, ref, provide } from 'vue'

import { ThemeSymbol } from './utils/inject-provide'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Flip,
    Api
  },
  setup() {
    const state = reactive({
      count: 1
    })
    provideStore(state)

    const themeRef = ref('dark')

    provide(ThemeSymbol, themeRef)

    const name = ref('api')

    const update = e => {
      name.value = e
    }

    return {
      state,
      name,
      update
    }
  }
}
</script>

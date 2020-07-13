<template>
  <h1 v-for="i in 3" :key="`${i}`">{{ msg }}</h1>
  <div class="count"></div>
  <button @click="increment">
    Count is: {{ count }}, double is: {{ double }}
  </button>
  <mouse-trace />
</template>

<script>
import { reactive, computed, watchEffect, ref, onMounted } from 'vue'
import MouseTrace from './MouseTrace.vue'

export default {
  name: 'HelloWorld',
  components: {
    MouseTrace
  },
  props: {
    msg: String
  },
  setup() {
    const count = ref(0)

    const state = reactive({
      count: 0,
    })

    let double = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }

    onMounted(() => {
      // console.log('mounted')
    })

    watchEffect(() => {
      // console.log(double.value)
      document.title = count.value
    })

    return {
      count,
      double,
      state,
      increment
    }
  }
}
</script>

<style scoped>
h1 {
  counter-increment: emmm;
}
.count::after {
  content: counter(emmm);
}
</style>

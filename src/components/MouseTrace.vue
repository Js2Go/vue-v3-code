<template>
  <div>
    {{ x }}
  </div>
  <div>
    {{ y }}
  </div>
  <div>
    {{ store.count }}
  </div>
</template>

<script>
import { useMousePos } from '../utils/mouse'
import { useStore } from '../utils/store'

export default {
  name: 'MouseTrace',
  setup() {
    const { x, y } = useMousePos()

    const store = useStore()

    return { x, y, store }
  }
}
</script>

<style>

</style>
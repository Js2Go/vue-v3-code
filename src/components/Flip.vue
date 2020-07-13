<template>
  <div class="action">
    <button @click="add">
      <span v-show="state.adding">下载中...</span>
      <span v-show="!state.adding">追加图片</span>
    </button>
    <button @click="shuffle">乱序图片</button>
    <button @click="reset">重置</button>
  </div>
  <div v-if="state.loading" class="loading">正在加载图片...</div>
  <div v-else class="wrap">
    <div class="img-wrap" v-for="(src, index) in state.imgs" :key="src">
      <img :ref="el => { imgs[index] = el }" class="img" :src="src" alt="">
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect, nextTick, onBeforeUpdate } from 'vue'

import { preload, getRandomInt, shuffleArr, getSisterGenerator } from '../utils/sister'

let initialGetSister = getSisterGenerator()

export default {
  setup() {
    const state = reactive({
      adding: false,
      loading: false,
      getSister: initialGetSister,
      imgs: [],
      imgHeights: [],
      imgsLoaded: false,
      leftImgIndexes: [],
      rightImgIndexes: []
    })

    const imgs = ref([])

    state.loading = true
    const imgs1 = state.getSister()
    preload(imgs1).then(() => {
      state.imgs = imgs1
      state.loading = false
    })

    onBeforeUpdate(() => {
      imgs.value = []
    })

    const add = async () => {
      if (state.adding) {
        return
      }

      state.adding = true
      const newData = state.getSister()
      await preload(newData)
      state.adding = false

      scheduleAnimation(() => {
        state.imgs = newData.concat(state.imgs)
      })
    }

    const shuffle = () => {
      scheduleAnimation(() => {
        state.imgs = shuffleArr(state.imgs)
      })
    }

    const reset = () => {
      state.getSister = getSisterGenerator()
      state.imgs = state.getSister()
    }

    const scheduleAnimation = update => {
      // 获取旧图片的位置
      const prevImgs = imgs.value.slice()
      const prevSrcRectMap = createSrcRectMap(prevImgs)
      // 更新数据
      update()
      // DOM更新后
      nextTick(() => {
        const currentSrcRectMap = createSrcRectMap(prevImgs)
        Object.keys(prevSrcRectMap).forEach((src) => {
          const currentRect = currentSrcRectMap[src]
          const prevRect = prevSrcRectMap[src]

          const invert = {
            left: prevRect.left - currentRect.left,
            top: prevRect.top - currentRect.top,
          }

          const keyframes = [
            {
              transform: `translate(${invert.left}px, ${invert.top}px)`,
            },
            { transform: "translate(0, 0)" },
          ]
          const options = {
            duration: 300,
            easing: "cubic-bezier(0,0,0.32,1)",
          }

          const animation = currentRect.img.animate(keyframes, options)
        })
      })
    }

    const createSrcRectMap = imgs => {
      return imgs.reduce((prev, img) => {
        const rect = img.getBoundingClientRect()
        const { left, top } = rect
        prev[img.src] = { left, top, img }
        return prev
      }, {})
    }

    return {
      state,
      imgs,
      add,
      shuffle,
      reset
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  box-sizing: border-box;
  padding: 0;
}
body {
  max-width: 500px;
  margin: auto;
}
.loading {
  margin: 12px;
  text-align: center;
}
.action {
  margin: 12px;
  text-align: center;
}
.action button {
  margin-right: 8px;
}
.link {
  display: block;
  padding: 8px;
  text-align: center;
  color: red;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  column-count: 4;
}
.img-wrap {
  width: 25%;
  padding: 8px;
}
.img {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
}
.move {
  transition: transform 1s;
}
</style>
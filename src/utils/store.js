import { provide, inject } from 'vue'

const symbolStore = Symbol()

export function provideStore(store) {
  provide(symbolStore, store) 
}

export function useStore() {
  const store = inject(symbolStore)
  if (!store) {
    throw new Error('error')
  }
  return store
}

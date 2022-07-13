import { ChargeItemType } from '@/api/cash/notcharged/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from '../index'

export interface DictState {
  isSetDict: boolean
  dictObj: Recordable
  productList: any
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    isSetDict: false,
    dictObj: {},
    productList: ref<ChargeItemType[]>([])
  }),
  persist: {
    enabled: true
  },
  getters: {
    getDictObj(): Recordable {
      return this.dictObj
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    }
  },
  actions: {
    setDictObj(dictObj: Recordable) {
      this.dictObj = dictObj
    },
    setIsSetDict(isSetDict: boolean) {
      this.isSetDict = isSetDict
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}

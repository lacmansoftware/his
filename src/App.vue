<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const { wsCache } = useCache()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark')) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

setDefaultTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

td,
th {
  padding: 3px 0 !important;
}

.@{elNamespace}-table .cell {
  padding: 0 !important;
}
.@{elNamespace}-table-column--selection {
  text-align: center !important;
}

.tr-primary-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-9) !important;
}

.tr-success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}

.tr-warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9) !important;
}

.tr-danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9) !important;
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>

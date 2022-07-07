import ContextMenu from './src/ContextMenu.vue'
import CustomDropdown from './src/CustomDropdown.vue'
import { ElDropdown } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface ContextMenuExpose {
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>
  tagItem: RouteLocationNormalizedLoaded
}

export { ContextMenu, CustomDropdown }

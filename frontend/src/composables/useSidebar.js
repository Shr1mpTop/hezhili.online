import { ref, watch } from 'vue'

export function useSidebar() {
  const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  watch(isCollapsed, (newValue) => {
    localStorage.setItem('sidebarCollapsed', newValue)
    document.documentElement.setAttribute('data-sidebar-collapsed', newValue)
  }, { immediate: true })

  return {
    isCollapsed,
    toggleSidebar
  }
}
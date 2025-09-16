import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * 响应式窗口尺寸 Hook
 */
export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const updateSize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    width,
    height,
    isMobile: computed(() => width.value < 768),
    isTablet: computed(() => width.value >= 768 && width.value < 1024),
    isDesktop: computed(() => width.value >= 1024)
  }
}

/**
 * 滚动位置 Hook
 */
export function useScroll() {
  const x = ref(0)
  const y = ref(0)
  const isScrolling = ref(false)

  let timeout: number

  const updateScroll = () => {
    x.value = window.scrollX
    y.value = window.scrollY
    isScrolling.value = true

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
    clearTimeout(timeout)
  })

  return {
    x,
    y,
    isScrolling
  }
}

/**
 * 本地存储 Hook
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  // 读取存储值
  const read = () => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        value.value = JSON.parse(item)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }

  // 写入存储值
  const write = () => {
    try {
      localStorage.setItem(key, JSON.stringify(value.value))
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error)
    }
  }

  // 删除存储值
  const remove = () => {
    try {
      localStorage.removeItem(key)
      value.value = defaultValue
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  // 初始化时读取值
  read()

  // 监听值变化并自动保存
  watch(
    value,
    () => write(),
    { deep: true }
  )

  return {
    value,
    read,
    write,
    remove
  }
}

/**
 * 防抖 Hook
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let timeout: number

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T
}

/**
 * 节流 Hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let inThrottle = false

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), delay)
    }
  }) as T
}

/**
 * 暗色模式检测 Hook
 */
export function useDarkMode() {
  const isDark = ref(false)

  const updateDarkMode = (e: MediaQueryListEvent) => {
    isDark.value = e.matches
  }

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    isDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', updateDarkMode)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updateDarkMode)
    })
  })

  return { isDark }
}

/**
 * 异步状态管理 Hook
 */
export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  defaultValue?: T
) {
  const state = ref<T | undefined>(defaultValue)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async () => {
    isLoading.value = true
    error.value = null

    try {
      const result = await asyncFunction()
      state.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    state,
    isLoading,
    error,
    execute
  }
}
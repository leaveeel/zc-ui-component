import { createApp, createVNode, render, DirectiveBinding, Directive } from 'vue'
import Loading from '@/packages/loading/src/index.vue'

interface LoadingElement extends HTMLElement {
  instance: any;
  loadingOptions?: LoadingOptions;
  loadingApp?: any;
}

interface LoadingOptions {
  size?: number | string;
  color?: string;
  text?: string;
  timeout?: number;
  background?: string;
  el?: HTMLElement;
  loading?: boolean;
  [key: string]: any; // 允许使用字符串索引
}

// 全局默认配置
const globalOptions: LoadingOptions = {
  size: 50,
  color: 'var(--main-color)',
  text: '',
  timeout: 0,
  background: 'rgba(255, 255, 255, 0.7)'
}

// 设置全局配置
export const setLoadingDefaultOptions = (options: LoadingOptions) => {
  Object.assign(globalOptions, options)
}

const handleAppend = (el: LoadingElement) => {
  el.appendChild(el.instance.$el)
}

const loadingDirective: Directive = {
  mounted(el: LoadingElement, binding: DirectiveBinding) {
    let loading = false
    let options: LoadingOptions = {}
    
    // 处理绑定值
    if (typeof binding.value === 'boolean') {
      loading = binding.value
    } else if (binding.value && typeof binding.value === 'object') {
      const bindingValue = binding.value as LoadingOptions
      options = { ...bindingValue }
      loading = !!options.loading
    }
    
    // 创建loading实例
    const app = createApp(Loading)
    // 通过provide注入配置
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key) && key !== 'loading') {
        app.provide(`loading-${key}`, options[key])
      }
    }
    el.loadingApp = app
    el.instance = app.mount(document.createElement('div'))
    el.loadingOptions = options
    
    if (getComputedStyle(el).position === 'static' || !getComputedStyle(el).position) {
      el.style.position = 'relative'
    }
    
    if (loading) {
      handleAppend(el)
      el.instance.show()
    }
  },
  
  updated(el: LoadingElement, binding: DirectiveBinding) {
    let loading = false
    let options: LoadingOptions = {}
    
    // 处理最新绑定值
    if (typeof binding.value === 'boolean') {
      loading = binding.value
    } else if (binding.value && typeof binding.value === 'object') {
      const bindingValue = binding.value as LoadingOptions
      options = { ...bindingValue }
      loading = !!options.loading
    }
    
    // 每次更新时动态创建新的实例以确保配置更新
    if (Object.keys(options).length > 0 && el.instance) {
      // 先移除老的实例
      el.instance.$el.remove()
      
      // 创建新的实例
      const app = createApp(Loading)
      // 通过provide注入配置
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key) && key !== 'loading') {
          app.provide(`loading-${key}`, options[key])
        }
      }
      el.loadingApp = app
      el.instance = app.mount(document.createElement('div'))
      el.loadingOptions = options
      
      // 如果需要显示，则重新添加到DOM
      if (loading) {
        handleAppend(el)
        el.instance.show()
      }
    } else {
      // 仅更新loading状态
      const isCurrentlyVisible = !!el.querySelector('.zc-loading')
      
      if (loading && !isCurrentlyVisible) {
        handleAppend(el)
        el.instance.show()
      } else if (!loading && isCurrentlyVisible) {
        el.instance.hide()
      }
    }
  },
  
  unmounted(el: LoadingElement) {
    if (el.instance) {
      el.instance.hide()
    }
  }
}

const useLoading = (options: LoadingOptions = {}) => {
  // 合并全局配置和传入的选项
  const mergedOptions: LoadingOptions = { fullscreen: !options.el, ...globalOptions, ...options}
  const container = document.createElement('div')
  let el = options.el || document.body
  let loadingApp: any = null
  let instance: any = null
  
  const createInstance = () => {
    el.appendChild(container)
    loadingApp = createApp(Loading)
    // 设置配置
    for (const key in mergedOptions) {
      if (Object.prototype.hasOwnProperty.call(mergedOptions, key) && key !== 'el' && key !== 'loading') {
        loadingApp.provide(`loading-${key}`, mergedOptions[key])
      }
    }
    instance = loadingApp.mount(container)
  }
  
  return {
    show: () => {
      if (!instance) {
        createInstance()
      }
      instance.show()
    },
    hide: () => {
      if (instance) {
        instance.hide()
      }
    },
    // 动态更新配置
    updateOptions: (newOptions: LoadingOptions) => {
      Object.assign(mergedOptions, newOptions)
      
      // 如果实例已创建，重新创建实例以更新配置
      if (instance) {
        // 先隐藏当前loading
        instance.hide()
        // 移除当前container
        container.remove()
        // 更新挂载元素
        el = newOptions.el || document.body
        // 重新创建实例
        createInstance()
        // 如果原来是显示的，保持显示
        instance.show()
      }
    }
  }
}

// 全局loading服务
const zcLoading = useLoading()

export { loadingDirective, zcLoading, useLoading }

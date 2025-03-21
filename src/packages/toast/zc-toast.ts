import { zcUIProps } from '@/types/zcUI'
import Toast from '@/packages/toast/src/index.vue'
import { createVNode, render } from 'vue'

// 创建Toast容器
const createToastContainer = (): HTMLDivElement => {
  const container = document.createElement('div')
  container.className = 'zc-toast-container'
  container.style.display = 'grid'
  container.style.gap = '8px'
  container.style.position = 'fixed'
  container.style.top = '0px'
  container.style.left = '50%'
  container.style.zIndex = '999999'
  container.style.transform = 'translateX(-50%)'
  container.style.maxWidth = '60%'
  
  return container
}

// 惰性初始化toast容器
let toastGroup: HTMLDivElement | null = null

const getToastGroup = (): HTMLDivElement => {
  if (!toastGroup) {
    toastGroup = createToastContainer()
    document.body.appendChild(toastGroup)
  }
  return toastGroup
}

// 定义 Toast 类型
type ToastType = 'normal' | 'success' | 'error' | 'warning'

// 定义颜色映射
const TYPE_COLOR_MAP: Record<ToastType, string> = {
  normal: 'var(--main-font-color)',
  success: 'var(--main-success-color)',
  error: 'var(--main-danger-color)',
  warning: 'var(--main-warning-color)'
}

// Toast实例缓存管理
interface ToastInstance {
  id: number;
  container: HTMLDivElement;
  timer: number | null;
}

// Toast实例计数器
let toastIdCounter = 0;

// 活动的Toast实例数组
const activeToasts: ToastInstance[] = [];

// 最大显示数量
const MAX_TOASTS = 5;

// 删除Toast实例
const removeToast = (id: number) => {
  const index = activeToasts.findIndex(item => item.id === id);
  if (index > -1) {
    const instance = activeToasts[index];
    
    // 清除定时器
    if (instance.timer) {
      clearTimeout(instance.timer);
    }
    
    // 移除DOM元素
    if (instance.container.parentNode) {
      instance.container.parentNode.removeChild(instance.container);
    }
    
    // 从活动列表中移除
    activeToasts.splice(index, 1);
  }
};

// 移除所有Toast
const removeAllToasts = () => {
  [...activeToasts].forEach(toast => removeToast(toast.id));
};

// 定义 Toast 函数类型
interface ToastFunction {
  (content: string, options?: Partial<zcUIProps.Toast>): number;
  success(content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>): number;
  error(content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>): number;
  warning(content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>): number;
  normal(content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>): number;
  clear(): void;
}

const createToast = (): ToastFunction => {
  const toast = (content: string, options?: Partial<zcUIProps.Toast>): number => {
    const toastGroup = getToastGroup()
    
    // 管理Toast数量，超过最大数量则移除最早的
    if (activeToasts.length >= MAX_TOASTS) {
      removeToast(activeToasts[0].id);
    }
    
    // 创建新的容器
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    
    toastGroup.appendChild(container)
    
    // 生成唯一ID
    const id = ++toastIdCounter;
    
    const opt = {
      duration: 2000,
      type: 'normal' as ToastType,
      ...options
    }
    
    // 确定颜色
    const color = opt.color || (opt.type ? TYPE_COLOR_MAP[opt.type] : TYPE_COLOR_MAP.normal)
    
    const vnode = createVNode(Toast, {
      message: content,
      duration: opt.duration,
      color,
      container
    })
    
    render(vnode, container)
    
    // 创建实例
    const instance: ToastInstance = {
      id,
      container,
      timer: null
    };
    
    // 添加到活动列表
    activeToasts.push(instance);
    
    // 自动移除
    if (opt.duration !== 0) {
      const actualDuration = (opt.duration && opt.duration > 0) ? opt.duration : 2000
      instance.timer = window.setTimeout(() => {
        removeToast(id);
      }, actualDuration + 300)
    }
    
    return id;
  }
  
  // 添加类型方法
  const typeToast = (type: ToastType) => {
    return (content: string, options?: Omit<Partial<zcUIProps.Toast>, 'type'>) => {
      return toast(content, { ...options, type })
    }
  }
  
  // 为 toast 函数添加各种类型方法
  toast.normal = typeToast('normal')
  toast.success = typeToast('success')
  toast.error = typeToast('error')
  toast.warning = typeToast('warning')
  
  // 添加清除所有Toast的方法
  toast.clear = removeAllToasts;
  
  return toast as ToastFunction
}

const zcToast = createToast()

export { zcToast }

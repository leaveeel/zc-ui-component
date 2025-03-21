import { loadingDirective } from '@/packages/loading/zc-loading.ts'
import { zcUIProps } from '@/types/index'
import MessageBox from '@/packages/messageBox/src/index.vue'
import { createApp, type App, createVNode, render } from 'vue'

/**
 * 创建消息框实例并显示
 */
const useMessage = () => {
  return (options: zcUIProps.MessageBox): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 创建容器元素
      const container = document.createElement('div')
      document.body.appendChild(container)

      // 创建参数对象
      const props = {
        ...options,
        container,
        resolve,
        reject
      }

      // 创建应用实例
      const app = createApp(MessageBox, props)
      app.directive('loading', loadingDirective)

      // 创建虚拟节点
      const vnode = createVNode(MessageBox, props)
      vnode.appContext = app._context

      // 渲染到容器
      render(vnode, container)
    })
  }
}

const zcMessage = useMessage()

export { zcMessage }

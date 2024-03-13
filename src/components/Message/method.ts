import { render, h, shallowReactive } from 'vue'
import type { CreateMessageProps, MessageContext } from './types'
import MessageConstructor from './Message.vue'
import useZIndex from '../../hooks/useZIndex'

let seed = 1 //闭包

const instances: MessageContext[] = shallowReactive([])

export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()
  const id = `message_${seed++}`
  const container = document.createElement('div')
  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onClose: destory,
  }
  const vnode = h(MessageConstructor, newProps)

  render(vnode, container) //插入到页面中去
  document.body.appendChild(container.firstElementChild!)
  const vm = vnode.component! //获取组件实例
  const instance = {
    id, //唯一标识
    vnode, //虚拟节点
    vm, //组件实例
    props: newProps, //组件属性
    destory: manualDestroy, // 手动销毁函数
  }
  instances.push(instance)
  return instance

  function destory() {
    const idx = instances.findIndex((instance) => instance.id === id)
    // 让后面的实例顶上来
    for (let i = idx + 1; i < instances.length; i++) {
      const instance = instances[i]
      // instance.vm.style!.top -= instances[idx].vm.exposed!.bottomOffset.value

      instances[i].vm.exposed!.closeOffset =
        -instances[idx].vm.exposed!.bottomOffset.value
      console.log(
        'instances[i].vm.exposed!.topOffset',
        instances[i].vm.exposed!.topOffset.value
      )
    }
    console.log('idx', idx, instances[idx].vm.exposed!.bottomOffset.value)
    if (idx === -1) return
    instances.splice(idx, 1)

    render(null, container)
  }
  function manualDestroy() {
    //先不用管
    const instance = instances.find((instance) => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false
    }
  }
}

export const getLastInstance = () => {
  return instances.at(-1)
}

export const getLastBottomOffset = (id: string) => {
  // instances发挥作用 ，获取上一个实例的bottomOffset
  const idx = instances.findIndex((instance) => instance.id === id)
  if (idx <= 0) {
    return 0
  } else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}

export const closeAll = () => {
  instances.forEach((instance) => {
    instance.destory()
  })
}

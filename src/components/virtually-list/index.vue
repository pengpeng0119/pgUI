<template>
  <div
    class="virtual-wrap"
    ref="virtualWrap"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
    @scroll="scrollHandle">
    <div
      class="virtual-content"
      :style="{ height: totalEstimatedHeight + 'px' }">
      <list-item
        v-for="(item, index) in showItemList"
        :key="item.dataIndex + index"
        :index="item.dataIndex"
        :data="item.data"
        :style="item.style"
        @onSizeChange="sizeChangeHandle">
        <template #slot-scope="slotProps">
          <slot name="slot-scope" :slotProps="slotProps"></slot>
        </template>
      </list-item>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ListItem from './list-item.vue'
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  height: {
    default: 100,
    type: Number,
  },
  width: {
    default: 100,
    type: Number,
  },
  itemEstimatedSize: {
    default: 50,
    type: Number,
  },
  itemCount: {
    default: 0,
    type: Number,
  },
  data: {
    default: () => [],
    type: Array,
  },
  buffCount: {
    default: 4,
    type: Number,
  },
})

const virtualWrap: any = ref(null)

watch(props.data, () => {
  getCurrentChildren()
})

const sizeChangeHandle = (index: number, domNode: any) => {
  const height = domNode.offsetHeight
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData
  const itemMetaData = measuredDataMap[index]
  itemMetaData.size = height
  let offset = 0
  for (let i = 0; i <= lastMeasuredItemIndex; i++) {
    const itemData = measuredDataMap[i]
    itemData.offset = offset
    offset += itemData.size
  }
}

// 元数据
const measuredData = {
  measuredDataMap: {} as any,
  lastMeasuredItemIndex: -1,
}

const showItemList = ref<any>([])

const getCurrentChildren = () => {
  //重新计算高度
  estimatedHeight(props.itemEstimatedSize, props.itemCount)
  const [startIndex, endIndex] = getRangeToRender(props, scrollOffset.value)
  const items = []
  for (let i = startIndex; i <= endIndex; i++) {
    const item = getItemMetaData(i)
    const itemStyle = {
      position: 'absolute',
      height: item.size + 'px',
      width: '100%',
      top: item.offset + 'px',
    }
    items.push({
      style: itemStyle,
      data: props.data[i],
      dataIndex: i,
    })
  }
  showItemList.value = items
}

const getRangeToRender = (props: any, scrollOffset: any) => {
  const { itemCount } = props
  const startIndex = getStartIndex(props, scrollOffset)
  const endIndex = getEndIndex(props, startIndex + props.buffCount)
  return [Math.max(0, startIndex - 1), Math.min(itemCount - 1, endIndex)]
}

const getStartIndex = (props: any, scrollOffset: number) => {
  const { itemCount } = props
  let index = 0
  while (true) {
    const currentOffset = getItemMetaData(index).offset
    if (currentOffset >= scrollOffset) return index
    if (index >= itemCount) return itemCount
    index++
  }
}

const getItemMetaData = (index: number) => {
  const { itemEstimatedSize = 50 } = props
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData
  // 如果当前索引比已记录的索引要大，说明要计算当前索引的项的size和offset
  if (index > lastMeasuredItemIndex) {
    let offset = 0
    // 计算当前能计算出来的最大offset值
    if (lastMeasuredItemIndex >= 0) {
      const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex]
      offset += lastMeasuredItem.offset + lastMeasuredItem.size
    }
    // 计算直到index为止，所有未计算过的项
    for (let i = lastMeasuredItemIndex + 1; i <= index; i++) {
      const currentItemSize = itemEstimatedSize
      measuredDataMap[i] = { size: Number(currentItemSize), offset }
      offset += currentItemSize
    }
    // 更新已计算的项的索引值
    // measuredData.lastMeasuredItemIndex = index;
  }
  return measuredDataMap[index]
}

const getEndIndex = (props: any, startIndex: number) => {
  const { height, itemCount } = props
  // 获取可视区内开始的项
  const startItem = getItemMetaData(startIndex)
  // 可视区内最大的offset值
  const maxOffset = Number(startItem.offset) + Number(height)
  // 开始项的下一项的offset，之后不断累加此offset，知道等于或超过最大offset，就是找到结束索引了
  let offset = Number(startItem.offset) + startItem.size
  // 结束索引
  let endIndex = startIndex

  // 累加offset
  while (offset <= maxOffset && endIndex < itemCount - 1) {
    endIndex++
    const currentItem = getItemMetaData(endIndex)
    offset += currentItem.size
  }
  // 更新已计算的项的索引值
  measuredData.lastMeasuredItemIndex = endIndex
  return endIndex
}
const totalEstimatedHeight = ref(0)
const estimatedHeight = (defaultEstimatedItemSize = 50, itemCount: number) => {
  let measuredHeight = 0
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData
  // 计算已经获取过真实高度的项的高度之和
  if (lastMeasuredItemIndex >= 0) {
    const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex]
    measuredHeight = lastMeasuredItem.offset + lastMeasuredItem.size
  }
  // 未计算过真实高度的项数
  const unMeasuredItemsCount =
    itemCount - measuredData.lastMeasuredItemIndex - 1
  // 预测总高度
  totalEstimatedHeight.value =
    measuredHeight + unMeasuredItemsCount * defaultEstimatedItemSize
}

//滚动距离
const scrollOffset = ref(0)
//列表滚动处理
// animationFrame
function rafThrottle(func, ...firstArgs) {
  let lock = false
  return function (...args) {
    if (lock) return
    lock = true
    window.requestAnimationFrame(() => {
      func.apply(this, args.concat(firstArgs))
      lock = false
    })
  }
}

const scrollHandle = rafThrottle((event: any) => {
  scrollOffset.value = event.target.scrollTop
  getCurrentChildren()
}, event)

onMounted(() => {
  nextTick(() => {
    virtualWrap.value.scrollTo(0, 1)
  })
})
defineOptions({
  name: 'virtuallyList',
})
// 暴露实例
</script>
<style>
.virtual-wrap {
  position: relative;
  overflow: auto;
}

.virtual-content {
  position: relative;
  overflow: auto;
}
</style>

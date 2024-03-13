<template>
  <div :style="style" ref="domRef">
    <slot name="slot-scope" :data="data"></slot>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['onSizeChange'])

const props = defineProps({
  style: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
})

const domRef = ref<any>(null)
const resizeObserver: any = null

onMounted(() => {
  const domNode = domRef.value.children[0]
  emit('onSizeChange', props.index, domNode)
  const resizeObserver = new ResizeObserver(() => {
    emit('onSizeChange', props.index, domNode)
  })
  resizeObserver.observe(domNode)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver?.unobserve(domRef.value.children[0])
  }
})
</script>

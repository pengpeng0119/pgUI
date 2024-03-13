<template>
  <virtuallyList
    :data="list"
    :height="300"
    :width="300"
    :itemCount="1000"
    :itemEstimatedSize="1"
    :buffCount="15">
    <template #slot-scope="{ slotProps }">
      <div class="li">{{ slotProps.data.text }}</div>
    </template>
  </virtuallyList>
</template>

<script setup lang="ts">
import virtuallyList from '@/components/virtually-list/index.ts'
import { ref, onMounted } from 'vue'
const list = ref<any>([])
onMounted(() => {
  for (let i = 0; i < 1000; i++) {
    list.value.push({ text: i + '这是滚动列表的数据！！！' })
  }
})
</script>

<style scoped lang="scss"></style>

<script setup lang="ts">
import ElButton from './components/Button/Button.vue'
import { onMounted, ref } from 'vue'
import { createMessage } from '@/components/Message/method'
import virtuallyList from '@/components/virtually-list/index.ts'

const list = ref<any>([])
onMounted(() => {
  for (let i = 0; i < 1000; i++) {
    list.value.push({ text: i + '这是滚动列表的数据！！！' })
  }
})
function clickFn() {
  createMessage({ message: 'message消息提示', type: 'success' })
}
</script>

<template>
  <div>
    <el-button type="success" @click="clickFn"> click </el-button>
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
    <!-- <header>
      <img alt="Vue logo" class="logo" src="./assets//vue.svg" width="125" height="125" ref="triggerNode"/>
      <div ref="overlayNode"><h1>Hello Tooltip</h1></div>
    </header> -->

    <!-- <el-button >按钮</el-button>
    <el-button type="danger">按钮</el-button>
    <el-button type="info">按钮</el-button>
    <el-button type="warning">按钮</el-button>
    <el-button type="success">按钮</el-button> -->
    <!-- <el-button loading>按钮1</el-button>
    <el-button icon="arrow-right">按钮1</el-button> -->
    <!-- <el-button >按钮</el-button> -->
    <!-- <Collapse v-model="openedValue">
      <Item name="a">
        <template #title>
          <h1>nice title A</h1>
        </template>
        <div>aaa </div>
      </Item>
      <Item name="b" title="b">
        <div>bbb</div>
      </Item>
      <Item name="c" title="c" disabled>
        <div>ccc</div>
      </Item>
    </Collapse>
    {{openedValue}} -->
    <!-- <el-icon icon="arrow-right" color="blue"></el-icon> -->
    <!-- <el-link href="https://element-plus.org" target="_blank">default</el-link>
    <el-link type="primary">primary</el-link>
    <el-link type="success">success</el-link>
    <el-link type="warning">warning</el-link>
    <el-link type="danger">danger</el-link>
    <el-link type="info">info</el-link> -->
    <!-- <el-link type="danger" disabled>info</el-link>
    <el-link type="success" underline>info</el-link> -->
    <!-- <el-link type="primary" icon="arrow-right">
    
    </el-link> -->
    <!-- <el-button-group>
      <el-button type="primary" icon="arrow-right">Previous Page</el-button>
      <el-button type="danger">aaa</el-button>
    </el-button-group>
    <el-alert title="success alert" type="success" />
    <el-alert title="info alert" type="info" />
    <el-alert title="warning alert" type="warning" />
    <el-alert title="error alert" type="error" /> -->

    <router-view></router-view>
  </div>
</template>

<style scoped></style>
import { onMounted } from 'vue'; import { onMounted } from 'vue'; import {
onMounted } from 'vue';import ts from 'typescript';

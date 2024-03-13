/*
 * @Author: fcli
 * @Date: 2023-09-04 16:50:16
 * @LastEditors: fcli
 * @LastEditTime: 2023-09-04 16:50:25
 * @FilePath: /vue-auto-scroll/type.d.ts
 * @Description: 
 */
declare module '*.vue' {
    import { defineComponent } from 'vue'
    const component: ReturnType<typeof defineComponent>
    export default component
}
<template>
  <div class="mt-3">
    <h1>前台頁面</h1>
    <hr>
    <router-link to="/home">首頁</router-link> |
    <router-link to="/about">關於我們</router-link> |
    <router-link to="/products">產品列表</router-link> |
    <router-link to="/cart">購物車</router-link> |
    <router-link to="/login">登入</router-link> |
    <router-link to="/admin/products">後台</router-link> |
    <hr>
    <RouterView></RouterView>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
export default {
  components: {
    RouterView
  }
}
</script>

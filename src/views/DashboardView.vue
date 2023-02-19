<template>
  <div class="mt-3">
    <h1>後台頁面</h1>
    <hr>
    <router-link to="/admin/products">後台產品列表</router-link> |
    <router-link to="/admin/orders">後台訂單列表</router-link> |
    <router-link to="/home">回前台</router-link> |
    <a href="#" @click.prevent="logout">登出</a>
    <hr>
    <RouterView></RouterView>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_APP_URL } = import.meta.env
export default {
  components: {
    RouterView
  },
  methods: {
    logout () {
      document.cookie = `hexToken=; expires=${new Date()}`// 清除token等資料
      alert('您已成功登出')
      this.$router.push('/login')
    },
    checkAdmin () {
      const url = `${VITE_APP_URL}/v2/api/user/check`
      this.$http
        .post(url)
        .then((res) => {
          // 如果登入驗證失敗，踢回到登入頁
          if (!res.data.success) {
            alert('請重新登入')
            this.$router.push('/login')
          }
        })
        .catch((err) => {
          alert(err.data)
          // window.location = 'login.html'
        })
    }
  },
  mounted () {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    this.checkAdmin()
  }
}
</script>

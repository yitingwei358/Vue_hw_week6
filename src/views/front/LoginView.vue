<template>
  <h3>登入畫面</h3>
  <hr>
  <form id="form" class="form-signin" @submit.prevent="login">
    <div class="form-floating mb-3">
      <input
        v-model="user.username"
        type="email"
        class="form-control"
        id="username"
        placeholder="name@example.com"
        required
        autofocus
      />
      <label for="username">Email address</label>
    </div>
    <div class="form-floating">
      <input
        v-model="user.password"
        type="password"
        class="form-control"
        id="password"
        placeholder="Password"
        required
      />
      <label for="password">Password</label>
    </div>
    <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
      登入
    </button>
  </form>
</template>

<script>
const { VITE_APP_URL } = import.meta.env
export default {
  data () {
    return {
      api: 'https://vue3-course-api.hexschool.io/v2',
      path: 'j437437',
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      const url = `${VITE_APP_URL}/v2/admin/signin`
      this.$http
        .post(url, this.user)
        .then((res) => {
          const { token, expired } = res.data
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
          alert(res.data.message)
          // window.location = 'products.html'
          this.$router.push('/admin/products')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  }
}
</script>

<template>
  <h3>前台產品列表頁面</h3>
  <hr>
  <table class="table">
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.title }}</td>
        <td><img :src="item.imageUrl" width="100" alt=""></td>
        <td>
          <RouterLink :to="`/product/${item.id}`" class="btn btn-outline-secondary">產品細節</RouterLink>
          <button type="button" class="btn btn-outline-primary" @click="addToCart(item.id)">加入購物車</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { RouterLink } from 'vue-router'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: []
    }
  },
  methods: {
    getProductList () {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/products/all`
      this.$http
        .get(url)
        .then((res) => {
          console.log('產品列表:', res.data.products)
          this.products = res.data.products
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    addToCart (id) {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart`
      const data = {
        product_id: id,
        qty: 1
      }
      console.log(data)
      this.$http
        .post(url, { data })
        .then((res) => {
          console.log('加入購物車:', res)
          alert('已加入購物車')
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    }

  },
  components: {
    RouterLink
  },
  mounted () {
    console.log(VITE_APP_URL, VITE_APP_PATH)
    this.getProductList()
  }
}
</script>

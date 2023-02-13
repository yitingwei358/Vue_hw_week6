<template>
  <h3>前台單一產品頁面</h3>
  <p>{{ product.title }}</p>
  <img :src="product.imageUrl" class="img-fluid" alt="">

</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      product: { },
      id: ''
    }
  },
  methods: {
    getProduct () {
      console.log(this.id)
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/product/${this.id}`
      console.log(url)
      this.$http.get(url).then((res) => {
        this.product = res.data.product
        console.log('單一產品細節:', res.data.product)
      }).catch((err) => {
        alert(err.response.data.message)
      })
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getProduct()
  }
}
</script>

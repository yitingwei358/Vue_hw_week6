<template>
  <h3>前台購物車頁面</h3>
  <hr>
  <!-- 購物車列表 -->
  <div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="deleteCartItem(item)"
                :disabled="item.id===loadingItem"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="item.id===loadingItem"
                ></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <!-- <div class="text-success">已套用優惠券</div> -->
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <!-- 原本的input改為select -->
                  <!-- 利用 disabled 避免連續選取 -->
                  <select
                    name=""
                    id=""
                    class="form-control"
                    v-model="item.qty"
                    @change="updateCartItem(item)"
                    :disabled="item.id===loadingItem"
                  >
                    <option :value="i" v-for="i in 20" :key="i+'1234'">
                      {{i}}
                    </option>
                  </select>
                </div>
              </div>
            </td>
            <td class="text-end">
              <!-- <small class="text-success">折扣價：</small> -->
              {{ item.total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cart.total }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {
        carts: {}
      },
      loadingItem: '', // 存id
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  // components: {},
  methods: {
    getCarts () {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart`
      this.$http
        .get(url)
        .then((res) => {
          this.cart = res.data.data
          console.log('取得購物車', res)
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    updateCartItem (item) {
      // 有分 購物車的id 和 產品的id
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart/${item.id}`
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      this.loadingItem = item.id // 避免用戶在還沒更新完成就重複按
      this.$http
        .put(url, { data })
        .then((res) => {
          this.getCarts()
          this.loadingItem = '' // axios 完成後清空
          alert('數量更改成功')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteCartItem (item) {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/cart/${item.id}`
      this.loadingItem = item.id
      this.$http
        .delete(url)
        .then((res) => {
          console.log('刪除購物車:', res.data.message)
          this.getCarts()
          this.loadingItem = ''
          alert('刪除成功')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    deleteAllCart () {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/carts`
      this.$http
        .delete(url)
        .then((res) => {
          alert(res.data.message)
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的手機號碼'
    },
    createOrder () {
      const url = `${VITE_APP_URL}/v2/api/${VITE_APP_PATH}/order`
      const data = this.form
      this.$http
        .post(url, { data })
        .then((res) => {
          alert(res.data.message)
          this.$refs.form.resetForm()
          this.getCarts()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>

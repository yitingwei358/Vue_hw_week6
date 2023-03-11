<template>
  <h3>前台購物車頁面</h3>
  <hr>
  <!-- 購物車列表 -->
  <div class="d-flex justify-content-end">
    <div>
      <p class="p-2 text-danger fw-bold" v-if="cart.carts.length===0">
        您還沒加入任何商品呦! 趕快逛逛吧!
      </p>
    </div>
    <div>
      <button
        class="btn btn-outline-danger p-2"
        type="button"
        @click="deleteAllCart"
        :disabled="cart.carts.length===0"
      >
        清空購物車
      </button>
    </div>
  </div>
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
  <!--表單-->
  <div class="my-5 row justify-content-center">
    <v-form
      ref="form"
      class="col-md-6"
      v-slot="{ errors }"
      @submit="createOrder"
    >
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <v-field
          id="email"
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors['email'] }"
          placeholder="請輸入 Email"
          rules="email|required"
          v-model="form.user.email"
        ></v-field>
        <error-message
          name="email"
          class="invalid-feedback"
        ></error-message>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <v-field
          id="name"
          name="姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名"
          rules="required"
          v-model="form.user.name"
        ></v-field>
        <error-message
          name="姓名"
          class="invalid-feedback"
        ></error-message>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <v-field
          id="tel"
          name="電話"
          type="tel"
          class="form-control"
          :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入電話"
          :rules="isPhone"
          v-model="form.user.tel"
        ></v-field>
        <error-message
          name="電話"
          class="invalid-feedback"
        ></error-message>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <v-field
          id="address"
          name="地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址"
          rules="required"
          v-model="form.user.address"
        ></v-field>
        <error-message
          name="地址"
          class="invalid-feedback"
        ></error-message>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea
          id="message"
          class="form-control"
          cols="30"
          rows="10"
          v-model="form.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </v-form>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate'
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
  components: { ErrorMessage },
  methods: {
    getCarts () {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart`
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
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart/${item.id}`
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
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart/${item.id}`
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
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/carts`
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
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/order`
      const data = this.form
      this.$http
        .post(url, { data })
        .then((res) => {
          alert(res.data.message)
          this.$refs.form.resetForm()
          data.message = ''
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

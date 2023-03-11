<template>
  <h3>後台產品頁面</h3>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="()=>openProductModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-end pe-5">原價</th>
          <th width="120" class="text-end pe-5">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title }}</td>
          <td class="text-end pe-5">{{item.origin_price }}</td>
          <td class="text-end pe-5">{{item.price}}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="()=>openProductModal(false, item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="()=>openDelProductModel(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁元件 -->
    <pagination-effect :pages="pagination" @emit-pages="getData"></pagination-effect>
  <!-- ProductModal -->
    <product-modal
      :product="tempProduct"
      :is-new="isNew"
      @update="getData"
      ref="insideModal2"
    ></product-modal>
  <!-- DelProductModal -->
    <del-product-modal
      :item="tempProduct"
      @update="getData"
      ref="insideModal66"
    ></del-product-modal>
</template>

<script>
import PaginationEffect from '@/components/PaginationEffect.vue'
import ProductModal from '@/components/ProductModal.vue'
import DelProductModal from '@/components/DelProductModal.vue'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      pagination: {},
      isNew: false,
      tempProduct: {
        imagesUrl: []
      }
    }
  },
  methods: {
    // page=1為預設值
    getData (page = 1) {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/products/?page=${page}`

      this.$http
        .get(url)
        .then((res) => {
          const { products, pagination } = res.data
          this.products = products
          this.pagination = pagination
          console.log('取得產品列表res', res)
          console.log(products, pagination)
        })
        .catch((err) => {
          console.log(err)
          // window.location = 'login.html'
        })
    },
    openProductModal (isNew, item) {
      if (isNew) {
        this.tempProduct = {}
        this.isNew = true
      } else {
        this.tempProduct = { ...item }
        this.isNew = false
      }
      console.log(this.tempProduct)
      const productComponent = this.$refs.insideModal2
      productComponent.openModal()
    },
    openDelProductModel (item) {
      this.tempProduct = { ...item }
      console.log('要刪除的品項暫存:', this.tempProduct)
      const delProductModalComponent = this.$refs.insideModal66
      delProductModalComponent.openModal()
    }
  },
  components: {
    PaginationEffect,
    ProductModal,
    DelProductModal
  },
  mounted () {
    this.getData()
  }
}

</script>

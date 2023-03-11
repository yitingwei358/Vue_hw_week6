<template>
  <h3>後台訂單頁面</h3>
  <table class="table">
  <thead>
    <tr>
      <th scope="col">訂單編號</th>
      <th scope="col">顧客姓名</th>
      <th scope="col">購買時間</th>
      <th scope="col">品項</th>
      <th scope="col">總金額</th>
      <th scope="col">付款狀態</th>
      <th scope="col">編輯</th>
    </tr>
  </thead>
  <tbody v-for="item in orders" :key="item.id">
    <tr >
      <td>{{item.id}}</td>
      <td>{{item.user.name}}</td>
      <td>{{ $filters.date(item.create_at) }}</td>
      <td>
        <ul class="list-unstyled">
          <li v-for="(product, i) in item.products" :key="i">
            {{ product.product.title }} * {{ product.qty }}
            {{ product.product.unit }}
          </li>
        </ul>
      </td>
      <td>{{ $filters.currency(item.total) }}</td>
      <td>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            :id="`paidSwitch${item.id}`"
            v-model="item.is_paid"
            @change="()=>updatePaid(item)"
            >
          <label
            class="form-check-label"
            :for="`paidSwitch${item.id}`">
              <span v-if="item.is_paid">已付款</span>
              <span v-else>未付款</span>
          </label>
        </div>
      </td>
      <td><button @click="()=>openAdminOrderModal(item)">查看細節</button><button>刪除訂單</button></td>
    </tr>
  </tbody>
</table>
<admin-order-modal :order="tempOrder" ref="adminOrderModalTem" :refresh-orderlist="getOrderList()"></admin-order-modal>
</template>

<script>
import AdminOrderModal from '@/components/AdminOrderModal.vue'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      orders: {},
      tempOrder: {}
    }
  },
  methods: {
    getOrderList () {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/orders`
      this.$http
        .get(url)
        .then((res) => {
          console.log('取得訂單列表:', res.data.orders)
          this.orders = res.data.orders
        })
        .catch((err) => { console.log(err) })
    },
    updatePaid (item) {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/order/${item.id}`
      this.$http
        .put(url, { data: { is_paid: item.is_paid } })
        .then((res) => {
          this.getOrderList()
          alert(res.data.message)
        })
        .catch((res) => { console.log(res) })
    },
    openAdminOrderModal (item) {
      this.tempOrder = { ...item }
      const adminOrderModalComponent = this.$refs.adminOrderModalTem
      adminOrderModalComponent.openModal()
    }
  },
  components: {
    AdminOrderModal
  },
  mounted () {
    this.getOrderList()
  }
}
</script>

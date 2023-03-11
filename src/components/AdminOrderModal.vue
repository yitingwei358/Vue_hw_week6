<template>
  <div class="modal" tabindex="-1" ref="adminOrderModal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">訂單資料</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4">
              <h3 class="fw-bold">顧客資料</h3>
              <table class="table">
                <tbody v-if="openOrder.user">
                  <tr>
                    <th>姓名</th>
                    <td>{{openOrder.user.name}}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{{openOrder.user.email}}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{openOrder.user.tel}}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{openOrder.user.address}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-8">
              <h3 class="fw-bold">訂單細節</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th>訂單編號</th>
                    <td>4687687{{ openOrder.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ $filters.date(openOrder.create_at) }}</td>
                  </tr>
                  <tr>
                    <th>付款時間</th>
                    <td>
                      <span v-if="openOrder.paid_date">
                        {{ $filters.date(openOrder.paid_date) }}
                      </span>
                      <span v-else>無法讀取付款時間</span>
                    </td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <!-- <span v-if="openOrder.is_paid">已付款</span>
                      <span v-else>未付款</span> -->
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          :id="`paidSwitch2${openOrder.id}`"
                          v-model="openOrder.is_paid">
                        <label
                          class="form-check-label"
                          :for="`paidSwitch2${openOrder.id}`">
                            <span v-if="openOrder.is_paid">已付款</span>
                            <span v-else>未付款</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>{{ $filters.currency(openOrder.total) }}</td>
                  </tr>
                </tbody>
              </table>
              <h3 class="mt-5 fw-bold">選購商品</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>品名</th>
                    <th>產品編號</th>
                    <th class="text-end">原價</th>
                    <th class="text-end">售價</th>
                    <th class="text-end">數量</th>
                    <th class="text-end">金額</th>
                  </tr>
                </thead>
                <tbody v-for="(product, index) in openOrder.products" :key='index'>
                  <tr>
                    <td>{{ product.product.title }}</td>
                    <td>{{ product.product.id }}</td>
                    <td class="text-end">{{ $filters.currency(product.product.origin_price) }}</td>
                    <td class="text-end">{{ $filters.currency(product.product.price) }}</td>
                    <td class="text-end">{{ product.qty }}</td>
                    <td class="text-end">{{ $filters.currency(product.total) }}</td>
                  </tr>
                </tbody>
                <tfoot >
                  <tr class="text-end">
                    <td colspan="6">總金額 NT$ {{ $filters.currency(openOrder.total) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer bg-dark text-white">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" @click="()=>updatePaid(openOrder)">儲存變更</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  // props: ['order'],
  props: {
    order: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      status: {},
      modal: '',
      openOrder: {},
      isPaid: false
    }
  },
  methods: {
    openModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    },
    updatePaid (openOrder) {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/order/${openOrder.id}`
      this.$http
        .put(url, { data: { is_paid: openOrder.is_paid } })
        .then((res) => {
          alert(res.data.message)
          this.hideModal()
          this.$emit('refreshOrderlist')
        })
        .catch((res) => { console.log(res) })
    }
  },
  watch: {
    order () {
      console.log('props傳過來的訂單資料:', this.order)
      this.openOrder = this.order
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.adminOrderModal)
  }
}
</script>

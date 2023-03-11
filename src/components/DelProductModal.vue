<template>
  <div
    id="delProductModal"
    ref="yes123"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除產品：
          <strong class="text-danger"></strong>{{item.title}}
          (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteItem">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  props: ['item'], // tempProduct傳進來變item
  data () {
    return {
      modal: ''
    }
  },
  methods: {
    openModal () {
      console.log('delModal被觸發了')
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    },
    deleteItem () {
      const url = `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/product/${this.item.id}`

      this.$http
        .delete(url)
        .then((res) => {
          alert(res.data.message)
          // 成功後關掉互動視窗，並重新取得資料
          this.hideModal()
          this.$emit('update')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.yes123)
  }
}
</script>

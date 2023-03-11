<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <!-- 如果現在在第一頁，就 disabled 上一頁 按鈕 -->
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === 1}"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="emitPages(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 迴圈 -->
      <!-- :key 用 index+字串'page' 讓它成為唯一值  -->
      <li
        v-for="(item, index) in pages.total_pages"
        :key="index + 'page'"
        class="page-item"
        :class="{'active': item === pages.current_page}"
      >
        <span
          class="page-link"
          v-if="item === pages.current_page"
        >{{ item }}</span>
        <a
          class="page-link"
          href="#"
          v-else
          @click.prevent="emitPages(item)"
        >{{ item }}</a>
      </li>

      <!-- 如果現在在最後一頁，就 disabled 下一頁按鈕 -->
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === pages.total_pages}"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="emitPages(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
// 分頁元件
export default {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages (item) {
      this.$emit('emit-pages', item)
    }
  }
}
</script>

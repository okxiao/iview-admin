<template>
  <div class="page-list">
    <Page :total="pageTotal" :current="pageCurrent" :page-size="pageSize" show-total show-elevator/>
  </div>
</template>
<script>
import './page.less'

export default {
  data () {
    return {
      /* 分页-总条数 */
      pageTotal: 100,
      /* 分页-每页显示多少条 */
      pageSize: 20,
      /* 分页-页码 */
      pageCurrent: 1
    }
  },
  methods: {
    init (pageCurrent, pageTotal, pageSize) {
      this.pageCurrent = pageCurrent
      this.pageTotal = pageTotal
      if (pageSize) { this.pageSize = pageSize }
    }
  }
}
</script>

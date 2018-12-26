<template>
  <div class="page-list">
    <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" @on-change="changePage" show-total show-elevator/>
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
      pageNum: 1
    }
  },
  methods: {
    getParams () {
      return this
    },
    setParams (pageNum, pageTotal, pageSize) {
      this.pageNum = pageNum
      this.pageTotal = pageTotal
      if (pageSize) { this.pageSize = pageSize }
    },
    changePage (index) {
      this.pageNum = index
      this.$emit('datalist')
    }
  }
}
</script>

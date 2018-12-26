<template>
  <div>
    <Card>
      <Button @click="showWindowBDrawer = true" type="primary" style="float: right;">添加</Button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <drag-drawer v-model="showWindowBDrawer"
                   :width.sync="width1"
                   :min-width="600"
                   :placement="placementComputed"
                   :draggable="draggable"
                   :scrollable="true">
        <div slot="header">
          <Icon type="md-aperture" :size="18"></Icon>
          <b>这是标题</b>
        </div>
        <test></test>
      </drag-drawer>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import DragDrawer from '_c/drag-drawer'
import test from '@/components/form/test'

import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',
  components: {
    Tables,
    DragDrawer,
    test
  },
  data () {
    return {
      /* 侧边弹出 */
      showWindowBDrawer: false,
      /* 侧边弹出 */
      draggable: false,
      /* 侧边弹出 */
      placement: false,
      /* 侧边弹出 */
      width1: 600,
      columns: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    /* 侧边弹出 */
    handleResize (event) {
      const { atMin } = event
      /* eslint-disable */
      console.log(atMin);
    },
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  /* 侧边弹出 */
  computed: {
    placementComputed () {
      return this.placement ? 'left' : 'right'
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data.returnData
    })
  }
}
</script>

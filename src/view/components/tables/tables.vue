<template>
  <div>
    <Card>
      <Button @click="showWindowBDrawer = !showWindowBDrawer" type="primary" style="float: right;"><Icon type="md-add" style="margin-top: -2px;" :size="14"></Icon>添加</Button>
      <Button style="float: right;margin-right: 10px" type="primary" @click="exportExcel"><Icon type="md-aperture" style="margin-top: -2px;" :size="14"></Icon>导出</Button>
      <tables ref="tables" @datalist="datalist" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
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
        <test @close="close"></test>
      </drag-drawer>
    </Card>
  </div>
</template>

<script>
import './table.less'
import axios from '@/libs/api.request'
import Tables from '_c/tables'
import DragDrawer from '_c/drag-drawer'
import test from '@/components/form/test'

export default {
  name: 'tables_page',
  components: {
    Tables,
    DragDrawer,
    test
  },
  data () {
    return {
      /* 侧边弹出-弹出开关 */
      showWindowBDrawer: false,
      /* 侧边弹出-是否可移动 */
      draggable: false,
      /* 侧边弹出-方向 */
      placement: false,
      /* 侧边弹出-宽度 */
      width1: 600,
      columns: [
        // { type: 'index', width: 60, align: 'center' },
        // { type: 'selection', width: 60, align: 'center' },
        { title: 'Name', key: 'name', sortable: true, align: 'center' },
        { title: 'Email', key: 'email', editable: true, align: 'center' },
        { title: 'Create-Time', key: 'createTime', align: 'center' },
        {
          title: 'Handle',
          key: 'handle',
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看')
            },
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
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, '删除')
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
      //删除事件
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    close () {
      //关闭遮罩层
      this.showWindowBDrawer = false
      this.datalist()
    },
    datalist () {
      axios.request({
        url: 'get_table_data',
        data: {
          pageInfo: {
            pageNum: this.$refs.tables.pageNum
          },
          search: {
            name: ''
          }
        },
        method: 'post'
      }).then(res => {
        let returnData = res.data.returnData
        this.tableData = returnData.datalist
        this.$refs.tables.pageTotal = returnData.pageTotal
        // this.$refs.tables.pageTotal.pageSize = returnData.pageSize
      })
    }
  },
  computed: {
    /* 侧边弹出 */
    placementComputed () {
      return this.placement ? 'left' : 'right'
    }
  },
  mounted () {
    this.datalist()
  }
}
</script>

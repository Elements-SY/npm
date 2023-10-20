<template>
  <div class="table-container">
    <el-row
      v-if="attrs.btnCofig.isBtn"
      style="margin-bottom: 15px"
      id="group-btn"
    >
      <el-col>
        <span
          v-for="(item, i) in attrs.btnCofig.btnGroup"
          :key="item.btnName"
          :class="i == 0 ? 'first-span' : 'span'"
        >
          <el-button
            :type="item.type"
            :icon="item.icon"
            :round="item.round"
            :size="item.size"
            :loading="item.loading"
            @click="handleClick(item, i)"
            v-if="item.btnName !== '导入' && item.btnName !== '增加'"
            >{{ item.btnName }}</el-button
          >
          <el-upload
            v-else
            ref="upload"
            :action="item.action"
            :fileName="item.fileName"
            :http-request="toUpload"
            :on-remove="onRemoveUpload"
            :limit="item.limit"
            :accept="item.accept"
            :show-file-list="false"
            class="upload"
          >
            <el-button
              :type="item.type"
              :icon="item.icon"
              :round="item.round"
              :size="item.size"
              :loading="item.loading"
              >{{ item.btnName }}</el-button
            >
          </el-upload>
        </span>
      </el-col>
    </el-row>
    <el-table
      :max-height="attrs.maxHeight"
      :empty-text="emptyText"
      v-bind="attrs"
      v-loading="loadingTable"
      :data="tableData ? tableData : []"
      @selection-change="selectionChange"
      ref="tableRef"
      row-key="id"
      :header-cell-class-name="headerCellClassName"
    >
      <template v-if="columns.length">
        <template v-for="item in columns">
          <column v-if="!item.hidden" :key="item.id" :attrs="item"></column>
        </template>
      </template>
      <slot name="column" v-else></slot>
    </el-table>
    <!-- 分页 -->
    <div
      v-if="pageConfig.isPagination"
      id="pagination"
      class="pagination-container"
      :style="{ textAlign: pageConfig.position || 'right' }"
      ref="paginationRef"
    >
      <el-pagination
        background
        :hide-on-single-page="false"
        :current-page="pageConfig.pageData.page"
        :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
        :page-size="pageConfig.pageData.size"
        layout="total,prev, pager, next, jumper, ->, sizes"
        :total="pageConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import column from "./column";
import { objectMerge, debounce } from "../../../src/utils";
export default {
  name: "YlTable",
  props: {
    attrs: {
      type: Object,
      default: {
        border: true,
        isDragSort: false,
        btnCofig: {
          isBtn: true,
          btnGroup: [
            {
              type: "primary", // text、primary、danger
              icon: "el-icon-search", // el-icon-edit 、el-icon-delete、el-icon-plus、el-icon-download、el-icon-upload el-icon--right
              btnName: "搜索",
              size: "mini", // medium / small / mini
              round: false,
              loading: false,
              event: "searchBtn",
            },
          ],
        },
      },
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    loadingTable: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    pageConfig: {
      type: Object,
      default: {
        isPagination: true,
      },
      required: true,
    },
  },
  components: {
    column,
  },
  data() {
    return {
      dropCol: objectMerge({}, this.columns),
      trHeight: 4,
    };
  },
  computed: {
    _attrs() {
      //默认table 参数
      const defaultParams = {};
      return Object.assign(defaultParams, this.attrs);
    },
    isHasAttr() {},
  },
  created() {
    if (this.attrs.isDragSort) {
      // 有没有复选框、有没有render
      //  this.columns
    }
  },

  mounted() {
    //阻止火狐拖拽新建新页面
    document.body.addEventListener(
      "drop",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
      },
      false
    );
    this.getTrCurrentHeight();
    window.addEventListener("resize", this.getTrCurrentHeight);
  },
  destroyed() {
    if (this.tableData && this.tableData.length) {
      window.removeEventListener("resize", this.getTrCurrentHeight);
    }
  },

  methods: {
    getTrCurrentHeight: debounce(function () {
      this.$nextTick(() => {
        //   const trEl =
        //     this.$refs.tableRef.$refs.bodyWrapper.children[0].children[1]
        //       .children[0];
        // console.log(trEl)
        //   if (trEl) {
        //     this.trHeight = trEl.clientHeight;
        //   }
      });
    }, 800),
    // 给表头列添加className
    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 0) {
        return "el-table_1_column";
      }
    },
    useTableFunc(FuncName, ...params) {
      if (!this.$refs["el-table"]) {
        return console.warn("访问不到el-table");
      }
      if (!FuncName) {
        return console.error("请传入tabel方法名字");
      }
      this.$refs["el-table"][FuncName](params[0]);
    },
    // table复选框事件
    selectionChange(e) {
      console.log(e);
      this.$emit("selectionEvent", e);
    },
    // 条数变化
    handleSizeChange(e) {
      this.$emit("sizeChange", e);
    },
    // 页码变化
    handleCurrentChange(e) {
      this.$emit("currentChange", e);
    },
    // btn点击事件注册
    handleClick(item, i) {
      this.$emit(item.event, item, i);
    },
    // 拖拽行更新排序
    rowDrop() {
      const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
      // console.log("wrapperTr:", wrapperTr);
      this.sortable = Sortable.create(wrapperTr, {
        sort: this.attrs.isDragSort,
        animation: 100,
        delay: 0,
        handle: ".move", // 只有带move类名的元素才能拖动,多选框禁止拖动
        onEnd: (evt) => {
          // 因为手动加了一个多选框, 不在表头循环数组内, 所以这里减1
          let oldIndx = evt.oldIndex - 1;
          let newIndx = evt.newIndex - 1;
          const oldItem = this.dropCol[oldIndx];
          // 真正改变列数据--变化列头，就能实现列拖动 列数据按列头索引取值 {{ scope.row[dropCol[index].prop] }}
          this.dropCol.splice(oldIndx, 1); // 删除旧一行 删除为1
          this.dropCol.splice(newIndx, 0, oldItem); // 插入新一行 插入为0
        },
      });
    },
    // 拖拽列更新排序
    columnDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        sort: this.attrs.isDragSort,
        animation: 100,
        delay: 0,
        onStart(evt) {
          // console.log("onStart:", evt);
          evt.oldIndex;
        },
        onEnd({ newIndex, oldIndex }) {
          // console.log("onEnd:", newIndex, oldIndex);
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
    // 选择上传
    toUpload(options) {
      this.$refs.upload.map((item) => {
        item.clearFiles(); //上传成功之后清除历史记录
      });
      this.$emit("upload", options);
    },
    //移除上传
    onRemoveUpload(file, fileList) {
      this.$emit("rmfile", { file, fileList });
    },
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.useTableFunc("doLayout");
      });
    },
    tableData() {
      if (this.tableData && this.tableData.length && this.attrs.isDragSort) {
        // 拖拽行更新排序
        // this.rowDrop();
        // 拖拽列更新排序
        this.columnDrop();
      }
    },
  },
};
</script>
<style lang="scss">
.el-table {
  th {
    padding: 0;
  }
  td {
    padding: 0;
  }
}
.first-span,
.span {
  display: inline-block;
}
.span {
  margin-left: 6px;
}
.pagination-container{
  margin-top: 10px;
}
</style>

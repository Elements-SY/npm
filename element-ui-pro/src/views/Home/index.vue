<template>
  <div class="container">
    <el-row>
      <el-col>
        <yl-form
          ref="ruleForm"
          :formConfig="formConfig"
          :queryForm="queryForm"
          :inline="false"
          formWidth="auto"
          @blur="blurEvent"
        />
      </el-col>
    </el-row>
    <yl-table
      ref="ylTable"
      :attrs="tableAttr"
      :loadingTable="tableAttr.loadingTable"
      :columns="columns"
      :tableData="tableData"
      :pageConfig="pageConfig"
      @search="searchBtn"
      @add="addBtn"
      @delete="deleteData"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      @selectionEvent="tableSelectionChange"
    >
    </yl-table>
  </div>
</template>
<script>
import { formConfig } from "./formConfig";
import { tableAttr, columnHeader } from "./tableConfig";
import { tableData } from "./tableDate";
import { YlForm } from "@/components/YlElementUIPro/src/index";
import { Alert } from "element-ui";
import YlElementUIPro from "yl-element-ui-pro";
import ElementUI from "element-ui";
export default {
  name: "Index",
  data() {
    return {
      formConfig: formConfig, // 表单配置项
      queryForm: {
        // 表单参数
        status: "有效",
      },
      pageConfig: {
        // 分页配置项
        isPagination: true,
        total: 0,
        pageData: {
          page: 1,
          size: 10,
        },
      },
      tableAttr: tableAttr, // table配置项
      columns: columnHeader(
        this.indexAdd,
        this.viewRow,
        this.editRow,
        this.deleteRow
      ), // 表头
      tableData: [], // 表格数据
    };
  },
  components: {},
  created() {
    this.$nextTick(() => {
      this.searchBtn();
    });
  },
  mounted() {
    console.log(YlForm);
    console.log(Alert);
    console.log(YlElementUIPro);
    console.log(ElementUI);
  },
  computed: {},
  methods: {
    // 请求数据
    getTableData() {
      setTimeout(() => {
        this.tableData = tableData;
        this.pageConfig.total = tableData.length;
      }, 1000);
    },
    // input输入框失焦事件
    blurEvent(item) {
      console.log(`input输入框失焦事件`);
    },
    // 搜索
    searchBtn(row) {
      console.log("搜索：", this.queryForm);
      this.getTableData();
    },
    // 添加
    addBtn(row) {
      console.log("添加：", row);
    },
    // 勾选删除
    deleteData(row) {
      console.log("勾选删除：", row);
    },
    // 条数变化
    handleSizeChange(row) {
      console.log("条数变化：", row);
    },
    // 页码变化
    handleCurrentChange(row) {
      console.log("页码变化：", row);
    },
    // table勾选
    tableSelectionChange(row) {
      console.log("已勾选：", row);
    },
    // 翻页序号递增
    indexAdd(index) {
      const page = this.pageConfig.pageData.page; // 当前页码
      const pagesize = this.pageConfig.pageData.size; // 每页条数
      return index + 1 + (page - 1) * pagesize;
    },
    // 查看详情
    viewRow(row) {
      console.log("查看详情：", row);
    },
    // 编辑
    editRow(row) {
      console.log("编辑：", row);
    },
    // 单行删除
    deleteRow(row) {
      console.log("单行删除：", row);
    },
  },
};
</script>

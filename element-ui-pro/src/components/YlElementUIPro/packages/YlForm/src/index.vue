<template>
  <div
    class="ylform"
    :class="inline == true ? 'the-form' : ''"
    :style="{ marginBottom: `${marginBottom}px` }"
  >
    <el-form
      :model="tempQueryForm"
      :inline="inline"
      :label-position="position"
      :label-width="formWidth"
      :loading="loading"
      ref="ruleForm"
      :size="size"
    >
      <el-row
        :gutter="rowGutter"
        :type="rowType"
        :justify="rowJustify"
        :align="rowAlign"
        :tag="rowTag"
      >
        <span v-for="item in tempFormConfig" :key="item.name">
          <el-col
            v-if="!item.hidden"
            :span="item.span"
            :offset="item.offset"
            :tag="item.tag"
            :push="item.push"
            :pull="item.pull"
            :xs="item.xs"
            :sm="item.sm"
            :md="item.md"
            :lg="item.lg"
            :xl="item.xl"
            :style="{ width: item.colWidth }"
          >
            <el-form-item
              :label="item.label"
              :prop="item.prop"
              :rules="item.rules"
              :label-width="item.labelWidth"
            >
              <slot v-if="item.type === 'slot'"></slot>
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'Input'"
                v-model="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                v-on:[item.trigger]="
                  (e) => {
                    inputEvent(e, item);
                  }
                "
                @keyup.enter.native="toEnterSearch"
                clearable
              >
              </el-input>
              <template v-if="view">
                <span v-text="tempQueryForm[item.prop]"></span>
              </template>
              <!-- 数字输入框 -->
              <el-input
                v-if="item.type === 'inputNumber'"
                type="number"
                :min="item.min"
                :max="item.max"
                v-model.trim="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                v-on:keyup.enter="value = value.replace(/^-?[0-9]\d*$/, '')"
                clearable
              >
              </el-input>
              <!-- InputNumber 计数器 -->
              <el-input-number
                v-if="item.type === 'Number'"
                v-model.trim="tempQueryForm[item.prop]"
                :min="0"
                :max="10"
                :size="item.size"
                :style="{ width: item.inputWidth }"
                label="描述文字"
              ></el-input-number>

              <template v-if="view">
                <span v-text="tempQueryForm[item.prop]"></span>
              </template>

              <!-- 下拉选择 -->
              <el-select
                v-if="item.type === 'Select'"
                :multiple="item.multiple"
                :filterable="item.filterable"
                v-model.trim="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :loading="searchLoading"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                clearable
              >
                <el-option
                  v-for="op in item.options.data"
                  :label="op[item.options.label] || op.label"
                  :value="op[item.options.value] || op.value"
                  :key="op[item.options.value] || op.value"
                >
                </el-option>
              </el-select>

              <!-- 远程搜索 -->
              <template v-if="item.type === 'Search'">
                <el-autocomplete
                  v-model.trim="tempQueryForm[item.prop]"
                  :style="{ width: item.inputWidth }"
                  :debounce="1500"
                  :fetch-suggestions="querySearchAsync"
                  :placeholder="
                    item.placeholder ? item.placeholder : '请选择' + item.label
                  "
                  @focus="focusKey(item)"
                  @select="selectSearch"
                  clearable
                ></el-autocomplete>
              </template>

              <!-- 日期 -->
              <el-date-picker
                v-if="item.type === 'Date'"
                v-model.trim="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择日期'
                "
                :value-format="item.format"
                clearable
              >
              </el-date-picker>

              <!-- 时间 -->
              <el-time-select
                v-if="item.type === 'Time'"
                v-model.trim="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择时间'
                "
                clearable
              >
              </el-time-select>

              <!-- 日期时间 -->
              <el-date-picker
                v-if="item.type === 'DateTime'"
                type="datetime"
                v-model.trim="tempQueryForm[item.prop]"
                :disabled="item.disable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择日期'
                "
                clearable
              >
              </el-date-picker>

              <!-- 日期范围 -->
              <el-date-picker
                v-if="item.type === 'datetimerange'"
                type="datetimerange"
                v-model.trim="tempQueryForm[item.prop]"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              >
              </el-date-picker>

              <!-- 单选框 普通的样式 Radio 的尺寸，仅在 border 为真时有效-->
              <template v-if="item.type === 'radio'">
                <el-radio
                  v-model.trim="tempQueryForm[item.prop]"
                  v-for="op in item.options.data"
                  :disabled="item.disable"
                  :border="tempQueryForm[item.border]"
                  :size="tempQueryForm[item.size]"
                  :label="op[item.options.label] || op.label"
                  :value="op[item.options.value] || op.value"
                  :key="op[item.options.value] || op.value"
                ></el-radio>
              </template>

              <!-- 单选框 按钮样式 -->
              <el-radio-group
                v-if="item.type === 'radioButtom'"
                v-model.trim="tempQueryForm[item.prop]"
                :size="tempQueryForm[item.size]"
                :disabled="item.disable"
              >
                <el-radio-button
                  v-for="op in item.options.data"
                  :label="op[item.options.label] || op.label"
                  :value="op[item.options.value] || op.value"
                  :key="op[item.options.value] || op.value"
                ></el-radio-button>
              </el-radio-group>

              <!-- 文本框 -->
              <el-input
                v-if="item.type === 'textarea'"
                v-model.trim="tempQueryForm[item.prop]"
                type="textarea"
                :style="{ width: item.inputWidth }"
                :disabled="item.disable"
                :rows="item.row"
                :autosize="item.autosize"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                clearable
              >
              </el-input>

              <!-- 多选框 -->
              <template v-if="item.type === 'Checkbox'">
                <el-checkbox
                  v-model="tempQueryForm[item.prop]"
                  :disabled="item.disabled"
                ></el-checkbox>
              </template>
            </el-form-item>
          </el-col>
        </span>
        <!-- 查询按钮 de-->
        <span v-show="inline & hiddenFormBtn">
          <el-form-item v-show="show">
            <el-button
              type="primary"
              @click="handleSearch('ruleForm')"
              :btnLoading="btnLoading"
            >
              {{ formBtn }}
            </el-button>
          </el-form-item>
        </span>
        <span v-show="inline & hiddenFormBtn">
          <el-form-item v-show="show">
            <el-button @click="resetFields('ruleForm')">重置</el-button>
          </el-form-item>
        </span>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Mock from "../../../src/utils"
import { deepClone, debounce } from "../../../src/utils";
export default {
  name: "YlForm",
  props: {
    rowGutter: {
      type: Number,
      default: 24,
    },
    rowType: {
      type: String,
      default: "",
    },
    rowJustify: {
      type: String,
      default: "",
    },
    rowAlign: {
      type: String,
      default: "",
    },
    rowTag: {
      type: String,
      default: "div",
    },
    // 由inline属性决定form表单是普通表单，还是行内表单
    inline: {
      //排列方式
      type: Boolean,
      default: true,
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
    hiddenFormBtn: {
      //是否展示搜索按钮
      type: Boolean,
      default: false,
    },
    formWidth: {
      //form表单宽度
      type: String,
      default: "auto",
    },
    position: {
      type: String,
      default: "",
    },
    formConfig: {
      type: Array,
      default: [],
    },
    queryForm: {
      type: Object,
      default: () => {},
    },
    // 用于控制该表单内组件的尺寸 medium / small / mini
    size: {
      type: String,
      default: "small",
    },
    marginBottom: {
      type: Number,
      default: 0,
    },
    view: {
      type: Boolean,
      default: false,
    },
    formBtn: {
      type: String,
      default: "查询",
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    loading: {
      //加载
      type: Boolean,
      default: false,
    },
    isBtnSave: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
      tempQueryForm: {},
      tempFormConfig: [],
      fetchResult: [],
      timeout: null,
      searchMark: {}, // 搜索
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // input事件绑定和注册
    inputEvent(e, item) {
      this.$emit(item.trigger, this.tempQueryForm);
    },
    // 回车事件
    toEnterSearch() {
      this.$emit("keyup", this.tempQueryForm);
    },
    // selectSearch 聚焦获取当前input绑定的数据
    focusKey(item) {
      this.searchMark = item;
    },
    // selectSearch 下拉选中获取当前input绑定的数据
    selectSearch(item) {
      console.log(item);
    },
    // 远程搜索查询
    querySearchAsync(queryString, cb) {
      console.log(queryString);
      // let result = this.formConfig.filter((item) => {
      //   if (item.hasOwnProperty("http")) {
      //     if (item.prop === this.searchMark.prop) {
      //       return item;
      //     }
      //   }
      // });
      // // 在搜索关键词不为空时发送http请求
      // if (queryString) {
      //   if (queryString.split(" ").length > 0) {
      //     if (result[0].http.method == "post") {
      //       result[0].http.data[result[0].prop] = queryString.split(" ")[0];
      //     } else {
      //       result[0].http.params[result[0].prop] = queryString.split(" ")[0];
      //     }
      //   }
      //   request(result[0].http).then((res) => {
      //     if (res.code == 200) {
      //       if (res.data.list.length) {
      //         res.data.list.map((item) => {
      //           item.value = `${item[result[0].prop]}  ${item[result[0].name]}`;
      //         });
      //         this.fetchResult = res.data.list;
      //         var results = queryString.split(" ")[0]
      //           ? this.fetchResult.filter(
      //               this.createStateFilter(queryString.split(" ")[0])
      //             )
      //           : this.fetchResult;
      //         clearTimeout(this.timeout);
      //         this.timeout = setTimeout(() => {
      //           cb(results);
      //         }, 1500 * Math.random());
      //       }
      //     }
      //   });
      // }
    },
    // 远程搜索匹配查询
    createStateFilter(queryString) {
      return (state) => {
        return (
          state[this.searchMark.prop]
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 行内表单搜索事件
    handleSearch(formName, cb) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          cb(valid);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.$emit("handleSearch");
    },
    // 清空ruleForm表单事件
    resetFields(formName = "ruleForm") {
      this.$refs[formName].resetFields();
    },
  },
  watch: {
    queryForm: {
      handler(val) {
        this.tempQueryForm = val;
      },
      deep: true,
      immediate: true,
    },
    formConfig: {
      handler(val) {
        this.tempFormConfig = deepClone(val);
      },
      deep: true,
      immediate: true,
    },
    //
  },
};
</script>
<style lang="scss" scoped></style>

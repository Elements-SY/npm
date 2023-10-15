import YlTable from "./src/index";

YlTable.install = function (Vue) {
  Vue.component(YlTable.name, YlTable);
};

export default YlTable;
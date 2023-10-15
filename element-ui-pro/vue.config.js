// https://cli.vuejs.org/zh/config/#vue-config-js
const { defineConfig } = require('@vue/cli-service')
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // pages: {
  //   main: {
  //     entry: "src/main.js",
  //     template: "public/index.html",
  //     filename: "index.html",
  //     title: "ElementUIPro",
  //     chunks: ["chunk-vendors", "chunk-common", "index"],
  //   },
  //   elementUIPro: {
  //     entry: "src/components/ElementUIPro/index.js",
  //     template: "public/index.html",
  //     filename: "index.html",
  //     title: "ElementUIPro",
  //     chunks: ["chunk-vendors", "chunk-common", "index"],
  //   },
  // },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
});

const Mock = require("mockjs");
const apiList = {
  city: "/county/province/city",
};
const searchWord = [
  {
    name: Mock.mock("@city"),
  },
];

export default {
  apiList,
  searchWord,
};

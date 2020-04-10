<template>
  <div class="header-search">
    <el-select
      ref="headerSearchSelect"
      v-model="shop"
      filterable
      placeholder="请选择公司"
      class="header-search-select"
    >
      <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: "ShopSelect",
  data() {
    return {
      shop: "0",
      options: [
        { id: "0", name: "广西拾介水果平台" },
        { id: "1", name: "公牛专卖店" },
        { id: "2", name: "九阳厨卫旗舰店" }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.header-search {
  display: inline-flex;
  vertical-align: text-bottom;
  width: 240px;

  .header-search-select {
    font-size: 18px;
    width: 100%;
    transition: width 0.2s;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 10px;
      padding-right: 0;
      border: 1px solid #d9d9d9;
      vertical-align: middle;
      border-radius: 5px;
    }
  }
}
</style>

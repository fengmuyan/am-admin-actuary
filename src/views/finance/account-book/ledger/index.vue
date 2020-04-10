<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" style="padding-right:2px">
        <div class="left-side" :style="{ 'min-height': `${parseInt(minHeight)+68}px` }">
          <div class="head-container">
            <el-input
              v-model="itemName"
              placeholder="请输入科目名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
              :data="itemOptions"
              :props="defaultProps"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              :highlight-current="true"
              ref="tree"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-collapse-transition>
          <div class="form-p" v-if="formShow" ref="formPublic">
            <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="dateRange"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-transition>
        <div class="table-p" :style="{ 'min-height': minHeight }">
          <el-table v-loading="loading" :data="dataList">
            <el-table-column label="序号" prop="a" />
            <el-table-column label="科目" prop="b" />
            <el-table-column label="时间" prop="c" />
            <el-table-column label="起止凭证号" prop="d" />
            <el-table-column label="借方" prop="e" />
            <el-table-column label="贷方" prop="f" />
            <el-table-column label="余额" prop="g" />
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryForm.pageNum"
            :limit.sync="queryForm.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      total: 3,
      formShow: true,
      dataList: [
        {
          a: 1,
          b: "银行存款",
          c: "2020-01-02",
          d: "36 - 36",
          e: "5.00",
          f: "",
          g: "+5.00"
        },
        {
          a: 2,
          b: "银行存款",
          c: "2020-01-02",
          d: "36 - 36",
          e: "",
          f: "5.00",
          g: "+5.00"
        },
        
      ],
      itemOptions: [
        {
          label: "库存现金"
        },
        {
          label: "银行贷款"
        },
        {
          label: "其他货币资金"
        },
        {
          label: "短期投资"
        },
        {
          label: "应收票据"
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      itemName: "",
      queryForm: {
        pageNum: 1,
        pageSize: 10
      },
      dateRange: []
    };
  },
  watch: {
    // 根据名称筛选部门树
    itemName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {},
  methods: {
    getList() {},
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick() {},
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        timestart: dateRange.length > 0 ? dateRange[0] : null,
        timeend: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>
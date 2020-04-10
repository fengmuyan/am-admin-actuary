<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="商户名称" prop="userName">
            <el-input
              v-model="queryForm.userName"
              placeholder="请输入商户名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="审核状态" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="待审核" value="0" />
              <el-option label="未通过" value="1" />
              <el-option label="通过" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 260px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
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
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="userList">
        <el-table-column label="商户名称" prop="username" />
        <el-table-column label="联系方式" prop="phone" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="审核状态" prop="voState">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.state===1,'suc-color':scope.row.state===2}"
            >{{scope.row.voState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="拒绝原因" prop="reason" />
        <el-table-column label="申请时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              v-if="scope.row.state===0"
              @click="handleRefuse(scope.row)"
            >拒绝</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              v-if="scope.row.state===0"
              @click="handleAgree(scope.row)"
            >同意</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { getApplyList, handelApply } from "@/api/examin";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      userList: [],
      total: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        state: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { _initParams, queryForm } = this;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await getApplyList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.userList = content;
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAgree(item) {
      this.$confirm("确定要通过审核吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      }).then(async () => {
        try {
          this.loading = true;
          const { code } = await handelApply({ uid: item.uid, state: 2 });
          this.loading = false;
          if (code === 200) {
            this.msgSuccess("操作成功");
            this.getList();
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      });
    },
    handleRefuse(item) {
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPattern: /\S/,
        inputErrorMessage: "拒绝原因不能为空"
      }).then(async ({ value }) => {
        try {
          this.loading = true;
          const { code } = await handelApply({
            uid: item.uid,
            state: 1,
            reason: value
          });
          this.loading = false;
          if (code === 200) {
            this.msgSuccess("操作成功");
            this.getList();
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      });
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        beginTime: dateRange.length > 0 ? dateRange[0] : null,
        endTime: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>
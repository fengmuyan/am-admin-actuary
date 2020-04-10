<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="店铺名称" prop="card">
            <el-input v-model="queryForm.a" style="width:240px" placeholder="请输入店铺名称" />
          </el-form-item>

          <el-form-item style="padding-left:11px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增店铺</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="cardList">
        <el-table-column label="序号" prop="a" width="80" />
        <el-table-column label="项目名称" prop="b" />
        <el-table-column label="关联店铺" prop="c" />
        <el-table-column label="创建时间" prop="d" />
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除</el-button>
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

    <el-dialog title="新增项目名称" :visible.sync="open" width="500px" @close="clearValidate">
      <el-form ref="cardForm" :model="cardForm" :rules="cardFormRules" label-width="100px">
        <el-form-item label="项目名称" prop="a">
          <el-input style="width:300px" v-model="cardForm.a" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="关联店铺" prop="b">
          <el-select v-model="cardForm.b" placeholder="请选择" style="width:300px">
            <el-option label="店铺测试001" value="1000" />
            <el-option label="店铺测试002" value="1001" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('cardForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      open: false,
      total: 1,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        a: undefined
      },
      cardList: [
        {
          a: "1",
          b: "农业银行",
          c: "店铺测试0001",
          d: "2019-2-20 12:20:23"
        }
      ],
      cardForm: {
        a: "",
        b: "",
        c: ""
      },
      cardFormRules: {
        a: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        b: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        c: [{ required: true, message: "用户名称不能为空", trigger: "blur" }]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
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
    resetCardForm() {
      Object.assign(this.cardForm, {
        a: undefined,
        b: undefined,
        c: undefined
      });
    },
    async handleAdd() {
      this.resetCardForm();
      this.title = "新增店铺";
      this.open = true;
      try {
      } catch (err) {
        console.log(err);
      }
    },
    async handleEdit(item) {
      this.resetCardForm();
      this.title = "修改店铺";
      Object.assign(this.cardForm, {
        a: item.a,
        b: item.b,
        c: item.c
      });
      this.open = true;
      try {
      } catch (err) {
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    handleDel(item) {
      this.$confirm("确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      }).then(async () => {
        try {
        } catch (err) {}
      });
    },
    clearValidate() {
      this.$refs.cardForm.resetFields();
    }
  }
};
</script>
<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="70px">
          <el-form-item label="银行卡" prop="card">
            <el-select v-model="queryForm.card" placeholder="请选择" clearable size="small">
              <el-option label="农业银行" value="1000" />
              <el-option label="华夏银行" value="1001" />
            </el-select>
          </el-form-item>
          <el-form-item label="录入状态" prop="state">
            <el-select v-model="queryForm.state" placeholder="请选择" clearable size="small">
              <el-option label="已录入" value="1000" />
              <el-option label="未录入" value="1001" />
            </el-select>
          </el-form-item>
          <el-form-item label="导入批次" prop="batch">
            <el-select v-model="queryForm.batch" placeholder="请选择" clearable size="small">
              <el-option label="导入批次1" value="1000" />
              <el-option label="导入批次2" value="1001" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 340px"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增记录</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleUpload">导入记录</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <el-button
            type="primary"
            style="margin-right:15px"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelAll"
          >批量删除</el-button>
        </el-col>
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
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="recordList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="编号" prop="a" width="50" />
        <el-table-column label="所属银行卡" prop="b" width="150" show-overflow-tooltip />
        <el-table-column label="项目名" prop="c" width="150" show-overflow-tooltip />
        <el-table-column label="科目名称" prop="d" show-overflow-tooltip />
        <el-table-column label="创建日期" prop="e" width="150" />
        <el-table-column label="备注名" prop="f" />
        <el-table-column label="摘要" prop="g" width="150" show-overflow-tooltip />
        <el-table-column label="借" prop="h" width="100" />
        <el-table-column label="贷" prop="i" width="100" />
        <el-table-column label="状态" prop="voj" width="100" />
        <el-table-column label="导入批次" prop="k" width="100" />
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              v-if="Number(scope.row.j === '1')"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-if="Number(scope.row.j === '1')"
              @click="handleDel(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="Number(scope.row.j === '1')"
              @click="handleInput(scope.row)"
            >录入凭证</el-button>
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

    <el-dialog title="新增记录" :visible.sync="open" width="550px" @close="clearValidate">
      <el-form
        ref="recordAddForm"
        :model="recordAddForm"
        :rules="recordAddFormRules"
        label-width="110px"
      >
        <el-form-item label="类型" prop="a">
          <el-radio-group v-model="recordAddForm.a">
            <el-radio :label="0">借</el-radio>
            <el-radio :label="1">贷</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="银行卡名称" prop="b">
          <el-select v-model="recordAddForm.b" placeholder="请选择" style="width:370px">
            <el-option label="农业银行" value="1000" />
            <el-option label="华夏银行" value="1001" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="c">
          <el-input v-model="recordAddForm.c" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="日期" prop="d">
          <el-date-picker
            style="width:370px"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="recordAddForm.d"
            placeholder="请输入时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注名" prop="e">
          <el-input v-model="recordAddForm.e" placeholder="请输入备注名" />
        </el-form-item>
        <el-form-item label="摘要" prop="f">
          <el-input v-model="recordAddForm.f" placeholder="请输入摘要" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('recordAddForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入记录" :visible.sync="openUpload" width="550px" @close="clearValidateUpload">
      <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="110px">
        <el-form-item label="批次名称" prop="batchName">
          <el-input v-model="uploadForm.batchName" maxlength="30" placeholder="请输入本批次名称"></el-input>
        </el-form-item>
        <el-form-item label="银行卡名称" prop="card">
          <el-select v-model="uploadForm.card" placeholder="请选择" style="width:370px">
            <el-option label="农业银行" value="1000" />
            <el-option label="华夏银行" value="1001" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据导入" prop="file" ref="uploadElement" v-if="fileShow">
          <upload-file
            @add-item="addItemFir"
            @del-item="delItemFir"
            ref="fileItemOne"
            v-model="uploadForm.file"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openUpload = false">取 消</el-button>
        <el-button type="primary" @click="submitUploadForm('uploadForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import minHeightMix from "@/mixins/minHeight";
import UploadFile from "@/components/UploadFile";
export default {
  mixins: [minHeightMix],
  components: { UploadFile },
  data() {
    return {
      loading: false,
      formShow: true,
      recordList: [
        {
          a: "1",
          b: "农业银行",
          c: "投资北京联通公司",
          d: "10010001001_库存现金-天猫美的紫莱店支付宝-test",
          e: "2019-12-02",
          f: "test",
          g: "测试摘要",
          h: "100.00",
          i: "0",
          j: "1",
          voj: "未录入",
          k: "导入批次1"
        },
        {
          a: "2",
          b: "农业银行",
          c: "投资北京联通公司",
          d: "10010001001_库存现金-天猫美的紫莱店支付宝-test",
          e: "2019-12-02",
          f: "test",
          g: "测试摘要",
          h: "100.00",
          i: "0",
          j: "1",
          voj: "未录入"
        },
        {
          a: "3",
          b: "农业银行",
          c: "投资北京联通公司",
          d: "10010001001_库存现金-天猫美的紫莱店支付宝-test",
          e: "2019-12-02",
          f: "test",
          g: "测试摘要",
          h: "100.00",
          i: "0",
          j: "2",
          voj: "已录入",
          k: "导入批次2"
        }
      ],
      total: 3,
      dateRange: [],
      fileShow: true,
      itemOptions: [
        {
          id: "1",
          label: "库存现金",
          children: [
            {
              id: "1-1",
              label: "天猫美的紫莱店支付宝_testabc"
            }
          ]
        },
        {
          id: "2",
          label: "银行贷款",
          children: [
            {
              id: "2-1",
              label: "紫莱建行基本户2835"
            },
            {
              id: "2-2",
              label: "紫莱民生私户5755"
            }
          ]
        },
        {
          id: "3",
          label: "其他货币资金"
        }
      ],
      open: false,
      openUpload: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        card: undefined,
        state: undefined,
        batch: undefined
      },
      recordAddForm: {
        gid: undefined,
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined,
        e: undefined,
        f: undefined
      },
      recordAddFormRules: {
        a: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        b: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        c: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        d: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        e: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
        f: [{ required: true, message: "用户名称不能为空", trigger: "blur" }]
      },
      uploadForm: {
        batchName: undefined,
        file: undefined,
        card: undefined
      },
      uploadFormRules: {
        batchName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        card: [{ required: true, message: "银行卡不能为空", trigger: "blur" }],
        file: [{ required: true, message: "数据文件不能为空", trigger: "blur" }]
      }
    };
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { _initParams, queryForm } = this;
        this.loading = false;
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
    resetAddForm() {
      Object.assign(this.recordAddForm, {
        gid: undefined,
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined,
        e: undefined,
        f: undefined
      });
    },
    async handleAdd() {
      this.resetAddForm();
      this.title = "新增记录";
      this.open = true;
      try {
      } catch (err) {
        console.log(err);
      }
    },
    async handleEdit(item) {
      this.resetAddForm();
      this.title = "修改记录";
      Object.assign(this.recordAddForm, {
        gid: "1",
        a: item.a,
        b: item.b,
        c: item.c,
        d: item.d,
        e: item.e,
        f: item.f
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
    handleInput(item) {},
    clearValidate() {
      this.$refs.recordAddForm.resetFields();
    },
    clearValidateUpload() {
      this.$refs.uploadForm.resetFields();
    },
    resetUploadForm() {
      Object.assign(this.formUpload, {
        batchName: undefined,
        card: undefined,
        file: null
      });
    },
    handleSelectionChange() {},
    handleDelAll() {},
    addItemFir(val) {
      this.uploadForm.file = val[0];
      this.$refs["uploadElement"].clearValidate();
    },
    delItemFir(val) {
      this.uploadForm.file = null;
    },
    handleUpload() {
      this.openUpload = true;
    },
    submitUploadForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
        }
      });
    },
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
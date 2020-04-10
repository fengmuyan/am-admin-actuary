<template>
  <div class="box-wrap">
    <div class="table-box">
      <el-button @click="addItem">新增</el-button>
      <el-button @click="delAllItem">批量删除</el-button>
      <table cellpadding="0" cellspacing="0">
        <thead>
          <th v-for="(item,index) in thData" :key="index" :width="item.width">
            <span class="require-icon" v-if="item.isRequire === true">*</span>
            <i class="el-icon-edit-outline" v-if="item.isEdit === true"></i>
            {{item.name}}
          </th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tableData" :key="index">
            <td v-for="(v,i) in item.content" :key="i" :class="{'edit-action':item.editAction}">
              <div v-if="item.editAction">
                <span v-if="v.canEdit === false">
                  <el-checkbox v-if="i === 0" v-model="v.checked"></el-checkbox>
                  {{v.value}}
                </span>
                <el-input
                  v-if="v.canEdit && v.inputType === 1"
                  v-model="v.value"
                  :disabled="v.disabled"
                  :placeholder="v.placeholder"
                  :maxlength="v.maxLen"
                  :class="{'err-validate':v.validate}"
                  v-on:blur="handleBlur(index,i)"
                  v-on:input="handleInput(index,i)"
                  :style="`width:${v.width}px`"
                ></el-input>
                <el-select
                  v-if="v.canEdit && v.inputType === 2"
                  :disabled="v.disabled"
                  v-model="v.value"
                  :placeholder="v.placeholder"
                  :class="{'err-validate':v.validate}"
                  @change="selectChange(index,i)"
                  style="width:120px"
                >
                  <el-option
                    v-for="item in v.inputOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div v-else>
                <span>
                  <el-checkbox v-if="i === 0" v-model="v.checked"></el-checkbox>
                  <i class="el-icon-s-flag" v-if="i === 1 && item.isGuide === true"></i>
                  <i class="el-icon-s-custom" v-if="i === 1 && item.isGuide === false"></i>
                  {{v.value}}
                </span>
              </div>
            </td>
            <td width="200" :class="{'edit-action':item.editAction}">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-if="!item.isGuide"
                @click="updateItem(index)"
              >{{item.editAction === true?"保存":"修改"}}</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="delItem(index)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableInit: {
      type: Object,
      default() {
        return { touristList: [] };
      }
    }
  },

  data() {
    return {
      modelTableData: {
        editAction: true,
        isGuide: false,
        content: [
          {
            key: "order",
            value: "",
            idValue: "",
            canEdit: false,
            noValidate: true,
            checked: false,
            unStr: ""
          },
          {
            key: "fullname",
            value: "",
            placeholder: "输入姓名",
            canEdit: true,
            inputType: 1,
            maxLen: 100,
            validate: false,
            validexpType: 4,
            errMsg: "* 姓名不能为空。",
            width: 120
          },
          {
            key: "cardType",
            value: "",
            placeholder: "证件类型",
            isCard: true,
            canEdit: true,
            validate: false,
            inputType: 2,
            validexpType: 6,
            inputOptions: [
              {
                value: "身份证",
                label: "身份证"
              },
              {
                value: "护照",
                label: "护照"
              }
            ],
            errMsg: "* 证件类型不能为空。"
          },
          {
            key: "cardId",
            value: "",
            placeholder: "输入证件号码",
            isCardInput: true,
            canEdit: true,
            validate: false,
            inputType: 1,
            maxLen: 22,
            validexpType: 2,
            errMsg: "* 证件号码不能为空或格式不正确。",
            width: 220
          },
          {
            key: "dateOfBirth",
            value: "",
            placeholder: "出生日期",
            canEdit: true,
            inputType: 1,
            maxLen: 10,
            validexpType: 5,
            errMsg: "* 出生年月格式不正确，例：1980-02-02 。",
            width: 150
          },
          {
            key: "gender",
            value: "",
            placeholder: "输入性别",
            canEdit: true,
            noValidate: true,
            inputType: 2,
            inputOptions: [
              {
                value: "男",
                label: "男"
              },
              {
                value: "女",
                label: "女"
              }
            ]
          },
          {
            key: "phone",
            value: "",
            placeholder: "输入手机号",
            canEdit: true,
            validate: false,
            inputType: 1,
            maxLen: 11,
            validexpType: 1,
            errMsg: "* 手机号格式不正确。",
            width: 130
          }
        ]
      }, //表格模板数据
      thData: [
        { name: "序号" },
        { name: "姓名", isEdit: true, isRequire: true },
        { name: "证件类型", isEdit: true, isRequire: true },
        { name: "证件号码", isEdit: true, isRequire: true },
        { name: "出生日期", isEdit: true },
        { name: "性别", isEdit: true },
        { name: "手机号码", isEdit: true },
        { name: "操作" }
      ],
      errMsgArr: [],
      tableData: []
    };
  },

  created() {
    this._initTableData();
  },

  methods: {
    _delItem(oprate) {
      const localStorageData = JSON.parse(
        window.localStorage.getItem("tableData")
      );
      const idCard = this.tableData.findIndex(item => {
        if (item.content[0].idValue) {
          return item.content[0].idValue === oprate.content[0].idValue;
        }
      });
      const idUnStr = this.tableData.findIndex(item => {
        if (item.content[0].unStr) {
          return item.content[0].unStr === oprate.content[0].unStr;
        }
      });
      const idCard2 = localStorageData.findIndex(item => {
        if (item.id) {
          return item.id === oprate.content[0].idValue;
        }
      });
      const idUnStr2 = localStorageData.findIndex(item => {
        if (item.unStr) {
          return item.unStr === oprate.content[0].unStr;
        }
      });
      if (idCard !== -1) {
        this.tableData.splice(idCard, 1);
      }
      if (idUnStr !== -1) {
        this.tableData.splice(idUnStr, 1);
      }
      if (idCard2 !== -1) {
        localStorageData.splice(idCard2, 1);
      }
      if (idUnStr2 !== -1) {
        localStorageData.splice(idUnStr2, 1);
      }
      window.localStorage.setItem(
        "tableData",
        JSON.stringify(localStorageData)
      );
    },

    /* 表格删除某项操作 */
    delItem(index) {
      this._confirmModel(
        `确定要删除 ${this.tableData[index].content[1].value} 吗？`,
        "确定",
        function() {
          this._delItem(this.tableData[index]);
          this._reSort(this.tableData);
          this.$emit("total-num");
        }
      );
    },

    delAllItem() {
      const checkedData = this.tableData.filter((item, index) => {
        return item.content[0].checked === true;
      });
      if (checkedData.length === 0) {
        this._confirmModel(`没有选中数据`);
      } else {
        const nameStr = checkedData
          .map(item => {
            return item.content[1].value;
          })
          .join(",");
        this._confirmModel(
          `确定要删除 [${nameStr}] 数据吗？`,
          "确定",
          function() {
            checkedData.forEach(item => {
              this._delItem(item);
            });
            this._reSort(this.tableData);
            this.$emit("total-num");
          }
        );
      }
    },

    /* 表格新增一行 */
    addItem() {
      const model = this._deepClone(this.modelTableData);
      model.content[0].value = this.tableData.length + 1;
      model.content[0].unStr = this._generateStr(15);
      this.tableData.push(model);
    },

    /* 表格中select触发事件 */
    selectChange(index, i) {
      const item = this.tableData[index].content;
      if (item[i].isCard === true) {
        if (item[i].value === "护照") {
          Object.assign(item[5], {
            disabled: false,
            placeholder: "选择性别",
            noValidate: false
          });
          Object.assign(item[4], {
            disabled: false,
            placeholder: "输入出生年月日",
            noValidate: false
          });
          Object.assign(item[3], {
            validexpType: 3
          });
          this._validate(item);
        } else if (item[i].value === "身份证") {
          Object.assign(item[5], {
            disabled: true,
            placeholder: "身份证带入",
            noValidate: true
          });
          Object.assign(item[4], {
            disabled: true,
            placeholder: "身份证带入",
            noValidate: true
          });
          Object.assign(item[3], {
            validexpType: 2
          });
          this._validate(item);
        }
      }
      item[i].validate = false;
    },

    /* 表格中保存修改操作 */
    updateItem(index) {
      const editAction = this.tableData[index].editAction;
      if (editAction === true) {
        this.errMsgArr = [];
        this.selectChange(index, 2);
        this.handleBlur(index, 3);
        const content = this.tableData[index].content.filter(item => {
          return item.noValidate !== true;
        });
        content.forEach(item => {
          this._validate(item);
        });
        if (this.errMsgArr.length === 0) {
          this.tableData[index].editAction = false;
          const content = this.tableData[index].content;
          const localStorageData = JSON.parse(
            window.localStorage.getItem("tableData")
          );
          const idCard = localStorageData.findIndex(item => {
            if (item.id !== "") {
              return item.id === this.tableData[index].content[0].idValue;
            }
          });
          const obj = {
            id: content[0].idValue,
            fullname: content[1].value,
            cardType: this._cardDeInit(content[2].value),
            cardId: content[3].value,
            dateOfBirth: content[4].value,
            gender: this._genderDeInit(content[5].value),
            phone: content[6].value,
            unStr: content[0].unStr
          };
          if (idCard === -1) {
            const idUnStr = localStorageData.findIndex(item => {
              if (item.unStr) {
                return item.unStr === this.tableData[index].content[0].unStr;
              }
            });
            if (idUnStr !== -1) {
              Object.assign(localStorageData[idUnStr], obj);
            } else {
              localStorageData.push(obj);
            }
          } else {
            Object.assign(localStorageData[idCard], obj);
          }
          window.localStorage.setItem(
            "tableData",
            JSON.stringify(localStorageData)
          );
          this.$emit("total-num");
        } else {
          const h = this.$createElement;
          this._confirmModel(
            h(
              "ul",
              {
                style:
                  "list-style:none;line-height:28px;margin:0;padding:0;font-size:16px"
              },
              [
                h("li", null, this.errMsgArr[0]),
                h("li", null, this.errMsgArr[1]),
                h("li", null, this.errMsgArr[2]),
                h("li", null, this.errMsgArr[3]),
                h("li", null, this.errMsgArr[4])
              ]
            )
          );
        }
      } else {
        this.selectChange(index, 2);
        this.tableData[index].editAction = !editAction;
      }
    },

    checkIdNumberValid(tex) {
      var num = tex.value;
      num = num.toUpperCase();

      var len, re;
      len = num.length;
      if (len == 0) return true;

      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
        return false;
      }

      //验证前两位地区是否有效
      var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };

      if (aCity[parseInt(num.substr(0, 2))] == null) {
        return false;
      }

      //当身份证为15位时的验证出生日期。
      if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(
          "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
        );
        var bGoodDay;
        bGoodDay =
          dtmBirth.getYear() == Number(arrSplit[2]) &&
          dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
          dtmBirth.getDate() == Number(arrSplit[4]);
        if (!bGoodDay) {
          return false;
        }
      }

      //当身份证号为18位时，校验出生日期和校验位。
      if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
        //检查生日日期是否正确
        var dtmBirth = new Date(
          arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
        );
        var bGoodDay;
        bGoodDay =
          dtmBirth.getFullYear() == Number(arrSplit[2]) &&
          dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
          dtmBirth.getDate() == Number(arrSplit[4]);
        if (!bGoodDay) {
          return false;
        } else {
          //检验18位身份证的校验码是否正确。
          //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
          var valnum;
          var arrInt = new Array(
            7,
            9,
            10,
            5,
            8,
            4,
            2,
            1,
            6,
            3,
            7,
            9,
            10,
            5,
            8,
            4,
            2
          );
          var arrCh = new Array(
            "1",
            "0",
            "X",
            "9",
            "8",
            "7",
            "6",
            "5",
            "4",
            "3",
            "2"
          );
          var nTemp = 0,
            i;
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i];
          }
          valnum = arrCh[nTemp % 11];
          if (valnum != num.substr(17, 1)) {
            return false;
          }
        }
      }
      return true;
    },

    /* 表格身份证号项失去焦点填入性别出生日期 */
    handleBlur(index, i) {
      const item = this.tableData[index].content;
      const IdCardNumberReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
      // 在此处校验身份证
      if (item[i].isCardInput === true && item[2].value === "身份证") {
        // if (item[3].value !== "" && IdCardNumberReg.test(item[3].value)) {  //不精确校验
        if (item[3].value !== "" && this.checkIdNumberValid(item[3])) {
          //精确校验
          item[5].value = this._getAnalysisIdCard(item[i].value, 2);
          item[4].value = this._getAnalysisIdCard(item[i].value, 1);
        } else {
          item[5].value = "";
          item[4].value = "";
        }
      } else {
        return false;
      }
    },

    /* 表格中input输入事件监听触发验证 */
    handleInput(index, i) {
      const item = this.tableData[index].content[i];
      this._validate(item, false);
    },

    /* 初始后端返回数据 */
    _initTableData() {
      const { guideName, touristList } = this.tableInit;
      let guideData = [];
      const findIdx = touristList.findIndex(item => {
        return item.fullname === guideName;
      });
      const haveGuide = findIdx !== -1;
      if (haveGuide) {
        guideData.push(this._deepClone(touristList[findIdx]));
        guideData[0].isguide = true;
        touristList.splice(findIdx, 1);
      }
      window.localStorage.setItem(
        "tableData",
        JSON.stringify([...guideData, ...touristList])
      );
      this.tableData = [...guideData, ...touristList]
        .map((item, index) => {
          return Object.assign(item, {
            dateOfBirth: this._dateOfBirthInit(item.dateOfBirth),
            gender: this._genderInit(item.gender),
            cardType: this._cardInit(item.cardType),
            order: index + 1
          });
        })
        .map((item, index) => {
          const cloneData = this._deepClone(this.modelTableData);
          return Object.assign(cloneData, {
            editAction: false,
            isGuide: index === 0 && haveGuide ? true : false,
            content: cloneData.content.map(v => {
              if (v.key === "order") {
                return Object.assign(v, {
                  value: item[v.key],
                  idValue: item.id
                });
              } else {
                return Object.assign(v, {
                  value: item[v.key] ? item[v.key] : ""
                });
              }
            })
          });
        });
      const addLen = 10 - this.tableData.length;
      if (addLen > 0) {
        for (let i = 0; i < addLen; i++) {
          this.addItem();
        }
      }
    },

    /* 处理成后端想要数据 */
    _deinitData() {
      const data = this.tableData.reduce((pre, item) => {
        const itemdData = item.content;
        pre.push({
          id: itemdData[0].idValue,
          fullname: itemdData[1].value,
          cardType: this._cardDeInit(itemdData[2].value),
          cardId: itemdData[3].value,
          dateOfBirth: itemdData[4].value,
          gender: this._genderDeInit(itemdData[5].value),
          phone: itemdData[6].value
        });
        return pre;
      }, []);
      window.localStorage.setItem("tableData", JSON.stringify(data));
    },

    /* 表格数据保存验证  */
    _validate(item, addMsg = true) {
      if (item.validexpType === 1) {
        if (/^1[345678]\d{9}$/.test(item.value) || item.value === "") {
          item.validate = false;
        } else {
          item.validate = true;
          this.errMsgArr.push(item.errMsg);
        }
      } else if (item.validexpType === 2) {
        if (!this.checkIdNumberValid(item) || item.value === "") {
          item.validate = true;
          if (addMsg) this.errMsgArr.push(item.errMsg);
        } else {
          item.validate = false;
        }
      } else if (item.validexpType === 3) {
        const regExp = /^[0-9a-zA-Z]{1,20}$/;
        if (!regExp.test(item.value) || item.value === "") {
          item.validate = true;
          if (addMsg) this.errMsgArr.push(item.errMsg);
        } else {
          item.validate = false;
        }
      } else if (item.validexpType === 4) {
        if (item.value === "") {
          item.validate = true;
          if (addMsg) this.errMsgArr.push(item.errMsg);
        } else {
          item.validate = false;
        }
      } else if (item.validexpType === 5) {
        if (/^\d{4}-\d{2}(-\d{2})?$/.test(item.value) || item.value === "") {
          item.validate = false;
        } else {
          item.validate = true;
          if (addMsg) this.errMsgArr.push(item.errMsg);
        }
      } else if (item.validexpType === 6) {
        if (item.value === "") {
          item.validate = true;
          if (addMsg) this.errMsgArr.push(item.errMsg);
        } else {
          item.validate = false;
        }
      }
    },

    /* 根据身份证获取性别和出生日期  */
    _getAnalysisIdCard(card, num) {
      if (num === 1) {
        let birth =
          card.substring(6, 10) +
          "-" +
          card.substring(10, 12) +
          "-" +
          card.substring(12, 14);
        return birth;
      }
      if (num === 2) {
        if (parseInt(card.substr(16, 1)) % 2 == 1) {
          return "男";
        } else {
          return "女";
        }
      }
    },

    /* 初始后端证件类型数据 */
    _cardInit(val) {
      const arr = ["", "身份证", "护照"];
      return arr[val];
    },

    /* 初始后端性别数据 */
    _genderInit(val) {
      const arr = ["女", "男"];
      return arr[val];
    },

    /* 初始后端证件类型数据 */
    _cardDeInit(val) {
      if (val === "身份证") {
        return 1;
      } else if (val === "护照") {
        return 2;
      }
    },

    /* 初始后端性别数据 */
    _genderDeInit(val) {
      if (val === "男") {
        // return 1;
        return 0;
      } else if (val === "女") {
        // return 0;
        return 1;
      }
    },

    /* 初始后端出生日期数据 */
    _dateOfBirthInit(val) {
      if (val) {
        return val.split(" ")[0];
      } else {
        return val;
      }
    },

    /* 深拷贝 */
    _deepClone(source) {
      if (!source && typeof source !== "object") {
        throw new Error("error arguments", "shallowClone");
      }
      const targetObj = source.constructor === Array ? [] : {};
      Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
          targetObj[keys] = source[keys].constructor === Array ? [] : {};
          targetObj[keys] = this._deepClone(source[keys]);
        } else {
          targetObj[keys] = source[keys];
        }
      });
      return targetObj;
    },

    /* 表格数据排序 */
    _reSort(val) {
      val.forEach((item, index) => {
        item.content[0].value = index + 1;
      });
    },

    /* confirmBox封装  */
    _confirmModel(msg, confirmButtonText = "确定", confirmFn, cancelFn) {
      this.$confirm(msg, "系统提示", {
        confirmButtonText,
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(() => {
          if (confirmFn) {
            confirmFn.call(this);
          }
        })
        .catch(() => {
          if (cancelFn) {
            cancelFn.call(this);
          }
        });
    },

    _generateStr(len) {
      var len = len || 32;
      var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = $chars.length;
      var pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  }
};
</script>

<style lang="scss">
.box-wrap {
  .table-box {
    min-height: 560px;
    table {
      border-color: rgb(250, 250, 250);
      width: 100%;
      td,
      th {
        border-bottom: 1px solid rgb(220, 220, 220);
      }
      th {
        text-align: left;
        font-size: 14px;
        color: #666;
        padding: 14px;
        background-color: rgb(245, 245, 245);
        padding: 12px 8px;
      }
      td {
        font-size: 13px;
        background-color: #fff;
        padding: 5px 2px;
      }
      .err-validate {
        .el-input__inner {
          color: #ef6776;
          border-color: #ef6776;
          padding: 0 8px;
        }
      }
      .edit-action {
        background-color: #f3f4f5;
      }
      .require-icon {
        color: #ef6776;
        font-size: 20px;
        vertical-align: middle;
      }
    }
    table tbody {
      display: block;
      height: 432px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    table thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
      border-left: 1px solid rgb(220, 220, 220);
      border-bottom: 1px solid rgb(220, 220, 220);
    }
    table thead {
      background-color: #f5f5f5;
      width: calc(100% - 1.25em);
    }
    .tip-info-table {
      color: #ccc;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
    }
    tr > td:first-child {
      width: 50px;
      text-align: center;
    }
    thead > th:first-child(2) {
      text-align: center;
    }
    thead > th:first-child {
      width: 50px;
      text-align: center;
    }
    tr > td:last-child {
      width: 120px;
      text-align: center;
    }
    thead > th:last-child {
      width: 120px;
      text-align: center;
    }
  }
}
</style>

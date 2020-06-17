<template>
  

<div style="width: 100%">
<el-container style="border: 1px solid #eee">

  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="addTestPlan()" >新增计划</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>Lu.Xie</span>
    </el-header>
    
    <el-main>
      <el-table :data="tableData"  v-if="tableData.length>0" 
      stripe style="width: 100%" 
      :row-class-name="tableRowClassName">
       <el-table-column v-for="item in colConfigs" v-bind:key="item.prop"
      :prop="item.prop"
      :label="item.label">
      </el-table-column>
      <el-table-column fixed="right"
      label="报告"
      width="120">
      <template slot-scope="scope">
        <el-button @click="executeTest(scope.row)" type="text" size="small">执行</el-button>
        <el-button @click="getTestReport(scope.row)" type="text" size="small">查看</el-button>
      </template>
      </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  export default {
    mounted(){
      this.getTestPlans();
      this.getLatestAgent();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (this.tableData[rowIndex].status == 'failure') {
          return 'warning-row';
        } else if (this.tableData[rowIndex].status == 'success') {
          return 'success-row';
        }
        return '';
      },
      getTestPlans(){
        this.$http.get('http://localhost:8080/showall')
        .then((response) => {
          this.tableData = response.data;
          this.tableRowClassName();
        });
      },
      getTestReport(row){
        window.open('http://localhost:8080/getreport?testPlanId=' + row.id, '_blank')
      },
      addTestPlan(){
        this.$prompt('请输入测试计划', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: this.inputValidator,
          inputValue: '{"connNum":1,"host":"http://baidu.com","elapse":60,"script": {"path": "/","method": "GET"}}',
          inputErrorMessage: 'JSON格式不正确,请确认JSON对象中包含method,path的key,同时method的value应为大写'
        }).then(({ value }) => {
          this.$http.post('http://localhost:8080/addtestplan',value)
          this.$message({
            type: 'success',
            message: '新增测试计划是: ' + value
          },
          );
          this.getTestPlans()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      inputFormatter(input){
       try {
            if (typeof JSON.parse(str) == "object") {
              obj = JSON.parse(str)
              if(!("path" in obj)){
                return false
              }
              if(!("method" in obj)){
                return false
              }
              if(obj["method"]!="GET" && !("body" in obj)){
                return false
              }             
              return true;
            }
        } catch(e) {
          console.log("非法JSON!")
        }
        return false;
    },
    getLatestAgent(){
       this.$http.get("http://localhost:8080/getagent")
       .then((response) => {
          this.agent = response.data.agentIP;
        });
    },
    sendTestPlanToAgent(obj){
      this.$http.post("http://localhost:8081/sendtestplan",obj)
      .then((response)=> {
          if(response.status != 200){
            this.$message({
            type: 'failure',
            message: 'Agent执行失败!'
          });
          }
        });
    },
    executeTest(row){
      this.$confirm('此操作将重新执行测试,当前测试报告会被覆盖, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.agent = this.agent
          console.log(row)
          this.sendTestPlanToAgent(row)
          this.$message({
            type: 'success',
            message: '开始执行'
          });
        }).catch((e) => {
          console.log(e);
          this.$message({
            type: 'info',
            message: '已取消执行'
          });          
        });
    },
    },
    data() {
      return {
          agent:"",
          tableData : [],
          colConfigs: [
            { prop: 'id', label: '编号' },
            { prop: 'host', label: 'Host' },
            { prop: 'creator', label: '创建人' },
            { prop: 'status', label: '状态' },
            { prop: 'elaspe', label: '持续时长(单位:s)' },
            { prop: 'connNum', label: '并发用户数' },
            { prop: 'createTime', label: '创建时间' }
          ]
      }
    }
  };
</script>
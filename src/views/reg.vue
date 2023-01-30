<template>
  <div :xl="6" :lg="7" class="bg-login">
    <!--logo-->
    <!-- <el-image :src="require('@/assets/logo.png')" class="logo" /> -->
    <!--标题-->
    <el-row type="flex" class="row-bg row-two" justify="center" align="middle">
      <el-col :span="6"></el-col>
      <el-col :span="6">
        <!--标题-->
        <h1 class="title">注册账号</h1>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <!--form表单-->
    <el-row type="flex" class="row-bg card" justify="center" align="bottom">
      <el-col :span="7" class="login-card">
        <!--loginForm-->
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="21%" class="loginForm">
          <el-form-item label="账户" prop="username" style="width: 380px">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="width: 380px">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="btn-ground">
            <el-button type="primary" @click="submitForm('loginForm')">立即注册</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-link type="primary" href="/login"
          style="position: absolute; left: 2rem;bottom: 6.2rem;font-size: 0.8rem;">已有账号?去登录</el-link>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
export default {
  name: "login",
  data() {
    return {
      // 表单信息
      loginForm: {
        // 账户数据
        username: '',
        // 密码数据
        password: '',
        // 记住密码
        remember: false,
      },
      // 表单验证
      rules: {
        // 设置账户效验规则
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符的账户', trigger: 'blur' }
        ],
        // 设置密码效验规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符的密码', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 表单验证成功
          /* 发登陆请求 */
          this.$axios({
            url: '/user/register',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'post',
            data: {
              phone: this.loginForm.username,
              password: this.loginForm.password
            }
          }).then((res) => {
            if (res.data.code == 200) {
              this.$message('注册成功!');
              this.$router.push({ path: '/login' })//跳转页面
            } else {
              this.$message(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>
  
<style scoped>
.bg-login {
  height: 100vh;
  width: 100vw;
  background-color: #41b9a6;
  background-image: url("https://file.moyublog.com/d/file/2021-01-18/0243f499349182524123ec8bbcd0edeb.jpg");
  background-size: 200%;

}

.btn-ground {
  text-align: center;
  margin-left: -5vw;
  margin-top: 5vh;
}

.logo {
  /* margin: 30px; */
  height: 12vw;
  width: 20vw;
  position: absolute;
  left: 40vw;
}

.title {
  text-shadow: -3px 3px 1px #5f565e;
  text-align: center;
  margin: 0 auto;
  margin-top: 60%;
  color: #41b9a6;
  font-size: 30px;
  /* background-color: #5f565e; */
}

.login-card {
  margin-top: 5vh;
  background-color: #ffffff;
  opacity: 0.9;
  box-shadow: 0 0 20px #ffffff;
  border-radius: 10px;
  padding: 40px 40px 30px 15px;
  width: auto;
  position: relative;
}
</style>
  
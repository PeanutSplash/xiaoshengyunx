<template>
    <div class="leftNavigationBar">
        <el-row class="tac">
            <el-col>
                <el-menu default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect"
                    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="/home">
                        <i class="el-icon-s-check"></i>
                        <span slot="title">文件库</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>

</template>
  
<script>
export default {
    name: 'leftNavigationBar',
    data() {
        return ({
            activeIndex: '',//当前路由页面
            username: ''
        })
    },
    created() {
        var username = localStorage.getItem("userInfo");
        console.log('username=' + username)
        this.username = username
    },
    methods: {
        handleSelect(key) {//跳转到选择的路由
            console.log(key)
            this.activeIndex = key
            if (key === '/home' && this.$route.path != '/home') {
                this.$router.push('/home')
            }
        }
    }
}
</script>
  
<style >
html,
body {
    height: 100%;
    width: 100%;
}

.el-menu {
    height: 100vh;
    text-align: left;
}

.leftNavigationBar {
    height: 100%;
    margin-left: 0px;
    width: 15vw;
}

.tac {
    width: 100%;
    background-color: aqua;
}

.el-menu-vertical-demo {
    width: 100%;
    background-color: aquamarine;
}
</style>
  
<template>
    <div class="topFileBar">
        <h2>文件名</h2>
        <h2>创建时间</h2>
        <h2>更新时间</h2>
        <h2>路径</h2>
        <h2>操作</h2>
    </div>
</template>
  
<script>
export default {
    name: 'topFileBar',
    data() {
        return {
           
        }
    },
    created() {
       
    },
    methods: {
    }
}
</script>
  
<style >
h1 {
    font-weight: normal;
    font-size: 1.5vw;
    margin: auto 0;
    margin-left: 10vw;
}

h2 {
    font-weight: normal;
    font-size: 1.2vw;
    margin: auto 0;
}


.topFileBar {
    width: 85vw;
    height: 5vh;
    background-color: #F8F8F8;
    text-align: center;
    display: flex;
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.icon {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: flex;
    margin: auto 0;
    margin-left: auto;
    border: solid 1px #efefef;

}

</style>
  
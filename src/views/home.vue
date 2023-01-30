<template>
    <div class="home" style="margin: 0 auto;">
        <el-table :data="newList" style="width: 100%;padding-bottom: 20px;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                    <i class="el-icon-folder-opened" v-if="scope.row.type == '文件夹'"></i>
                    <i class="el-icon-document" v-if="scope.row.type == '文件'"></i>
                    <el-link
                        @click="scope.row.type == '文件夹' ? getDetailFileList(scope.row.id) : downloadFile(scope.row)"
                        style="margin-left: 5px;">{{ scope.row.name }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间">
            </el-table-column>
            <el-table-column prop="type" label="类型">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.type == '文件夹'" type="text" size="small"
                        @click="updateName(scope.row.id)">重命名</el-button>
                    <el-button v-if="scope.row.type == '文件夹'" type="text" size="small"
                        @click="deleteFloder(scope.row.id)">删除</el-button>
                    <el-button v-if="scope.row.type == '文件'" type="text" size="small"
                        @click="downloadFile(scope.row)">下载</el-button>
                    <el-button v-if="scope.row.type == '文件'" type="text" size="small"
                        @click="deleteFile(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-count="maxPage" @current-change="getPageNum">
        </el-pagination>
        <div ref="dragArea" class="drag-area">
            <el-tooltip effect="dark" content="返回上一目录" placement="top">
                <el-button size="mini" icon="el-icon-back" circle @click="parentDirectory"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="回到主目录" placement="top">
                <el-button size="mini" icon="el-icon-s-home" circle @click="getFileList"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="新增文件夹" placement="top">
                <el-button size="mini" icon="el-icon-plus" circle @click="openDialog"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="上传文件" placement="top">
                <el-button size="mini" icon="el-icon-upload" circle @click="dialogVisible = true"></el-button>
            </el-tooltip>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible">
            <el-upload class="upload-demo" drag :headers=myHeaders :data="uploadData" :on-success="afterUpload"
                :on-change="onFileChange" action="http://43.138.239.126:1208/xiaoshengcloud/user-file/upload" multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'home',
    data() {
        var token = localStorage.getItem("token");
        return {
            list: '',
            newList: '',
            maxPage: 1,
            currentPage: 1,
            dialogVisible: false,//dialog
            myHeaders: { token: token },
            uploadData: {//上传文件附带的参数
                folderId: '',
                filename: ''
            },
            parentId: ''//上一级目录
        }
    },
    created() {
        this.getToken()
        this.getFileList()
    },
    methods: {
        getToken() {//获取本地token
            var token = localStorage.getItem("token");
            if (token) {
                this.$axios.defaults.headers['token'] = token;//配置请求头
            }
        },
        getFileList() {//获取主目录
            this.$axios({
                url: '/folder/' + this.currentPage + '/' + 9,
                method: 'get',
                data: {}
            }).then((res) => {
                if (res.data.code == 200) {
                    console.log(res.data.data)
                    this.list = res.data.data.folderItem
                    this.maxPage = Math.ceil(Number(res.data.data.total) / 9)
                    this.parentId = res.data.data.folderItem.folderId
                    this.mergeList()//合并
                } else {
                    this.$message(res.data.data.msg);
                }
            })
        },
        getDetailFileList(e) {//获取文件目录
            this.currentPage = 1
            this.$axios({
                url: '/folder/' + e + '/' + this.currentPage + '/' + 9,
                method: 'get',
                data: {}
            }).then((res) => {
                if (res.data.code == 200) {
                    console.log(res.data.data)
                    this.list = res.data.data.folderItem
                    this.parentId = res.data.data.folderItem.parentId
                    this.maxPage = Math.ceil(Number(res.data.data.total) / 9)
                    this.mergeList()//合并
                } else {
                    this.$message(res.data.msg);
                }
            })
        },
        newFile(e) {//新增文件夹
            this.$axios({
                url: '/folder/create',
                method: 'post',
                data: {
                    name: e,
                    id: this.newList.folderId
                }
            }).then((res) => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功: '
                    });
                    this.getDetailFileList(this.newList.folderId)//重新刷新当前页面目录
                } else {
                    this.$message(res.data.msg);
                }
            })

        },
        updateName(e) {//文件夹重命名
            this.$prompt('请输入新名字', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.$axios({
                    url: '/folder/update?name=' + value + '&&id=' + e,
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }).then((res) => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功! '
                        });
                        this.getDetailFileList(this.newList.folderId)//重新刷新当前页面目录
                    } else {
                        this.$message(res.data.msg);
                    }
                })
            })

        },
        deleteFloder(e) {//删除文件夹
            this.$axios({
                url: '/folder/' + e,
                method: 'delete',
                data: {}
            }).then((res) => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!: '
                    });
                    this.getDetailFileList(this.newList.folderId)//重新刷新当前页面目录
                } else {
                    this.$message(res.data.msg);
                }
            })
        },
        deleteFile(e) {//删除文件
            this.$axios({
                url: 'user-file/delete/' + e + '?folderId=' + this.newList.folderId,
                method: 'delete',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
            }).then((res) => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!: '
                    });
                    this.getDetailFileList(this.newList.folderId)//重新刷新当前页面目录
                } else {
                    this.$message(res.data.msg);
                }
            })
        },
        onFileChange(e) {//有文件操作时执行
            this.uploadData.folderId = this.newList.folderId
            this.uploadData.filename = e.name
            console.log(this.uploadData)
        },
        afterUpload(e) {//文件上传成功后
            console.log(e)
            this.$message({
                message: e.msg
            });
            this.getDetailFileList(this.newList.folderId)//重新刷新当前页面目录
        },
        getPageNum(val) {//获取当前分页器对应的页码
            this.currentPage = val
            this.getFileList()
        },
        mergeList() {//把文件夹和文件合并到一起
            var flode = this.list.folders//文件夹
            var file = this.list.userFiles//文件
            for (var i in file) {
                file[i].name = file[i].filename
                file[i].type = '文件'
            }
            for (var i in flode) {
                flode[i].type = '文件夹'
            }
            var mergedList = flode.concat(file);
            mergedList.folderId = this.list.folderId
            this.newList = mergedList
        },
        openDialog() {//获取新建文件夹的名字
            this.$prompt('请输入新文件夹名字', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.newFile(value)
            })
        },
        downloadFile(e) {//下载文件
            console.log(e)
            this.$axios({
                url: 'user-file/download?id=' + e.id,
                method: 'get',
                responseType: 'blob', // important
            }).then((res) => {
                console.log(res)
                if (res.status == 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    console.log(url)
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', e.name); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                } else {
                    this.$message(res.data.msg);
                }
            })
        },
        parentDirectory() {//上级目录
            if (this.parentId == null) {
                this.parentId = this.newList.folderId
            }
            this.getDetailFileList(this.parentId)
        }

    },
    mounted() {
        /**
         * 监听悬浮拖拽区域
         */
        this.$nextTick(() => {
            // 获取DOM元素
            let dragArea = this.$refs.dragArea;
            // 缓存 clientX clientY 的对象: 用于判断是点击事件还是移动事件
            let clientOffset = {};
            // 绑定鼠标按下事件
            dragArea.addEventListener("mousedown", (event) => {
                let offsetX = dragArea.getBoundingClientRect().left; // 获取当前的x轴距离
                let offsetY = dragArea.getBoundingClientRect().top; // 获取当前的y轴距离
                let innerX = event.clientX - offsetX; // 获取鼠标在方块内的x轴距
                let innerY = event.clientY - offsetY; // 获取鼠标在方块内的y轴距
                // 缓存 clientX clientY
                clientOffset.clientX = event.clientX;
                clientOffset.clientY = event.clientY;
                // 鼠标移动的时候不停的修改div的left和top值
                document.onmousemove = function (event) {
                    dragArea.style.left = event.clientX - innerX + "px";
                    dragArea.style.top = event.clientY - innerY + "px";
                    // dragArea 距离顶部的距离
                    let dragAreaTop = window.innerHeight - dragArea.getBoundingClientRect().height;
                    // dragArea 距离左部的距离
                    let dragAreaLeft = window.innerWidth - dragArea.getBoundingClientRect().width;
                    // 边界判断处理
                    // 1、设置左右不能动
                    dragArea.style.left = dragAreaLeft + "px";
                    // 2、超出顶部处理
                    if (dragArea.getBoundingClientRect().top <= 0) {
                        dragArea.style.top = "0px";
                    }
                    // 3、超出底部处理
                    if (dragArea.getBoundingClientRect().top >= dragAreaTop) {
                        dragArea.style.top = dragAreaTop + "px";
                    }
                };
                // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件；否则鼠标抬起后还可以继续拖拽方块
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }, false);
            // 绑定鼠标松开事件
            dragArea.addEventListener('mouseup', (event) => {
                let clientX = event.clientX;
                let clientY = event.clientY;
            })
        });
    }
}

</script>
<style scoped>
.home {
    display: flex;
    flex-direction: column;
    height: max-content;
    width: 85vw;
}


.drag-area {
    position: fixed;
    right: 20px;
    top: 80%;
    z-index: 6666;
    padding: 13px;
    width: fit-content;
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0px 2px 15px 0px rgba(9, 41, 77, 0.15);
    cursor: move;
    user-select: none;
    text-align: center;
}

.box {
    width: 85vw;
    border: 1px solid #efefef;
    box-shadow: 0 0 20px #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-around; */

}

.textBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: space-around; */
    background-color: aqua;
    width: 85vw;
}

.topFileBar {
    width: 85vw;
    height: 5vh;
    background-color: #F8F8F8;
    text-align: center;
    display: flex;
    flex-direction: row;
    display: flex;

}

h1 {
    font-weight: normal;
    font-size: 1.5vw;
    margin: auto 0;
    margin-left: 10vw;
}

h2 {
    font-weight: normal;
    width: max-content;
    font-size: 1.2vw;
    margin: auto 0;
}

h3 {
    font-weight: normal;
    width: max-content;
    font-size: 1.2vw;
    margin: auto 0;
}
</style>
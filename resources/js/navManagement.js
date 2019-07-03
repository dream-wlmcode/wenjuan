var isaddbtnqx = false; //添加按钮权限
var isLeftck = true; //是否点击左边树结构

/*tree set s*/
var setting = {
    view: {
        selectedMulti: false,
    },
    check: {
        enable: true,
        chkStyle: "radio",
        radioType: "all",
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: false
    },
    callback: {
        onCheck: zTreeOnCheck,
        onClick: zTreeonClick,
    },
}

function zTreeOnCheck(event, treeId, treeNode) {
    // console.log(treeNode);
    var $table = $("#table-data");
    var leftTree = $.fn.zTree.getZTreeObj("leftTree");
    var node = leftTree.getNodeByParam("id", treeNode.id, null);
    
    if (treeNode.checked) {
        $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');

        isLeftck = false;
        var id = treeNode.id; //ID
        $("#adddh_parentId").attr("value", id);
        $("#pl_delete").attr("value", id);
        if(isaddbtnqx){
            //是否显示添加按钮
            $("#add_dh").addClass('in_show').removeClass('hide');
        }

        //刷新表格
        refreshTable($table,id,isLeftck);
        
    } else {
        $("#"+node.tId+"_a").removeClass('curSelectedNode');

        isLeftck = true;
        $("#adddh_parentId").attr("value", "0");
        $("#pl_delete").attr("value", "");
        if(isaddbtnqx){
            //是否显示添加按钮
            $("#add_dh").addClass('hide').removeClass('in_show');
        }

        //刷新表格
        refreshTable($table,0,isLeftck);
    }
}

function zTreeonClick(event, treeId, treeNode, clickFlag){
    var $table = $("#table-data");
    var leftTree = $.fn.zTree.getZTreeObj("leftTree");
    var node = leftTree.getNodeByParam("id", treeNode.id, null);
    if(treeNode.checked == false){
        $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');
        leftTree.checkNode(node, true); //将指定ID的节点选中


        /*----------------*/
        isLeftck = false;
        var id = treeNode.id; //ID
        console.log("id---:"+id);
        $("#addqx_parentId").attr("value", id);
        $("#pl_delete").attr("value", id);
        if(isaddbtnqx){
            //是否显示添加按钮
            $("#add_qx").addClass('in_show').removeClass('hide');
        }

        //刷新表格
        refreshTable($table,id,isLeftck);
        /*----------------*/
        
    }
}
/*tree set e*/




/*moveinTree set s*/
var moveinTree_setting = {
    view: {
        selectedMulti: false,
    },
    check: {
        enable: true,
        chkStyle: "radio",
        radioType: "all",
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: false
    },
    callback: {
        onCheck: moveinTreeOnCheck,
    },
}

function moveinTreeOnCheck(event, treeId, treeNode) {
    if (treeNode.checked) {
        var id = treeNode.id; //ID
        $("#movein_targetId").attr("value",id);
    }
}
/*moveinTree set e*/

var arr_authList = "";
$(function() {
    //获取权限
    $.ajax({
        url: domainUrl + 'admin/getUserInfo.do',
        type: "POST",
        dataType: "json",
        data: {
            token: token
        },
        success: function(data) {
            if (data.code == 200) {
                var authList = data.data.authList;
                arr_authList = authList.split(",");
                // console.log(arr_authList);
                if (arr_authList.indexOf('/admin/nav/list.do') != -1) {
                    var nav_list_do = "admin/nav/list.do";

                    // 获取左边树列表
                    $.ajax({
                        url: domainUrl + 'admin/nav/list.do',
                        type: "POST",
                        dataType: "json",
                        data: {
                            token: token,
                            page: 0
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                var zNodes = [];
                                for (var i = 0; i < data.data.length; i++) {
                                    zNodes.push({
                                        id: data.data[i].id,
                                        pId: data.data[i].parentId,
                                        name: data.data[i].name
                                    });
                                }
                                zNodes.push({
                                    id: 0,
                                    pId: -1,
                                    name: "跟目录",
                                });
                                $.fn.zTree.init($("#leftTree"), setting, zNodes);
                                //默认展开根目录
                                dafultzkdirectory("leftTree");
                            }
                        },
                        error: function(error) {
                            alert(error);
                            setTimeout(function() {
                                window.location.href = "/login.html";
                            },
                            1500);
                        }
                    });

                    //1.初始化Table
                    var $table = $("#table-data");
                    $("#table-data").bootstrapTable('destroy');
                    $.initBootstrapTable("#table-data", {
                        method: 'post',
                        url: domainUrl + 'admin/nav/list.do?token=' + token,
                        height: 'auto',
                        pageSize: 6,
                        queryParams: navMqueryParams,     
                        columns: [{
                            checkbox: true,
                            formatter: function (i,row) { // 每次加载 checkbox 时判断当前 row 的 id 是否已经存在全局 Set() 里
                                if($.inArray(row.id,overAllIds)!=-1){// 因为 判断数组里有没有这个 id 
                                    return {
                                        checked : true  // 存在则选中
                                    }
                                }
                            }  
                        },
                        {
                            field: 'id',
                            title: '导航ID',
                            visible: false
                        },
                        {
                            field: 'name',
                            title: '名称'
                        },
                        {
                            field: 'path',
                            title: '页面路径'
                        },
                        {
                            field: 'parentId',
                            title: '父ID',
                            visible: false
                        },
                        {
                            field: 'uName',
                            title: '创建者'
                        },
                        {
                            field: 'creDate',
                            title: '创建时间'
                        },
                        {
                            field: 'priority',
                            title: '显示顺序'
                        },
                        {
                            field: 'Button',
                            title: '操作',
                            events: operateEvents,
                            formatter: operateFormatter
                        },
                        ],
                    });


                    $table.on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
                        var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
                        examine(e.type,datas);                              // 保存到全局 Array() 里
                    });
                }

                //批量删除按钮权限
                if (arr_authList.indexOf('/admin/nav/delete.do') != -1) {
                    $("#dh_deletes").show();
                } else {
                    $("#dh_deletes").hide();
                }

                //添加按钮权限
                if (arr_authList.indexOf('/admin/nav/add.do') != -1) {
                    isaddbtnqx = true;
                } else {
                    isaddbtnqx = false;
                }

            } else if (data.code == 201) {
                alert(data.msg);
                window.location.href = "/login.html";
            } else if (data.code == 500) {
                alert(data.msg);
                window.location.href = "/pages/500.html";
            }
        },
        error: function(error) {
            alert(error);
            setTimeout(function() {
                window.location.href = "/login.html";
            },
            1500);
        }
    });

    //添加导航
    $("#add_dh").click(function(event) {
        $('#adddhModal').modal('show');
        $("#adddh_name").val("");
        $("#adddh_path").val("");
        $("#adddh_priority").val("");
    });

    //保存添加导航
    $("#adddhModal_save").click(function(event) {
        var $table = $("#table-data");
        var adddh_name = $("#adddh_name").val();
        var adddh_path = $("#adddh_path").val();
        var adddh_parentId = $("#adddh_parentId").val();
        var adddh_priority = $("#adddh_priority").val();
        $.ajax({
            url: domainUrl + 'admin/nav/add.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                name: adddh_name,
                path: adddh_path,
                parentId: adddh_parentId,
                priority: adddh_priority
            },
            success: function(data) {
                if (data.code == 200) {
                    art.dialog({
                        content: data.msg,
                        fixed: true,
                        lock: true,
                        width: 200,
                        cancel: false,
                        ok: function() {
                            $('#adddhModal').modal('hide');
                            console.log("adddh_parentId:"+adddh_parentId);

                            //刷新表格
                            refreshTable($table,adddh_parentId,isLeftck);

                            // 获取左边菜单列表
                            // leftnavList();

                            // 左边树列表重新加载
                            leftTreeListLodaing(adddh_parentId,isLeftck);
                          

                        }
                    });
                } else if (data.code == 500) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
                    });
                }
            },
            error: function(error) {
                art.dialog({
                    content: error,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        setTimeout(function() {
                            window.location.href = "/login.html";
                        },
                        1500);
                    },
                });
            }
        });
    });

    //批量删除事件
    $("#dh_deletes").click(function(event) {
        var $table = $("#table-data");
        var pl_delete = $("#pl_delete").val();
        console.log(overAllIds);
        if (overAllIds.length == 0) {
            art.dialog({
                content: "请至少选中一行数据",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
        } else {
            console.log(overAllIds.join(','));
            var ids = overAllIds.join(',');
            art.dialog({
                content: "确定要删除所选数据？",
                ok: function() {
                    $.ajax({
                        url: domainUrl + 'admin/nav/delete.do',
                        type: "POST",
                        dataType: "json",
                        data: {
                            token: token,
                            ids: ids
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                art.dialog({
                                    content: data.msg,
                                    cancel: false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function() {
                                        //刷新表格
                                        refreshTable($table,pl_delete,isLeftck);


                                        // 获取左边菜单列表
                                        // leftnavList();

                                        // 左边树列表重新加载
                                        leftTreeListLodaing(pl_delete,isLeftck);

                                    },
                                });
                            } else if (data.code == 500) {
                                art.dialog({
                                    content: data.msg,
                                    cancel: false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function() {},
                                });
                            }
                        },
                        error: function(error) {
                            art.dialog({
                                content: error,
                                cancel: false,
                                fixed: true,
                                lock: true,
                                width: 200,
                                ok: function() {
                                    setTimeout(function() {
                                        window.location.href = "/login.html";
                                    },
                                    1500);
                                },
                            });

                        }
                    });
                },
                lock: true,
                width: 200,
                cancelValue: '取消',
                cancel: function() {},
            });
        }

    });

    //保存编辑角色
    $("#navModal_save").click(function(event) {
        var $table = $("#table-data");
        var e_id = $("#e_id").val();
        var e_parentId = $("#e_parentId").val();
        var e_name = $("#e_name").val();
        var path = $("#e_path").val();
        var priority = $("#e_priority").val();

        $.ajax({
            url: domainUrl + 'admin/nav/edit.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: e_id,
                name: e_name,
                path: path,
                priority: priority
            },
            success: function(data) {
                if (data.code == 200) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {
                            $('#navModal').modal('hide');

                            //刷新表格
                            refreshTable($table,e_parentId,isLeftck);

                            // 获取左边菜单列表
                            // leftnavList();

                            // 左边树列表重新加载
                            leftTreeListLodaing(e_parentId,isLeftck);

                        },
                    });
                } else if (data.code == 500) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
                    });
                    window.location.href = "/pages/500.html";
                }
            },
            error: function(error) {
                art.dialog({
                    content: error,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        setTimeout(function() {
                            window.location.href = "/login.html";
                        },
                        1500);
                    },
                });
            }
        });
    });

    //保存修改的显示顺序
    $("#modifyNavPModal_save").click(function(event) {
        var $table = $("#table-data");
        var priority = $("#e_npriority").val();
        var id = $("#e_npriority_id").val();
        var parentId = $("#e_nparentId_id").val();
        $.ajax({
            url: domainUrl + 'admin/nav/priority.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id,
                priority: priority
            },
            success: function(data) {
                if (data.code == 200) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {
                            $('#modifyNavPModal').modal('hide');

                            //刷新表格
                            refreshTable($table,parentId,isLeftck);

                            // 获取左边菜单列表
                            // leftnavList();

                            // 左边树列表重新加载
                            leftTreeListLodaing(parentId,isLeftck);
                        },
                    });
                } else if (data.code == 500) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
                    });
                    window.location.href = "/pages/500.html";
                }
            },
            error: function(error) {
                art.dialog({
                    content: error,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        setTimeout(function() {
                            window.location.href = "/login.html";
                        },
                        1500);
                    },
                });
            }
        });
    });



    //确认移动导航
    $("#moveinModal_ok").click(function(event) {
        var $table = $("#table-data");
        var moveId = $("#movein_moveId").val();
        var parentId = $("#movein_parentId").val();
        var targetId = $("#movein_targetId").val();
        if(targetId == ""){
            art.dialog({
                content: "请选择要移到的目标导航！",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        $.ajax({
            url: domainUrl + 'admin/nav/move.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                moveId: moveId,
                targetId:targetId,
            },
            success: function(data) {
                if (data.code == 200) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
                    });
                    $("#moveinModal").modal('hide');

                    //刷新表格
                    refreshTable($table,parentId,isLeftck);

                    // 获取左边菜单列表
                    // leftnavList();

                    // 左边树列表重新加载
                    leftTreeListLodaing(parentId,isLeftck);
                }
            },
            error: function(error) {
                alert(error);
                setTimeout(function() {
                    window.location.href = "/login.html";
                },
                1500);
            }
        });





    });

});



var overAllIds = new Array();  //全局数组

function examine(type,datas){            
    if(type.indexOf('uncheck')==-1){    
        $.each(datas,function(i,v){
           // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
　　　　　　overAllIds.indexOf(v.id) == -1 ? overAllIds.push(v.id) : -1;
　　　　});
    }else{
        $.each(datas,function(i,v){
            overAllIds.splice(overAllIds.indexOf(v.id),1);    //删除取消选中行
        });
    }
}



function navMqueryParams(params){
    /*var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        page: (params.offset/params.limit) + 1,  //页码
        count:params.limit, //单次查询条数

    };*/
    querys.page = (params.offset/params.limit) + 1;
    querys.count = params.limit;
    return querys;
};

function operateFormatter(value, row, index) {
    var rowedit_html = "";
    var rowdelete_html = "";
    var rowdetails_html = "";
    var rowmodifypriority_html = "";

    if (arr_authList.indexOf('/admin/nav/edit.do') != -1) {
        rowedit_html = '<i class="tbmr rowedit fa fa-edit" title="编辑"></i>';
    }

    if (arr_authList.indexOf('/admin/nav/delete.do') != -1) {
        rowdelete_html = '<i class="tbmr rowdelete fa fa-trash" title="删除"></i>';
    }

    if (arr_authList.indexOf('/admin/nav/get.do') != -1) {
        rowdetails_html = '<i class="tbmr rowdetails fa fa-info-circle" title="详情"></i>';
    }

    if (arr_authList.indexOf('/admin/nav/priority.do') != -1) {
        rowmodifypriority_html = '<i class="tbmr rowmodifypriority fa fa-pencil-alt" title="修改导航显示顺序"></i>';
    }

    if (arr_authList.indexOf('/admin/nav/list.do') != -1) {
        rowmove_html = '<i class="tbmr rowmovein fa fa-sign-in-alt" title="移动"></i>';
    }

          
    return [
        rowedit_html,
        rowdelete_html, 
        rowdetails_html, 
        rowmodifypriority_html, 
        rowmove_html,
    ].join('');  
}

window.operateEvents = {      
   'click .rowdelete': function(e, value, row, index) { //单独删除角色
        var $table = $("#table-data");
        var parentId = row.parentId;
        art.dialog({
            content: "确定要删除本条数据？",
            ok: function() {
                var ids = new Array();
                ids.push(row.id);
                $.ajax({
                    url: domainUrl + 'admin/nav/delete.do',
                    type: "POST",
                    dataType: "json",
                    data: {
                        token: token,
                        ids: ids.join(',')
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            art.dialog({
                                content: data.msg,
                                cancel: false,
                                fixed: true,
                                lock: true,
                                width: 200,
                                ok: function() {

                                    //刷新表格
                                    refreshTable($table,parentId,isLeftck);

                                    // 获取左边菜单列表
                                    // leftnavList();

                                    // 左边树列表重新加载
                                    leftTreeListLodaing(parentId,isLeftck);

                                },
                            });
                        } else if (data.code == 500) {
                            art.dialog({
                                content: data.msg,
                                cancel: false,
                                fixed: true,
                                lock: true,
                                width: 200,
                                ok: function() {},
                            });
                            window.location.href = "/pages/500.html";
                        }
                    },
                    error: function(error) {
                        art.dialog({
                            content: error,
                            cancel: false,
                            fixed: true,
                            lock: true,
                            width: 200,
                            ok: function() {
                                setTimeout(function() {
                                    window.location.href = "/login.html";
                                },
                                1500);
                            },
                        });

                    }
                });
            },
            lock: true,
            width: 200,
            cancelValue: '取消',
            cancel: function() {},
        });      
    },
   'click .rowedit': function(e, value, row, index) { //单独编辑
        $("#e_id").attr("value", row.id);
        $("#e_name").val(row.name);
        $("#e_parentId").attr("value",row.parentId);
        $("#e_path").val(row.path);
        $("#e_priority").val(row.priority);
        $("#navModal").modal('show');      
    },
    'click .rowdetails': function(e, value, row, index) { //查看详情
        var id = row.id;
        $.ajax({
            url: domainUrl + 'admin/nav/get.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id
            },
            success: function(data) {
                if (data.code == 200) {
                    // $("#e_details_id").attr("value", data.data.id);
                    $("#e_details_name").attr("value", data.data.name);
                    $("#e_details_path").attr("value", data.data.path);
                    // $("#e_details_parentId").attr("value",data.data.parentId);
                    $("#e_details_priority").attr("value", data.data.priority);
                    $("#detailsModal").modal('show');
                } else if (data.code == 500) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
                    });
                    window.location.href = "/pages/500.html";
                }
            },
            error: function(error) {
                art.dialog({
                    content: error,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        setTimeout(function() {
                            window.location.href = "/login.html";
                        },
                        1500);
                    },
                });

            }
        });
    },
    'click .rowmodifypriority': function(e, value, row, index) { //修改导航显示顺序
        $("#e_npriority_id").attr("value", row.id);
        $("#e_npriority").val(row.priority);
        $("#e_nparentId_id").attr("value",row.parentId);
        $("#modifyNavPModal").modal('show');
    },
    'click .rowmovein': function(e, value, row, index) { //移动导航
        var moveId = row.id;
        var parentId = row.parentId;
        $("#movein_moveId").attr("value", moveId);
        $("#movein_parentId").attr("value", parentId);
        $.ajax({
            url: domainUrl + 'admin/nav/list.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                page:0,
                moveId: moveId
            },
            success: function(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    var zNodes = [];
                    for (var i = 0; i < data.data.length; i++) {
                        zNodes.push({
                            id: data.data[i].id,
                            pId: data.data[i].parentId,
                            name: data.data[i].name
                        });
                    }
                    zNodes.push({
                        id: 0,
                        pId: -1,
                        name: "跟目录",
                    });
                    $.fn.zTree.init($("#moveinTree"), moveinTree_setting, zNodes);

                    //默认展开根目录
                    dafultzkdirectory("moveinTree");
                }
            },
            error: function(error) {
                alert(error);
                setTimeout(function() {
                    window.location.href = "/login.html";
                },
                1500);
            }
        });

        $("#moveinModal").modal('show');

    },
}






function leftTreeListLodaing(pid,isLeftck){ // 左边树列表重新加载
        $.ajax({
            url: domainUrl + 'admin/nav/list.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                page: 0
            },
            success: function(data) {
                if (data.code == 200) {
                    var zNodes = [];
                    for (var i = 0; i < data.data.length; i++) {
                        zNodes.push({
                            id: data.data[i].id,
                            pId: data.data[i].parentId,
                            name: data.data[i].name
                        });
                    }
                    zNodes.push({
                        id: 0,
                        pId: -1,
                        name: "跟目录",
                    });
                    $.fn.zTree.init($("#leftTree"), setting, zNodes);
                    //默认展开根目录
                    dafultzkdirectory("leftTree");
                    var leftTree = $.fn.zTree.getZTreeObj("leftTree");
                    if(isLeftck != null){
                        if(!isLeftck){
                            var node = leftTree.getNodeByParam("id", pid, null);
                            leftTree.cancelSelectedNode(); //先取消所有的选中状态
                            leftTree.checkNode(node, true); //将指定ID的节点选中
                            leftTree.expandNode(node, true, false); //将指定ID节点展开
                        }else{
                            var leftTree = $.fn.zTree.getZTreeObj("leftTree");
                            var node = leftTree.getNodeByParam("id", pid, null);
                            // leftTree.cancelSelectedNode(); //先取消所有的选中状态
                            // leftTree.checkNode(node, true); //将指定ID的节点选中
                            leftTree.expandNode(node, true, false); //将指定ID节点展开
                        }
                    }

                }
            },
            error: function(error) {
                alert(error);
                setTimeout(function() {
                    window.location.href = "/login.html";
                },
                1500);
            }
        });
}












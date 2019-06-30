/*tree set 设置导航 s*/
var setting = {
    view: {
        selectedMulti: false
    },
    check: {
        enable: true
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
};


function zTreeOnCheck(event, treeId, treeNode) {
    var $table = $("#table-data");
    var treeSetNav = $.fn.zTree.getZTreeObj("treeSetNav");
    var node = treeSetNav.getNodeByParam("id", treeNode.id, null);
    if (treeNode.checked) {
        // $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');
    } else {
        $("#"+node.tId+"_a").removeClass('curSelectedNode');
    }
}


function zTreeonClick(event, treeId, treeNode, clickFlag){
    var $table = $("#table-data");
    var treeSetNav = $.fn.zTree.getZTreeObj("treeSetNav");
    var node = treeSetNav.getNodeByParam("id", treeNode.id, null);
    if(treeNode.checked == false){
        // $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');
        treeSetNav.checkNode(node, true); //将指定ID的节点选中
    }
}
/*tree set e*/



/*tree set 设置权限 s*/
var setting2 = {
    view: {
        selectedMulti: false
    },
    check: {
        enable: true
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
        onCheck: treeSetKeyOnCheck,
        onClick: treeSetKeyonClick,
    },
};


function treeSetKeyOnCheck(event, treeId, treeNode) {
    var $table = $("#table-data");
    var treeSetKey = $.fn.zTree.getZTreeObj("treeSetKey");
    var node = treeSetKey.getNodeByParam("id", treeNode.id, null);
    if (treeNode.checked) {
        // $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');
    } else {
        $("#"+node.tId+"_a").removeClass('curSelectedNode');
    }
}


function treeSetKeyonClick(event, treeId, treeNode, clickFlag){
    var $table = $("#table-data");
    var treeSetKey = $.fn.zTree.getZTreeObj("treeSetKey");
    var node = treeSetKey.getNodeByParam("id", treeNode.id, null);
    if(treeNode.checked == false){
        // $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');
        treeSetKey.checkNode(node, true); //将指定ID的节点选中
    }
}
/*tree set e*/

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

                if (arr_authList.indexOf('/admin/role/list.do') != -1) {
                    var role_list_do = "admin/role/list.do";

                    //1.初始化Table
                    var $table = $("#table-data");
                    $("#table-data").bootstrapTable('destroy');
                    $.initBootstrapTable("#table-data", {
                        method: 'post',
                        url: domainUrl + 'admin/role/list.do?token=' + token,
                        height: 'auto',
                        pageSize: 6,
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
                            title: 'ID',
                            visible: false
                        },
                        {
                            field: 'name',
                            title: '角色名称'
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
                            field: 'Button',
                            title: '操作',
                            events: operateEvents,
                            formatter: operateFormatter
                        },
                        ],
                        onPostBody: function() {
                            //layer.msg("列表加载完成");
                        },

                        onCheck: function(row) {
                            // $("#js_deletes").removeAttr('disabled');
                        },

                        onUncheck: function(row) {
                            console.log(row);
                        },

                        onCheckAll: function(rows) {
                            // $("#js_deletes").removeAttr('disabled');
                        },

                        onUncheckAll: function(rows) {
                            console.log(rows);
                        },

                    });


                    $table.on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
                        var datas = $.isArray(rows) ? rows : [rows]; // 点击时获取选中的行或取消选中的行
                        examine(e.type,datas); // 保存到全局 Array() 里
                    });

                }

                //批量删除按钮权限
                if (arr_authList.indexOf('/admin/role/delete.do') != -1) {
                    $("#js_deletes").show();
                } else {
                    $("#js_deletes").hide();
                }

                //添加按钮权限
                if (arr_authList.indexOf('/admin/role/add.do') != -1) {
                    $("#add_js").show();
                } else {
                    $("#add_js").hide();
                }

            } else if (data.code == 201) {
                alert(data.msg);
                window.location.href = "/login.html";
            } else if (data.code == 500) {
                alert(data.msg);
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

    //添加角色
    $("#add_js").click(function(event) {
        $('#addjsModal').modal('show');
        $("#addjs_name").val("");
    });

    //保存添加角色
    $("#addjsModal_save").click(function(event) {
        var addjs_name = $("#addjs_name").val();
        $.ajax({
            url: domainUrl + 'admin/role/add.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                name: addjs_name
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
                            $('#addjsModal').modal('hide');
                            $("#table-data").bootstrapTable('refresh');
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
    $("#js_deletes").click(function(event) {
        var $table = $("#table-data");
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
                        url: domainUrl + 'admin/role/delete.do',
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
                                        $("#table-data").bootstrapTable('refresh');
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
    $("#editModal_save").click(function(event) {
        var e_name = $("#e_name").val();
        var e_id = $("#e_id").val();
        $.ajax({
            url: domainUrl + 'admin/role/edit.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: e_id,
                name: e_name
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
                            $('#editModal').modal('hide');
                            $("#table-data").bootstrapTable('refresh');
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
    });

    //设置权限
    $("#setKeyModal_ok").click(function(event) {
        var treeObj = $.fn.zTree.getZTreeObj("treeSetKey");
        var authIds = [];
        var nodes = treeObj.getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].id != 0){
                authIds.push(nodes[i].id);
            }
        }
        if (authIds.length == 0) {
            art.dialog({
                content: "请至少选中一行数据",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
        } else {
            var id = $("#get_jsid").val();
            authIds = authIds.join(',');
            art.dialog({
                content: "确定要设置所选数据权限？",
                ok: function() {
                    $.ajax({
                        url: domainUrl + 'admin/role/setAuth.do',
                        type: "POST",
                        dataType: "json",
                        data: {
                            token: token,
                            id: id,
                            authIds: authIds
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
                                        $("#setKeyModal").modal('hide');
                                        $("#table-data").bootstrapTable('refresh');
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
                width: 250,
                cancelValue: '取消',
                cancel: function() {},
            });
        }
    });

    //设置导航
    $("#setNavModal_ok").click(function(event) {
        var treeObj = $.fn.zTree.getZTreeObj("treeSetNav");
        var navIds = [];
        var nodes = treeObj.getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].id != 0){
                navIds.push(nodes[i].id);
            }
        }
        if (navIds.length == 0) {
            art.dialog({
                content: "请至少选中一行数据",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
        } else {
            var id = $("#get_jsid2").val();
            navIds = navIds.join(',');
            art.dialog({
                content: "确定要设置所选数据导航？",
                ok: function() {
                    $.ajax({
                        url: domainUrl + 'admin/role/setNav.do',
                        type: "POST",
                        dataType: "json",
                        data: {
                            token: token,
                            id: id,
                            navIds: navIds
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
                                        $("#setNavModal").modal('hide');
                                        $("#table-data").bootstrapTable('refresh');
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
                width: 250,
                cancelValue: '取消',
                cancel: function() {},
            });
        }
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

function operateFormatter(value, row, index) {
    var rowedit_html = "";
    var rowdelete_html = "";
    var rowdetails_html = "";
    var rowsetKey_html = "";
    var rowsetnav_html = "";
    var rowsetdefault_html = "";

    if (arr_authList.indexOf('/admin/role/edit.do') != -1) {
        rowedit_html = '<i class="tbmr rowedit fa fa-edit" title="编辑"></i>';
    }

    if (arr_authList.indexOf('/admin/role/delete.do') != -1) {
        rowdelete_html = '<i class="tbmr rowdelete fa fa-trash" title="删除"></i>';
    }

    if (arr_authList.indexOf('/admin/role/get.do') != -1) {
        rowdetails_html = '<i class="tbmr rowdetails fa fa-info-circle" title="详情"></i>';
    }

    if (arr_authList.indexOf('/admin/auth/list.do') != -1) {
        rowsetKey_html = '<i class="tbmr rowsetKey fa fa-key" title="设置权限"></i>';
    }

    if (arr_authList.indexOf('/admin/nav/list.do') != -1) {
        rowsetnav_html = '<i class="tbmr rowsetnav fa fa-th" title="设置导航"></i>';
    }

    if (arr_authList.indexOf('/admin/role/setDefault.do') != -1) {
        rowsetdefault_html = '<i class="tbmr rowsetdefault fa fa-user" title="设置默认角色"></i>';
    }

    return [rowedit_html,      rowdelete_html, rowdetails_html, rowsetKey_html, rowsetnav_html, rowsetdefault_html,    ].join('');

      
}

window.operateEvents = {      'click .rowdelete': function(e, value, row, index) { //单独删除角色
        art.dialog({
            content: "确定要删除本条数据？",
            ok: function() {
                var ids = new Array();
                ids.push(row.id);
                $.ajax({
                    url: domainUrl + 'admin/role/delete.do',
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
                                    $("#table-data").bootstrapTable('refresh');
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
    },
          'click .rowedit': function(e, value, row, index) { //单独编辑
        $("#e_id").attr("value", row.id);
        $("#e_name").val(row.name);
        $("#editModal").modal('show');      
    },
    'click .rowsetKey': function(e, value, row, index) { //设置权限
        var id = row.id;
        $("#get_jsid").attr("value", id);
        $("#setKeyModal").modal('show');


        var authParentIds = [];
        var authIds = [];
        //获取角色信息
        $.ajax({
            url: domainUrl + 'admin/role/get.do',
            async:false,
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id
            },
            success: function(data) {
                if (data.code == 200) {
                    for (var i = 0; i < data.data.authList.length; i++) {
                       authParentIds.push(data.data.authList[i].parentId);
                       authIds.push(data.data.authList[i].id);
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
        

        //获取全部权限树列表
        $.ajax({
            url: domainUrl + 'admin/auth/list.do',
            async:false,
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
                    console.log(zNodes);
                    $.fn.zTree.init($("#treeSetKey"), setting2, zNodes);
                    //默认展开根目录
                    dafultzkdirectory("treeSetKey");

                    var treeSetKey = $.fn.zTree.getZTreeObj("treeSetKey");
                    for(var j=0;j<authParentIds.length;j++){
                        var node = treeSetKey.getNodeByParam("id", authParentIds[j],null);
                        if(node != null) {
                            treeSetKey.expandNode(node, true, false);
                        }
                    }
                    console.log(authIds);
                    for(var i = 0; i < authIds.length; i++) {
                        var node = treeSetKey.getNodeByParam("id", authIds[i]);
                        console.log(node);
                        if(node != null) {
                            treeSetKey.checkNode(node, true)
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
    },
    'click .rowdetails': function(e, value, row, index) { //查看详情
        var id = row.id;
        $.ajax({
            url: domainUrl + 'admin/role/get.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id
            },
            success: function(data) {
                if (data.code == 200) {
                    $("#e_details_id").attr("value", data.data.id);
                    $("#e_details_name").attr("value", data.data.name);
                    var authList = data.data.authList;
                    if (authList.length > 0) {
                        $("#authList_card").show();
                        var html = "";
                        for (var i = 0; i < authList.length; i++) {
                            var id = authList[i].id;
                            var name = authList[i].name;
                            var parentId = authList[i].parentId;
                            html += '<tr><td>' + id + '</td><td>' + name + '</td><td>' + parentId + '</td></tr>';
                        }
                        $("#roleAuthList_Details-table").find("tbody").html(html);
                    } else {
                        $("#authList_card").hide();
                    }

                    var navList = data.data.navList;
                    if (navList.length > 0) {
                        $("#navList_card").show();
                        var html = "";
                        for (var i = 0; i < navList.length; i++) {
                            var id = navList[i].id;
                            var name = navList[i].name;
                            var parentId = navList[i].parentId;
                            html += '<tr><td>' + id + '</td><td>' + name + '</td><td>' + parentId + '</td></tr>';
                        }
                        $("#roleNavList_Details-table").find("tbody").html(html);
                    } else {
                        $("#navList_card").hide();
                    }

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
    'click .rowsetnav': function(e, value, row, index) { //设置导航
        var id = row.id;
        $("#get_jsid2").attr("value", id);
        $("#setNavModal").modal('show');

        var navParentIds = [];
        var navIds = [];
        //获取角色信息
        $.ajax({
            url: domainUrl + 'admin/role/get.do',
            async:false,
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id
            },
            success: function(data) {
                if (data.code == 200) {
                    for (var i = 0; i < data.data.navList.length; i++) {
                       navParentIds.push(data.data.navList[i].parentId);
                       navIds.push(data.data.navList[i].id);
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


        //获取全部导航树列表
        $.ajax({
            url: domainUrl + 'admin/nav/list.do',
            async:false,
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
                    console.log(zNodes);
                    $.fn.zTree.init($("#treeSetNav"), setting, zNodes);
                    //默认展开根目录
                    dafultzkdirectory("treeSetNav");

                    var treeSetNav = $.fn.zTree.getZTreeObj("treeSetNav");
                    for(var j=0;j<navParentIds.length;j++){
                        var node = treeSetNav.getNodeByParam("id", navParentIds[j],null);
                        if(node != null) {
                            treeSetNav.expandNode(node, true, false);
                        }
                    }
                    for(var i = 0; i < navIds.length; i++) {
                        var node = treeSetNav.getNodeByParam("id", navIds[i],null);
                        if(node != null) {
                            treeSetNav.checkNode(node, true)
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
    },
    'click .rowsetdefault': function(e, value, row, index) { //设置为默认角色
        $el = $(e.target);
        var id = row.id;
        $.ajax({
            url: domainUrl + 'admin/role/setDefault.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id
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
                            $("#table-data").find(".rowsetdefault").removeClass('default');
                            $el.addClass('default');
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
}
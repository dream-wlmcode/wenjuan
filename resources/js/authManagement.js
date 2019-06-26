var isaddbtnqx = false; //添加按钮权限
var isLeftck = true; //是否点击左边树结构
var cked_Array = []; //选中id全局变量
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
    var $table = $("#table-data");
    var leftTree = $.fn.zTree.getZTreeObj("leftTree");
    var node = leftTree.getNodeByParam("id", treeNode.id, null);
    if (treeNode.checked) {
        $(".curSelectedNode").removeClass('curSelectedNode');
        $("#"+node.tId+"_a").addClass('curSelectedNode');

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
        
    } else {
        $("#"+node.tId+"_a").removeClass('curSelectedNode');

        isLeftck = true;
        $("#addqx_parentId").attr("value", "0");
        $("#pl_delete").attr("value", "");
        if(isaddbtnqx){
            //是否显示添加按钮
            $("#add_qx").addClass('hide').removeClass('in_show');
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

                if (arr_authList.indexOf('/admin/auth/list.do') != -1) {
                    var auth_list_do = "admin/auth/list.do";


                    // 获取左边树列表
                    $.ajax({
                        url: domainUrl + 'admin/auth/list.do',
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
                        url: domainUrl + 'admin/auth/list.do?token=' + token,
                        height: 'auto',
                        pageSize: 6,
                        queryParams: authMqueryParams,
                        fixedColumns: true,
                        fixedNumber: 1,
                        columns: [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: 'ID',
                            visible: false
                        },
                        {
                            field: 'name',
                            title: '权限名称'
                        },
                        {
                            field: 'api',
                            title: '接口地址'
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
                        onPostBody:function(){
                            // console.log(cked_Array);
                            $table = $("#table-data");
                            for(var i = 0;i<cked_Array.length;i++){
                                $table.find("td input:checkbox[value='"+cked_Array[i]+"']").prop("checked",true);
                            }
                            var count=0;//定义一个计数变量
                            var ck = $table.find("td input:checkbox");
                            var cklen = $table.find("td input:checkbox").length;
                            ck.each(function(){
                               if($(this).is(':checked')){
                                   count++;
                               }
                            });
                            // console.log(count);
                            // console.log(ck.length);
                            if(count==ck.length){
                                if(ck.length != 0){
                                   $('.fixed-table-container input[name="btSelectAll"]').prop('checked',true); 
                                }
                            }else{
                                $('.fixed-table-container input[name="btSelectAll"]').prop('checked',false);
                            }
                            
                        },
                    });

                    //全选
                    $('.fixed-table-container').on('click','input[name="btSelectAll"]',function(){
                       if($(this).is(':checked')){
                              $('.fixed-table-body-columns input[name="btSelectItem"]').prop('checked',true);
                              var rows = $('.fixed-table-body-columns input[name="btSelectItem"]');
                              console.log(cked_Array.length);
                              console.log(rows.length);

                              var ids = "";
                              var id_arry = [];
                              var ckid_arry = [];
                              rows.each(function(index, el) {
                                  id_arry.push($(this).attr("value"));
                              });
                              for(var j=0;j<cked_Array.length;j++){
                                  ckid_arry.push(cked_Array[j]);
                              }

                              console.log("id_arry:"+id_arry);
                              console.log("ckid_arry:"+ckid_arry);

                              if(cked_Array.length == rows.length){
                                 ckid_arry = [];
                                 ids = arraysDiff(id_arry,ckid_arry);
                              }
                              if(cked_Array.length > rows.length){
                                 //ckid_arry没清空之前拿到相同的值
                                 var result = new Array();
                                 var c = id_arry.toString();
                                 for (var i = 0; i < ckid_arry.length; i++) {
                                    if (c.indexOf(ckid_arry[i].toString()) > -1) {
                                        for (var j = 0; j < id_arry.length; j++) {
                                            if (ckid_arry[i] == id_arry[j]) {
                                                result.push(ckid_arry[i]);
                                                break;
                                            }
                                        }
                                    }
                                 }

                                 ckid_arry = [];
                                 var idar = arraysDiff(id_arry,ckid_arry);
                                 ids = arraysDiff(idar,result);
                              }
                              if(cked_Array.length < rows.length){
                                 ids = arraysDiff(id_arry,ckid_arry);
                              }

                              console.log(arraysDiff(id_arry,ckid_arry));

                              ids = arraysDiff(ids,ckid_arry); 
                              for(var i=ids.length-1;i>=0;i--){
                                 var id = ids[i];
                                 cked_Array.push(id);
                              }


                       }else{
                           $('.fixed-table-body-columns input[name="btSelectItem"]').prop('checked',false);
                           var rows = $('.fixed-table-body-columns input[name="btSelectItem"]');
                           rows.each(function(index, el) {
                              cked_Array.splice($.inArray($(this).attr("value"), cked_Array), 1);
                           });
                       } 
                    });
                    
                    //选中事件
                   $("#table-data").on('check.bs.table',function(row, $element){
                        var id = $element.id;
                        cked_Array.push(id.toString());

                        var inputs = $table.find('input[name="btSelectItem"]');
                        var num = 0;
                        inputs.each(function(){
                           if($(this).is(':checked')){
                               num++;
                           }
                        });
                        if(num==inputs.length){
                           $('.fixed-table-container input[name="btSelectAll"]').prop('checked',true);
                        }else{
                           $('.fixed-table-container input[name="btSelectAll"]').prop('checked',false);
                        }
                   });

                   //取消选中事件
                   $("#table-data").on('uncheck.bs.table',function(row, $element){
                        var id = $element.id;
                        cked_Array.splice($.inArray(id.toString(), cked_Array), 1);
                        $('.fixed-table-container input[name="btSelectAll"]').prop('checked',false);
                   });


                }

                //批量删除按钮权限
                if (arr_authList.indexOf('/admin/auth/delete.do') != -1) {
                    $("#qx_deletes").show();
                } else {
                    $("#qx_deletes").hide();
                }

                //添加按钮权限
                if (arr_authList.indexOf('/admin/auth/add.do') != -1) {
                    isaddbtnqx = true;
                } else {
                    isaddbtnqx = false;
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

    //添加权限
    $("#add_qx").click(function(event) {
        $('#addqxModal').modal('show');
        $("#addqx_name").val("");
        $("#addqx_api").val("");
        $("#addqx_priority").val("");
    });

    //保存添加权限
    $("#addqxModal_save").click(function(event) {
        var $table = $("#table-data");
        var addqx_name = $("#addqx_name").val();
        var addqx_api = $("#addqx_api").val();
        var addqx_parentId = $("#addqx_parentId").val();
        var addqx_priority = $("#addqx_priority").val();

        $.ajax({
            url: domainUrl + 'admin/auth/add.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                name: addqx_name,
                api: addqx_api,
                parentId: addqx_parentId,
                priority: addqx_priority
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
                            $('#addqxModal').modal('hide');

                            //刷新表格
                            refreshTable($table,addqx_parentId,isLeftck);


                            // 左边树列表重新加载
                            leftTreeListLodaing(addqx_parentId,isLeftck);
                        }
                    });
                } else if (data.code == 201) {
                    art.dialog({
                        content: data.msg,
                        cancel: false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function() {},
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
    $("#qx_deletes").click(function(event) {
        var $table = $("#table-data");
        var pl_delete = $("#pl_delete").val();
        console.log(cked_Array);
        if (cked_Array.length == 0) {
            art.dialog({
                content: "请至少选中一行数据",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
        } else {
            console.log(cked_Array.join(','));
            var ids = cked_Array.join(',');
            art.dialog({
                content: "确定要删除所选数据？",
                ok: function() {
                    $.ajax({
                        url: domainUrl + 'admin/auth/delete.do',
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

    //保存编辑权限
    $("#powerModal_save").click(function(event) {
        var $table = $("#table-data");
        var e_id = $("#e_id").val();
        var e_parentId = $("#e_parentId").val();
        var e_name = $("#e_name").val();
        var e_api = $("#e_api").val();
        var e_priority = $("#e_priority").val();
        $.ajax({
            url: domainUrl + 'admin/auth/edit.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: e_id,
                name: e_name,
                api: e_api,
                priority: e_priority
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
                            $('#powerModal').modal('hide');

                            //刷新表格
                            refreshTable($table,e_parentId,isLeftck);

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
    $("#modifyPriorityModal_save").click(function(event) {
        var $table = $("#table-data");
        var priority = $("#e_npriority").val();
        var id = $("#e_npriority_id").val();
        var parentId = $("#e_nparentId_id").val();
        $.ajax({
            url: domainUrl + 'admin/auth/priority.do',
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
                            $('#modifyPriorityModal').modal('hide');

                            //刷新表格
                            refreshTable($table,parentId,isLeftck);

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


    //确认移动权限
    $("#moveinModal_ok").click(function(event) {
        var $table = $("#table-data");
        var moveId = $("#movein_moveId").val();
        var parentId = $("#movein_parentId").val();
        var targetId = $("#movein_targetId").val();
        if(targetId == ""){
            art.dialog({
                content: "请选择要移到的目标权限！",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }
        $.ajax({
            url: domainUrl + 'admin/auth/move.do',
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




function authMqueryParams(params){
    querys.page = (params.offset/params.limit) + 1;
    querys.count = params.limit;
    return querys;
};

function operateFormatter(value, row, index) {
    var rowedit_html = "";
    var rowdelete_html = "";
    var rowdetails_html = "";
    var rowmodifypriority_html = "";

    if (arr_authList.indexOf('/admin/auth/edit.do') != -1) {
        rowedit_html = '<i class="tbmr rowedit fa fa-edit" title="编辑"></i>';
    }

    if (arr_authList.indexOf('/admin/auth/delete.do') != -1) {
        rowdelete_html = '<i class="tbmr rowdelete fa fa-trash" title="删除"></i>';
    }

    if (arr_authList.indexOf('/admin/auth/get.do') != -1) {
        rowdetails_html = '<i class="tbmr rowdetails fa fa-info-circle" title="详情"></i>';
    }

    if (arr_authList.indexOf('/admin/auth/priority.do') != -1) {
        rowmodifypriority_html = '<i class="tbmr rowmodifypriority fa fa-pencil-alt" title="修改显示顺序"></i>';
    }

    if (arr_authList.indexOf('/admin/auth/list.do') != -1) {
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
    'click .rowdelete': function(e, value, row, index) { //单独删除权限
        var $table = $("#table-data");
        var parentId = row.parentId;
        art.dialog({
            content: "确定要删除本条数据？",
            ok: function() {
                var ids = new Array();
                ids.push(row.id);
                $.ajax({
                    url: domainUrl + 'admin/auth/delete.do',
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
        $("#e_api").val(row.api);
        $("#e_priority").val(row.priority);
        $("#powerModal").modal('show');      
    },
    'click .rowdetails': function(e, value, row, index) { //查看详情
        var id = row.id;
        $.ajax({
            url: domainUrl + 'admin/auth/get.do',
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
                    $("#e_details_api").attr("value", data.data.api);
                    // $("#e_details_parentId").attr("value", data.data.parentId);
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
    'click .rowmodifypriority': function(e, value, row, index) { //修改显示顺序
        $("#e_npriority_id").attr("value", row.id);
        $("#e_npriority").val(row.priority);
        $("#modifyPriorityModal").modal('show');
    },

    'click .rowmovein': function(e, value, row, index) { //移动权限
        var moveId = row.id;
        var parentId = row.parentId;
        $("#movein_moveId").attr("value", moveId);
        console.log("parentId:"+parentId);
        $("#movein_parentId").attr("value", parentId);
        $.ajax({
            url: domainUrl + 'admin/auth/list.do',
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
                    console.log(zNodes);
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
            url: domainUrl + 'admin/auth/list.do',
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




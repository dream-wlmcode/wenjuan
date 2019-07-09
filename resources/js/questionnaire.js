var arr_authList = "";
// var ix = 1;
// var e_ix = 1;
var cked_Array = []; //选中id全局变量
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
                if (arr_authList.indexOf('/admin/qn/list.do') != -1) {
                    var qn_list_do = "admin/qn/list.do";

                    //1.初始化Table
                    var $table = $("#table-data");
                    $("#table-data").bootstrapTable('destroy');
                    $.initBootstrapTable("#table-data", {
                        method: 'post',
                        url: domainUrl + 'admin/qn/list.do?token=' + token,
                        height: 'auto',
                        pageSize: 6,
                        fixedColumns: true,
                        fixedNumber: 1,
                        columns: [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: '问卷ID',
                            visible: false
                        },
                        {
                            field: 'token',
                            title: '问卷token',
                            visible: false
                        },
                        {
                            field: 'name',
                            title: '问卷名称',
                        },
                        {
                            field: 'beginDate',
                            title: '开始时间',
                        },
                        {
                            field: 'endDate',
                            title: '结束时间',
                        },
                        {
                            field: 'status',
                            title: '状态',
                            formatter: function(value, row, index) {
                                if (value == "1") {
                                    return value = "正常";
                                } else if (value == "2") {
                                    return value = "关闭";
                                }
                            }
                        },
                        {
                            field: 'questionNum',
                            title: '题目数'
                        },
                        {
                            field: 'cName',
                            title: '分类名称',
                        },
                        {
                            field: 'uName',
                            title: '创建者',
                        },
                        {
                            field: 'creDate',
                            title: '创建时间',
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
                            if(count==ck.length){
                                $('.fixed-table-container input[name="btSelectAll"]').prop('checked',true);
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

                            //数组去重
                            cked_Array = unique(cked_Array);
                       }else{
                           $('.fixed-table-body-columns input[name="btSelectItem"]').prop('checked',false);
                           var rows = $('.fixed-table-body-columns input[name="btSelectItem"]');
                           rows.each(function(index, el) {
                              cked_Array.splice($.inArray($(this).attr("value"), cked_Array), 1);
                           });
                           //数组去重
                           cked_Array = unique(cked_Array);
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
                        //数组去重
                        cked_Array = unique(cked_Array);
                    });

                    //取消选中事件
                    $("#table-data").on('uncheck.bs.table',function(row, $element){
                        var id = $element.id;
                        cked_Array.splice($.inArray(id.toString(), cked_Array), 1);
                        $('.fixed-table-container input[name="btSelectAll"]').prop('checked',false);
                        //数组去重
                        cked_Array = unique(cked_Array);
                    });
                }

                //批量删除按钮权限
                if (arr_authList.indexOf('/admin/qn/delete.do') != -1) {
                    $("#qSnaire_deletes").show();
                } else {
                    $("#qSnaire_deletes").hide();
                }

                //添加按钮权限
                if (arr_authList.indexOf('/admin/qn/add.do') != -1) {
                    $("#add_qSnaire").show();
                } else {
                    $("#add_qSnaire").hide();
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

    //添加问卷
    $("#add_qSnaire").click(function(event) {
        $('#qSnaireAddIframe').attr('src', $('#qSnaireAddIframe').attr('src'));
        $('#addqSnaireModal').modal('show');
    });

    //保存添加问卷
    $("#addqSnaireModal_save").click(function(event) {

        var name = $("#qSnaireAddIframe").contents().find("#addqSnaire_name").val();
        var description = $("#qSnaireAddIframe").contents().find("#addqSnaire_description").val();
        var beginDate = $("#qSnaireAddIframe").contents().find("#addqSnaire_beginDate1").find("input").val();
        var endDate = $("#qSnaireAddIframe").contents().find("#addqSnaire_endDate1").find("input").val();
        var categoryId = $("#qSnaireAddIframe").contents().find("#addqSnaire_categoryId").val();
        var status = $("#qSnaireAddIframe").contents().find("#addqSnaire_status").val();
        var expectQuizTime = $("#qSnaireAddIframe").contents().find("#addqSnaire_expectQuizTime").val();
        var timu_empty = $("#qSnaireAddIframe").contents().find("#timu_List .timu_empty");

        console.log("name:" + name);
        console.log("description:" + description);
        console.log("beginDate:" + beginDate);
        console.log("endDate:" + endDate);
        console.log("categoryId:" + categoryId);
        console.log("status:" + status);
        console.log("expectQuizTime:" + expectQuizTime);

        if ($.trim(name).length == 0) {
            art.dialog({
                content: "问卷名称不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(description).length == 0) {
            art.dialog({
                content: "问卷描述不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(beginDate).length == 0) {
            art.dialog({
                content: "开始时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(endDate).length == 0) {
            art.dialog({
                content: "结束时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(categoryId).length == 0) {
            art.dialog({
                content: "分类ID不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(expectQuizTime).length == 0) {
            art.dialog({
                content: "预计答题时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if (timu_empty.css("display") != "none") {
            art.dialog({
                content: "题目不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        var questions = new Array();
        var timu_box = $("#qSnaireAddIframe").contents().find("#timu_List .timu_box");

        timu_box.each(function(index, el) {
            var that = $(this);
            if (that.attr("data-id") != undefined) {
                var qbId = that.attr("data-id");
            }
            var title = that.find(".sxtitle").text();
            var type = that.attr("data-type");

            var msck = that.find(".msck");
            var required = 2;
            if (msck.is(':checked')) {
                required = 1;
            } else {
                required = 2;
            }

            var options = [];
            var timu_items = that.find(".timu_dry .timu_items");
            timu_items.each(function(index, el) {
                var name = $(this).find(".opname").text();
                options.push({
                    name: name
                });
            });

            if (type == "3") {
                questions.push({
                    qbId: qbId,
                    title: title,
                    type: type,
                    required: required
                });
            } else {
                questions.push({
                    qbId: qbId,
                    title: title,
                    type: type,
                    required: required,
                    options: options
                });
            }
        });

        $.ajax({
            url: domainUrl + 'admin/qn/add.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                name: name,
                description: description,
                beginDate: beginDate,
                endDate: endDate,
                categoryId: categoryId,
                status: status,
                expectQuizTime: expectQuizTime,
                questions: JSON.stringify(questions)
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
                            $('#addqSnaireModal').modal('hide');
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

    /***********************编辑问卷 s***************************/

    //保存编辑问卷
    $("#e_qSnaireModal_save").click(function(event) {
        var id = $("#e_id").val();
        var name = $("#qSnaireEditIframe").contents().find("#editqSnaire_name").val();
        var description = $("#qSnaireEditIframe").contents().find("#editqSnaire_description").val();
        var beginDate = $("#qSnaireEditIframe").contents().find("#editqSnaire_beginDate1").find("input").val();
        var endDate = $("#qSnaireEditIframe").contents().find("#editqSnaire_endDate1").find("input").val();
        var categoryId = $("#qSnaireEditIframe").contents().find("#editqSnaire_categoryId").val();
        var status = $("#qSnaireEditIframe").contents().find("#editqSnaire_status").val();
        var expectQuizTime = $("#qSnaireEditIframe").contents().find("#editqSnaire_expectQuizTime").val();
        var timu_empty = $("#qSnaireEditIframe").contents().find("#timu_List .timu_empty");

        console.log("name:" + name);
        console.log("description:" + description);
        console.log("beginDate:" + beginDate);
        console.log("endDate:" + endDate);
        console.log("categoryId:" + categoryId);
        console.log("status:" + status);
        console.log("expectQuizTime:" + expectQuizTime);

        if ($.trim(name).length == 0) {
            art.dialog({
                content: "问卷名称不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(description).length == 0) {
            art.dialog({
                content: "问卷描述不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(beginDate).length == 0) {
            art.dialog({
                content: "开始时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(endDate).length == 0) {
            art.dialog({
                content: "结束时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(categoryId).length == 0) {
            art.dialog({
                content: "分类ID不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if ($.trim(expectQuizTime).length == 0) {
            art.dialog({
                content: "预计答题时间不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        if (timu_empty.css("display") != "none") {
            art.dialog({
                content: "题目不能为空!",
                cancel: false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function() {},
            });
            return;
        }

        var questions = new Array();
        var timu_box = $("#qSnaireEditIframe").contents().find("#timu_List .timu_box");

        timu_box.each(function(index, el) {
            var that = $(this);

            var title = that.find(".sxtitle").text();
            var type = that.attr("data-type");

            var msck = that.find(".msck");
            var required = 2;
            if (msck.is(':checked')) {
                required = 1;
            } else {
                required = 2;
            }

            var options = [];
            var timu_items = that.find(".timu_dry .timu_items");
            timu_items.each(function(index, el) {
                var name = $(this).find(".opname").text();
                options.push({
                    name: name
                });
            });

            if (type == "3") {
                if (that.attr("data-id") != "undefined") { //旧题目
                    if (that.attr("data-qbid") != "undefined") {
                        var qbId = that.attr("data-qbid");
                    } else {
                        var qbId = that.attr("data-id");
                    }
                    var id = that.attr("data-id");
                    questions.push({
                        id: id,
                        qbId: qbId,
                        title: title,
                        type: type,
                        required: required
                    });
                } else {
                    questions.push({
                        title: title,
                        type: type,
                        required: required
                    });
                }
            } else {
                if (that.attr("data-id") != "undefined") { //旧题目
                    if (that.attr("data-qbid") != "undefined") {
                        var qbId = that.attr("data-qbid");
                    } else {
                        var qbId = that.attr("data-id");
                    }
                    var id = that.attr("data-id");
                    questions.push({
                        id: id,
                        qbId: qbId,
                        title: title,
                        type: type,
                        required: required,
                        options: options
                    });
                } else {
                    questions.push({
                        title: title,
                        type: type,
                        required: required,
                        options: options
                    });
                }

            }
        });

        $.ajax({
            url: domainUrl + 'admin/qn/edit.do',
            type: "POST",
            dataType: "json",
            data: {
                token: token,
                id: id,
                name: name,
                description: description,
                beginDate: beginDate,
                endDate: endDate,
                categoryId: categoryId,
                status: status,
                expectQuizTime: expectQuizTime,
                questions: JSON.stringify(questions)
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
                            $('#e_qSnaireModal').modal('hide');
                            $("#table-data").bootstrapTable('refresh');
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

    /***********************编辑问卷 e***************************/

    //批量删除事件
    $("#qSnaire_deletes").click(function(event) {
        var $table = $("#table-data");
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
                        url: domainUrl + 'admin/qn/delete.do',
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
                            }else if (data.code == 201) {
                                art.dialog({
                                    content: data.msg,
                                    cancel: false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function() {},
                                });
                            }else if (data.code == 500) {
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
        }

    });

});

function operateFormatter(value, row, index) {
    var rowedit_html = "";
    var rowdelete_html = "";
    var rowdetails_html = "";

    if (arr_authList.indexOf('/admin/qn/edit.do') != -1) {
        rowedit_html = '<i class="tbmr rowedit fa fa-edit" title="编辑"></i>';
    }

    if (arr_authList.indexOf('/admin/qn/delete.do') != -1) {
        rowdelete_html = '<i class="tbmr rowdelete fa fa-trash" title="删除"></i>';
    }

    if (arr_authList.indexOf('/admin/qn/get.do') != -1) {
        rowdetails_html = '<i class="tbmr rowdetails fa fa-info-circle" title="详情"></i>';
    }

          
    return [rowedit_html,          rowdelete_html, rowdetails_html,       ].join('');
}

window.operateEvents = {    
    'click .rowdelete': function(e, value, row, index) { //单独删除问卷
        art.dialog({
            content: "确定要删除本条数据？",
            ok: function() {
                var ids = new Array();
                ids.push(row.id);
                $.ajax({
                    url: domainUrl + 'admin/qn/delete.do',
                    type: "POST",
                    dataType: "json",
                    data: {
                        token: token,
                        ids: ids.join(',')
                    },
                    success: function(data) {
                        console.log(data.code);
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
                        }else if (data.code == 201) {
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
        $('#qSnaireEditIframe').attr('src', $('#qSnaireEditIframe').attr('src'));
        var id = row.id;
        $("#e_id").attr("value", id);
        $("#e_qSnaireModal").modal('show');     
    },
    'click .rowdetails': function(e, value, row, index) { //查看详情
        $('#qSnaireDetailIframe').attr('src', $('#qSnaireDetailIframe').attr('src'));
        var id = row.id;
        $("#e_details_id").attr("value", id);
        $("#detailsModal").modal('show');
    },
}
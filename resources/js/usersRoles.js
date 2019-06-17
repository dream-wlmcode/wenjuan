//获取管理员的ID
var id = $("#usersRolesModal #usersRoles_id",window.parent.document).val();
//保存被选中的角色
var cked_Array = [];



/*tree set s*/
var setting = {
    view: {
        selectedMulti: true,
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
    	beforeClick:zTreeBeforeClick
    },
}

function zTreeBeforeClick(treeId, treeNode){
	return !treeNode;// 返回false 不让选取
}
/*tree set e*/



$(function(){

    //获取权限
    $.ajax({
      url: domainUrl + 'admin/getUserInfo.do',
      type: "POST",
      dataType: "json",
      data: {token: token},
      success:function (data) {
        if (data.code == 200) {
          var authList = data.data.authList;
            arr_authList = authList.split(",");
            if(arr_authList.indexOf('/admin/useradmin/listRole.do') != -1){
                //获取左边管理员角色列表
    			getLeftusersR();
            }


            if(arr_authList.indexOf('/admin/auth/list.do') != -1){
			    //获取权限树结构
			    getqxTree();
            }



            if(arr_authList.indexOf('/admin/nav/list.do') != -1){
			    //获取导航树结构
			    getdhTree();
            }



            //添加按钮权限
            if (arr_authList.indexOf('/admin/useradmin/grantRole.do') != -1) {
                $("#add_usersRBtn").removeClass('hide');
            } else {
                $("#add_usersRBtn").addClass('hide');
            }




            //添加角色至管理员
            $("#add_usersRBtn").click(function(event) {
            	cked_Array = [];
	            $("#roleList-table").bootstrapTable('destroy'); 
		        $.initBootstrapTable("#roleList-table", {
		               method: 'post',
		               url: domainUrl + 'admin/role/list.do?token='+token,
		               toolbar: '',  
		               pageSize: 2, 
		               columns: [
		                    {
		                        checkbox: true
		                    },
		                    {
		                        field: 'id',
		                        title: '角色ID',
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
		               ],

		               onPostBody:function(){
				            $table = $("#roleList-table");
				            var cklen = $table.find("td input:checkbox").length;
				            for(var i=0;i<cked_Array.length;i++){
				            	var id = cked_Array[i];
				                $table.find("td input:checkbox[value='"+id+"']").prop("checked",true);
				                var ckedlen = $table.find("td input:checkbox:checked").length;
				                if(cklen == ckedlen){
				                    $table.find("td input:checkbox[value='"+id+"']").parents("#roleList-table").find("th input:checkbox").prop("checked",true);
				                }
				            }
				       },
		               onCheckAll:function(rows){ //全选
               	          console.log(cked_Array.length);
				          console.log(rows.length);

				          var ids = "";
				          var id_arry = [];
				          var ckid_arry = [];
				          for(var i=0;i<rows.length;i++){
				            id_arry.push(rows[i].id);
				          }

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

				          for(var i=ids.length-1;i>=0;i--){
				              var id = ids[i];
				              cked_Array.push(parseInt(id)); //要拿到选中的值的时候id要为整型
				          }
		               },

		               onCheck:function(row, $element){ //选中
				            var id = row.id;
				            cked_Array.push(id);  
		               },
		               onUncheck:function(row, $element){  //取消选中
				            var id = row.id;
				            cked_Array.splice($.inArray(id, cked_Array), 1);
		               },
		        });



			    $("#roleList-table").on('uncheck-all.bs.table',function(e,rows){ //取消全选
			        var $table = $(e.currentTarget);
			        if(rows.length != 0){
			           for(var i=0;i<rows.length;i++){
			               var id = rows[i].id;
			               cked_Array.splice($.inArray(id, cked_Array), 1);
			           } 
			        }else{
			           $table.find("td input:checkbox").each(function(index, el) {
			               id = $(this).val();
			               console.log("id:"+id);
			               cked_Array.splice($.inArray(id, cked_Array), 1);
			           });
			        }
			    });



            	$("#roleListModal").modal("show");
            });


            //确认角色至管理员
            $("#roleListModal_ok").click(function(event) {
            	// console.log(unique(cked_Array));
            	var ids = unique(cked_Array); //选中值再次过滤去重
            	for(var i=0;i<ids.length;i++){
            		var roleId = ids[i];
            		URway(roleId); //授予管理员角色
            	}

            });
        }else if(data.code == 201){
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
          alert(error);
      }
    });
    





});




function getLeftusersR(){
    $.initBootstrapTable("#usersR-table-data", {
         method: 'post',
         url: domainUrl + 'admin/useradmin/listRole.do?token='+token,
         queryParams: usersRqueryParams,    
         toolbar: '#toolbar',
         pagination:false,
         columns: [
              {
                  field: 'id',
                  title: '角色ID',
                  visible:false
              },
              {
                  field: 'name',
                  title: '名称'
              }, 
              {
                  field: 'uName',
                  title: '操作人'
              }, 
              {
                  field: 'date',
                  title: '创建时间'
              },
              {
                 field: 'Button',
                 title: '操作',
                 events: operateEvents,
                 formatter: operateFormatter
              },  
         ],
         onClickRow:function (row,$element) {
            $('.selected').removeClass('selected');
            $($element).addClass('selected');
            var id = row.id;

            var authParentIds = [];
        	var authIds = []; 


	        var navParentIds = [];
	        var navIds = [];
            $.ajax({
		      url: domainUrl + 'admin/role/get.do',
		      async:false,
		      type: "POST",
		      dataType: "json",
		      data: {token: token,id:id},
		      success:function (data) {
		      	if (data.code == 200) {
		      		for (var i = 0; i < data.data.authList.length; i++) {
                       authParentIds.push(data.data.authList[i].parentId);
                       authIds.push(data.data.authList[i].id);
                    }

                    for (var i = 0; i < data.data.navList.length; i++) {
                       navParentIds.push(data.data.navList[i].parentId);
                       navIds.push(data.data.navList[i].id);
                    }
		      	}else if(data.code == 201){
		      		alert(data.msg);
		      	}
		      },
              error: function(error) {
		          alert(error);
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
	                    $.fn.zTree.init($("#qxTree"), setting, zNodes);
	                    //默认展开根目录
	                    dafultzkdirectory("qxTree");

	                    var qxTree = $.fn.zTree.getZTreeObj("qxTree");
	                    for(var j=0;j<authParentIds.length;j++){
	                        var node = qxTree.getNodeByParam("id", authParentIds[j],null);
	                        if(node != null) {
	                            qxTree.expandNode(node, true, false);
	                        }
	                    }
	                    console.log(authIds);
	                    for(var i = 0; i < authIds.length; i++) {
	                        var node = qxTree.getNodeByParam("id", authIds[i]);
	                        console.log(node);
	                        if(node != null) {
	                        	console.log(111);
	                            qxTree.selectNode(node, true);
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
	                    $.fn.zTree.init($("#dhTree"), setting, zNodes);
	                    //默认展开根目录
	                    dafultzkdirectory("dhTree");

	                    var dhTree = $.fn.zTree.getZTreeObj("dhTree");
	                    for(var j=0;j<navParentIds.length;j++){
	                        var node = dhTree.getNodeByParam("id", navParentIds[j],null);
	                        if(node != null) {
	                            dhTree.expandNode(node, true, false);
	                        }
	                    }
	                    for(var i = 0; i < navIds.length; i++) {
	                        var node = dhTree.getNodeByParam("id", navIds[i],null);
	                        if(node != null) {
	                            dhTree.selectNode(node, true)
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

    });
}



function URway(roleId){
    $.ajax({
        url: domainUrl + 'admin/useradmin/grantRole.do',
        type: "POST",
        dataType: "json",
        data: {
            token: token,
            id: id,
            roleId:roleId
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
                    	$("#roleListModal").modal("hide");
        				$("#usersR-table-data").bootstrapTable('refresh');
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



function getqxTree(){
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
                $.fn.zTree.init($("#qxTree"), setting, zNodes);
                //默认展开根目录
                dafultzkdirectory("qxTree");
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



function getdhTree(){
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
                $.fn.zTree.init($("#dhTree"), setting, zNodes);
                //默认展开根目录
                dafultzkdirectory("dhTree");
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



function usersRqueryParams(params){
	var temp = {   
        page: (params.offset/params.limit) + 1,  
        count:params.limit, 
        id:id,
    };
    return temp;
}





function operateFormatter(value, row, index) {
    var rowdeleteUR_html = "";
    if(arr_authList.indexOf('/admin/useradmin/removeRole.do') != -1){
        rowdeleteUR_html ='<i class="tbmr rowdeleteUR fa fa-trash" title="删除"></i>';
    }
    return [
	    rowdeleteUR_html,
    ].join('');
}

window.operateEvents = {
    'click .rowdeleteUR': function(e, value, row, index) { //单独删除管理员角色
		e.stopPropagation();
        var roleId = row.id;
        art.dialog({
            content: "确定要删除本条数据？",
            ok: function() {
                $.ajax({
                    url: domainUrl + 'admin/useradmin/removeRole.do',
                    type: "POST",
                    dataType: "json",
                    data: {
                        token: token,
                        id:id,
                        roleId:roleId,
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
                                	$("#usersR-table-data").bootstrapTable('refresh');
                                },
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
            },
            lock: true,
            width: 200,
            cancelValue: '取消',
            cancel: function() {},
        });


        return false;   
    },
}
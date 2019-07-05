var token = $.cookie('token');
var pagesPath = "/pages/";
var querys = {}; //导航参数对象
$(function(){
    /*搜索隐藏 s*/
    $("#searchButton").parents(".form-inline").remove();
    /*搜索隐藏 e*/
	
	//获取用户账号
	$.ajax({
        url: domainUrl + 'admin/getUserInfo.do',
        type: "POST",
        dataType: "json",
        data: {token: token},
        success:function (data) {
            if (data.code == 200) {
                var account = data.data.account;
                var authList = data.data.authList;
                $("#nav-account").text(account);

                if (authList.indexOf('/admin/nav/list.do') != -1) {
                    var nav_list_do = "admin/nav/list.do";
                    // console.log(data.data.navList);
                    var html = "";
                    html += '<li class="nav-title">导航</li>';
                    for(var i=0; i<data.data.navList.length;i++){
                        var name = data.data.navList[i].name;
                        var parentId = data.data.navList[i].parentId;
                        var path = data.data.navList[i].path;
                        var bjClass = "";
                        var iconClass = "";
                        var navItem = "";
                        var navLink = "";
                        switch(name)
                        {
                            case "主页":
                              iconClass = "icon icon-home";
                              break;
                            case "基础管理":
                              iconClass = "icon icon-target";
                              break;
                            case "题库管理":
                              iconClass = "icon icon-question";
                              break;
                            case "问卷管理":
                              iconClass = "icon icon-puzzle";
                              break;
                            case "数据库管理":
                              iconClass = "fa fa-database";
                              break;
                           case "统计管理":
                              iconClass = "icon icon-chart";
                              break;
                           case "日志管理":
                              iconClass = "icon icon-pencil";
                              break;
                            default:
                              iconClass = "icon icon-target";
                        }
                        if(path == ""){
                            path = "javascript:;";
                        }else{
                            if(name == "主页"){
                                path = '/'+path;
                            }else{
                                path = pagesPath + path;
                            }
                        }
                        if(data.data.navList[i].childList != undefined){
                            navItem = "nav-dropdown";
                            navLink = "nav-dropdown-toggle";
                        }else{
                            navItem = "";
                            navLink = "";
                        }
                        html += '<li class="nav-item '+navItem+'">'+
                            '<a href="'+path+'" class="nav-link '+navLink+'">'+
                                '<i class="'+iconClass+'"></i> '+name;
                                if(data.data.navList[i].childList != undefined){
                                  html +=' <i class="fa fa-caret-left"></i>';
                                }
                        html += '</a>';
                            if(data.data.navList[i].childList != undefined){
                                html += '<ul class="nav-dropdown-items">';
                                    for(var j=0;j<data.data.navList[i].childList.length;j++){
                                        html += '<li class="nav-item">'+
                                            '<a href="'+pagesPath+data.data.navList[i].childList[j].path+'" class="nav-link">'+
                                                '<i class="'+iconClass+'"></i>'+data.data.navList[i].childList[j].name+
                                            '</a>'+
                                        '</li>';
                                    }
                                html += '</ul>';
                            }
                        html += '</li>';

                        /*
                        html +='<li class="nav-item"><a href="/pages/'+pagePath+'" class="nav-link '+bjClass+'">'+
                                '<i class="icon '+iconClass+'"></i>'+name+'</a></li>';
                        html += '<li class="nav-item nav-dropdown">'+
                            '<a href="#" class="nav-link nav-dropdown-toggle">'+
                                '<i class="icon icon-target"></i> '+data.data[i].name+' <i class="fa fa-caret-left"></i>'+
                            '</a>'+
                            '<ul class="nav-dropdown-items">'+
                                '<li class="nav-item">'+
                                    '<a href="layouts-normal.html" class="nav-link">'+
                                        '<i class="icon icon-target"></i>'+data.data[i].name+
                                    '</a>'+
                                '</li>'+
                            '</ul>'+
                        '</li>';*/
                    }
                    $("#menu-list").html(html);
                    $("#menu-list").find(".nav-item.nav-dropdown").click(function(event) {
                        $(this).toggleClass("open").siblings('.nav-item.nav-dropdown').removeClass('open');
                    });

                    //点击菜单添加类
                    addActiveWay();
                }
            }else if(data.code == 202){
                // alert(data.msg);
                art.dialog({
                    content: data.msg,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        window.location.href = "/login.html";
                    },
                });
                
            }
        },
        error: function(error) {
            alert(error);
            setTimeout(function () {
               window.location.href = "/login.html";
 	       }, 1500);
        }
    });





    //退出登录
    $("#logout").click(function(event) {
        art.dialog({
            content: "您确定要退出登录？",
            ok: function() {
                $.ajax({
                    url: domainUrl + 'admin/logout.do',
                    type: "POST",
                    dataType: "json",
                    data: {token: token},
                    success:function (data) {
                        if (data.code == 200) {
                            art.dialog({
                                content:data.msg,
                                cancel:false,
                                fixed: true,
                                lock: true,
                                dblclick_hide:false,
                                width: 200,
                                ok:function(){
                                    window.location.href = "/login.html";
                                }
                            });
                        }else if(data.code == 202){
                            art.dialog({
                                content:data.msg,
                                cancel:false,
                                fixed: true,
                                lock: true,
                                dblclick_hide:false,
                                width: 200,
                                ok:function(){
                                    window.location.href = "/login.html";
                                }
                            });
                        }
                    },
                    error: function(error) {
                        alert(error);
                        setTimeout(function () {
                           window.location.href = "/login.html";
                        }, 1500);
                    }
                }); 
            },
            lock: true,
            width: 200,
            cancelValue: '取消',
            cancel: function() {},
        });

    });

});

function leftnavList(){ // 获取左边菜单列表
    $.ajax({
        url: domainUrl + 'admin/getUserInfo.do',
        type: "POST",
        dataType: "json",
        data: {token: token},
        success:function (data) {
            if (data.code == 200) {
                var authList = data.data.authList;
                if (authList.indexOf('/admin/nav/list.do') != -1) {
                    var nav_list_do = "admin/nav/list.do";
                    var html = "";
                    html += '<li class="nav-title">导航</li>';
                    for(var i=0; i<data.data.navList.length;i++){
                        var name = data.data.navList[i].name;
                        var parentId = data.data.navList[i].parentId;
                        var path = data.data.navList[i].path;
                        var bjClass = "";
                        var iconClass = "";
                        var navItem = "";
                        var navLink = "";
                        switch(name)
                        {
                            case "基础管理":
                              iconClass = "icon-target";
                              break;
                            case "题库管理":
                              iconClass = "icon-energy";
                              break;
                            case "问卷管理":
                              iconClass = "icon-puzzle";
                            default:
                              iconClass = "icon-target";
                        }
                        if(path == ""){
                            path = "javascript:;";
                        }else{
                            path = pagesPath + path;
                        }
                        if(data.data.navList[i].childList != undefined){
                            navItem = "nav-dropdown";
                            navLink = "nav-dropdown-toggle";
                        }else{
                            navItem = "";
                            navLink = "";
                        }
                        html += '<li class="nav-item '+navItem+'">'+
                            '<a href="'+path+'" class="nav-link '+navLink+'">'+
                                '<i class="icon '+iconClass+'"></i> '+name;
                                if(data.data.navList[i].childList != undefined){
                                  html +=' <i class="fa fa-caret-left"></i>';
                                }
                        html += '</a>';
                            if(data.data.navList[i].childList != undefined){
                                html += '<ul class="nav-dropdown-items">';
                                    for(var j=0;j<data.data.navList[i].childList.length;j++){
                                        html += '<li class="nav-item">'+
                                            '<a href="'+pagesPath+data.data.navList[i].childList[j].path+'" class="nav-link">'+
                                                '<i class="icon icon-target"></i>'+data.data.navList[i].childList[j].name+
                                            '</a>'+
                                        '</li>';
                                    }
                                html += '</ul>';
                            }
                        html += '</li>';
                    }
                    $("#menu-list").html(html);
                    $("#menu-list").find(".nav-item.nav-dropdown").click(function(event) {
                        $(this).toggleClass("open");
                    });
                    //点击菜单添加类
                    addActiveWay();
                }
            }else if(data.code == 202){
                // alert(data.msg);
                art.dialog({
                    content: data.msg,
                    cancel: false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok: function() {
                        window.location.href = "/login.html";
                    },
                });
            }
        },
        error: function(error) {
           alert(error);
           setTimeout(function () {
                window.location.href = "/login.html";
 	       }, 1500);
        }
	});  
}



function addActiveWay(){ //根据url判断
	var locaName,
    $location = window.location.pathname,
    lvnav = $("#menu-list"),
    $link = lvnav.find(".nav-link");
    // $location ="http://sys.lihongda.cn/wenjuan/pages/roleManagement.html";
    locaName = GetPageName($location);
	$.each($link,function(i,ele){
		var $href = $(ele).attr("href");
        var res = GetPageName($href);
		if(res){
            // console.log("locaName:"+locaName);
            // console.log("res:"+res);
            // if(res.indexOf(locaName) > 0 ){
            //    alert('res中包含locaName字符串');
            // }
			if(locaName === res){
				$(ele).addClass("active").parent(".nav-item").siblings("li.nav-item").find(".nav-link").removeClass("active");
				if($(ele).parents(".nav-dropdown") != undefined){
					$(ele).parents(".nav-dropdown").addClass('open');
				}
			}
		}
		
	});
}


//获取页面文件名 
function GetPageName(url) { 
    var tmp= new Array();//临时变量，保存分割字符串 
    tmp=url.split("/");//按照"/"分割 
    var pp = tmp[tmp.length-1];//获取最后一部分，即文件名和参数 
    tmp=pp.split("?");//把参数和文件名分割开 
    tmp=pp.split(".");
    return tmp[0]; 
}


//获取选中行的index索引号
function getIdSelections($table) { 
    return $.map($table.bootstrapTable('getSelections'), function(row) {
        return row.id
    });
}




/**
 * 默认展开根目录
 */
 function dafultzkdirectory(treeobj){
        var treeObj = $.fn.zTree.getZTreeObj(treeobj);
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
              for(var i=0;i<nodes.length;i++){
                treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
              }
        }
 }


/**
 * 默认选中根目录
 */
 function dafultxzdirectory(treeobj){
     var treeObj = $.fn.zTree.getZTreeObj(treeobj);
     var nodes = treeObj.getNodes();  
     if (nodes.length > 0) {
        var node = treeObj.selectNode(nodes[0]);//默认选中根节点
        var node = treeObj.checkNode(nodes[0]);//默认选中根节点
     }
}



/**
 * 刷新表格
 */
function refreshTable($table,id,isLeftck){
    if(isLeftck != null){
        if(!isLeftck){
            if(id == 0){
                querys.maxLevel = 1;
                delete querys["parentId"];
            }else{
                querys.parentId = id;
                delete querys["maxLevel"];
            }
            $table.bootstrapTable('refresh',{
                pageNumber:1
            });
        }else{
            if(id == 0){
                querys = {};
                $table.bootstrapTable('refresh');
            }
        }
    }
    // $table.bootstrapTable('refresh',{
    //     pageNumber:1
    // });
}





/**
 * 取出两个数组的不同元素
 */
function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}


function arraysDiff(arr1,arr2){
    var temp = arr1.concat(arr2);
    var rel = {};
    var end = [];
    for(var i = 0;i < temp.length; i ++){
        temp[i] in rel ? rel[temp[i]] ++ : rel[temp[i]] = 1;
    }
    for(x in rel){
        if(rel[x] == 1){
            end.push(x);
        }
    }
    return end;
}


function unique(arr){   
    for(var i =0,uarr=[];i<arr.length;i++){
        for(var k =0;k<uarr.length;k++){
            if(arr[i] == uarr[k]){
                break;
            }
        }
        k==uarr.length && (uarr[k]=arr[i]);
    }
    return uarr;
}

// 找出数组中出现次数最多的元素
function findMost(arr) {
    var maxEle;
    var maxNum = 1;
    var obj = arr.reduce(function (p, k) {
        p[k] ? p[k]++ : p[k] = 1;

        if (p[k] > maxNum) {
            maxEle = k;
            maxNum++;
        }

        return p;

    }, {});
    return maxEle;
}


//js数组删除所有重复的元素(删除指定的元素)
function delArrElem(arr,s){
    var i=arr.length;
    while(i--)if(arr[i]===s)arr.splice(i,1);
    return arr;
}


//获取数组重复的元素
function refrain(arr) {
　　var tmp = [];
　　if(Array.isArray(arr)) {
　　　　arr.concat().sort().sort(function(a,b) {
　　　　　　if(a==b && tmp.indexOf(a) === -1) tmp.push(a);
　　　　});
　　}
　　return tmp;
}


/*获取参数*/
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = decodeURI(window.location.search).substr(1).match(reg); 
    if (r != null){
        return unescape(r[2]); 
        return null; 
    }
}




/*下拉表格列表*/
function dropdownTable(name,id,selectCot,d_table,table,parameter){
        var _name = name;
        var _id = id;
        var _selectCot = selectCot;
        var _d_table = d_table;
        var _table = table;
        var _parameter = parameter;

        $("#"+_name).click(function(event) {
            event.stopPropagation();
            if($("#"+_selectCot).is(":hidden")){
              $("#"+_d_table).bootstrapTable('refresh');
              $("#"+_selectCot).show();
              $("#"+_selectCot).animate({marginTop:"5px",opacity:"1"},"fast");
            }else{
              $("#"+_selectCot).hide();
              $("#"+_selectCot).animate({marginTop:"50px",opacity:"0"},"fast");
            }
        });
        $("#"+_name).siblings('.downtb').click(function(event) {
            event.stopPropagation();
            if($("#"+_selectCot).is(":hidden")){
              $("#"+_d_table).bootstrapTable('refresh');
              $("#"+_selectCot).show();
              $("#"+_selectCot).animate({marginTop:"5px",opacity:"1"},"fast");
            }else{
              $("#"+_selectCot).hide();
              $("#"+_selectCot).animate({marginTop:"50px",opacity:"0"},"fast");
            }
        });
        $("#"+_d_table).on('click-row.bs.table', function (e, row, element){
          $("#"+_name).attr("value",row.name);
          $("#"+_name).val(row.name);
          $("#"+_id).attr("value",row.id);
          $("#"+_id).val(row.id);

          $("#"+_selectCot).hide();
          $("#"+_selectCot).animate({marginTop:"50px",opacity:"0"},"fast");

          if(_table != null && _parameter != null){
             if(row.id =! undefined){
                var id = row.id;
             }
             if(row.name =! undefined){
                var name = row.name;
             }
             var qy = {}
             if(_parameter == "type"){
               qy._parameter = id;
             }else if(_parameter == "tableName"){
               qy._parameter = name;
             }
             $("#"+_table).bootstrapTable('refresh',{
                query:qy
             });
          }
          

        });
        $(document).click(function(e) {
            e.stopPropagation();
            if($("#"+_selectCot).css("display") === "block"){
              $("#"+_selectCot).hide();
              $("#"+_selectCot).animate({marginTop:"50px",opacity:"0"},"fast");
            }
        });
        $("#"+_selectCot).click(function(e) {
            e.stopPropagation();
        });
}
		
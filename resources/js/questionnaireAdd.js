var querys = {}; //添加问卷参数对象
var ix = 1;
var e_ix = 1;
$(function() {

    var addqSnaire_beginDate1 = $("#addqSnaire_beginDate1").datetimepicker({ //选择年月日
        //显示中文
        language: 'zh-CN',
        //显示格式
        format: 'yyyy-mm-dd hh:ii',
        //设置只显示到月份
        minView: "month",
        //初始化当前日期
        initialDate: new Date(),
        //选中自动关闭
        autoclose: true,
        //显示今日按钮
        todayBtn: true 
    });

    var addqSnaire_endDate1 = $("#addqSnaire_endDate1").datetimepicker({ //选择年月日
        //显示中文
        language: 'zh-CN',
        //显示格式
        format: 'yyyy-mm-dd hh:ii',
        //设置只显示到月份
        minView: "month",
        //初始化当前日期
        initialDate: new Date(),
        //选中自动关闭
        autoclose: true,
        //显示今日按钮
        todayBtn: true,
        useCurrent: false　　　
    });

    addqSnaire_beginDate1.on("changeDate",
    function(e) {
        $('#addqSnaire_endDate1').datetimepicker('setStartDate', e.date);
    });
    addqSnaire_endDate1.on("changeDate",
    function(e) {
        $('#addqSnaire_beginDate1').datetimepicker('setEndDate', e.date);
    });


     /***********************下拉问卷分类部分 s***************************/
    //加载问卷分类表格数据
    loadingqnairClassify();
    //下拉问卷分类列表
    $("#addqSnaire_categoryName").click(function(event) {
        event.stopPropagation();
        if ($("#addqSnaire-selectCot").is(":hidden")) {
            $("#addqSnaire-selectCot").show();
            $("#addqSnaire-selectCot").animate({
                marginTop: "5px",
                opacity: "1"
            },
            "fast");
        } else {
            $("#addqSnaire-selectCot").hide();
            $("#addqSnaire-selectCot").animate({
                marginTop: "50px",
                opacity: "0"
            },
            "fast");
        }
    });
    $("#addqSnaire_categoryName").siblings('.downtb').click(function(event) {
        event.stopPropagation();
        if($("#addqSnaire-selectCot").is(":hidden")){
          $("#addqSnaire-selectCot").show();
          $("#addqSnaire-selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
        }else{
          $("#addqSnaire-selectCot").hide();
          $("#addqSnaire-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $('#selectqnairClassify-table').on('click-row.bs.table',
    function(e, row, element) {
        $("#addqSnaire_categoryName").attr("value", row.name);
        $("#addqSnaire_categoryName").val(row.name);
        $("#addqSnaire_categoryId").attr("value", row.id);
        $("#addqSnaire_categoryId").val(row.id);
        $("#addqSnaire-selectCot").hide();
        $("#addqSnaire-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
    });

    $('#addqSnaireModal',window.parent.document).on('click',
    function(e) {
        e.stopPropagation();
        if ($("#addqSnaire-selectCot").css("display") === "block") {
            $("#addqSnaire-selectCot").hide();
            $("#addqSnaire-selectCot").animate({
                marginTop: "50px",
                opacity: "0"
            },
            "fast");
        }
    });
    $('#addqSnaireModal .modal-dialog',window.parent.document).click(function(e) {
        if ($("#addqSnaire-selectCot").is(":visible")) {
            $("#addqSnaire-selectCot").hide();
            $("#addqSnaire-selectCot").animate({
                marginTop: "50px",
                opacity: "0"
            },
            "fast");
        }
    });


    $(document).click(function(e) {
        if ($("#addqSnaire-selectCot").is(":visible")) {
              $("#addqSnaire-selectCot").hide();
              $("#addqSnaire-selectCot").animate({
                  marginTop: "50px",
                  opacity: "0"
              },
              "fast");
        }
    });
    $("#addqSnaire-selectCot").click(function(e) {
        e.stopPropagation();
    });
    /***********************下拉问卷分类部分 e***************************/



     /***********************添加题库部分 s***************************/
    //添加题库题目
    $("#add_timu").click(function(event) {
        $('#addqSubjectModal').modal('show');
        $("#addqSubject_title").val("");
        $("#addqSubject_type option:first").prop("selected", 'selected');
        $("#select_Box").find(".card-header").text("单选选项列表");
        $("#select_Box").find(".card-body .xxtext:first").val("");
        $("#select_Box").find(".coningroup").each(function(index, el) {
            if($(this).attr("data-ix") != undefined){
                $(this).remove();
            }
        });
        $("#addqSubject_status option:first").prop("selected", 'selected');
        $("#addqSubject_categoryName").val("");
        $("#addqSubject_categoryId").val("");
    });

    //选择类型
    $("#addqSubject_type").change(function(event) {
        var checkValue=$(this).val();
        if(checkValue == "3"){ //填空
          $("#select_Box").attr("style","display:none!important;");
        }else{
          $("#select_Box").attr("style","display:flex!important;");
          if(checkValue == "1"){
            $("#select_Box").find(".card-header").text("单选选项列表");
          }else if(checkValue == "2"){
            $("#select_Box").find(".card-header").text("多选选项列表");
          }
        }
    });

    //单选
    $("#select_Box .card-body .coningroup").find("#plus").click(function(event) {
          console.log($("#select_Box .card-body").find(".coningroup").length);
          if($("#select_Box .card-body").find(".coningroup").length >= 4){
            art.dialog({
                title:"提示",
                content:"最多只能添加4个选项！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
          }
          ix ++;
          var chm = '<div class="input-group mb-3 coningroup" data-ix="'+ix+'">'+
                        '<input type="text" class="form-control input-sm col-6 xxtext" placeholder="选项'+ix+'">'+
                        '<div class="input-group-prepend mx-sm-3"><span class="input-group-text plus" onclick="plusWay(this)">+</span></div>'+
                        '<div class="input-group-prepend" hidden="hidden">'+
                        '<span class="input-group-text minus" onclick="minusWay(this)">-</span></div>'+
                    '</div>';
          $(this).parents(".card-body").append(chm);
           $("#select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
           $("#select_Box .card-body").find(".coningroup:last").siblings('.coningroup').find(".minus").parent(".input-group-prepend").attr("hidden","hidden");
    });

    //加载题库分类表格数据
    loadingqClassify();
    //下拉题库分类列表
    $("#addqSubject_categoryName").click(function(event) {
        event.stopPropagation();
        if($("#addqSubject-selectCot").is(":hidden")){
          $("#addqSubject-selectCot").show();
          $("#addqSubject-selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
        }else{
          $("#addqSubject-selectCot").hide();
          $("#addqSubject-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $("#addqSubject_categoryName").siblings('.downtb').click(function(event) {
        event.stopPropagation();
        if($("#addqSubject-selectCot").is(":hidden")){
          $("#addqSubject-selectCot").show();
          $("#addqSubject-selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
        }else{
          $("#addqSubject-selectCot").hide();
          $("#addqSubject-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $('#selectqClassify-table').on('click-row.bs.table', function (e, row, element){
      $("#addqSubject_categoryName").attr("value",row.name);
      $("#addqSubject_categoryName").val(row.name);
      $("#addqSubject_categoryId").attr("value",row.id);
      $("#addqSubject_categoryId").val(row.id);

      $("#addqSubject-selectCot").hide();
      $("#addqSubject-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
    });
    $('#addqSubjectModal').on('hidden.bs.modal', function (e) {
        e.stopPropagation();
        if($("#addqSubject-selectCot").css("display") === "block"){
          $("#addqSubject-selectCot").hide();
          $("#addqSubject-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $('#addqSubjectModal').find(".modal-dialog").click(function(e) {
        if($("#addqSubject-selectCot").is(":visible")){
          $("#addqSubject-selectCot").hide();
          $("#addqSubject-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $("#addqSubject-selectCot").click(function(e) {
        e.stopPropagation();
    });
    //保存添加题库题目
    $("#addqSubjectModal_save").click(function(event) {
        var title = $("#addqSubject_title").val();
        var type = $("#addqSubject_type").val();
        var status = $("#addqSubject_status").val();
        var categoryName = $("#addqSubject_categoryName").val();
        var categoryId = $("#addqSubject_categoryId").val();


        if($.trim(title).length == 0){
            art.dialog({
                content:"标题不能为空!",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }


        var options = new Array();
        if(type != "3"){ //单选和多选
          var txt = "";
          if(type == "1"){
             txt = "单选";
          }else if(type == "2"){
             txt = "多选";
          }
          $("#select_Box").find(".xxtext").each(function(index, el) {
            if($.trim($(this).val()).length == 0){
              var titv = $(this).attr("placeholder");
              art.dialog({
                  content:txt+titv+"不能为空!",
                  cancel:false,
                  fixed: true,
                  lock: true,
                  width: 200,
                  ok: function () {},
              });
              return false;
            }else{
              var xxv = $(this).val();
              options.push({name:xxv});
            }
          });
        }
        
        if($.trim(categoryName).length == 0){
            art.dialog({
                content:"题库分类名称不能为空!",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }



        timuxx_len = 1;
        var timu_listlen = $("#timu_List").find(".timu_box").length;
        var html = '';
        html +='<div class="timu_box timu_box'+parseInt(timu_listlen+1)+'" data-type="'+type+'"><div class="timu_title">';
        if(type != "3"){
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必选<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" />)</label>';
        }else{
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必填<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" />)</label>';
        }
        html +='<span class="sxnum">'+parseInt(timu_listlen+1)+'</span>.<span class="sxtitle">'+title+'</span></div>';
        if(type != "3"){
            html +='<div class="timu_dry">';
            for(var i=0;i<options.length;i++){
                html +='<span class="timu_items">';
                if(type == "1"){
                    html += '<span class="radio_type"></span>';
                }else if(type == "2"){
                    html += '<span class="checkbox_type"></span>';
                }
                html += '<label>'+parseInt(timuxx_len++)+'、<span class="opname">'+options[i].name+'</span></label></span>';
            }
            html +='</div>';
        }

        options =  JSON.stringify(options).replace(/\"/g,"'");
        title = JSON.stringify(title).replace(/\"/g,"'");
        categoryName = JSON.stringify(categoryName).replace(/\"/g,"'");
        console.log(options);
        console.log(title);
        console.log(categoryName);
        html +='<div class="timu_opernDiv">'+
        '<button type="button" class="obtn btn btn-sm btn-outline-info tmEditBtn" data-listlen="'+parseInt(timu_listlen+1)+'" onclick="timuEdit(this,'+title+','+type+','+options+','+status+','+categoryId+','+categoryName+')">编辑</button>'+
        '<button type="button" class="obtn btn btn-sm btn-outline-danger tmDeteleBtn" onclick="timuDetele(this)">删除</button>'+
        '</div>';
        html +='</div>';

        $("#timu_List").find(".timu_empty").hide();
        $("#timu_List").append(html);
        $("#addqSubjectModal").modal('hide');
    });
    /***********************添加题库部分 e***************************/




    /***********************编辑题库题目部分 s***************************/
      
    //选择类型
    $("#e_type").change(function(event) {
        var checkValue=$(this).val();
        if(checkValue == "3"){ //填空
          $("#e_select_Box").attr("style","display:none!important;");
        }else{
          $("#e_select_Box").attr("style","display:flex!important;");
          if(checkValue == "1"){
            $("#e_select_Box").find(".card-header").text("单选选项列表");
          }else if(checkValue == "2"){
            $("#e_select_Box").find(".card-header").text("多选选项列表");
          }
        }
    });


    //选择
    $("#e_select_Box .card-body .coningroup").find("#e_plus").click(function(event) {
          console.log($("#e_select_Box .card-body").find(".coningroup").length);
          if($("#e_select_Box .card-body").find(".coningroup").length >= 4){
            art.dialog({
                title:"提示",
                content:"最多只能添加4个选项！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
          }
          e_ix ++;
          var chm = '<div class="input-group mb-3 coningroup" data-ix="'+e_ix+'">'+
                        '<input type="text" class="form-control input-sm col-6 xxtext" placeholder="选项'+e_ix+'">'+
                        '<div class="input-group-prepend mx-sm-3"><span class="input-group-text plus" onclick="e_plusWay(this)">+</span></div>'+
                        '<div class="input-group-prepend" hidden="hidden">'+
                        '<span class="input-group-text minus" onclick="e_minusWay(this)">-</span></div>'+
                    '</div>';
          $(this).parents(".card-body").append(chm);
           $("#e_select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
           $("#e_select_Box .card-body").find(".coningroup:last").siblings('.coningroup').find(".minus").parent(".input-group-prepend").attr("hidden","hidden");
    });


    //加载题库分类表格数据
    e_loadingqClassify();

    //下拉题库分类列表
    $("#e_categoryName").click(function(event) {
        event.stopPropagation();
        if($("#e_qSubject_selectCot").is(":hidden")){
          $("#e_qSubject_selectCot").show();
          $("#e_qSubject_selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
        }else{
          $("#e_qSubject_selectCot").hide();
          $("#e_qSubject_selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $("#e_categoryName").siblings('.downtb').click(function(event) {
        event.stopPropagation();
        if($("#e_qSubject_selectCot").is(":hidden")){
          $("#e_qSubject_selectCot").show();
          $("#e_qSubject_selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
        }else{
          $("#e_qSubject_selectCot").hide();
          $("#e_qSubject_selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $('#e_selectqClassify-table').on('click-row.bs.table', function (e, row, element){
      $("#e_categoryName").attr("value",row.name);
      $("#e_categoryName").val(row.name);
      $("#e_categoryId").attr("value",row.id);
      $("#e_categoryId").val(row.id);
      $("#e_qSubject_selectCot").hide();
      $("#e_qSubject_selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
    });
    $('#e_qSubjectModal').on('hidden.bs.modal', function (e) {
        e.stopPropagation();
        if($("#e_qSubject_selectCot").css("display") === "block"){
          $("#e_qSubject_selectCot").hide();
          $("#e_qSubject_selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $('#e_qSubjectModal').find(".modal-dialog").click(function(e) {
        if($("#e_qSubject_selectCot").is(":visible")){
          $("#e_qSubject_selectCot").hide();
          $("#e_qSubject_selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
        }
    });
    $("#e_qSubject_selectCot").click(function(e) {
        e.stopPropagation();
    });
    //保存编辑题库题目
    $("#e_qSubjectModal_save").click(function(event) {
        var id = $("#e_id").val();
        var title = $("#e_title").val();
        var type = $("#e_type").val();
        var status = $("#e_status").val();
        var categoryName = $("#e_categoryName").val();
        var categoryId = $("#e_categoryId").val();
        var tmLen = $("#e_tmLen").val();
        var ckNum = $("#e_ckNum").val();


        if($.trim(title).length == 0){
            art.dialog({
                content:"标题不能为空!",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }


        var options = new Array();
        if(type != "3"){ //单选和多选
          var txt = "";
          if(type == "1"){
             txt = "单选";
          }else if(type == "2"){
             txt = "多选";
          }
          $("#e_select_Box").find(".xxtext").each(function(index, el) {
            if($.trim($(this).val()).length == 0){
              var titv = $(this).attr("placeholder");
              art.dialog({
                  content:txt+titv+"不能为空!",
                  cancel:false,
                  fixed: true,
                  lock: true,
                  width: 200,
                  ok: function () {},
              });
              return false;
            }else{
              var xxv = $(this).val();
              options.push({name:xxv});
            }
          });
        }

        
        if($.trim(categoryName).length == 0){
            art.dialog({
                content:"题库分类名称不能为空!",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }

        timuxx_len = 1;
        // var timu_listlen = $("#timu_List").find(".timu_box").length;
        var html = '';
        html +='<div class="timu_box timu_box'+tmLen+'" data-type="'+type+'"><div class="timu_title">';
        
        var cked = "";
        if(ckNum == "1"){
            cked = "checked";
        }else if(ckNum == "2"){
            cked = "";
        }
        if(type != "3"){
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+tmLen+'">(是否必选<input type="checkbox" class="msck" id="msck_'+tmLen+'" '+cked+' />)</label>';
        }else{
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+tmLen+'">(是否必填<input type="checkbox" class="msck" id="msck_'+tmLen+'" '+cked+' />)</label>';
        }
        html +='<span class="sxnum">'+tmLen+'</span>.<span class="sxtitle">'+title+'</span></div>';
        if(type != "3"){
            html +='<div class="timu_dry">';
            for(var i=0;i<options.length;i++){
                html +='<span class="timu_items">';
                if(type == "1"){
                    html += '<span class="radio_type"></span>';
                }else if(type == "2"){
                    html += '<span class="checkbox_type"></span>';
                }
                html += '<label>'+parseInt(timuxx_len++)+'、<span class="opname">'+options[i].name+'</span></label></span>';
            }
            html +='</div>';
        }
        options =  JSON.stringify(options).replace(/\"/g,"'");
        title = JSON.stringify(title).replace(/\"/g,"'");
        categoryName = JSON.stringify(categoryName).replace(/\"/g,"'");
        html +='<div class="timu_opernDiv">'+
        '<button type="button" class="obtn btn btn-sm btn-outline-info tmEditBtn" data-listlen="'+tmLen+'" onclick="timuEdit(this,'+title+','+type+','+options+','+status+','+categoryId+','+categoryName+')">编辑</button>'+
        '<button type="button" class="obtn btn btn-sm btn-outline-danger tmDeteleBtn" onclick="timuDetele(this)">删除</button>'+
        '</div>';
        html +='</div>';

        $("#timu_List").find(".timu_empty").hide();
        $("#timu_List").find(".timu_box"+tmLen+"").after(html);
        $("#timu_List").find(".timu_box"+tmLen+"").eq(0).remove();
        $('#e_qSubjectModal').modal('hide');



        /*$('#e_qSubjectModal').modal('hide');
        var timu_box = $("#timu_List").find(".timu_box"+tmLen+"");
        timu_box.attr("data-type",type);
        timu_box.find(".timu_title .sxtitle").text(title);

        timu_box.find(".timu_dry").html("");
        if(type != "3"){
            timu_box.find(".timu_dry").remove();
            timuxx_len = 1;
            var html = '';
            html +='<div class="timu_dry">';
            for(var i=0;i<options.length;i++){
                html +='<span class="timu_items">';
                if(type == "1"){
                    html += '<span class="radio_type"></span>';
                }else if(type == "2"){
                    html += '<span class="checkbox_type"></span>';
                }
                html += '<label>'+parseInt(timuxx_len++)+'、<span class="opname">'+options[i].name+'</span></label></span>';
            }
            html +='</div>';

            timu_box.children("div:eq(0)").after(html);
        }else{
          timu_box.find(".timu_dry").remove();
        }*/
       
     



    });

    /***********************编辑题库题目部分 e***************************/



    //获取右边题库列表
    loadingRightqS();

});

//加载问卷分类表格数据
function loadingqnairClassify() {
    $.initBootstrapTable("#selectqnairClassify-table", {
        method: 'post',
        url: domainUrl + 'admin/qnCategory/list.do?token=' + token,
        // height: 'auto',
        toolbar: '',
        // singleSelect:true,
        pageSize: 5,
        columns: [
        // {
        //     checkbox: true
        // },
        {
            field: 'id',
            title: '问卷分类ID',
            visible: false
        },
        {
            field: 'priority',
            title: '显示顺序',
            visible: false
        },
        {
            field: 'name',
            title: '分类名称'
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

    });
}


//获取题库列表表格数据
function loadingRightqS() {
    var cked_Array = [];
    var $table = $("#selectqS-table");

    
    
    
    $("#selectqS-table").bootstrapTable('destroy');
    $.initBootstrapTable("#selectqS-table", {
        method: 'post',
        url: domainUrl + 'admin/qb/list.do?token=' + token,
        toolbar: '',
        pageSize: 3,
        queryParams: rigqSqueryParams,
        columns: [{
            field: '',
            checkbox: true,
        },
        {
            field: 'id',
            title: '题目ID',
            visible: false
        },
        {
            field: 'title',
            title: '标题'
        },
        {
            field: 'cName',
            title: '分类'
        },
        ],

        onPostBody:function(){
            $table = $("#selectqS-table");
            var count=0;//定义一个计数变量
            var timu_box = $("#timu_List").find(".timu_box");
            var cklen = $table.find("td input:checkbox").length;
            timu_box.each(function(index, el) {
                var id = $(this).attr("data-id");
                $table.find("td input:checkbox[value='"+id+"']").prop("checked",true);
                var ckedlen = $table.find("td input:checkbox:checked").length;
                if(cklen == ckedlen){
                    $table.find("td input:checkbox[value='"+id+"']").parents("#selectqS-table").find("th input:checkbox").prop("checked",true);
                }
            });
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
             if(idar.length > result.length || idar.length == result.length){
                ids = arraysDiff(idar,result);
             }else{
                var zfarr = findMost(result);
                idar.push(zfarr.toString());
                ids = delArrElem(idar,zfarr.toString());
                var qbid = [];
                $("#timu_List").find(".timu_box").each(function(index, el) {
                  qbid.push($(this).attr("data-qbid").toString());
                });
                console.log(qbid);
                var someArr = refrain(ids.concat(qbid));
                console.log(someArr);
                ids = delArrElem(ids,someArr.toString());
             }
             console.log(ids);
          }

          if(cked_Array.length < rows.length){
             ids = arraysDiff(id_arry,ckid_arry);
          }


          console.log(arraysDiff(id_arry,ckid_arry));


          ids = arraysDiff(ids,ckid_arry); //添加接口这个过滤很重要
          var _id = [];
          $("#timu_List").find(".timu_box").each(function(index, el) {
            _id.push($(this).attr("data-id").toString());
          });
          var someArr = refrain(ids.concat(_id));
          ids = delArrElem(ids,someArr.toString());
          console.log(ids);
          for(var i=ids.length-1;i>=0;i--){
              var id = ids[i];
              cked_Array.push(id);
              //数组去重
              cked_Array = unique(cked_Array);
              $.ajax({
                  url: domainUrl + 'admin/qb/get.do',
                  type: "POST",
                  dataType: "json",
                  data: {
                      token: token,
                      id:id
                  },
                  success: function(data) {
                      if (data.code == 200) {
                          addLefttimu_list(data);
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
          }
        },

        /*onUncheckAll:function(rows){ //取消全选
            console.log(rows);
            if(rows.length != 0){
               for(var i=0;i<rows.length;i++){
                   var id = rows[i].id;
                   cked_Array.splice($.inArray(id, cked_Array), 1);
                   $("#timu_List").find(".timu_box[data-id='"+id+"']").remove();
                   $("#timu_List").find(".sxnum").each(function(index, el) {
                      $(this).html(parseInt(index+1));
                   });
               } 
            }else{
               $("#selectqS-table td").find("input:checkbox").each(function(index, el) {
                   id = $(this).val();
                   cked_Array.splice($.inArray(id, cked_Array), 1);
                   $("#timu_List").find(".timu_box[data-id='"+id+"']").remove();
                   $("#timu_List").find(".sxnum").each(function(index, el) {
                      $(this).html(parseInt(index+1));
                   });
               });
            }
        },*/

        onCheck:function(row, $element){ //选中
            var id = row.id;
            cked_Array.push(id.toString());
            //数组去重
            cked_Array = unique(cked_Array); 
            $.ajax({
                url: domainUrl + 'admin/qb/get.do',
                type: "POST",
                dataType: "json",
                data: {
                    token: token,
                    id:id
                },
                success: function(data) {
                    if (data.code == 200) {
                        addLefttimu_list(data);
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


        onUncheck:function(row, $element){ //取消选中
            var id = row.id;
            cked_Array.splice($.inArray(id, cked_Array), 1);
            $("#timu_List").find(".timu_box[data-id='"+id+"']").remove();
            $("#timu_List").find(".sxnum").each(function(index, el) {
                $(this).html(parseInt(index+1));
            });
            $("#timu_List").find(".ismust").each(function(index, el) {
                $(this).attr("for","msck_"+parseInt(index+1));
                $(this).find(".msck").attr("id","msck_"+parseInt(index+1));
            });
            $("#timu_List").find(".timu_box").each(function(index, el){
                $(this).attr("class","timu_box timu_box"+parseInt(index+1)+"");
                $(this).find(".tmEditBtn").attr("data-listlen",""+parseInt(index+1)+"");
            });
            var timu_listlen = $("#timu_List").find(".timu_box").length;
            if(timu_listlen == 0){
                $("#timu_List").find(".timu_empty").show();
            }
            //数组去重
            cked_Array = unique(cked_Array);
        },

    });
    $("#selectqS-table").on('uncheck-all.bs.table',function(e,rows){ //取消全选
        var $table = $(e.currentTarget);
        if(rows.length != 0){
           for(var i=0;i<rows.length;i++){
               var id = rows[i].id;
               cked_Array.splice($.inArray(id, cked_Array), 1);
               $("#timu_List").find(".timu_box[data-id='"+id+"']").remove();
               $("#timu_List").find(".sxnum").each(function(index, el) {
                  $(this).html(parseInt(index+1));
               });
               $("#timu_List").find(".ismust").each(function(index, el) {
                  $(this).attr("for","msck_"+parseInt(index+1));
                  $(this).find(".msck").attr("id","msck_"+parseInt(index+1));
               });
               $("#timu_List").find(".timu_box").each(function(index, el){
                  $(this).attr("class","timu_box timu_box"+parseInt(index+1)+"");
                  $(this).find(".tmEditBtn").attr("data-listlen",""+parseInt(index+1)+"");
               });
               var timu_listlen = $("#timu_List").find(".timu_box").length;
               if(timu_listlen == 0){
                  $("#timu_List").find(".timu_empty").show();
               }
           } 
        }else{
           $table.find("td input:checkbox").each(function(index, el) {
               id = $(this).val();
               console.log("id:"+id);
               cked_Array.splice($.inArray(id, cked_Array), 1);
               $("#timu_List").find(".timu_box[data-id='"+id+"']").remove();
               $("#timu_List").find(".sxnum").each(function(index, el) {
                  $(this).html(parseInt(index+1));
               });
               $("#timu_List").find(".ismust").each(function(index, el) {
                  $(this).attr("for","msck_"+parseInt(index+1));
                  $(this).find(".msck").attr("id","msck_"+parseInt(index+1));
               });
               $("#timu_List").find(".timu_box").each(function(index, el){
                  $(this).attr("class","timu_box timu_box"+parseInt(index+1)+"");
                  $(this).find(".tmEditBtn").attr("data-listlen",""+parseInt(index+1)+"");
               });
               var timu_listlen = $("#timu_List").find(".timu_box").length;
               if(timu_listlen == 0){
                  $("#timu_List").find(".timu_empty").show();
               }
           });
        }

        var timu_listlen = $("#timu_List").find(".timu_box").length;
        if(timu_listlen == 0){
            $("#timu_List").find(".timu_empty").show();
        }

        //数组去重
        cked_Array = unique(cked_Array);
    });
}



function rigqSqueryParams(params){
    querys.page = (params.offset/params.limit) + 1;
    querys.count = params.limit;
    return querys;
}




//从已有题库中添加题目
function addLefttimu_list(data){
        var timuxx_len = 1;
        var id = data.data.id;
        var categoryId = data.data.categoryId;
        var title = data.data.title;
        var type = data.data.type;
        var timu_listlen = $("#timu_List").find(".timu_box").length;
        var html = '';
        html +='<div class="timu_box timu_box'+parseInt(timu_listlen+1)+'" data-id="'+id+'" data-type="'+type+'"><div class="timu_title">';
        if(type != "3"){
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必选<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" />)</label>';
        }else{
            html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必填<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" />)</label>';
        }
        
        html +='<span class="sxnum">'+parseInt(timu_listlen+1)+'</span>.<span class="sxtitle">'+title+'</span></div>';
        
        if(type != "3"){
            html +='<div class="timu_dry">';
            for(var i=0;i<data.data.options.length;i++){
                html +='<span class="timu_items">';
                if(type == "1"){
                    html += '<span class="radio_type"></span>';
                }else if(type == "2"){
                    html += '<span class="checkbox_type"></span>';
                }
                html += '<label>'+parseInt(timuxx_len++)+'、<span class="opname">'+data.data.options[i].name+'</span></label></span>';
            }
            html +='</div>';
        }
        

        html +='</div>';
        $("#timu_List").find(".timu_empty").hide();
        $("#timu_List").append(html);
}





//加载题库分类表格数据
function loadingqClassify(){
  $.initBootstrapTable("#selectqClassify-table", {
         method: 'post',
         url: domainUrl + 'admin/qbCategory/list.do?token='+token,
         // height:'auto',
         toolbar: '',
         // singleSelect:true,
         pageSize: 5, 
         columns: [
              // {
              //     checkbox: true
              // },
              {
                  field: 'id',
                  title: '分类ID',
                  visible:false,
              },
              {
                  field: 'name',
                  title: '分类名称'
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
                  title: '显示顺序',
              },
         ],

   });
}

function plusWay(e) { //添加
    console.log($("#select_Box .card-body").find(".coningroup").length);
    if($("#select_Box .card-body").find(".coningroup").length >= 4){
      art.dialog({
          title:"提示",
          content:"最多只能添加4个选项！",
          cancel:false,
          fixed: true,
          lock: true,
          width: 200,
          ok: function () {},
      });
      return;
    }
    ix++;
    var chm = '<div class="input-group mb-3 coningroup" data-ix="' + ix + '">' + '<input type="text" class="form-control input-sm col-6 xxtext" placeholder="选项' + ix + '">' + '<div class="input-group-prepend mx-sm-3"><span class="input-group-text plus" onclick="plusWay(this)">+</span></div>' + '<div class="input-group-prepend" hidden="hidden">' + '<span class="input-group-text minus" onclick="minusWay(this)">-</span></div>' + '</div>';
    $(e).parents(".card-body").append(chm);
    $("#select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
    $("#select_Box .card-body").find(".coningroup:last").siblings('.coningroup').find(".minus").parent(".input-group-prepend").attr("hidden", "hidden");
}
function minusWay(e) { //减少
    $(e).parents(".coningroup").remove();
    ix--;
    $("#select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
}



//加载题库分类表格数据
function e_loadingqClassify(){
  $.initBootstrapTable("#e_selectqClassify-table", {
         method: 'post',
         url: domainUrl + 'admin/qbCategory/list.do?token='+token,
         // height:'auto',
         toolbar: '',
         pageSize: 5, 
         columns: [
              {
                  field: 'id',
                  title: '分类ID',
                  visible:false,
              },
              {
                  field: 'name',
                  title: '分类名称'
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
                  title: '显示顺序',
              },
         ],

   });
}

function e_plusWay(e){ //添加
  console.log($("#e_select_Box .card-body").find(".coningroup").length);
  if($("#e_select_Box .card-body").find(".coningroup").length >= 4){
    art.dialog({
        title:"提示",
        content:"最多只能添加4个选项！",
        cancel:false,
        fixed: true,
        lock: true,
        width: 200,
        ok: function () {},
    });
    return;
  }
  e_ix++;
  var chm = '<div class="input-group mb-3 coningroup" data-ix="'+e_ix+'">'+
                '<input type="text" class="form-control input-sm col-6 xxtext" placeholder="选项'+e_ix+'">'+
                '<div class="input-group-prepend mx-sm-3"><span class="input-group-text plus" onclick="e_plusWay(this)">+</span></div>'+
                '<div class="input-group-prepend" hidden="hidden">'+
                '<span class="input-group-text minus" onclick="e_minusWay(this)">-</span></div>'+
            '</div>';
  $(e).parents(".card-body").append(chm);
  $("#e_select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
  $("#e_select_Box .card-body").find(".coningroup:last").siblings('.coningroup').find(".minus").parent(".input-group-prepend").attr("hidden","hidden");
}


function e_minusWay(e){ //减少
  $(e).parents(".coningroup").remove();
  e_ix--;
  if(e_ix < "0"){
      $("#e_select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").attr("hidden","hidden");
  }else{
      $("#e_select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
  }
}






//左边题目列表编辑
function timuEdit(e,title,type,options,status,categoryId,categoryName){
    options =  JSON.stringify(options).replace(/\'/g,'"');
    title = JSON.stringify(title).replace(/\"/g,"");
    categoryName = JSON.stringify(categoryName).replace(/\"/g,"");
    options = JSON.parse(options);
    var tmLen = $(e).attr('data-listlen');
    
    $("#e_title").attr("value",title);
    $("#e_type").val(type);
    $("#e_tmLen").attr("value",tmLen);
    $("#e_tmLen").val(tmLen);


    var ckNum = 2;
    if($(e).parents(".timu_box").find(".msck").is(':checked')){
        ckNum = 1;
    }else{
        ckNum = 2;
    }
    $("#e_ckNum").val("value",ckNum);
    $("#e_ckNum").val(ckNum);

    if(type == "1"){
        $("#e_select_Box").find(".card-header").text("单选选项列表");
    }else if(type == "2"){
        $("#e_select_Box").find(".card-header").text("多选选项列表");
    }
    var html = "";
    for(var i=0; i<options.length;i++){
      html += '<div class="input-group mb-3 coningroup" data-ix="'+parseInt(i+1)+'"><input type="text" class="form-control input-sm col-6 xxtext" placeholder="选项'+parseInt(i+1)+'" value="'+options[i].name+'"><div class="input-group-prepend mx-sm-3"><span class="input-group-text plus" onclick="e_plusWay(this)">+</span></div><div class="input-group-prepend" hidden="hidden"><span class="input-group-text minus" onclick="e_minusWay(this)">-</span></div></div>';
    }
    $("#e_select_Box").find(".card-body").html(html);
    var xtlen = $("#e_select_Box").find(".card-body").find(".coningroup").length;
    if(xtlen != 1){
        $("#e_select_Box .card-body").find(".coningroup:last").find(".minus").parent(".input-group-prepend").removeAttr("hidden");
        $("#e_select_Box .card-body").find(".coningroup:last").siblings('.coningroup').find(".minus").parent(".input-group-prepend").attr("hidden","hidden");
    }

    $("#e_status").val(status);
    $("#e_categoryId").attr("value",categoryId);
    $("#e_categoryId").val(categoryId);
    $("#e_categoryName").attr("value",categoryName);
    $("#e_categoryName").val(categoryName);
    $("#e_qSubjectModal").modal('show');
}




//左边题目列表删除
function timuDetele(e){
    $(e).parents(".timu_box").remove();
    $("#timu_List").find(".sxnum").each(function(index, el) {
        $(this).html(parseInt(index+1));
    });
    $("#timu_List").find(".ismust").each(function(index, el) {
        $(this).attr("for","msck_"+parseInt(index+1));
        $(this).find(".msck").attr("id","msck_"+parseInt(index+1));
    });
    $("#timu_List").find(".timu_box").each(function(index, el){
        $(this).attr("class","timu_box timu_box"+parseInt(index+1)+"");
        $(this).find(".tmEditBtn").attr("data-listlen",""+parseInt(index+1)+"");
    });
    var timu_listlen = $("#timu_List").find(".timu_box").length;
    if(timu_listlen == 0){
        $("#timu_List").find(".timu_empty").show();
    }
}

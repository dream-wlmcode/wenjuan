var querys = {}; //添加问卷参数对象
$(function(){
    /***************************************获取问卷信息 s************************************/
    var id = $("#detailsModal #e_details_id",window.parent.document).val();
    $.ajax({
        url: domainUrl + 'admin/qn/get.do',
        type: "POST",
        dataType: "json",
        data: {
            token: token,
            id: id,
        },
        success: function(data) {
            if (data.code == 200) {
                var name = data.data.name;
                var categoryId = data.data.categoryId;
                var status = data.data.status;
                var beginDate = data.data.beginDate;
                var endDate = data.data.endDate;
                var expectQuizTime = data.data.expectQuizTime;
                var description = data.data.description;

                console.log("expectQuizTime:"+expectQuizTime);
                console.log("description:"+description);

                $("#editqSnaire_name").attr("value",name);
                $.ajax({ //获取问卷分类名称
                  url: domainUrl + 'admin/qnCategory/get.do',
                  type: "POST",
                  dataType: "json",
                  data: {
                      token: token,
                      id: categoryId,
                  },
                  success: function(data) {
                    if (data.code == 200) {
                      $("#editqSnaire_categoryName").attr("value",data.data.name);
                    }
                  },
                  error:function(error) {
                      alert(error);
                      setTimeout(function() {
                          window.location.href = "/login.html";
                      },
                      1500);
                  },
                }); 
                $("#editqSnaire_categoryId").attr("value",categoryId);
                $("#editqSnaire_status").find("option[value='"+status+"']").attr("selected",true);
                $("#editqSnaire_beginDate1").find('input').attr("value",beginDate);
                $("#editqSnaire_endDate1").find('input').attr("value",beginDate);
                $("#editqSnaire_expectQuizTime").attr("value",expectQuizTime);
                $("#editqSnaire_description").attr("value",description);
                $("#editqSnaire_description").val(description);


                if(data.data.questions.length > 0){
                    $("#timu_List").find(".timu_empty").hide();
                    for(var i=0;i<data.data.questions.length;i++){
                          var timuxx_len = 1;
                          var id = data.data.questions[i].id;
                          var required = data.data.questions[i].required;
                          var qbId = data.data.questions[i].qbId;
                          var title = data.data.questions[i].title;
                          var type = data.data.questions[i].type;
                          var timu_listlen = $("#timu_List").find(".timu_box").length;



                          var html = '';
                          html +='<div class="timu_box timu_box'+parseInt(timu_listlen+1)+'" data-id="'+id+'" data-type="'+type+'" data-qbId="'+qbId+'"><div class="timu_title">';
                          var cked = "";
                          if(required == "1"){
                              cked = "checked";
                          }else if(required == "2"){
                              cked = "";
                          }
                          if(type != "3"){
                              html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必选<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" '+cked+' disabled />)</label>';
                          }else{
                              html +='<label onselectstart="return false;" class="ismust" for="msck_'+parseInt(timu_listlen+1)+'">(是否必填<input type="checkbox" class="msck" id="msck_'+parseInt(timu_listlen+1)+'" '+cked+'  disabled />)</label>';
                          }
                          
                          html +='<span class="sxnum">'+parseInt(timu_listlen+1)+'</span>.<span class="sxtitle">'+title+'</span></div>';
                          

                          if(type != "3"){
                              html +='<div class="timu_dry">';
                              for(var j=0;j<data.data.questions[i].options.length;j++){
                                  html +='<span class="timu_items">';
                                  if(type == "1"){
                                      html += '<span class="radio_type"></span>';
                                  }else if(type == "2"){
                                      html += '<span class="checkbox_type"></span>';
                                  }
                                  html += '<label>'+parseInt(timuxx_len++)+'、<span class="opname">'+data.data.questions[i].options[j].name+'</span></label></span>';
                              }
                              html +='</div>';
                          }


                         
                          html +='</div>';
                          $("#timu_List").append(html);
                    }
                }else{
                    $("#timu_List").find(".timu_empty").show();
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
    /***************************************获取问卷信息 e************************************/




    //获取右边题库列表
    loadingRightqS();
});





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
            formatter: function (value, row, index) {
                return {
                  disabled : true,
                }
            },
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
            var $table = $("#selectqS-table");
            var count=0;//定义一个计数变量
            var timu_box = $("#timu_List").find(".timu_box");
            var cklen = $table.find("td input:checkbox").length;
            timu_box.each(function(index, el) {
                var qbid = $(this).attr("data-qbid");
                if(qbid != "undefined"){
                    $table.find("td input:checkbox[value='"+qbid+"']").prop("checked",true);
                    cked_Array.push(qbid);
                    var ckedlen = $table.find("td input:checkbox:checked").length;
                    if(cklen == ckedlen){
                        $table.find("td input:checkbox[value='"+qbid+"']").parents("#selectqS-table").find("th input:checkbox").prop("checked",true);
                    }
                }
            });
        },

    });

    var $checkAll = $("#selectqS-table").find("#btSelectAll-0");  
    $checkAll.attr("disabled","disabled");
}



function rigqSqueryParams(params){
    querys.page = (params.offset/params.limit) + 1;
    querys.count = params.limit;
    return querys;
}

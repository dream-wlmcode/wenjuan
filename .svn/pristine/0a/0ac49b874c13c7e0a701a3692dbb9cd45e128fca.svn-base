var arr_authList = "";
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
                // console.log(arr_authList);

                if(arr_authList.indexOf('/admin/qn/list.do') != -1){
                    /****************************加载问卷列表表格数据 s****************************/
                    loadingqn();
                    //下拉题库分类列表
                    $("#get_qnName").click(function(event) {
                        event.stopPropagation();
                        if($("#getqn-selectCot").is(":hidden")){
                          $("#getqn-selectCot").show();
                          $("#getqn-selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
                        }else{
                          $("#getqn-selectCot").hide();
                          $("#getqn-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
                        }
                    });
                    $("#get_qnName").siblings('.downtb').click(function(event) {
                        event.stopPropagation();
                        if($("#getqn-selectCot").is(":hidden")){
                          $("#getqn-selectCot").show();
                          $("#getqn-selectCot").animate({marginTop:"5px",opacity:"1"},"fast");
                        }else{
                          $("#getqn-selectCot").hide();
                          $("#getqn-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
                        }
                    });
                    $('#selectqn-table').on('click-row.bs.table', function (e, row, element){
                      var qnId = row.id;
                      var beginDate = row.beginDate;
                      var endDate = row.endDate;
                      $("#get_qnId").attr("value",row.id);
                      $("#get_qnId").val(row.id);
                      $("#get_qnName").attr("value",row.name);
                      $("#get_qnName").val(row.name);
                      $("#getqn-selectCot").hide();
                      $("#getqn-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");

                      /****加载主页数据 s****/
                      LoadIndexData(qnId);
                      /****加载主页数据 e****/

                    });
                    $(document).click(function(e) {
                        e.stopPropagation();
                        if($("#getqn-selectCot").css("display") === "block"){
                          $("#getqn-selectCot").hide();
                          $("#getqn-selectCot").animate({marginTop:"50px",opacity:"0"},"fast");
                        }
                    });
                    $("#getqn-selectCot").click(function(e) {
                        e.stopPropagation();
                    });
                    /****************************加载问卷列表表格数据 e****************************/

                   
                    
                }

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
            setTimeout(function () {
               window.location.href = "/login.html";
           }, 1500);
        }
    });





});



//加载问卷列表表格数据
function loadingqn(){
  $.initBootstrapTable("#selectqn-table", {
         method: 'post',
         url: domainUrl + 'admin/qn/list.do?token='+token,
         height:'auto',
         toolbar: '',
         // singleSelect:true,
         pageSize: 5, 
         columns: [
              // {
              //     checkbox: true
              // },
              {
                  field: 'id',
                  title: '问卷ID',
                  visible: false
              },
              {
                  field: 'name',
                  title: '问卷名称'
              }, 
              {
                  field: 'beginDate',
                  title: '开始时间'
              }, 
              {
                  field: 'endDate',
                  title: '结束时间'
              },
         ],
         onLoadSuccess:function(data){
            $("#get_qnId").attr("value",data.rows[0].id);
            $("#get_qnName").attr("value",data.rows[0].name);


            /****默认加载主页数据 s****/
            LoadIndexData(data.rows[0].id);
            /****默认加载主页数据 e****/
         },

   });
}







//默认加载主页数据
function LoadIndexData(id){
    $.ajax({
        url: domainUrl + 'admin/getUserInfo.do',
        type: "POST",
        dataType: "json",
        data: {token: token},
        success:function (data) {
            if (data.code == 200) {
                var authList = data.data.authList;
                arr_authList = authList.split(",");
                if(arr_authList.indexOf('/admin/tj/qnSimple.do') != -1){
                    $.ajax({
                        url: domainUrl + 'admin/tj/qnSimple.do',
                        type: "POST",
                        dataType: "json",
                        data: {token: token,id:id},
                        success:function (data) {
                            if (data.code == 200) {
                                // Statistics_list
                                var totalNum = data.data.totalNum;
                                var avgQuizTime = data.data.avgQuizTime;

                                console.log(totalNum);
                                console.log(avgQuizTime);

                                var html = '';
                                html += '<div class="col-md-3">'+
                                            '<div class="card p-4">'+
                                                '<div class="card-body d-flex justify-content-between align-items-center">'+
                                                    '<div>'+
                                                        '<span class="h4 d-block font-weight-normal mb-2">'+totalNum+'&nbsp;人</span>'+
                                                        '<span class="font-weight-light">参与人次</span>'+
                                                    '</div>'+
                                                    '<div class="h2 text-muted">'+
                                                        '<i class="icon icon-people"></i>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';


                                html += '<div class="col-md-3">'+
                                            '<div class="card p-4">'+
                                                '<div class="card-body d-flex justify-content-between align-items-center">'+
                                                    '<div>'+
                                                        '<span class="h4 d-block font-weight-normal mb-2">'+avgQuizTime+'&nbsp;分钟</span>'+
                                                        '<span class="font-weight-light">平均答题时间</span>'+
                                                    '</div>'+
                                                    '<div class="h2 text-muted">'+
                                                        '<i class="icon icon-clock"></i>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';  
                                        
                                   $("#Statistics_list").html("");
                                   $("#Statistics_empty").addClass('hide');
                                   $("#Statistics_list").append(html);


                                /*最近7天区域分布柱状图 s*/
                                areaBarCharts(data.data.area);
                                /*最近7天区域分布柱状图 e*/
                            


                                /*最近7天来源分布饼状图 s*/
                                sourcePieChart(data.data.source);
                                /*最近7天来源分布饼状图 e*/
                                
                            }else if(data.code == 201){
                                art.dialog({
                                    content: data.msg,
                                    cancel: false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function() {},
                                });
                                $("#Statistics_list").html("");
                                $("#Statistics_empty").removeClass('hide');
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
            setTimeout(function () {
               window.location.href = "/login.html";
           }, 1500);
        }
    });

}


/*最近7天区域分布柱状图 s*/
function areaBarCharts(area){
    var labels = [];
    var data = [];
    for(var i=0;i<area.length;i++){
        var province = area[i].province;
        var num = area[i].num;
        labels.push(province);
        data.push(num);
    }


    console.log(labels);
    console.log("data:"+data);



    /**
     * Bar Chart
    */
    var barChart = $('#area-bar-chart');

    if (barChart.length > 0) {
        new Chart(barChart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '人数',
                    data: data,
                    backgroundColor: [
                        'rgba(244, 88, 70, 0.5)',
                        'rgba(33, 150, 243, 0.5)',
                        'rgba(0, 188, 212, 0.5)',
                        'rgba(42, 185, 127, 0.5)',
                        'rgba(156, 39, 176, 0.5)',
                        'rgba(253, 178, 68, 0.5)'
                    ],
                    borderColor: [
                        '#F45846',
                        '#2196F3',
                        '#00BCD4',
                        '#2ab97f',
                        '#9C27B0',
                        '#fdb244'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive:true,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function(label, index, labels) {
                                 // when the floored value is the same as the value we have a whole number
                                 if (Math.floor(label) === label) {
                                     return label;
                                 }

                            },
                        }
                    }]
                }
            }
        });
    }
    

}
/*最近7天区域分布柱状图 e*/



/*最近7天来源分布饼状图 s*/
function sourcePieChart(source){
    var labels = [];
    var data = [];
    for(var i=0;i<source.length;i++){
        var source_v = source[i].source;
        var num = source[i].num;
        labels.push(source_v);
        data.push(num);
    }

    /**
     * Pie Chart
     */
    var pieChart = $('#source-pie-chart');

    if (pieChart.length > 0) {
        new Chart(pieChart, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Users',
                    data: data,
                    backgroundColor: [
                        'rgba(244, 88, 70, 0.5)',
                        'rgba(33, 150, 243, 0.5)',
                        'rgba(0, 188, 212, 0.5)',
                        'rgba(42, 185, 127, 0.5)',
                        'rgba(156, 39, 176, 0.5)',
                        'rgba(253, 178, 68, 0.5)'
                    ],
                    borderColor: [
                        'rgba(244, 88, 70, 0.5)',
                        'rgba(33, 150, 243, 0.5)',
                        'rgba(0, 188, 212, 0.5)',
                        'rgba(42, 185, 127, 0.5)',
                        'rgba(156, 39, 176, 0.5)',
                        'rgba(253, 178, 68, 0.5)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
}
/*最近7天来源分布饼状图 e*/
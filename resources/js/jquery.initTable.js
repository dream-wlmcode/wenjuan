/**
 * 通用方法封装
 * <i>bootstrap-table插件拓展</i>
 * @author wlm
 */
(function ($) {
 
    /**
     *
     * @param selector jQuery选择器
     * @param options
     */
    $.initBootstrapTable = function (selector, options) {
        var defaults = {
            method: "get",
            dataType: "json",             // 返回格式（*）
            striped: true,                //是否显示行间隔色
            cache: false,                 //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            columns : [],
            detailView : false,           // 显示详情模式
            pagination: true,             // 是否显示分页（*）
            pageSize: 10,                  // 每页的记录行数（*）
            pageNumber: 1,                // 初始化加载第一页，默认第一页
            paginationLoop:false,
            pageList: [10, 25, 50],       // 可供选择的每页的行数（*）
            search: false,                 // 是否显示搜索框功能
            strictSearch: true,
            singleSelect: false,          // 是否禁止多选
            iconSize: 'outline',          // 图标大小：undefined默认的按钮尺寸 xs超小按钮sm小按钮lg大按钮
            toolbar: '#toolbar',          // 指定工作栏
            // "queryParamsType": "limit",
            sortable: false,              //是否启用排序
            sortOrder: "asc",             //排序方式
            queryParams: queryParams,     //传递参数（*）
            contentType : "application/x-www-form-urlencoded",
            sidePagination: "server",     // 启用服务端分页
            showRefresh: false,           // 是否显示刷新按钮
            minimumCountColumns: 2,       //最少允许的列数
            clickToSelect: false,          //是否启用点击选中行
            // height: 500,                  //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",               //每一行的唯一标识，一般为主键列
            showColumns: false,           // 是否显示隐藏某列下拉框
            showToggle: false,            // 是否显示详细视图和列表视图的切换按钮
            cache: false,                 // 是否使用缓存
            showFooter: false,            // 是否显示列脚
            showRefresh: false,           // 是否显示刷新按钮
            cardView: false,              //是否显示详细视图
            detailView: false,            //是否显示父子表
            responseHandler: function (res) {
                 // 加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
                return{
                    "rows": res.data,
                    "total": res.total
                };
            }
        };
        function queryParams(params){
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                page: (params.offset/params.limit) + 1,  //页码
                count:params.limit, //单次查询条数
            };
            return temp;
        };
        defaults = $.extend(true, defaults, options);
        defaults.onPostBody = function () {
            //改变复选框样式
            $(selector).find("input:checkbox").each(function (i) {
                var $check = $(this);
                if ($check.attr("id") && $check.next("span")) {
                    return;
                }
                var name = $check.attr("name");
                var id = name + "-" + i;
                $check.addClass('styled');
                $check.next("span").attr('for',id);
                $check.attr("id", id).parent().addClass("checkbox-custom");
            });
            if ($.isFunction(options.onPostBody)) {
                options.onPostBody();
            }
        };
        $(selector).bootstrapTable(defaults);
    }
 
})(jQuery);
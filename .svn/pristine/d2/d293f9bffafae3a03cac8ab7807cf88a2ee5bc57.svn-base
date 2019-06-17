$(function(){
    //获取cookie
    getCookie();
    $("#sign_inB").click(function(event) {
        loginInit();
    });


    //键盘enter事件
    $(document).keypress(function(e) {  
        // 回车键事件  
       if(e.which == 13) {  
           loginInit(); 
       }  
    }); 


});



function loginInit(){
    var account = $("#account").val();
    // var password = $("#password").val();
    var password = $('input.password[type=password]').val();
    if($.trim(account).length == 0){
        art.dialog({
            content:"请输入用户名",
            cancel:false,
            fixed: true,
            lock: true,
            width: 200,
            ok:function(){}
        });
        return;
    }
    if($.trim(password).length == 0){
        art.dialog({
            content:"请输入密码",
            cancel:false,
            fixed: true,
            lock: true,
            width: 200,
            ok:function(){}
        });
        return;
    }
    $.ajax({
        url: domainUrl + 'admin/login.do',
        type: "POST",
        dataType: "json",
        data: {account: account, password:hex_md5(password)},
        success:function (data) {
            if (data.code == 200) {
                // alert(data.msg);
                art.dialog({
                    content:data.msg,
                    cancel:false,
                    fixed: true,
                    lock: true,
                    dblclick_hide:false,
                    width: 200,
                    ok:function(){
                        window.location.href = "/index.html";
                    }
                });
                var token = data.token;
                var inFifteenMinutes = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
                $.cookie('token', '', { expires: -1 });
                $.cookie('token', token, { expires: inFifteenMinutes});
                setCookie();
            }else{
                art.dialog({
                    content:data.msg,
                    cancel:false,
                    fixed: true,
                    lock: true,
                    width: 200,
                    ok:function(){}
                });
            }
        },
        error: function(error) {
            alert(error);
        }
    });
}



function setCookie(){ //设置cookie
    var account = $("#account").val();
    // var password = $("#password").val();
    var password = $('input.password[type=password]').val();
    if($("#login_ck").is(":checked")){
        var inFifteenMinutes = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        $.cookie('account', account, { expires: inFifteenMinutes});
        $.cookie('password', password, { expires: inFifteenMinutes});
    }else{
        $.cookie('account', null);
        $.cookie('password', null);
        $("#account").val("");
        // $("#password").val("");
        $('input.password[type=password]').val("");
    }
}



function getCookie(){ //获取cookie
    var account = $.cookie('account');
    var password = $.cookie('password');
    console.log("account:"+account);
    console.log("password:"+password);
    if(account != "null"){
        $("#account").val(account);
    }
    
    if(password != "null"){
        $("#login_ck").attr("checked","true");
        // $("#password").val(password);
        $('input.password[type=password]').attr("value",password);
    }

    $("#login_ck").attr('checked',true); //复选框一直被选中
}
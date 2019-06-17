$(function(){
    /*  $("#get_authCode").click(function(event) {
        $("#getauthCodeModal").modal("show");
        $("#getauthCode_name").val("");
        $("#getauthCode_mobile").val("");
    });


    $("#getauthCodeModal_save").click(function(event) {
        var getauthCode_name = $("#getauthCode_name").val();
        var getauthCode_mobile = $("#getauthCode_mobile").val();
        if($.trim(getauthCode_name).length == 0){
            art.dialog({
                content:"名称不能为空！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }


        if($.trim(getauthCode_mobile).length == 0){
            art.dialog({
                content:"手机号码不能为空！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }


        if(!(/^1(3|4|5|7|8)\d{9}$/.test(getauthCode_mobile))){ 
            art.dialog({
                content:"手机号码有误，请重填！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return; 
        } 


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
                if(arr_authList.indexOf('/admin/useradmin/authCode.do') != -1){
                    $.ajax({
                        url: domainUrl + 'admin/useradmin/authCode.do',
                        type: "POST",
                        dataType: "json",
                        data: {token:token,name: getauthCode_name,mobile:getauthCode_mobile},
                        success:function (data) {
                            if (data.code == 200) {
                                art.dialog({
                                    content:data.msg,
                                    cancel:false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function () {},
                                });
                                $("#authCode").attr("value",data.authCode);
                                $("#authCode").val(data.authCode);
                                $("#getauthCodeModal").modal("hide");
                            }else if (data.code == 201){
                                art.dialog({
                                    content:data.msg,
                                    cancel:false,
                                    fixed: true,
                                    lock: true,
                                    width: 200,
                                    ok: function () {},
                                });
                            }
                        },
                        error: function(error) {
                            alert(error);
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
          }
        });

    });*/

    $("#register_id").click(function(event) {
        registerInit()
    });


    //键盘enter事件
    $(document).keypress(function(e) {  
        // 回车键事件  
       if(e.which == 13) {  
           registerInit(); 
       }  
    }); 
});


function registerInit(){
        var account = $("#account").val();
        // var password = $("#password").val();
        var password = $('input.password[type=password]').val();
        var authCode = $("#authCode").val();
        var reg = /^[a-zA-Z\d]+$/; //只能为数字和大小写字母
        if($.trim(account).length == 0){
            art.dialog({
                content:"请输入账号",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
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
                ok: function () {},
            });
            return;
        }

        if(!reg.test(password)){ 
            art.dialog({
                content:"密码有误，请重填！(只能为数字和大小写字母)",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return; 
        } 

        if($.trim(authCode).length == 0){
            art.dialog({
                content:"请输入授权码",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok: function () {},
            });
            return;
        }


        $.ajax({
            url: domainUrl + 'admin/register.do',
            type: "POST",
            dataType: "json",
            data: {account: account,password:hex_md5(password),authCode:authCode},
            success:function (data) {
                if (data.code == 200) {
                    art.dialog({
                        content:data.msg,
                        cancel:false,
                        fixed: true,
                        lock: true,
                        dblclick_hide:false,
                        width: 200,
                        ok: function () {
                            windows.location.href = "/login.html";
                        },
                    });
                }else if (data.code == 201){
                    art.dialog({
                        content:data.msg,
                        cancel:false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok: function () {},
                    });
                }
            },
            error: function(error) {
                alert(error);
            }
        });
}

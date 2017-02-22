$(document).ready(function(){
	var user = common.getCookie("user");
	var pwd = common.getCookie("pwd");
	if(user){
		$(".user").val(user);
	}
	if(pwd){
		$(".pwd").val(pwd);
	}
	$(".login").on("click",function(){
		var user = $(".user").val();
		var pwd = $(".pwd").val();
		if(!user && !pwd){
			alert("用户名和密码不能为空！");
			return;
		}
		if(!user && pwd){
			alert("用户名不能为空！");
			return;
		}
		if(user && !pwd){
			alert("密码不能为空！");
			return;
		}
		var param = {
			"username":user,
			"password":pwd,
			"appId":"welearning_wechat",
			"appSecret":"learn2strong"
		};
		common.ajaxPost("login/validateLogin",param,function(d){
			if(d.errorCode != 0){
				alert(d.errorMassage);
				return;
			}
			var t = 7; 
			var pwdt = $("#rememberPWD")[0].checked?7:undefined;
			common.setCookie("user",user,t);
			common.setCookie("pwd",pwd,pwdt);
			common.setCookie("realname",d.data.username,t);
			common.setCookie("memberId",d.data.memberId,t);
			common.setCookie("personId",d.data.personId,t);
			common.setCookie("certificate",d.data.certificate);
			common.setCookie("headPic",d.data.headPicPath,t);
			common.setCookie("sign",d.data.signature,t);
			window.location.href = "../mycourse/mycourse.html";
		});
	});
	$(document).keydown(function(e){
		if(e.keyCode == 13){
			$(".login").click();
		}
	});
});
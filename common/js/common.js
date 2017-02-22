$(function(){
	var certificate = common.getCookie("certificate");
	var winUrl = window.location.href;
	if(!certificate){
		if(winUrl.indexOf("/login.html")!=-1 || winUrl.indexOf("/forget.html") != -1){
			return;
		}else{
			window.location.href = "../index.html";
		}
	}

	var headPic = common.getCookie("headPic");
	var realname = common.getCookie("realname");
	var sign = common.getCookie("sign");
	if(headPic){
		headPic = common.resolveUrl(headPic);
	}else{
		headPic = "../common/head.jpg";
	}
	$(".yd-headPic").attr("src",headPic);

	if(realname){
		$(".yd-realname").html(realname);
	}
	if(sign){
		$(".yd-sign").html(common.cutStr(sign,14));
	}

	$(".yd-exit").on("click",function(){
		common.setCookie("certificate","");
		window.location.href = "../index.html";
	});


});
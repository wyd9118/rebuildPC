(function($){
	loadPersonCon();
	$(".yd-left-menu>li>a").on("click",function(e){
		loadPersonCon($(this));
		preventDefault(e);
	});
	
}(jQuery));

function loadPersonCon(obj){ 
	data_pcon = common.getCookie("data_pcon");
	if(obj){
		data_pcon = obj.attr("data-pcon");
		common.setCookie("data_pcon",data_pcon);
	}else if(data_pcon=="" && obj==null){
		$(".yd-left-menu>li>a").removeClass("a-focus");
		$("#personCon").html("<h2 style='font-size:20px; margin-top:200px; text-align:center; color:#bbb;'>你是非法进入！</h2>");
		return false;
	}
	
	$(".yd-left-menu>li>a").removeClass("a-focus");
	$(".yd-left-menu>li>a[data-pcon="+data_pcon+"]").addClass("a-focus");
	$("#personCon").empty();
	$("#personCon").load(data_pcon+".html");
	
}
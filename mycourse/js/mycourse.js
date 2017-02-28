
var path = "member/myPcCompulsory";
var $courseNum = $(".yd-left-menu .requireNum");
$(document).ready(function(){
	initCourse(path,$courseNum);
	common.ajaxPost("member/myPcElective",{"memberId":common.getCookie("memberId"),},
		function(d){
			$(".yd-left-menu .electNum").html(" "+d.data[0].totalSize);
		}
	);
	var pageType = common.getUrlParam("pageType"); 
	if(pageType!=null && pageType==="requireCourse"){  
		$(".yd-left-menu li").eq(0).click(clkback);
	}else if(pageType!=null && pageType==="electCourse"){ alert(pageType);
		$(".yd-left-menu li").eq(1).click(clkback);
	}

	// 点击左侧菜单的必修课程或选修课程
	$(".yd-left-menu li").on("click",clkback);

	$(".yd-status-menu li a").on("click",function(event){
		$("#courseStatus").text($(this).text());
		//alert(path);
		initCourse(path,null);
	});

	//根据关键字搜索相关课程
	$("#findBtn").on("click",function(){
		findKeyCourse(path);
	});
		

});


function clkback(obj,event){
	alert(44);

	if($(this).find("a").hasClass("a-focus")){
		return;
	}
	$("#mycourse-which").html($(this).find("a").text().split(" ")[0]);
	$(this).siblings().find("a").removeClass("a-focus");
	$(this).find("a").addClass("a-focus");
	
	if($(this).attr("yd-pageType")=="requireCourse"){
		path = "member/myPcCompulsory";
		$courseNum = $(".yd-left-menu .requireNum");
	}else{
		path = "member/myPcElective";
		$courseNum = $(".yd-left-menu .electNum");
	}
	initCourse(path,$courseNum);
	//preventDefault(event);
}





var path = "member/myPcCompulsory";
var $courseNum = $(".yd-left-menu .requireNum");
$(document).ready(function(){
	
	var pageType = common.getUrlParam("pageType"); 
	if(pageType==null){  
		initCourse(path,$courseNum);
		common.ajaxPost("member/myPcElective",{"memberId":common.getCookie("memberId"),},
			function(d){
				$(".yd-left-menu .electNum").html(" "+d.data[0].totalSize);
			}
		);
	}else if(pageType!=null && pageType==="electCourse"){ 
		$("li[yd-pageType]").find("a").removeClass("a-focus");
		$("li[yd-pageType=electCourse]").find("a").addClass("a-focus");
		path = "member/myPcElective";
		$courseNum = $(".yd-left-menu .electNum");
		initCourse(path,$courseNum);
		common.ajaxPost("member/myPcCompulsory",{"memberId":common.getCookie("memberId"),},
			function(d){
				$(".yd-left-menu .requireNum").html(" "+d.data[0].totalSize);
			}
		);
	}

	// 点击左侧菜单的必修课程或选修课程
	$(".yd-left-menu li").on("click",function clkback(event){

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
		preventDefault(event);
	});

	// 点击学习状态或搜索
	loadKeyCourse();

});







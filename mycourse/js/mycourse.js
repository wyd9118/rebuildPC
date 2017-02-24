
var path = "member/myPcCompulsory";
var $courseNum = $(".yd-left-menu .requireNum");
$(document).ready(function(){
	initCourse(path,$courseNum);
	common.ajaxPost("member/myPcElective",{"memberId":common.getCookie("memberId"),},
		function(d){
			$(".yd-left-menu .electNum").html(" "+d.data[0].totalSize);
		}
	);

	// 点击左侧菜单的必修课程或选修课程
	$(".yd-left-menu li").on("click",function(event){
		if($(this).find("a").hasClass("a-focus")){
			return;
		}
		$("#mycourse-which").html($(this).find("a").text().split(" ")[0]);
		$(this).siblings().find("a").removeClass("a-focus");
		$(this).find("a").addClass("a-focus");
		
		if($(this).attr("yd-data-role")==1){
			path = "member/myPcCompulsory";
			$courseNum = $(".yd-left-menu .requireNum");
		}else{
			path = "member/myPcElective";
			$courseNum = $(".yd-left-menu .electNum");
		}
		initCourse(path,$courseNum);
	});

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






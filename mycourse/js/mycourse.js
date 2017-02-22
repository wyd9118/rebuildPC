var pageIndex = 0;
var pageSize = 24;
$(document).ready(function(){
	initCourse("member/myPcCompulsory",$(".yd-left-menu .requireNum"));
	common.ajaxPost("member/myPcElective",{"memberId":common.getCookie("memberId"),},
		function(d){
			$(".yd-left-menu .electNum").html(" "+d.data[0].totalSize);
		}
	);

	$(".yd-left-menu li").on("click",function(){
		if($(this).find("a").hasClass("a-focus")){
			return;
		}
		$(this).siblings().find("a").removeClass("a-focus");
		$(this).find("a").addClass("a-focus");
		var path,$courseNum;
		if($(this).attr("yd-data-role")==1){
			path = "member/myPcCompulsory";
			$courseNum = $(".yd-left-menu .requireNum");
		}else{
			path = "member/myPcElective";
			$courseNum = $(".yd-left-menu .electNum");
		}
		initCourse(path,$courseNum);
	});
	
});

function initCourse(path,$courseNum){
	var param={
		"pageSize":pageSize,
		"pageNo":1,
		"memberId":common.getCookie("memberId"),
	};
	$(".yd-course-list").empty();
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){
			if(d.data==null||d.data.length==0) 
			{
				$("Pagination").hide();
				$(".loading").fadeOut(function(){
					$(".yd-course-list").html("<h3 style='margin-top:200px; text-align:center; font-size:30px; color:#bbb;'>暂无课程！</h3>");
					return;
				});
				
			}else{
				var totalSize = d.data[0].totalSize;
				if(totalSize<=pageSize){
					$("Pagination").hide();
				}
				$courseNum.html(" "+totalSize);
				$("#Pagination").pagination(totalSize,
					{
						items_per_page:pageSize,
						prev_text:"<img src='../common/images/left.png' width='20'>",
						next_text:"<img src='../common/images/right.png' width='20'>",
						callback:paginationBack,
					}

				);
			}	

		},
		function(d){
			console.dir(d);
		}
	);

	function paginationBack(pageIndex,jq){
		loadCourse(path,$courseNum,pageIndex);
	}
}

function loadCourse(path,$courseNum,pageIndex){ 
	var param={
		"pageSize":pageSize,
		"pageNo":pageIndex+1,
		"memberId":common.getCookie("memberId"),
	}; 
	$(".yd-course-list").empty();
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){  console.dir(d)
			$(".loading").fadeOut(function(){
				if(d.data==null||d.data.length==0){
					$(".yd-course-list").html("<h3 style='margin-top:200px; text-align:center; font-size:30px; color:#bbb;'>课程加载失败，请重试！</h3>");
					return;
				}
				//$courseNum.html(" "+d.data[0].totalSize.totalSize);
				$("#course-tmpl").tmpl(d.data).appendTo(".yd-course-list");
			}); 
			
		},
		function(d){
			console.dir(d);
		}
	);
}

function dealImage(src){
	var src = src;
	if(src == null || src == ""){
		src = "images/cover0.png";
	}else{
		src = common.resolveUrl(src);
	}
	return src;
}
$(function(){
	$(".yd-head-right>li>a").each(function(){ //alert(444);
		var winUrl = window.location.href;
		var ishref = $(this).attr("href");
		if(ishref)ishref = ishref.split("../")[1];
		if(winUrl.indexOf(ishref) != -1){
			$(this).addClass("yd-focus");
		}else{
			$(this).removeClass("yd-focus");
		}
	});

	// 处理logo和loading路径
	$("#logo-img").attr("src",common.getAbsoluteUrl("rebuild","common/images/logo.png"));
	$("#loading-img").attr("src",common.getAbsoluteUrl("rebuild","common/images/load.gif"));

	// 初始化头像、签名
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

	// 监听搜索框enter键事件
	$("#keyWords").keydown(function(e){
		if(e.keyCode == 13){$("#findBtn").click();}
	});

});


var pageIndex = 0; //分页索引
var pageSize = 24; //每页显示的课程数

// 加载课程封装函数
function initCourse(path,$courseNum){
	var param={
		"pageSize":pageSize,
		"pageNo":1,
		"memberId":common.getCookie("memberId"),
		"studySataus":$("#courseStatus").text(),
		"keyword":$("#keyWords").val(),		
	}; 
	if(param["keyword"]==$("#keyWords").attr("placeholder")){
		param["keyword"]="";
	}
	$(".yd-course-list").empty();
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){ //请求成功时
			if(d.data==null||d.data.length==0) 
			{
				$("#Pagination").hide();
				$(".loading").fadeOut(function(){
					$(".yd-course-list").html("<h3 style='margin-top:200px; text-align:center; font-size:30px; color:#bbb;'>暂无课程！</h3>");
					return;
				});
				
			}else{
				var totalSize = d.data[0].totalSize;
				if(totalSize<=pageSize){
					$("#Pagination").hide();
				}else{
					$("#Pagination").show();
				}
				if($courseNum){//我的课程中添加课程总数
					$courseNum.html(" "+totalSize);
				}
				
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
		function(d){ //请求失败
			console.dir(d);
		}
	);

	function paginationBack(pageIndex,jq){
		loadCourse(path,pageIndex);
	}
}
// loadCourse为加载课程列表，是initCourse的调用函数
function loadCourse(path,pageIndex){ 
	var param={
		"pageSize":pageSize,
		"pageNo":pageIndex+1,
		"memberId":common.getCookie("memberId"),
		"studySataus":$("#courseStatus").text(),
		"keyword":$("#keyWords").val(),		
	}; 
	if(param["keyword"]==$("#keyWords").attr("placeholder")){
		param["keyword"]="";
	}

	$(".yd-course-list").empty();
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){ 

			$(".loading").fadeOut(function(){
				if(d.data==null||d.data.length==0){
					$(".yd-course-list").html("<h3 style='margin-top:200px; text-align:center; font-size:30px; color:#bbb;'>未找到相应课程！</h3>");
					return;
				}
				$("#course-tmpl").tmpl(d.data).appendTo(".yd-course-list");
			}); 
			
		},
		function(d){
			console.dir(d);
		}
	);
}

function findKeyCourse(path){
	initCourse(path,null);
}
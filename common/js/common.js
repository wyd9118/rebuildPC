var path_pageType = {
	"member/myPcCompulsory"         :"requireCourse",
	"member/myPcElective"           :"electCourse",
	"courseCenterSelf/findMyCourse" :"courseCenter",
	""                              :"myCollect"
};
var categoryId = null;
$(function(){
	$(".yd-head-right>li>a").each(function(){ 
		var winUrl = window.location.href;
		var ishref = $(this).attr("href");
		if(ishref)ishref = ishref.split("../")[1];
		if(ishref!=null && winUrl.indexOf(ishref)!= -1){
			$(this).addClass("yd-focus");
		}else{
			$(this).removeClass("yd-focus");
		}
	});

	// 处理logo和loading路径
	$("#logo-img").attr("src",common.getAbsoluteUrl("common/images/logo.png"));
	$("#loading-img").attr("src",common.getAbsoluteUrl("common/images/load.gif"));

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

	// 文档图标icon
	$("link#shortIcon").attr("href",common.getAbsoluteUrl("common/images/icon.jpg"));
});


var pageIndex = 0; //分页索引
var pageSize = 24; //每页显示的课程数

// 加载课程封装函数
function initCourse(path,$courseNum){
	if(!categoryId){categoryId = null;}
	var param={
		"pageSize":pageSize,
		"pageNo":1,
		"memberId":common.getCookie("memberId"),
		"studySataus":$("#courseStatus").text(),
		"keyword":$("#keyWords").val(),	
		"categoryId":categoryId	
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
	if(!categoryId){categoryId = null;}
	var param={
		"pageSize":pageSize,
		"pageNo":pageIndex+1,
		"memberId":common.getCookie("memberId"),
		"studySataus":$("#courseStatus").text(),
		"keyword":$("#keyWords").val(),	
		"categoryId":categoryId	
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
				// 下面的if 添加一个当前页面课程分类
				for(var i in d.data){
					d.data[i]["pageType"] = path_pageType[path];
				}
				
				console.log(d.data);
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

function enterIntroduction(id,type,courseId,pageType){
	var courseType = common.course_type_alias[type];
	if(courseType){
		window.location.href = "../courseDetail/courseIntroduction.html?contentId="+id+"&courseType="+courseType+"&courseId="+courseId+"&pageType="+pageType;
	}else{
		window.location.href = "../courseDetail/courseIntroduction.html?contentId="+id+"&courseType="+type+"&courseId="+courseId+"&pageType="+pageType;
	}
	
}


function toggleCollection(contentId,contentType,obj,sucessback){ 
	var contentType = common.course_type_alias[contentType];
	var param = {
			"referenceId":contentId,
			"memberId":common.getCookie("memberId"),
			"type":contentType
		};
	var isCollection = eval(obj.attr("data-collection"));
	if(isCollection){
		var path = "contentCollection/deleteCollection";
		var fn = function(){
			obj.attr("data-collection",false).attr("src",common.getAbsoluteUrl("common/images/u1408.png"));
			if(sucessback)sucessback();
		};
	}else{
		path = "contentCollection/insert";
		fn = function(){
			obj.attr("data-collection",true).attr("src",common.getAbsoluteUrl("common/images/u1405.png"));
			if(sucessback)sucessback();
		};
		param = {fields:"{reference_id:"+contentId+",member_id:"+param.memberId+",reference_type:'"+contentType+"'}"};
	}
	common.ajaxPost(path,param,fn);
}


function crumbPath(pageType,title){
	var title = common.cutStr(title,16);
	switch(pageType){
		case'requireCourse':
			$("#path-one").attr("href",common.getAbsoluteUrl("mycourse/mycourse.html")).text("我的课程");
			$("#path-two").attr("href",common.getAbsoluteUrl("mycourse/mycourse.html?pageType=requireCourse")).text("必修课程");
			$("#path-three").text(title);
			break;
		case'electCourse':
			$("#path-one").attr("href",common.getAbsoluteUrl("mycourse/mycourse.html")).text("我的课程");
			$("#path-two").attr("href",common.getAbsoluteUrl("mycourse/mycourse.html?pageType=electCourse")).text("选修课程");
			$("#path-three").text(title);
			break;
		case'courseCenter':
			$("#path-one").attr("href",common.getAbsoluteUrl("courseCenter/courseCenter.html")).text("课程中心");
			var crumStr = $("#crumb-two").text()||"...";
			$("#path-two").text(crumStr).removeAttr("href");
			$("#path-three").text(title);
			break;
		case'myCollect':
			$("#path-one").attr("href",common.getAbsoluteUrl("personCenter/personCenter.html")).text("个人中心");
			$("#path-two").attr("href",common.getAbsoluteUrl("personCenter/myCollect.html")).text("我的收藏");
			$("#path-three").text(title);
			break;
	}
}


// 阻止默认行为的兼容写法
function preventDefault(e){
	if(document.all){
		e.returnValue = false;
	}else{
		e.preventDefault();
	}
}
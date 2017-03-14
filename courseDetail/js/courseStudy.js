
var createTimeFormat = function(time){
	return new Date(time).Format("yyyy-MM-dd hh-mm-ss");
}


function CourseStudy(){
	this.contentId = common.getUrlParam("contentId");
	this.courseType = common.getUrlParam("courseType"),
	this.memberId = common.getCookie("memberId");
}

CourseStudy.prototype = {
	hasRightToStudy:function(){
		var param = {
			id:this.memberId,
			contentId:this.contentId
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("member/haveRightByContent",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.data);
				}
			})
			.fail(function(d){
				reject(d);
			});
		});
	},
	loadCourse:function(){
		var param = {
			id:this.contentId,
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("content/get",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.errorMassage);
				}
			})
			.fail(function(d){
				reject("加载内容失败："+d);
			});
		});
	},
	loadCourseBody:function(){
		var param = {
			id:this.contentId,
			"certificate":common.getCookie("certificate"),
			"companyCode":'ruixue_test'
		}; 
		
		return new Promise(function(resolve,reject){ 
			$.ajax({
				url:common.resturl+"content/getBody",
				data:param,
				type:'post',
				dataType:"text",
				success:function(d){ 
					console.log("接口content/getBody的返回内容\n:"+d);
					resolve(d);
				},
				error:function(d){
					reject(d);
				}
			});
		});
	},
	loadIsCollection:function(){
		var param = {
			id:this.contentId,
			memberId:this.memberId,
			type:this.courseType,
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("contentCollection/isCollection",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.errorMassage);
				}
			})
			.fail(function(d){
				reject("加载内容失败："+d);
			});
		});
	},
	loadCommentsNum(){
		var param = {
			id:this.contentId
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("contentComment/commentNumber",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.errorMassage);
				}
			})
			.fail(function(d){
				reject("加载评论数失败："+d);
			});
		});
	},
	loadBrowNum(){
		var param = {
			id:this.contentId
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("contentBrow/browNumber",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.errorMassage);
				}
			})
			.fail(function(d){
				reject("加载观看数失败："+d);
			});
		});
	},
	saveBrowRecord:function(){
		var param = {
			content_id:parseInt(this.contentId),
			brower_id:parseInt(this.memberId),
			time_length:1
		};
		param = {fields:JSON.stringify(param)};
		return new Promise(function(resolve,reject){
			common.ajaxPost("contentBrow/insert",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
				}else{
					reject(d.errorMassage);
				}
				
			})
			.fail(function(d){
				reject(d);
			});
		});
	}

};


$(function(){
	var study = new CourseStudy();
	$(".loading").fadeIn();
	Promise.all([
		study.hasRightToStudy(),
		study.loadCourse(),
		study.loadIsCollection(),
		study.loadCommentsNum(),
		study.loadBrowNum(),
		study.saveBrowRecord()
		
	])
	.then(function(d){
		
		if(!d[0]){
			//alert("你没有学习该课程的权限！");
			$(".loading").fadeOut(function(){
				$(".yd-detailMiddle").empty().html("<h2 style='font-size:30px; color:#bbb; text-align:center; margin-top:100px;'>你没有学习该课程的权限！</h2>");
			});
			return;
		}
		var course = d[1];
		var data = { 
			renderType:common.render_type[course.type], //课程类型
			course:course,       //课程内容
			isCollection:d[2], //是否收藏
			commentsNum:d[3], //评论数
			browNum:d[4]      //观看人数
		}; 
		console.dir(data);
		crumbPath(common.getUrlParam("pageType"),course.title);
		$(".loading").fadeOut(function(){
			$(".yd-crumbPath").show();
			$(".yd-detailMiddle").empty();
			$("#study-tmpl").tmpl(data).appendTo(".yd-detailMiddle");
			if(course.type == '标准图文'){ 
				study.loadCourseBody().then(function(d){
					var body = "";
					if(d){
						body = d;
					}else{
						body = "<img src="+common.dealImage(course.cover)+" class='yd-imgsize' alt=''>";
					}
					$(".yd-article").html(body);
					var timg = $(".yd-detailMiddle section img").attr("src");
					$(".yd-detailMiddle section img").attr("src","http://test.strong365.com"+timg);
				});
			}
			
			//$("<script type='text/javascript' src='../common/js/video.min.js'></script>").appendTo(document.body)
		});
		
	});
});

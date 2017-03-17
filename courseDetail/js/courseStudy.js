
var createTimeFormat = function(time){
	return new Date(time).Format("yyyy-MM-dd hh-mm-ss");
}


function CourseStudy(){
	this.contentId = common.getUrlParam("contentId");
	this.courseType = common.getUrlParam("courseType");
	this.courseId = common.getUrlParam("courseId");
	this.memberId = common.getCookie("memberId");
	this.contentBrowId = "";
	this.cache = {};
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
		var _this = this;
		var param = {
			id:this.contentId,
		};
		return new Promise(function(resolve,reject){
			common.ajaxPost("content/get",param)
			.then(function(d){
				if(d.errorCode == 0){
					resolve(d.data);
					_this.cacheCourseList(d.data);
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
	loadCommentsNum(){ //加载评论数
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
	loadBrowNum(){ //加载观看人数
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
	saveBrowRecord:function(){ //记录浏览记录（观看人数加1）
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
					this.contentBrowId = d.data;
				}else{
					reject(d.errorMassage);
				}
				
			})
			.fail(function(d){
				reject(d);
			});
		});
	},
	saveProgress:function(){ //保存学习进度
		var _this = this;
		this.cache['starttime'] = this.cache['starttime']||(new Date().getTime());
		var endtime = new Date().getTime();
		var times = endtime - this.cache['starttime'];
		if(times>0){
			var param = {
				contentId:this.contentId,
				courseId:this.courseId,
				contentBrowId:this.contentBrowId,
				memberId:this.memberId,
				touchTime:times,
			};  
			common.ajaxAll({
				path:"courseStudyProcess/updateContentTimes",
				data:param,
				complete:function(d){ 
					var dd = eval('('+d+')');
					_this.cache['starttime'] = new Date(dd.data).getTime();  console.log(_this.cache['starttime']);
				}
			});
		}
	},
	cacheCourseList:function(data){
		var _this = this;
		var param = {
				contentId:this.contentId,
				memberId:this.memberId
		};
		if(data&&((data.type=='标准图文'&&data.originUrl) || data.type=='课件图文' || data.type=='H5图文')){
			var courseUrl = "";
			switch (data.type) {
				case '课件图文':
					courseUrl = "../content/content_viewcourse1.html"+window.location.search;
					break;

				case 'h5图文':
					courseUrl = "../content/content_view_h5.html"+window.location.search;;
					break;

				case '标准图文':
					courseUrl = data.originalUrl;
					break;
			}
			_this.cache['cacheCourseLog'] = new Promise(function(resolve,reject){
				common.ajaxPost("contentBrow/contentCompleteProgress",param)
				.then(function(d){
					if(d.errorCode == 0){
						resolve([{
							id: data.id,
							series_course_id: data.id,
							'name': null,
							subDirectory: [
								{
									is_compulsory: '',
									content_id: data.id,
									url: courseUrl,
									name: data.title,
									learning_time: false,
									course_catalog_id: '',
									Course_process: d.data[0].progress
								}
							]
						}]);
					}else{
						reject(d.errorMassage);
					}
				})
				.fail(function(d){
					reject(d);
				});
			});
		}
	},
	loadCourseList:function(){ //加载课程目录
		var _this = this;
		var param = {
			courseId:this.courseId,
			memberId:this.memberId,
		};
		if(!_this.cache['cacheCourseLog']){
			return new Promise(function(resolve,reject){
				common.ajaxPost("seriesCourse/getMyCatalogsBycourseId",param)
				.then(function(d){ //请求成功
					if(d.errorCode == 0){
						resolve(d.data);
					}else{
						reject(d.errorMassage);
					}
				})
				.fail(function(d){ //请求失败
					reject(d);
				});
			});
		}else{
			return _this.cache['cacheCourseLog'];
		} 
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
			$(".yd-detailMiddle video").addClass("vjs-big-play-centered").each(function(){
				videojs(this,{});
			});
			if(course.type == '标准图文'){ 
				study.loadCourseBody().then(function(d){
					var body = "";
					if(d){
						body = d;
					}else{
						body = "<img src="+common.dealImage(course.cover)+" class='yd-imgsize' alt=''>";
					}
					$(".yd-article").html(body);
					var timg = $(".yd-detailMiddle .yd-article img").attr("src");
					$(".yd-detailMiddle .yd-article img").attr("src","http://test.strong365.com"+timg);
					$(".yd-detailMiddle video").addClass("vjs-big-play-centered").each(function(){
						videojs(this,{});
						var src = common.resolveUrl($(this).attr("src"));
						$(this).attr("src",src);
						$(this).find("source").attr("src",src);
						$(this).attr("poster",common.resolveUrl(course.cover));
					});
				});
			}
			if(course.type == '视频图文' || (course.type=='标准图文'&&!course.originalUrl)){
				$("#courseList").remove();
				$("#courseComment").addClass("active");
			}
			study.loadCourseList().then(function(d){ 
				if(d){
					var $data = $("#tab-content-tmpl").tmpl({data:d});
					$("#tab-courseList").empty().append($data);
				}
			}).catch(function(err){
				console.log("课程目录为空！");
			});

			//保存学习进度
			setInterval(function(){
				study.saveProgress();
			},10000);	
		});
		
	});
});

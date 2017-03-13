$(document).ready(function(){
	var study = new CourseStudy();
	Promise.all([
		study.loadCourse(),
		study.loadIsCollection(),
		study.loadCommentsNum(),
		study.loadBrowNum()
	])
	.then(function(d){
		var course = d[0];
		var data = {
			renderType:course.type,
			course:course,
			isCollection:d[1],
			commentsNum:d[2],
			browNum:d[3]
		};
		crumbPath(common.getUrlParam("pageType"),course.title);
		$("#study-tmpl").tmpl(data).appendTo(".yd-detailMiddle");
	});
});
var createTimeFormat = function(time){
	return new Date(time).Format("yyyy-MM-dd hh-mm-ss");
}


function CourseStudy(){
	this.id = common.getUrlParam("contentId");
	this.memberId = common.getCookie("memberId");
}

CourseStudy.prototype = {
	
	loadCourse:function(){
		var param = {
			id:this.id,
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
	loadIsCollection:function(){
		var param = {
			id:this.id,
			memberId:this.memberId,
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
			id:this.id
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
			id:this.id
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
	}

};



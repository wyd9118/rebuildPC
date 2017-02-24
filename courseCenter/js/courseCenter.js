(function($){
	initCourse("courseCenterSelf/findMyCourse",null); //初始化课程中心课程列表

	// 点击选课状态分类课程
	$("#courseStatus").next("ul").find("a").on("click",function(){
		$("#courseStatus").text($(this).text());
		initCourse("courseCenterSelf/findMyCourse",null);
	});

	// 根据关键字搜索课程
	$("#findBtn").on("click",function(){
		initCourse("courseCenterSelf/findMyCourse",null);
	});

}(jQuery));
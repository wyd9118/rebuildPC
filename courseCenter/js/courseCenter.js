(function($){
	initCourse("courseCenterSelf/findMyCourse",null); //初始化课程中心课程列表

	// 点击选课状态分类课程或搜索
	courseStatusClick("courseCenterSelf/findMyCourse");

	var sub_items = {};
	var param = {
		memberId:common.getCookie("memberId"),
		categoryId:common.getUrlParam("categoryId") 
	}
	common.ajaxPost("courseCenterCategory/allCourseCategory",param,function(d){ console.dir(d.data);
		//$("#yd-mainmenu-tmpl").tmpl(d.data).appendTo(".yd-courseCenter-mainmenu");
		var tmplate = '<li><a href="###" data-id="@id" parent-id="@parent_id">@name</a></li>'; 
		$.each(d.data,function(){ 
			var $li = $(tmplate.replace('@id',this.id).replace('@parent_id',this.parent_id).replace('@name',this.name));
			$(".yd-courseCenter-mainmenu").append($li);
			sub_items[this.id] = this.subCate;
		}); 
		$(".yd-courseCenter-submenu").height($(".yd-courseCenter-mainmenu").outerHeight()-22);
	});
	
	var isCLK = false;
	$(".yd-left-menu")
	.on("mouseenter",".yd-courseCenter-mainmenu>li>a",function(){
		isCLK = false;
		$(".yd-courseCenter-submenu").empty();
		$(".yd-courseCenter-submenu").show();
		$(this).addClass("a-focus").parent().siblings().find("a").removeClass("a-focus");
		var tmplate = '<li><a href="###" data-id="@id" parent-id="@parent_id">@name</a></li>'; 
		$.each(sub_items[$(this).attr("data-id")],function(){
			var $li = $(tmplate.replace('@id',this.id).replace('@parent_id',this.parent_id).replace('@name',this.name));
			$(".yd-courseCenter-submenu").append($li);
		});
	})
	.on("mouseleave",$(this),function(){
		$(".yd-courseCenter-submenu").hide();
		if(!isCLK){
			$(".yd-courseCenter-mainmenu>li>a").removeClass("a-focus");
		}
	})
	.on("click",">ul>li>a",function(){
		isCLK = true;
		categoryId = $(this).attr("data-id");
		if($(this).attr("parent-id") === "0"){
			$("#crumb-two").text($(this).text());
			$("#crumb-three").parent().hide();
		}else{
			$("#crumb-two").text($(".yd-courseCenter-mainmenu>li>a[data-id="+$(this).attr("parent-id")+"]").text());
			$("#crumb-three").text($(this).text()).parent().css("display","inline-block");
		}
		initCourse("courseCenterSelf/findMyCourse",null);
	})

}(jQuery));
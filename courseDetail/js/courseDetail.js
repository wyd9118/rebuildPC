$(function(){
	var param = {
		memberId:common.getCookie("memberId"),
		contentId:common.getUrlParam("contentId"),
		type:common.getUrlParam("courseType")
	};
	$(".loading").fadeIn();
	common.ajaxPost("content/findContent",param,
		function(d){ //加载成功
			$(".loading").fadeOut(function(){
				$(".yd-crumbPath").css("display","block");
				crumbPath(common.getUrlParam("pageType"),d.data.title);
				$("#detail-tmpl").tmpl(d.data).appendTo(".yd-detailMiddle");
			});
		},
		function(d){ //加载失败
			$(".loading").fadeOut(function(){
				$(".yd-detailMiddle").html("<h2 style='font-size:30px; color:#bbb; text-align:center; margin-top:100px;'>内容加载失败！</h2>");
			});
		}
	);

});
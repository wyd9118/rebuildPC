var integral_path  = "integral/personIntegral";
var integral_pageSize = 15;
var integral_day = "";
$(function(){
	var integral_param = {
		memberId:common.getCookie("memberId"),
	};
	$(".loading").fadeIn();
	common.ajaxPost("integral/getMemberTotalScore",integral_param,function(d){
		if(d.data!=null && d.data.score!=null && d.data.score!=""){
			$(".yd-totalIntegral").show();
			$(".yd-totalIntegral span").text(d.data.score);
		}
	});
	
	initIntegral(integral_path);

	// 点击查看时间段积分
	$(".yd-myIntegral-type a").on("click",function(e){
		var day = $(this).attr("data-day");
		if(day){
			integral_day = parseInt(day);
		}else{
			integral_day = "";
		}
		
		initIntegral(integral_path);
		preventDefault(e);
	});
});

function initIntegral(path){
	var integral_param = {
		memberId:common.getCookie("memberId"),
		days:integral_day
	};
	$(".loading").fadeOut();
	common.ajaxPost(path,integral_param,
		function(d){ //请求成功
			if(d.data=="" || d.data==null || d.data.records.length==0){
				$("#myIntegral-table").replaceWith("<h2 style='text-align:center; color:#bbb; font-size:30px; margin-top:200px;'>暂无积分！</h2>");
				return;
			}
			if(d.data.records.length<=integral_pageSize){
				$("#Pagination").hide();
			}else{
				$("#Pagination").show();
			}
			$("#myIntegral-table").show();
			//console.dir(d);
			$("#Pagination").pagination(
				d.data.records.length,
				{
					items_per_page:integral_pageSize,
					prev_text:"<img src="+common.getAbsoluteUrl("common/images/left.png")+" width='20'>",
					next_text:"<img src="+common.getAbsoluteUrl("common/images/right.png")+" width='20'>",
					callback:paginationBack,
				}
			);
		},
		function(d){ //请求失败
			$("#myIntegral-table").replaceWith("<h2 style='text-align:center; color:#bbb; font-size:30px; margin-top:200px;'>加载失败！</h2>");
		}
	);
	function paginationBack(pageIndex){
		paginationIntegral(path,pageIndex);
	}

}

function paginationIntegral(path,pageIndex){
	var integral_param = {
		memberId:common.getCookie("memberId"),
		days:integral_day,
		pageNo:pageIndex + 1,
		pageSize:integral_pageSize,
	};

	common.ajaxPost(path,integral_param,function(d){
		if(d.data=="" || d.data==null || d.data.records.length==0){
			$("#myIntegral-table").replaceWith("<h2 style='text-align:center; color:#bbb; font-size:30px; margin-top:200px;'>未找到积分内容！</h2>");
			return;
		}
		$("#myIntegral-table>tbody").empty();
		$.each(d.data.records,function(){
			var tmpl = "<tr><td>@time</td><td>@score</td><td>@content</td></tr>";
			var score = this.score;
			if(score>0){
				score = "<span style='color:#009933'>+"+score+"</span>";
			}else{
				score = "<span style='color:#FF0000'>+"+score+"</span>";
			}
			var tmpl = tmpl.replace("@time",new Date(this.time).Format("yyyy-MM-dd hh : mm : ss")).replace("@score",score).replace("@content",this.content);
			$("#myIntegral-table>tbody").append($(tmpl));
		});
		

	});
}


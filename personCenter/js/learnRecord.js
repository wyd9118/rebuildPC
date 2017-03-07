var record_pageSize = 5;
$(function(){
	var record_path = "content/learningRecordPcMatchPage";
	initRecord(record_path);
	

});

function initRecord(p){
	var param = {
		memberId:common.getCookie("memberId"),
		pageNo:1,
		pageSize:record_pageSize,
	};
	$(".loading").fadeIn();
	common.ajaxPost(p,param,
		function(d){ //请求成功
			if(d.data&&d.data.records.length!=0){ 
				if(d.data.totalSize<=record_pageSize){
					$("#Pagination").hide();
				}else{
					$("#Pagination").show();
				}
				$("#Pagination").pagination(  //分页
					d.data.totalSize,
					{
						items_per_page: record_pageSize,
						prev_text:"<img src="+common.getAbsoluteUrl("common/images/left.png")+" width='20'>",
						next_text:"<img src="+common.getAbsoluteUrl("common/images/right.png")+" width='20'",
						callback:paginationBack,
					}
				);
			}else{
				$(".yd-learnRecord").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>暂无积分！</h2>");
				return;
			}
		},
		function(d){ //请求失败
			$(".yd-learnRecord").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>内容加载失败！</h2>");
		}
	);

	function paginationBack(pageIndex){
		paginationRecord(pageIndex,p);
	}

}

function paginationRecord(pageIndex,p){ 
	var param = {
		memberId:common.getCookie("memberId"),
		pageNo:pageIndex+1,
		pageSize:record_pageSize,
	};
	$(".loading").fadeIn();
	common.ajaxPost(p,param,
		function(d){ //请求成功
			if(d.data&&d.data.records.length!=0){
				$(".loading").fadeOut(function(){

					for(var i in d.data.records){
						if(d.data.records.course_score == null || d.data.records.course_score==undefined ){
							// d.data.records[i].course_score=90; 
						}
					}
					$("#learnRecord-list").empty();
					$("#learnRecord-tmpl").tmpl(d.data.records).appendTo("#learnRecord-list");
					
				});
			}else{
				$(".yd-learnRecord").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>请求异常，请重试！</h2>");
			}
		
		},
		function(d){ //请求失败
			$(".yd-learnRecord").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>内容加载失败！</h2>");
		}
	);

}

function formatTime(time){
	var is_time = new Date(time).Format('MM-dd hh:mm');
	return is_time;
}
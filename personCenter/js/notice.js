var notice_pageSize = 5;
$(document).ready(function(){
	initNotice("member/getNotices");
	$(document).on("click","#notice-del",function(e){
		var id = $(this).parents("li").attr("data-id");
		var param = {
			id:"["+id+"]",
		};
		common.ajaxPost("noticePcSend/deletes",param,function(d){
			/*console.dir(d);
			obj.parents("li").remove();*/
			initNotice("member/getNotices");
		});
		preventDefault(e);
	})
	.on("click","#setRead",function(e){
		var param = {
			memberId:common.getCookie("memberId"),
		};
		common.ajaxPost("noticePcSend/updateIsReadByMemberId",param,function(d){
			initNotice("member/getNotices");
		});
		preventDefault(e);
	})
	.on("click","#setDel",function(e){
		var param = {
			memberId:common.getCookie("memberId"),
		};
		common.ajaxPost("noticePcSend/deleteByMemberId",param,function(d){
			initNotice("member/getNotices");
		});
		preventDefault(e);
	})
	.on("click","#noticeToggle",function(e){ 
		var isTXT = $(this).text();
		var $isParent = $(this).parent();  console.log($isParent)
		if(isTXT == "详细信息"){
			$isParent.find(".yd-cbottom-cclose").hide();
			$isParent.find(".yd-cbottom-copen").show().stop().slideDown();
			$(this).text("收起");
		}else{
			$isParent.find(".yd-cbottom-cclose").show();
			$isParent.find(".yd-cbottom-copen").stop().slideUp().hide();
			$(this).text("详细信息");
		}
		preventDefault(e);
	});
});

function initNotice(path){
	var param = {
		id:common.getCookie("memberId"),
		needTotalSize:true
	};
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){ //请求成功
			if(d.data&&d.data.records.length!=0){
				if(d.data.totalSize<=notice_pageSize){
					$("#Pagination").hide();
				}else{
					$("#Pagination").show();
				}
				$("#Pagination").pagination(
					d.data.totalSize,
					{
						items_per_page:notice_pageSize,
						prev_text:"<img src="+common.getAbsoluteUrl("common/images/left.png")+" width='20'>",
						next_text:"<img src="+common.getAbsoluteUrl("common/images/right.png")+" width='20'>",
						callback:paginationBack
					}
				);

			}else{
				$(".loading").fadeOut(function(){
					$("#notice-list").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>暂无消息通知！</h2>");
					return;
				});	
			}
		},
		function(d){ //请求失败
			$(".loading").fadeOut(function(){
				$("#notice-list").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>内容加载失败！</h2>");
				return;
			});
			
		}
	);
	function paginationBack(pageIndex){
		paginationNotice(pageIndex,path);
	}
}

function paginationNotice(pageIndex,path){
	var param = {
		id:common.getCookie("memberId"),
		pageNo:pageIndex+1,
		pageSize:notice_pageSize,
	};
	$("#notice-list").empty();
	$(".loading").fadeIn();
	common.ajaxPost(path,param,
		function(d){ //请求成功
			$(".loading").fadeOut(function(){
				if(d.data&&d.data.records.length!=0){
					$.each(d.data.records,function(){
						var tmpl = '<li class="yd-clear yd-radius5px yd-notice-li" data-id="@id"><div class="yd-clear yd-notice-ctop"><span class="yd-notice-title">@title</span><span class="yd-notice-time">@time</span><a href="#" id="notice-del"><img src="img/u2916.png" height="22" alt=""></a></div><div class="yd-clear yd-notice-cbottom"><div class="yd-cbottom-content yd-cbottom-cclose">@cclose</div><div class="yd-cbottom-content yd-cbottom-copen">@copen</div><a href="#" id="noticeToggle">详细信息</a></div></li>';
						var reg = /<[^>]*>/g; //去除pcContent的html标签
						var pcContent = this.pcContent.replace(reg,"");
						$li = tmpl.replace("@id",this.id).replace("@title",common.cutStr(this.pcTitle,50)).replace("@time",new Date(this.createTime).Format("yyyy-MM-dd hh:mm:ss")).replace("@cclose",common.cutStr(pcContent,180)).replace("@copen",this.pcContent);
						$("#notice-list").append($li);
					});
							
				}else{
					$(".loading").fadeOut(function(){
						$("#notice-list").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>暂无消息通知！</h2>");
						return;
					});				
				}
			});
		},
		function(d){ //请求失败
			$("#notice-list").html("<h2 style='font-size:30px; color:#bbb; margin-top:200px; text-align:center;'>内容加载失败！</h2>");
		}
	);
}

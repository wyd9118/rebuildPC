var param = {
		memberId:common.getCookie("memberId"),
		contentId:common.getUrlParam("contentId"),
		type:common.getUrlParam("courseType")
	};
$(function(){
	$(".loading").fadeIn();
	common.ajaxPost("content/findContent",param,
		function(d){ //加载成功
			$(".loading").fadeOut(function(){
				if(d.data != null){
					$(".yd-crumbPath").css("display","block");
					crumbPath(common.getUrlParam("pageType"),d.data.title);
					$("#detail-tmpl").tmpl(d.data).appendTo(".yd-detailMiddle");
				}else{
					$(".yd-detailMiddle").html("<h2 style='font-size:30px; color:#bbb; text-align:center; margin-top:100px;'>课程内容为空！</h2>");
				}
				
			});
		},
		function(d){ //加载失败
			$(".loading").fadeOut(function(){
				$(".yd-detailMiddle").html("<h2 style='font-size:30px; color:#bbb; text-align:center; margin-top:100px;'>内容加载失败！</h2>");
			});
		}
	);

	/*$("#learn-choose").on("click",function(){ //立即选修
		if($(this).hasClass("btn-warning")){
			var param1 = {
				member_id:common.getCookie("memberId"),
				reference_id:common.getUrlParam("contentId"),
				reference_type:common.getUrlParam("courseType")
			};
			var para={};
			para[fields]=JSON.stringify(param1);
			common.ajaxPost("courseCenterSelf/insert",para,function(){
				$(this).removeClass("btn-warning").addClass("btn-success").text("立即学习");
				$("#delChoose").show();
			});
		}else{
			window.location.href = "study.html";
		}
		
	});
	$("#delChoose").on("click",function(){ //取消选修
		alert(44);
		common.ajaxPost("courseCenterSelf/deleteCourse",param,function(){
				$("#learn-choose").removeClass("btn-success").addClass("btn-warning").text("立即选修");
				$("#delChoose").hide();
			});
	});*/


	

});


function dealCollection(contentId,courseType,obj){
	var isCollection = obj.attr("data-collection");
	toggleCollection(contentId,courseType,obj,dealCoNum);
	function dealCoNum(){
		var collectionNum = 0;
		if($(".yd-collectionNum i").text() != null){
			collectionNum = parseInt($(".yd-collectionNum i").text());
		}
		console.log(collectionNum+"////"+isCollection)
		if(eval(isCollection)){ 
			$(".yd-collectionNum i").text(collectionNum-1);
		}else{
			$(".yd-collectionNum i").text(collectionNum+1);
		}
	}
}



function learnChoose(obj){ //立即选修
	if(obj.hasClass("btn-warning")){
		var para={};
		para["fields"] = "{reference_id:"+common.getUrlParam("contentId")+",member_id:"+common.getCookie("memberId")+",reference_type:'"+common.getUrlParam("courseType")+"'}";
		common.ajaxPost("courseCenterSelf/insert",para,function(){
			obj.removeClass("btn-warning").addClass("btn-success").text("立即学习");
			$("#delChoose").show();
			$(".yd-yesCollection").show();
			var electNum = 0;
			if($("#electNum").text() != null){
				electNum = parseInt($("#electNum").text());
			}
			$("#electNum").text(electNum+1);
			
		});
	}else{
		// window.location.href = "study.html";
	}
}		

function delChoose(){ //取消选修
	param["memberId"] = parseInt(param["memberId"]);
	param["referenceId"] = parseInt(param["contentId"]);
	common.ajaxPost("courseCenterSelf/deleteCourse",param,function(){
		$("#learn-choose").removeClass("btn-success").addClass("btn-warning").text("立即选修");
		$("#delChoose").hide();
		$(".yd-yesCollection").hide();
		var electNum = 1;
		if($("#electNum").text() != null){
			electNum = parseInt($("#electNum").text());
		}
		$("#electNum").text(electNum-1);
	});
}

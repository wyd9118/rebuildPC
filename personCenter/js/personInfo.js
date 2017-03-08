$(function(){
	initPersonInfo();
	$(document).on("click","#personInfo-save",function(e){
		if($(this).val()=="修改信息"){
			$(this).val("保存修改");
			$(".yd-personInfo-formL input").removeAttr("disabled").css({"border-color":"#00CC99"});
			$(".yd-personInfo-formL textarea").removeAttr("disabled").css({"border-color":"#00CC99"});
		}else{ 
			if($("input[name=personInfo-name]").val()==""){
				alert("姓名不能为空！");
				return;
			}
			var fields={
				real_name:$("input[name=personInfo-name]").val(),
				sex:$("input[name=personInfo-sex]:checked").val(),
				mobile:$("input[name=personInfo-phone]").val(),
				positionName:$("input[name=personInfo-post]").val(),
				signature:$(".personInfo-sign").val(),
				department:$("input[name=personInfo-department]").val(),
			};
			var param = {
				fields:JSON.stringify(fields),
				id:common.getCookie("personId")
			};
			common.ajaxPost("person/update",param,
				function(d){
				common.setCookie("realname",fields.real_name,7);	
				common.setCookie("sign",fields.signature,7);
				alert("保存成功！");
				window.location.href = "personCenter.html";
				},
				function(d){
					alert("保存成功！")
				}
			);
		}
		
	})
	.on("change","#upload-headpic",function(e){
		if(this.files&&this.files[0]){
			var file = this.files[0];
			var file_path = $(this).val();
			var reg = /(.jpg|.png|.jpeg|.bmp)$/gi;
			if(!file_path.match(reg)){
				alert("图片格式必须是：.jpg、.png、.jpeg、.bmp!");
				return;
			}
			var url = window.URL||window.webkitURL;
			$(".yd-personInfo-headPic").attr("src",url.createObjectURL(file));
		}
		
	});

	

});

function initPersonInfo(){
	var param = {
		id:common.getCookie("personId"),
	}
	common.ajaxPost("person/get",param,
		function(d){ // 请求成功
			if(d.data!=null){
				$("input[name=personInfo-name]").val(d.data.real_name);
				if(d.data.sex=="男"){
					$("input:radio[value='男']").attr("checked",true);
				}else{
					$("input:radio[value='女']").attr("checked",true);
				}
				$("input[name=personInfo-phone]").val(d.data.mobile);
				$("input[name=personInfo-post]").val(d.data.position);
				$(".personInfo-sign").val(d.data.signature);
				$(".personInfo-department").text(d.data.department);
				$(".yd-personInfo-headPic").attr("src",common.dealImage(d.data.head_pic_path));
			}

		},
		function(d){ // 请求失败

		}

	);

}
$(function(){ 
	var headPicPath = "";
	initPersonInfo();
	$(document).on("click","#personInfo-save",function(e){ // 点击修改、保存按钮
		if($(this).val()=="修改信息"){ 
			$(this).val("保存修改");
			$("#personInfo-form input").removeAttr("disabled").css({"border-color":"#00CC99"});
			$("#personInfo-form textarea").removeAttr("disabled").css({"border-color":"#00CC99"});
		}else{ //保存信息
			if($("input[name=personInfo-name]").val()==""){
				alert("姓名不能为空！");
				return;
			}
			head_pic_path = headPicPath?headPicPath:common.getCookie("headPic");
			common.setCookie("headPic",head_pic_path,7);
			var fields={
				real_name:$("input[name=personInfo-name]").val(),
				sex:$("input[name=personInfo-sex]:checked").val(),
				mobile:$("input[name=personInfo-phone]").val(),
				positionName:$("input[name=personInfo-post]").val(),
				signature:$(".personInfo-sign").val(),
				department:$("input[name=personInfo-department]").val(),
				head_pic_path:head_pic_path,
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
					alert("保存失败！");
				}
			);
		}
		
	})
	.on("change","#upload-headpic",function(e){ //点击上传
		if(this.files&&this.files[0]){
			var file = this.files[0];
			var file_path = $(this).val();
			var reg = /(.jpg|.png|.jpeg|.bmp)$/gi; //检查图片格式
			var type = file_path.match(reg);
			if(!type){
				alert("图片格式必须是：.jpg、.png、.jpeg、.bmp!");
				return;
			}
			var mime_type = "image/"+type;
			var canvas = document.createElement("canvas");
			var cxt = canvas.getContext("2d");
			var img = new Image();
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				img.src =  reader.result;
				var w = img.naturalWidth,
					h = img.naturalHeight,
					iw = canvas.width =  100,
					ih = canvas.height =  100;
				cxt.drawImage(img,0,0,iw,ih);
				var imgsrc = canvas.toDataURL(mime_type,0.1);

				$(".yd-personInfo-headPic").attr("src",imgsrc); //图片预览

				var data = imgsrc.split(",")[1]; 
				data = window.atob(data);
				var buffer = new Uint8Array(data.length);
				for(var i=0; i<data.length; i++){
					buffer[i] = data.charCodeAt(i);
				}
				var blob = new Blob([buffer]);
				var formdata = new FormData(); //上传图片到服务器
				formdata.append("ruixue_test",blob); 
				$.ajax({
					url:common.servleturl+"servletUpload",
					type:'post',
					data:formdata,
					processData: false,
	        		contentType: false,
					success:function(d){
						//console.dir(d);
						headPicPath = d;
						alert("上传成功，请保存修改！");
					},
					error:function(d){
						alert("上传失败！")
					},
				});
			};
		}
	})
	.on("click","#personInfo-modifypwd",function(e){
		$(".yd-modify-pwd").toggle();
		$.idcode.setCode({e:'idcode1',inputID:'idcode1-txt'});
	})
	.on("click","#step1-submit",checkStepOne)
	.on("click","#step2-submit",checkStepTwo)
	.on("click","#step3-submit",checkStepThree);

	

});

// 初始化个人信息页面内容
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


// 修改密码验证身份提交
function checkStepOne(){
	var now_pwd = $("input[name=now-pwd").val();
	var idcode = $("input[name=step1-idcode").val();
	if(!now_pwd){
		alert("密码不能为空！");
		return;
	}
	if(!idcode){
		alert("请输入验证码！");
		return;
	}
	var param = {
			"username":common.getCookie("user"),
			"password":now_pwd,
			"appId":"welearning_wechat",
			"appSecret":"learn2strong"
		};  
	common.ajaxPost("login/validateLogin",param,
		function(d){ //请求成功
			if(d.errorCode != 0){
				alert(d.errorMassage);
				return;
			} 
			if($.idcode.validateCode() == true){
				$(".yd-form-step1 input").not("input:button").val("");
				$(".yd-step-two").addClass("active");
				$(".yd-form-step1").removeClass("step-doing").next(".yd-form-step2").addClass("step-doing");
				$.idcode.setCode({e:'idcode2',inputID:'idcode2-txt'});
			}else{
				alert("验证码不正确！");
			}
		},
		function(d){ //请求失败
			alert(d);
		}
	);

}

function checkStepTwo(){
	var pwd = common.getCookie("pwd");
	var newpwd = $("input[name=new-pwd]").val();
	var renewpwd = $("input[name=renew-pwd]").val();
	var idcode = $("input[name=step2-idcode]").val();
	if(!newpwd){
		alert("新密码不能为空！");
		return;
	}
	if(!renewpwd){
		alert("请再次输入密码！");
		return;
	}
	if(newpwd != renewpwd){
		alert("两次密码输入不一致！");
		return;
	}
	if(newpwd == pwd){
		alert("新密码不能和原来密码一样!");
		return;
	}
	if(!idcode){
		alert("请输入验证码！");
		return;
	}else{
		if($.idcode.validateCode()){
			var fields = {
				password:newpwd,
			};
			var param = {
				fields:JSON.stringify(fields),
				id:common.getCookie("personId")
			}; $(".yd-form-step2 input").not("input:button").val("");
			common.ajaxPost("person/update",param,
				function(d){
				common.setCookie("pwd",newpwd);
				$(".yd-form-step2 input").not("input:button").val("");
				$(".yd-step-three").addClass("active");
				$(".yd-form-step2").removeClass("step-doing").next(".yd-form-step3").addClass("step-doing");
				},
				function(d){
					alert("更改密码失败，请重试！"+"---"+d);
					return false;
				}
			);
			$(".yd-step-three").addClass("active");
				$(".yd-form-step2").removeClass("step-doing").next(".yd-form-step3").addClass("step-doing");
		}
	}

}

function checkStepThree(){
	$(".yd-modify-pwd").hide();
	$(".yd-step-one").siblings("li").removeClass("active");
	$(".yd-form-step3").removeClass("step-doing").siblings(".yd-form-step1").addClass("step-doing");
}
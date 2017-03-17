var common = {};
common.rootName = "rebuild";
common.servleturl = "http://120.26.101.143:80/welearning/";
common.cdn = "http://cdn.strong365.com:80/";
common.resturl = "http://test.strong365.com:80/welearning/api/";
common.course_type_alias = {
	"scorm系列课程" : 'seriesCourse',
	"h5系列课程"    : 'seriesCourse',
	"video系列课程" : 'seriesCourse',
	"标准图文"      : "content",
	"视频图文"      : "content",
	"课件图文"      : "content",
	"h5图文"       : "content"
};
common.render_type = {
	'标准图文':'article',
	'视频图文':'video',
	'课件图文':'figure',
};
common.ajaxPost = function(path,param,successback,failback){
	param["companyCode"]='ruixue_test';
	if(!param.certificate){
		param["certificate"]=common.getCookie("certificate");
	}
	
	console.log("接口是（"+path+")；请求前传递参数：");
	console.dir(param);
	var obj = $.ajax({
		url:common.resturl+path,
		data:param,
		type:'post',
		dataType:'json',
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success:function(d){
			console.log("接口是（"+path+")；请求后返回数据：")
			console.dir(d);
			if(successback){
				successback(d);
			}
		},
		error:function(d){
			if(failback){
				failback(d);
			}
		}

	}); return obj;
}

common.ajaxAll = function(param){ //param = {path:,data:,type:,dataType:,cache:,success:,error:,complete:,}
	var data = param.data;
	if(!data['companyCode']){
		data['companyCode'] = "ruixue_test";
	}
	if(!data['certificate']){
		data['certificate'] = common.getCookie("certificate");
	}
	console.log("接口是："+param.path+"; 请求前数据：\n");
	console.dir(data);
	$.ajax({
		url:common.resturl+param.path,
		data:data,
		type:param.type?param.type:'post',
		dataType:param.dataType?param.dataType:'json',
		cache:(param.cache===false)?false:true,
		success:function(d){ //请求成功
			console.log("接口是："+param.path+"; 请求后数据：\n");
			console.dir(d);
			if(param.success){
				param.success(d);
			}
		},
		error:function(d){ //请求失败
			console.log("接口是："+param.path+"; 请求后数据：\n");
			console.dir(d);
			if(param.error){
				param.error(d);
			}
		},
		complete:function(xhr,status){ //请求完成
			console.log("接口是："+param.path+"; 请求后数据：\n");
			console.dir(xhr.responseText);
			if(param.complete){
				param.complete(xhr.responseText);
			}
		},
	});

}

common.getCookie = function(key){
	return $.cookie(key);
};
common.setCookie = function(key,value,t){
	$.cookie(key,value,{expires:t,path:"/"});
};

//截取字符串
common.cutStr = function(str,len){
	// var str = str.replace(/<([^>]*)>/g,"");
	var cutstr = new String();
	var str_len = 0;
	for(var i=0; i<str.length; i++){
		var s = str.charAt(i);
		str_len++;
		if(escape(s).length>4){//中文字符经编码后长度大于4
			str_len++;
		}
		if(str_len>len){
			return cutstr.concat("...");
		}else{
			cutstr = cutstr.concat(s);
		}
	}
	if(str_len<len){
		return str;
	}
}

common.resolveUrl = function(url){
	if(url.indexOf("RES_URL") != -1){
		url = url.replace("RES_URL",common.cdn)
	}else if((url.indexOf("RES_URL")==-1) && (url.indexOf("http://")==-1) && (url.indexOf("https://")==-1)){
		url = common.cdn+url;
	}
	return url;
}

// 根据location地址得到项目文件夹下绝对路径
common.getAbsoluteUrl = function(path){ 
	// name为项目文件夹名字，path为项目文件夹下的地址
	var isName = "/"+common.rootName+"/";
	var absoluteUrl = window.location.href.split(isName)[0]+isName;
	return absoluteUrl+path;
}

common.dealImage = function(src){
	var src = src;
	if(src == null || src == ""){
		src = common.getAbsoluteUrl("common/images/cover0.png");
	}else{
		src = common.resolveUrl(src);
	}
	return src;
}

// 获取页面url上的参数
common.getUrlParam = function(name){
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var arr = window.location.search.substring(1).match(reg);//url的？后的部分，如存在则返回["&name=value","&","value","&"](url中有&)或["name=value","","name=value",""](url中无&)
	if(arr != null){
		return decodeURI(arr[2]);
	}else{
		return null;
	}
}
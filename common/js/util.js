var common = {};
common.cdn = "http://cdn.strong365.com:80/";
common.ajaxPost = function(path,param,successback,failback){
	var resturl = "http://test.strong365.com:80/welearning/api/";
	param["companyCode"]='ruixue_test';
	param["certificate"]=common.getCookie("certificate");
	console.dir(param);
	$.ajax({
		url:resturl+path,
		data:param,
		type:'post',
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success:function(d){
			console.dir(d);
			if(successback){
				successback(d);
			}
		},
		error:function(d){
			console.log(d);
			if(failback){
				errorback(d);
			}
		}

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
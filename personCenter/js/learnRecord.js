$(function(){
	

	

});

function initRecord(){
	var param = {
		memberId:common.getCookie("memberId"),
	};

}

function paginationRecord(){
	var param = {
		memberId:common.getCookie("memberId"),
		pageNo:1,
		pageSize:20,
	};
	common.ajaxPost("content/learningRecordPcMatchPage",param,function(d){
		//console.dir(d)
		for(var i in d.data.records){
			if(d.data.records.course_score == null || d.data.records.course_score==undefined ){d.data.records[i].course_score=90; }
		}
		
		$("#learnRecord-tmpl").tmpl(d.data.records).appendTo("#learnRecord-list"); console.dir(d.data.records)
	})

}

function formatTime(time){
	var is_time = new Date(time).Format('MM-dd hh:mm');
	return is_time;
}
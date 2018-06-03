/**
 * 팝업
 */

var layerPopupCallBack = null;
function showPopup(url, title, width, closeCallback){
	$('.layer-pop-wrapper').remove();
	$(".layer-pop-back").remove();
	
	showSpinner();
	// test html
	var $layerBack = $('<div class="layer-pop-back"></div>');
	var $popWrapper = $('<div class="layer-pop-wrapper"><div class="layer-pop"></div></div>');
	var $popHeader = $('<div class="layer-pop-header"><h3></h3><button type="button" class="layer-pop-btn-close" onclick="hidePopupWithoutCallback();"><i class="fa fa-times-circle"></i></button></div>');
	var $popContent = $('<div class="layer-pop-body"></div>');
	
	width = width ? width : 500;
	title = title ? title : 'Title';
	
	$popHeader.find("h3").text(title);
	$popWrapper.find(".layer-pop").css("width", width+'px');
	
	var margin = width/2;
	$popWrapper.find(".layer-pop").css("margin-left", '-'+margin+'px');
		
	var wHeight = $(window).height();
	if(wHeight > 600)
		$popWrapper.find(".layer-pop").css("max-height", wHeight-40); // max-height 지정
	
	// content 불러오기
	var textUrl = '';
	var data = '';
	if(url instanceof jQuery && url.is("form")) {
		// form일경우
		textUrl = url.attr("action");
		data = url.serializeArray();
	} else {
		textUrl = url;
		data = {};
	}
	
	$.ajax({
		url : textUrl,
		data : data,
		type : 'post'
	}).done(function(resData){
		if(typeof resData == 'object')
			resData = setPopupDataToHtml(resData);
		
		$popContent.html(resData);
		
		$popWrapper.find(".layer-pop").append($popHeader);
		$popWrapper.find(".layer-pop").append($popContent);

		$("body").append($popWrapper);
		$("body").append($layerBack);

		$(".layer-pop-wrapper").fadeIn(200);
		$(".layer-pop-back").fadeIn(100);
		fitPopupHeight();
		moveTopFitHeight();
		
		hideSpinner();
		$(".layer-pop").draggable({
			handle : '.layer-pop-header',
			containment : '.layer-pop-wrapper'
		});
		
		$(window).resize(function(){
			fitPopupHeight();
		});
		
		layerPopupCallBack = closeCallback;
	}).fail(function(){
		swal('오류가 발생하였습니다.', '', 'error');
	});
}

function hidePopup(){
	$(".layer-pop-back").fadeOut(200);
	$(".layer-pop-wrapper").fadeOut(100, function(){
		$(this).remove();
		$(".layer-pop-back").remove();
		
		if(typeof layerPopupCallBack == 'function') {
			layerPopupCallBack();
		}
	});
}

function hidePopupWithoutCallback(){
	$(".layer-pop-back").fadeOut(200);
	$(".layer-pop-wrapper").fadeOut(100, function(){
		$(this).remove();
		$(".layer-pop-back").remove();
	});
}

function setPopupDataToHtml(resData){
	if(typeof fnSetPopupDataToHtml == 'function') {
		return fnSetPopupDataToHtml(resData);
	} else {
		return resData;
	}
}

function fitPopupHeight(){
	var maxHeight = $(window).height();
	// header: 46px, bottom: 59px, popup margin: 40px = 145px;
	var bottomBtn = $(".layer-pop-body #bottomButtonArea");
	if(bottomBtn.length>0)
		bottomBtn = bottomBtn.outerHeight();
	else
		bottomBtn = 0;
	
	$(".layer-pop-body").css("max-height", (maxHeight-86-bottomBtn) + 'px');
	$(".layer-pop-body").css("margin-bottom", bottomBtn + 'px');
}

function moveTopFitHeight(){
	var height = $(".layer-pop").height();
	$(".layer-pop").css("margin-top", ( -(height/2) ) + 'px');
}

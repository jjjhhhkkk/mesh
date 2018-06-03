	/**
	 * 공통 스크립트
	 */
	
	// Chart Default Colors
	var chartColorRgbs = [
		[255, 102, 000],
		[180, 195, 225],
		[000, 000, 102],
		[150, 150, 150],
		[255, 153, 000],
		[198, 217, 241],
		[85, 142, 213],
		[89, 89, 89],
		[255, 204, 000],
		[147, 205, 221]
	];
	
	// get Chart Color String(CSS)
	function getMyColor(idx, alpha){
		if(!alpha)
			alpha = 1;
		
		return 'rgba('+chartColorRgbs[idx][0]+', '+chartColorRgbs[idx][1]+', '+chartColorRgbs[idx][2]+', '+alpha+')';
	}
	
	if (typeof console === "undefined") {	// console이 없는 브라우저에서 오류가 나기때문에 dummy로 생성
		console = new Object();
		console.log = function() {};
	} 
	
	 Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear().toString();
		   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = this.getDate().toString();
	   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
	 };
	
	var spinner_opts = {
		lines : 13, // The number of lines to draw
		length : 20, // The length of each line
		width : 5, // The line thickness
		radius : 23, // The radius of the inner circle
		corners : 1, // Corner roundness (0..1)
		rotate : 0, // The rotation offset
		direction : 1, // 1: clockwise, -1: counterclockwise
		color : '#000', // #rgb or #rrggbb or array of colors
		speed : 1, // Rounds per second
		trail : 60, // Afterglow percentage
		shadow : true, // Whether to render a shadow
		hwaccel : false, // Whether to use hardware acceleration
		className : 'spinner', // The CSS class to assign to the spinner
		zIndex : 2e9, // The z-index (defaults to 2000000000)
		top : '50%', // Top position relative to parent
		left : '50%', // Left position relative to parent
		position : 'fixed'
	};
	
	var g_spinner = new Spinner(spinner_opts).spin();
	
	$(function() {
		
		addDatepicker($(".datepicker"));
		
		addNumberOnlyFilter($(".numberOnly"));
		
		$('input, textarea').placeholder();
		
		$('select.chosen').chosen({
			"disable_search" : true
		});
		
		$(".searchBox input, .searchBox select").keydown(function (key) {
			 
	        if(key.keyCode == 13){//엔터는 13
	        	if($(this).hasClass("datepicker"))
		        	removeKorean(this); // keyup에서 한글처리가 완전히 되지 않음
	        	
        		$(this).parents('.searchBox').find("button[id^='search']").click();
	        }
	    });
		
		
		prepareSpinner();
		
		// jQuery ajax Global Setting 설정 
		$(document)
			.ajaxSend(function(event, xhr, settings) {
				console.log("===== ajax send!! =====", settings);
				if (settings.nospinner) { return; }
				showSpinner();
			}).ajaxError(function(event, xhr) {
				console.log("===== ajax error!! =====", xhr.status);
				if(xhr.status == 403) {
					// alert('사용자 세션이 만료되었습니다. 로그인 페이지로 돌아갑니다.')
					location.reload();
				} else {
					hideSpinner();
				}
			}).ajaxComplete(function(event, xhr, settings) {
				console.log("===== ajax complete!! =====", xhr.status);
				if (settings.nospinner) { return; }
				hideSpinner();
			});
		
		
		addDateOnlyFilter($('.datepicker'));
	});
	
	function prepareSpinner() {
		window.spinner = $('<div style="position:fixed; left:50%; top:50%; margin-left:-125px; margin-top:-90px; width:250px; height:180px; z-index:20000; box-sizing:border-box; "><div class="alignC" style="padding-top:10px;"><i class="fa fa-spinner fa-spin colorPositive" style="font-size:60px;"></i></div></div>');
		$("body").append($('<i class="fa fa-spinner colorPositive" style="display:block; font-size:0px;"></i>'));	// font를 강제로 loading하기 위해 body에  spinner 엘리먼트를 붙여준다.
	}
	
	function addNumberOnlyFilter($target) {
		$target.keydown(function (e) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
	             // Allow: Ctrl+A
	            (e.keyCode == 65 && e.ctrlKey === true) ||
	             // Allow: Ctrl+C
	            (e.keyCode == 67 && e.ctrlKey === true) ||
	             // Allow: Ctrl+X
	            (e.keyCode == 88 && e.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (e.keyCode >= 35 && e.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
	    });
	}
	
	function addDateOnlyFilter($target){
		$target.formatter({
			'pattern' : '{{9999}}-{{99}}-{{99}}'
		})
		.keyup(function(e){
			// 한글 입력시 강제 space 처리해서 한글 삭제?
			removeKorean(this);
		}).focusout(function(){
			removeKorean(this);
		});
	} 
	
	function removeKorean(target){
		var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
		var str = $(target).val();
		
		if(check.test(str)) {
			$(target).val(str.replace(check, ''));
		}
	}
	
	// 뱅글뱅글... loading 이미지 띄우기
	function showSpinner($target) {
		if ($target===undefined || $target.length==0) {
			$target = $("body");
		}
		
		$.blockUI({ 
			message: null,
			overlayCSS: { 
				backgroundColor: '#aaaaaa url("jquery-ui-1.11.2.custom/images/ui-bg_flat_0_aaaaaa_40x100.png") 50% 50% repeat-x',
				opacity: '.3',
				filter: 'Alpha(Opacity=30)'	
			},
			fadeIn: 0,
			fadeOut: 0
		});
		$target.append(window.spinner);
		//g_spinner.spin();
		//$target.append(g_spinner.el);
	}
	
	// loding 이미지 감추기
	function hideSpinner() {
		$.unblockUI();
		window.spinner.detach();
		//g_spinner.stop();
		
	}
	
	// alert 박스를 띄운다.
	function showAlert(msg, title, callback) {
		if (title instanceof Function) {
			callback = title;
			title = undefined;
		}
		
		title = title ? title : "";
		swal({"title":title,  "text": msg,   type: "info",   confirmButtonText: "확인" }, function() {
			if (callback) callback();
		});
	}
	
	//confirm 박스를 띄운다.
	function showConfirm(msg, title, callback, okBtn, cancelBtn) {
		if ($.isFunction(title)) {
			callback = title;
			title = null;
		}
		title = title ? title : "";
		okBtn = okBtn ? okBtn : "예";
		cancelBtn = cancelBtn ? cancelBtn : "아니오";
		
		swal({
			"title":title,  
			"text": msg, type: "warning", 
			showCancelButton: true, 
			confirmButtonColor: "#DD6B55", 
			confirmButtonText: okBtn, 
			cancelButtonText: cancelBtn, 
			closeOnConfirm: true 
		}, function() {
			if (callback) callback();
		});
	}
	
	/**
	 * 현재 로그인 되어 있는지 확인하고, 로그인이 안 되어 있으면 로그인 팝업을 띄운다.
	 */
	function checkLogin() {
		return true;	// 로그인 팝업이 필요한지 나중에 결정
		/*
		var ret = false;
		$.ajaxSetup({
		    async: false
		});
		
		$.getJSON("/checkLoggedIn").done(function(json) {
			if (json.LoggedIn == "True") {
				ret = true;
			} else {
				var $jq = window.top.jQuery;
				var $iframe = $jq("<div><iframe src='/loginPopup' scrolling='no' width='700px' height='500px'></iframe></div>");
				$iframe.dialog({
					modal : true,
					width: 730
				});
				
			} 
		}).fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			//showAlert("데이터를 가져오는 중, 오류가 발생했습니다.\n[" + err + "]");
		});
		
		$.ajaxSetup({
		    async: true
		});
		return ret;
		*/
	}
	
	
	/**
	 * form을 submit하고, JSON 데이터를 받아온다. (GET 방식임)
	 * 
	 * @param $form
	 * @param callback
	 * @returns
	 */
	function getData($form, callback) {
		if (typeof $form === "string") {
			$form = makeForm($form);
		}
		
		var data=null, result=null, url=null;
		if (typeof($form) === 'string' || $form instanceof String) {
			url = $form;
		} else {
			url = $form.attr("action");
			data = $form.serializeArray();
		}
		
		showSpinner();
		$.get(url, data).done(function(json) {
			hideSpinner();
			callback(json);
		}).fail(function(jqxhr, textStatus, error) {
			hideSpinner();
			var err = "[" + error + "]" + textStatus;
			if (jqxhr.responseJSON) {
				showAlert(jqxhr.responseJSON.resultMessage, "서비스 오류");
			} else {
				if ($.isEmptyObject(jqxhr.responseText)) {
					showAlert("서버 작업 중, 오류가 발생했습니다.\n" + err	);
				} else {
					document.open();
					document.write(jqxhr.responseText);
					document.close();
				}
			}
		});
		return result;
	}
	
	/**
	 * form을 submit하고, JSON 데이터를 받아온다. (POST 방식임)
	 * 
	 * @param $form
	 * @param callback
	 * @returns
	 */
	function postData($form, callback) {
		var data=null, result=null, url=null;
		if (typeof($form) === 'string' || $form instanceof String) {
			url = $form;
		} else {
			url = $form.attr("action");
			data = $form.serializeArray();
		}
		
		//showSpinner();
		$.post( url, data).done(function(json) {
			//hideSpinner();
			callback(json);
		}).fail(function(jqxhr, textStatus, error) {
			//hideSpinner();
			
			var err = "[" + error + "]" + textStatus;
			if (jqxhr.responseJSON) {
				showAlert(jqxhr.responseJSON.resultMessage, "서비스 오류");
			} else {
				if ($.isEmptyObject(jqxhr.responseText)) {
					showAlert("서버 작업 중, 오류가 발생했습니다.\n" + err	);
				} else {
					document.open();
					document.write(jqxhr.responseText);
					document.close();
				}
			}
		});
		return result;
	}

	// form을 ajax 방식으로 전송한다. (파일 업로드 시 사용할 것.)
	function ajaxSubmit($form, userCallback) {
		showSpinner();
		var options = {
			error:function(response , result, statusText, $form) {
				hideSpinner();
				var err = "[" + result + "]" + statusText;
				if (response.responseJSON) {
					showAlert(response.responseJSON.resultMessage, "서비스 오류");
				} else {
					showAlert("서버 작업 중, 오류가 발생했습니다.\n" + err	);
				}
			},
		    success:    function(responseText , statusText, xhr, $form) {
		    	hideSpinner();
	    		if ( isString(responseText) ) {
	    			if ( isJsonString(responseText) ) {	// json string인가
	    				responseText = $.parseJSON(responseText);	// json 객체로 변환.
			    	} else {
			    		// <pre>tag가 붙어서 오는 경우가 있으므로 이 경우도 테스트
			    		var temp = $(responseText).text();
			    		if ( isJsonString(temp) ) {	
			    			responseText = $.parseJSON(temp);	// json 객체로 변환.
			    		}
			    	}
	    		}
				if (userCallback) userCallback(responseText);
		    }
		}; 
		$form.ajaxSubmit(options);
	}
	
	/*
	 * Form data를 json string 형태로 변환하여 리턴한다.
	 */
	function serializeObject($form) {
		var obj = $form.serializeArray();
		var data = {};
		$.each(obj, function() {
			data[this.name] = this.value;
		});
		
		return JSON.stringify(data);
	}
	
	/**
	 * popup 관련 
	 */
	// 버튼과 함께 팝업을 띄운다.
	function popupWithButton(url, option) {
		showSpinner();
		if (typeof width !== 'undefined' && $.isFunction(width)) {
			width = null;
		}		
		
		if (typeof option === "undefined"){
			option = {};
		};
		
		var popupName = "pop_" + Math.floor(Date.now() / 1000);
		var $popContent = $('<div><iframe name="'+ popupName + '" class="popupFrame" width="100%" height="99%" frameborder="0" scrolling="no"></iframe></div>');
		
		if (jQuery.type( url ) === "string") {	// url string 이 넘어온 경우.
			$popContent.find(".popupFrame").attr("src", url);
		}		
		
		var popupWidth = option.hasOwnProperty("width") ? option.width : '700';
		var popupHeight = option.hasOwnProperty("height") ? option.height : '700';
		
		// 팝업 창 생성 
		$popContent.dialog({
			"modal": true,
			"width" : popupWidth,
			"height" : popupHeight,
			'buttons': option.buttons,
		});
		
		if (url instanceof jQuery && url.is("form")) {	// jquery form이 넘어온 경우.
			url.attr("target", popupName);
			url.submit();
		}
		
		$popContent.parent().css("visibility" ,"hidden");	// iframe이 load되는 동안, 빈 창이 보여지는 것을 막기 위해 숨겨둔다.
	
		$popContent.find(".popupFrame").load(function() {	// iframe onload 시.
			$popContent.parent().css("visibility" ,"visible");	// 팝업창을 보여준다.
			var title = $popContent.find(".popupFrame")[0].contentDocument.title;
			$popContent.dialog({
				"position": {
					my: "center",
					at: "center",
					of: window
				},
				"title" : title
			});
	
			hideSpinner();
		});
	}
	
	// 팝업을 닫고 콜백을 호출한다.
	function closeOkWithButton() {
		var parent$ = window.parent.jQuery;
		parent$(window.frameElement).parent().data("lastClick", "ok");
		parent$(window.frameElement).parent().dialog("close");
	}
	
	// 팝업을 그냥 닫는다.
	function closeCancelWithButton() {
		var parent$ = window.parent.jQuery;
		parent$(window.frameElement).parent().dialog("close");
	}
	
	
	/**
	 * popup 관련 
	 */
	// 팝업을 띄운다.
	function popup(url, width, closeCallback) {
		
		// 팝업을 띄우기 전 사용자의 session을 체크한다. session이 끊겼으면 login페이지로 돌아간다.
		$.ajax(contextPath +"/user/common/session",{nospinner : true}).done(function() {
			
			if (typeof width !== 'undefined' && $.isFunction(width)) {
				closeCallback = width;
				width = null;
			}
			
			width = width ? width : 700;
			
			var popupName = "pop_" + Math.floor(Date.now() / 1000);
			var $popContent = $('<div><iframe name="'+ popupName + '" class="popupFrame" width="100%" frameborder="0" scrolling="no"></iframe></div>');
			
			if (jQuery.type( url ) === "string") {	// url string 이 넘어온 경우.
				$popContent.find(".popupFrame").attr("src", url);
			}		
			
			$popContent.css("width", width);
			
			// height 조절
			var maxHeight = screen.availHeight * 0.8;
			
			// 팝업 창 생성 
			$popContent.dialog({
				"modal": true,
				"width" : width,
				"maxHeight": maxHeight,
				close: function(event, ui) {
			        var lastClick = $(this).data('lastClick');
			        if(lastClick && lastClick == "ok") {
			        	closeCallback($(this).find(".popupFrame")[0]);
			        }
			        $(this).dialog('destroy').remove();
			    }
			});
			
			if (url instanceof jQuery && url.is("form")) {	// jquery form이 넘어온 경우.
				url.attr("target", popupName);
				url.submit();
			}
			
			$popContent.parent().css("visibility" ,"hidden");	// iframe이 load되는 동안, 빈 창이 보여지는 것을 막기 위해 숨겨둔다.
			
			$popContent.find(".popupFrame").on('load',function() {	// iframe onload 시.
				// 팝업창 X 버튼 icon 생성
				$popContent.parent().find('.ui-dialog-titlebar-close').addClass('fa fa-times');
				
				$popContent.parent().css("visibility" ,"visible");	// 팝업창을 보여준다.
				var title = $popContent.find(".popupFrame")[0].contentDocument.title;
				$popContent.dialog({
					"position": {
						my: "center+0 top+100",
						at: "center top",
						of: window,
						collision: "fit"
					},
					"title" : title
				});
				
			});
			
		});

	}
	
	/**
	 * popup 관련 
	 */
	// 팝업을 띄운다.
	function popupByFormSubmit($form, width, closeCallback) {
		showSpinner();
		if (typeof width !== 'undefined' && $.isFunction(width)) {
			closeCallback = width;
			width = null;
		}		
		width = width ? width : 700;
		var $popContent = $('<div><iframe name="_myPopup" class="popupFrame" width="100%" frameborder="0" scrolling="no"></iframe></div>');
		$popContent.css("width", width);
		$form.attr("target", "_myPopup");
		
		
		// 팝업 창 생성 
		$popContent.dialog({
			"modal": true,
			"width" : width,
			close: function(event, ui) {
		        var lastClick = $(this).data('lastClick');
		        if(lastClick && lastClick == "ok") {
		        	closeCallback($(this).find(".popupFrame")[0]);
		        }
		        $(this).dialog('destroy').remove();
		    }
		});
		
		
		
		$popContent.parent().css("visibility" ,"hidden");	// iframe이 load되는 동안, 빈 창이 보여지는 것을 막기 위해 숨겨둔다.
		$popContent.find(".popupFrame").load(function() {	// iframe onload 시.
			$popContent.parent().css("visibility" ,"visible");	// 팝업창을 보여준다.
			var title = $popContent.find(".popupFrame")[0].contentDocument.title;
			$popContent.dialog({
				"position": {
					my: "center",
					at: "center",
					of: window
				},
				"title" : title
			});
			hideSpinner();
		});
	}
	
	
	// 팝업을 닫고 콜백을 호출한다.
	function closeOk() {
		var parent$ = window.parent.jQuery;
		parent$(window.frameElement).parent().data("lastClick", "ok");
		parent$(window.frameElement).parent().dialog("close");
	}
	
	// 팝업을 그냥 닫는다.
	function closeCancel() {
		var parent$ = window.parent.jQuery;
		parent$(window.frameElement).parent().dialog("close");
	}
	
	
	function addDatepicker($input, dateFormat) {
		if (dateFormat == null || dateFormat == undefined) {
			dateFormat = "yy-mm-dd";
		}
		$input.datepicker({
			"yearRange": '-100:+100',
			"dateFormat" : dateFormat,
			"altFormat" : "yymmdd",
			"changeMonth" : true,
		    "changeYear" : true,
		    "showButtonPanel" : true,
		    "regional" : "ko",
		    "buttonImage": contextPath + "/resources/img/btnCalendar_n.png",
		    "buttonImageOnly" : false,
		    "showOn" : "both"
		}).on("change", function() {
			/*
			if ( !isValidDate($(this).val()) ) {
				var self = this;
				showAlert("올바른 날짜가 아닙니다. 다시 입력해 주세요.", function() {
					$(self).val("");
					$(self).focus();
				});
				return false;
			}
			
			// 입력된 날짜가 형식에 안 맞을 수 있으므로 형식에 맞춰서 다시 넣어준다.
			var temp = $(this).val().replace(/\D/g,'');
			$(this).datepicker("setDate", $.datepicker.parseDate( "yymmdd", $(this).val().replace(/\D/g,'') ));
			*/
		});
		
		$('.ui-datepicker-trigger').css({display:'none'});

	}
	
	function isValidDate(str) {
		str = str.replace(/\D/g,'');
		if(!/^(\d){8}$/.test(str)) return false;
	    var y = str.substr(0,4),
	        m = str.substr(4,2) - 1,
	        d = str.substr(6,2);
	    var D = new Date(y,m,d);
	    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? true : false;
	}
	
	function fitFrameHeight(minHeight) {
		minHeight = minHeight || 0;
		if (window.frameElement) {
			var height = $("#frameContent").outerHeight() + 10;
			if (height < minHeight) height = minHeight;
			window.frameElement.height = height;
		}
	}
	
	/**
	 * Jquery 폼을 생성한다.
	 * param : action, inputName1, inputValue1, inputName2, inputValue2, ... , inputNameN, inputValueN
	 */
	function makeForm() {
		 if (arguments.length % 2 != 1) {
			 showAlert("죄송합니다. 오류가 발생했습니다. 문의:02-XXX-YYYY");
			 return null;
		 }
		 var action = arguments[0];
		 var $form = $('<form action="' + action + '"></form>');
		 for (var i=1; i<arguments.length; i+=2) {
			 var name = arguments[i];
			 var value = arguments[i+1];
			 var $input = $('<input type="hidden"/>')
			 $input.attr("name", name);
			 $input.attr("value", value);
			 $form.append($input);
		 }
		 return $form;
	}
	
	/**
	 * queryString 파라미터를 가져온다.
	 */
	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	function navigate(url) {
		if (url===undefined || !url) return ;
		url = $.trim(url);
		location.href = url;
	}
	
	function isString(s) {
	    return typeof(s) === 'string' || s instanceof String;
	}
	
	function isJsonString(str) {
	    try {
	        $.parseJSON(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	}
	
	// 화면에 지정된 anchor로 스크롤
	function scrollToElement($el){
	    $('html,body').animate({scrollTop: $el.offset().top - 20} );
	}
	
	
	// 직업찾기 팝업을 띄운다.
	function popJobSearch(callback) {
		popup("/popJobSearch", 800, function(frm) {
			var ret = frm.contentWindow.getReturnObj();
			if (ret != null) callback(ret);
			
		});
	}
	
		
	// 국가조회 팝업을 띄운다.
	function popCountrySearch(callback) {
		popup("/popCountrySearch", 800, function(frm) {
			var ret = frm.contentWindow.getReturnObj();
			if (ret != null) callback(ret);
			
		});
	}
	
	
	//코드그룹을 이용해 코드값 리스트 조회
	function getCodeValue(selectId, codeGrp) {
		//form 생성
		var form = document.createElement("form");
		form.setAttribute("method","get");                    
		form.setAttribute("action","/board/getCodeValue");        
		document.body.appendChild(form);
		
		//input
		var codeGroup = document.createElement("input");  
		codeGroup.setAttribute("type", "hidden");                 
		codeGroup.setAttribute("name", "codeGrp");                        
		codeGroup.setAttribute("value", codeGrp);                          
		form.appendChild(codeGroup);
		
		var targetObj = document.getElementById(selectId);
		
		getData(($(form)), function callback(result){
			$.each(result, function() {
				var codeOption = new Option();
				
				codeOption.value = this.codeValue;
				codeOption.text = this.codeName;
				targetObj.options.add(codeOption);
			});
		});
	}
	

	//목록 페이징 함수 
	var Paging = function(totalCnt, dataSize, pageSize, pageNo, token) {
		totalCnt = parseInt(totalCnt);	// 전체레코드수 
		dataSize = parseInt(dataSize); // 페이지당 보여줄 데이타수 
		pageSize = parseInt(pageSize); // 페이지 그룹 범위 1 2 3 5 6 7 8 9 10 
		pageNo = parseInt(pageNo); // 현재페이지 
		
		var html = new Array(); 
		if(totalCnt == 0){ 
			return ""; 
		}
		
		// 페이지 카운트 
		var pageCnt = totalCnt % dataSize; 
		if(pageCnt == 0){ 
			pageCnt = parseInt(totalCnt / dataSize); 
		}
		else{ 
			pageCnt = parseInt(totalCnt / dataSize) + 1; 
		} 
		
		var pRCnt = parseInt(pageNo / pageSize); 
		if(pageNo % pageSize == 0){ 
			pRCnt = parseInt(pageNo / pageSize) - 1; 
		}
		
		// bootstrap css
		html.push('<ul class="pagination">');
		
		//이전 화살표 
		if(pageNo > pageSize){ 
			var s2; 
			if(pageNo % pageSize == 0){ 
				s2 = pageNo - pageSize; 
			}
			else{ 
				s2 = pageNo - pageNo % pageSize; 
			}
			html.push('<li class="paginate_button previous">');
			html.push('<a href=javascript:goPaging_' + token + '("'); 
			html.push(s2); 
			html.push('");>'); 
			html.push('◀ '); 
			html.push("</a>"); 
			html.push('</li>');
		}
		else{
			html.push('<li class="paginate_button previous disabled">'); 
			html.push('<a href="#">\n'); 
			html.push('◀ '); 
			html.push('</a>'); 
			html.push('</li>');
		} 
		
		//paging Bar 
		var firstIdx = pRCnt * pageSize + 1;
		var lastIdx = (pRCnt + 1)*pageSize + 1;
		if(lastIdx>pageCnt) {
			lastIdx=pageCnt+1;
		}
		
		for(var index=firstIdx;index<lastIdx;index++){ 
			if(index == pageNo){ 
				html.push('<li class="paginate_button active">'); 
				html.push('<a>'); 
				html.push(index); 
				html.push('</a>'); 
				html.push('</li>'); 
			}else{ 
				html.push('<li class="paginate_button">');
				html.push('<a href=javascript:goPaging_' + token + '("'); 
				html.push(index); 
				html.push('");>'); 
				html.push(index); 
				html.push('</a>'); 
				html.push('</li>');
			} 
			/* if(index == pageCnt){ 
				break; 
			}else 
				html.push(' | '); 
			*/ 
		}
	
		//다음 화살표 
		if(pageCnt > (pRCnt + 1) * pageSize){  
			html.push('<li class="paginate_button next">');
			html.push('<a href=javascript:goPaging_' + token + '("'); 
			html.push((pRCnt + 1)*pageSize+1); 
			html.push('");>'); 
			html.push(' ▶'); 
			html.push('</a>'); 
			html.push('</li>'); 
		}else{ 
			html.push('<li class="paginate_button next disabled">');
			html.push('<a href="#">'); 
			html.push(' ▶'); 
			html.push('</a>'); 
			html.push('</li>'); 
		} 
	
		// bootstrap css end
		html.push('</ul>');
		
		return html.join(""); 
	} //Close paging
	
	
// Date Week Control
	// 주차 구하기
	function getWeekOfMonth(date){
		var day = date.getDate();
		day -= (date.getDay()==0?6:date.getDay()-1);
		day+=7;
		
		prefixes = ['1', '2', '3', '4', '5', '6'];
		return prefixes[ 0 | (day)/7];
	}
	
	// 총 주차
	function weekCount(year, month_number) {
		var firstOfMonth = new Date(year, month_number-1, 1);
		var lastOfMonth = new Date(year, month_number, 0);
		
		var used = firstOfMonth.getDay() -1 + lastOfMonth.getDate();
		
		return Math.ceil(used / 7);
	}
// Date Week Control End
	
	// get Date YYYY-MM-DD
	function getDateString(date, fix) {
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var date = date.getDate();
		
		var dateStr = year + fix;
		
		if(month<10) dateStr+="0";
		dateStr+=month + fix;
		
		if(date<10) dateStr+="0";
		dateStr+=date;
		
		return dateStr;
	}
	
	function itoStr(num){
		return num < 10 ? '0'+num:''+num;
	}
	
	function nullToBlanc(text){
		return text==null || text == 'null' ? '':text;
	}
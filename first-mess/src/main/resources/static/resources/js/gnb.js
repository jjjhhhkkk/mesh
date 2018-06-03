$(function() {
	var options = {
			duration : 100,
			easing : "easeOutQuad"
	};
	
	$("header .mainMenu li").mouseover( function() {
		$(this).find(".subMenu").slideDown( options  );
	}).mouseleave(function() {
		$(this).find(".subMenu").slideUp(options);
	});
});
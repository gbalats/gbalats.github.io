;(function(){

	// Menu settings
	$('#menuToggle, .menu-close-btn').on('click', function(){
		$('#menuToggle').toggleClass('active');
		$('body').toggleClass('body-push-toright');
		$('#theMenu').toggleClass('menu-close');
	});

})(jQuery)

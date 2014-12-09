$("#fake_email").click( function(e) {
    var username = "gbalats",
          domain = "gmail.com";

    window.location.href = "mailto:" + username + "@" + domain;
});

;(function(){

	// Menu settings
	$('#menuToggle, .menu-close-btn').on('click', function(){
		$('#menuToggle').toggleClass('active');
		$('body').toggleClass('body-push-toright');
		$('#theMenu').toggleClass('menu-close');
	});

})(jQuery)

// Obfuscate email

$("#fake_email").click( function(e) {
    var username = "gbalats",
          domain = "gmail.com";

    window.location.href = "mailto:" + username + "@" + domain;
});


// Toggle sidebar

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});


// Open links in new tabs

$(".icons")
    .find("a")
    .not("[id='fake_email']")
    .attr("target", "_blank");

$("a[href^='http']")
    .not("[href*='gbalats.gihtub.io]")
    .attr("target", "_blank");

// Initialize smooth scrolling
smoothScroll.init({
    speed: 700
});

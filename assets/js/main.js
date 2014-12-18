// Obfuscate email
$(function() {
    $("#fake_email").click( function(e) {
        var username = "gbalats",
        domain = "gmail.com";

        window.location.href = "mailto:" + username + "@" + domain;
    });
});


// Toggle sidebar
$(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#theWrapper").toggleClass("toggled");
    });
});


// Open links in new tabs
$(function() {
    $(".icons")
        .find("a")
        .not("[id='fake_email']")
        .attr("target", "_blank");

    $("a[href^='http']")
        .not("[href*='gbalats.github.io']")
        .attr("target", "_blank");
});


// Initialize smooth scrolling
$(function() {
    smoothScroll.init({
        speed: 700
    });
});

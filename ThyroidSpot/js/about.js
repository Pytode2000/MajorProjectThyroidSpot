// For the parallex effect.
$(document).ready(function () {
    var $window = $(window);
    $('section[data-type="background"]').each(function () {
        var $bgobj = $(this); // Assigning the object.
        $(window).scroll(function () {
            var yPos = -($window.scrollTop() / $bgobj.data('speed'));
            // Put together the final background position (bgp).
            var bgp = '50% ' + yPos + 'px';
            // Move the background.
            $bgobj.css("background-position", bgp);
        });
    });
});
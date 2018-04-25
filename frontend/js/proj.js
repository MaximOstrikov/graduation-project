var welcomeChecker = 1;
function sliderBackgroundBody() {
    if (welcomeChecker === 1) {
        setTimeout(function(){
            $('#welcome').animate({opacity:1}, {duration:1000}).fadeOut(2000, function () {
                $(this).remove()
            });
        welcomeChecker++;
        setTimeout(sliderBackgroundBody, 2200);},300);
        setTimeout(function () {
            $('#task').animate({opacity:1}, {duration:1000}).removeClass('displayNone');
        }, 3600)
    } else {
        window.currBg = window.currBg + 1;
        if (!window.currBg || window.currBg > 8) window.currBg = 1;
        $('#bgimg').fadeOut(1000, function () {
            $(this).css('background-image', 'url("./img/background/' + window.currBg + '.jpg")').fadeIn(1000);
        });
        setTimeout(sliderBackgroundBody, 15000);
    }
}
$(document).ready(function() {
    sliderBackgroundBody();
});


// background slider
var welcomeChecker = 1;
function sliderBackgroundBody() {
    if (welcomeChecker === 1) {
        setTimeout(function () {
            $('#welcome').animate({opacity: 1}, {duration: 1000}).fadeOut(2000, function () {
                $(this).remove()
            });
            welcomeChecker++;
            setTimeout(sliderBackgroundBody, 2200);
        }, 300);
        setTimeout(function () {
            $('#task').animate({opacity: 1}, {duration: 1000}).removeClass('displayNone');
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
$(document).ready(function () {
    sliderBackgroundBody();
});

// add new task

$('#addListBtn').click(function() {
    var newTaskName = $('#addName').val(), newTaskDiscription = $('#addDiscription').val();
    $('#addName, #addDiscription').val('');

    $('#allTask').prepend('<div class="col-md-4 col-sm-6">\n' +
    '             <div id="taskList">\n' +
    '                 <div class="taskName"> <h3>'+ newTaskName +'</h3> </div>\n' +
    '                 <div class="taskDiscription"> <p>'+ newTaskDiscription +'</p></div>\n' +
    '                 <div class="rowBtn">\n' +
    '                    <button id="edit">Edit</button>\n' +
    '                    <button id="done">Done</button>\n' +
    '                    <button id="remove">Remove</button>\n' +
    '                 </div>\n' +
    '             </div>\n' +
    '         </div>');


});


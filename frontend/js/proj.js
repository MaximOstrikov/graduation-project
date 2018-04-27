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
$('#addListBtn').on('click', (function() {
    var newTaskName = $('#addName').val(), newTaskDiscription = $('#addDiscription').val();
    $('#addName, #addDiscription').val('');

    $('#allTask').prepend('<div id="containerList" class="col-md-4 col-sm-6">\n' +
        '             <div id="taskList" class="activeTask">\n' +
        '                 <div class="taskName"> <h3>'+ newTaskName +'</h3> </div>\n' +
        '                 <div class="taskDiscription"> <p>'+ newTaskDiscription +'</p></div>\n' +
        '                 <div class="rowBtn">\n' +
        '                    <button id="edit">Edit</button>\n' +
        '                    <button id="done">Done</button>\n' +
        '                    <button id="remove" class="removeNotFinished">Remove</button>\n' +
        '                 </div>\n' +
        '             </div>\n' +
        '         </div>');


}));

// done task
$(document).on('click', '#done', (function () {
   $(this).closest('#taskList').addClass('doneTask').removeClass('activeClass');
    $(this).closest('#taskList').append('<div class="rowBtn">\n' +
        '                 <button id="remove" class="removeFinished"><h1>Remove</h1></button>\n' +
        '             </div>');
   $(this).closest('.rowBtn').remove();

}));

//remove task
$(document).on('click', '#remove', (function () {
    $(this).closest('#containerList').remove();
}));



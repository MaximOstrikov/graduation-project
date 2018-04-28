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

    // loading tasks
    $.ajax({
        url: 'http://localhost:9999/api/tasks',
        method: 'GET',
        success: function(response) {
            for (var i = 0; i<response.tasks.length; i++){
                (response.tasks[i].taskStatus === 'New') ? (taskChecker = 0) : (taskChecker = 1);
                (taskChecker === 0) ? (listStyle = 'activeTask',
                    $('#allTask').prepend('<div id="'+response.tasks[i].id +'" class="col-md-4 col-sm-6">\n' +
                    '             <div id="taskList" class="'+ listStyle +'">\n' +
                    '                 <div class="taskName"> <h3>'+response.tasks[i].title+'</h3> </div>\n' +
                    '                 <div class="taskDescription"> <p>'+response.tasks[i].description+'</p></div>\n' +
                    '                 <div class="rowBtn">\n' +
                    '                    <button id="edit">Edit</button>\n' +
                    '                    <button id="done">Done</button>\n' +
                    '                    <button id="remove" class="removeNotFinished">Remove</button>\n' +
                    '                 </div>\n' +
                    '             </div>\n' +
                    '         </div>')) : (listStyle = 'doneTask',
                    $('#allTask').prepend('<div id="'+response.tasks[i].id +'" class="col-md-4 col-sm-6">\n' +
                    '             <div id="taskList" class="'+ listStyle +'">\n' +
                    '                 <div class="taskName"> <h3>'+response.tasks[i].title+'</h3> </div>\n' +
                    '                 <div class="taskDescription"> <p>'+response.tasks[i].description+'</p></div>\n' +
                    '                 <div class="rowBtn">\n' +
                    '                    <button id="remove" class="removeFinished"><h1>Remove</h1></button>\n' +
                    '                </div>\n' +
                    '             </div>\n' +
                    '         </div>'));
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});

// add new task
$('#addListBtn').on('click', (function() {
    var newTaskName = $('#addName').val(), newTaskDescription = $('#addDescription').val();
    $('#addName, #addDescription').val('');

    $.ajax({
        url: 'http://localhost:9999/api/tasks',
        method: 'POST',
        data: {
            title: newTaskName,
            description: newTaskDescription
        },
        success: function(response) {
            console.log(response.task);
            $('#allTask').prepend('<div id="'+ response.task.id + '" class="col-md-4 col-sm-6">\n' +
                '             <div id="taskList" class="activeTask">\n' +
                '                 <div class="taskName"> <h3>'+ newTaskName +'</h3> </div>\n' +
                '                 <div class="taskDescription"> <p>'+ newTaskDescription +'</p></div>\n' +
                '                 <div class="rowBtn">\n' +
                '                    <button id="edit">Edit</button>\n' +
                '                    <button id="done">Done</button>\n' +
                '                    <button id="remove" class="removeNotFinished">Remove</button>\n' +
                '                 </div>\n' +
                '             </div>\n' +
                '         </div>');
        },
        error: function(error) {
            console.log(error);
        }
    });
}));

// done task
$(document).on('click', '#done', (function () {
    var taskTitle, taskDescription;
    var elementId = $(this).parent().parent().parent()[0].id;
    $.ajax({
        url: 'http://localhost:9999/api/tasks/' + elementId,
        method: 'GET',
        success: function(response) {
            taskTitle = response.task[title];
            taskDescription = response.task.description;
        },
        error: function(error) {
            console.log(error);
        }
    });
    console.log(taskTitle);
    $.ajax({
        url: 'http://localhost:9999/api/tasks/' + elementId,
        method: 'PUT',
        data: {
            title: taskTitle,
            description: taskDescription,
            taskStatus: 'Done'
        },
    success: function(response) {
        console.log(response);
    },
    error: function(error) {
        console.log(error);
    }
    });
    $(this).closest('#taskList').addClass('doneTask').removeClass('activeClass');
    $(this).closest('#taskList').append('<div class="rowBtn">\n' +
         '                 <button id="remove" class="removeFinished"><h1>Remove</h1></button>\n' +
         '             </div>');
    $(this).closest('.rowBtn').remove();
}));

//remove task
$(document).on('click', '#remove', (function () {
    var elementId = $(this).parent().parent().parent()[0].id;
    $(this).parent().parent().parent().remove();
    $.ajax({
        url: 'http://localhost:9999/api/tasks/' + elementId ,
        method: 'DELETE',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
 })
);

// добавить возможность редактирования
// пофиксить ajax done
// сделать ajax при редактировании
// пофиксить input и areatext --- trim() обрезает пробелы с двух сторон
// добавить подтверждение удаления задачи
// сделать аккаунты пользователей*
var editChecker = 0;
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

    $('#addListBtn').attr('disabled',true);

    $('#addName').keyup(function(){
        if ($(this).val().trim().length !== 0) {
            $('#addListBtn').attr('disabled', false);
        } else {
            $('#addListBtn').attr('disabled', true);
        }
    });

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
    var newTaskName = $('#addName').val().trim(), newTaskDescription = $('#addDescription').val().trim();
    if (newTaskDescription === '') {
        newTaskDescription = 'No description'
    }
    $('#addName').val('');
    $('#addDescription').val('');

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

// edit task
$(document).on('click', '#edit', (function () {
    var elementId = $(this).parent().parent().parent()[0].id;
    var nameText = $(this).parent().siblings('.taskName').children().text();
    var descriptionText = $(this).parent().siblings('.taskDescription').children().text();

    $(this).parent().siblings('.taskName').append('<input type="text" id="addName">');
    $(this).closest('.col-md-4').append('<div id="addList">\n' +
        '                 <div class="taskName"> <input type="text" id="editName" placeholder="Task Name" value="' + nameText + '"</div>\n' +
        '                 <div class="taskDescription"> <textarea  id="editDescription" cols="30" rows="10" placeholder="Description">' + descriptionText + '</textarea> </div>\n' +
        '                 <button id="save">\n' +
        '                     <h1>Save</h1>\n' +
        '                 </button>\n' +
        '             </div>');
    $(this).closest('#taskList').remove();
    $(this).remove();

    $(document).on('click', '#save', (function () {
        var editedNameText = $(this).siblings('#editName').val();
        var editedDescriptionText = $(this).siblings('.taskDescription').children('#editDescription').val();
        if (editedDescriptionText === '') {
            editedDescriptionText = 'No description'
        }

        $(this).closest('.col-md-4').append('<div id="taskList" class="activeTask">\n' +
            '                                 <div class="taskName"> <h3>' + editedNameText + '</h3> </div>\n' +
            '                                 <div class="taskDescription"> <p>'+ editedDescriptionText +'</p></div>\n' +
            '                                 <div class="rowBtn">\n' +
            '                                    <button id="edit">Edit</button>\n' +
            '                                    <button id="done">Done</button>\n' +
            '                                    <button id="remove" class="removeNotFinished">Remove</button>\n' +
            '                                 </div> \n' +
            '                             </div> \n' +
            '                         </div>');
        $(this).closest('#addList').remove();

        $.ajax({
            url: 'http://localhost:9999/api/tasks/' + elementId,
            method: 'PUT',
            data: {
                title: editedNameText,
                description: editedDescriptionText,
                taskStatus: 'New'
    },
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });

    }))
}));

// done task
$(document).on('click', '#done', (function () {
    var elementId = $(this).parent().parent().parent()[0].id;
    $.ajax({
        url: 'http://localhost:9999/api/tasks/' + elementId,
        method: 'PUT',
        data: {
            title: $(this).closest('#taskList').children('.taskName').children('h3').text(),
            description: $(this).closest('#taskList').children('.taskDescription').children('p').text(),
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

// при добавлении задачи поля заголовка и описания отчистить
// задизэйблить кнопки
// добавить неизменяемый порядок листов
// пофиксить input trim() обрезает пробелы с двух сторон
// добавить подтверждение удаления задачи
// оформить ошибки
// при отключенном сервере добавить мерцающий error
// сделать аккаунты пользователей*
// подумать как записывать данные на сервер**
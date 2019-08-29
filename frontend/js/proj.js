var errorChecker = 0;
var doneTaskQuantity = 0;
var allTaskQuantity = 0;
// greeting
function greeting() {
    setTimeout(function () {
        $('#welcome').animate({opacity: 1}, {duration: 1000}).fadeOut(2000, function () {
            $(this).remove()
        });
    }, 300);
    setTimeout(function () {
        if (errorChecker === 0) {
            sliderBackgroundBody();
            setTimeout(function() {
                $('#task').animate({opacity: 1}, {duration: 1000}).removeClass('displayNone');
                $('#taskCounter').animate({opacity: 1}, {duration: 1000}).removeClass('displayNone')
            }, 1000)
        } else {
            setTimeout(function() {
                errorMessage();
            }, 1000)
        }
    }, 2600)
}

// background slider
function sliderBackgroundBody() {
        window.currBg = window.currBg + 1;
        if (!window.currBg || window.currBg > 8) window.currBg = 1;
        $('#bgimg').fadeOut(1000, function () {
            $(this).css('background-image', 'url("./img/background/' + window.currBg + '.jpg")').fadeIn(1000);
        });
        setTimeout(sliderBackgroundBody, 10000);
}

// error meaasage
function errorMessage() {
    $('#lostConnection').animate({opacity: 1}, {duration: 1000}).fadeOut(2000).fadeIn(2000);
    errorMessage()
}

$(document).ready(function () {
    greeting();

    $('#addListBtn').attr('disabled',true);

    $('#addName').keyup(function(){
        if ($(this).val().trim().length !== 0) {
            $('#addListBtn').attr('disabled', false).addClass('addBtnActive').removeClass('addBtnDisabled');
        } else {
            $('#addListBtn').attr('disabled', true).addClass('addBtnDisabled').removeClass('addBtnActive');
        }
    });

    // loading tasks
    loadingTask()
});
function counter() {
    if (allTaskQuantity === 0) {
        $('#taskCounter').children().text('There are no planned items yet');
    } else {
        $('#taskCounter').children().text('There are '+ doneTaskQuantity +' of '+ allTaskQuantity +' items done');
    }
}
function loadingTask() {
    $.ajax({
        url: 'http://localhost:9999/api/tasks',
        method: 'GET',
        success: function (response) {
            allTaskQuantity = response.tasks.length;
            for (var i = 0; i < response.tasks.length; i++) {
                (response.tasks[i].taskStatus === 'New') ? (taskChecker = 0) : (taskChecker = 1);
                (taskChecker === 0) ? (listStyle = 'activeTask',
                    $('#allTask').prepend('<div id="' + response.tasks[i].id + '" class="col-md-4 col-sm-6">\n' +
                        '             <div id="taskList" class="' + listStyle + '">\n' +
                        '                 <div class="taskName"> <h3>' + response.tasks[i].title + '</h3> </div>\n' +
                        '                 <div class="taskDescription"> <p>' + response.tasks[i].description + '</p></div>\n' +
                        '                 <div class="rowBtn">\n' +
                        '                    <button id="edit">Edit</button>\n' +
                        '                    <button id="done">Done</button>\n' +
                        '                    <button id="remove" class="removeNotFinished">Remove</button>\n' +
                        '                 </div>\n' +
                        '             </div>\n' +
                        '         </div>')) : (doneTaskQuantity++, listStyle = 'doneTask',
                    $('#allTask').prepend('<div id="' + response.tasks[i].id + '" class="col-md-4 col-sm-6">\n' +
                        '             <div id="taskList" class="' + listStyle + '">\n' +
                        '                 <div class="taskName"> <h3>' + response.tasks[i].title + '</h3> </div>\n' +
                        '                 <div class="taskDescription"> <p>' + response.tasks[i].description + '</p></div>\n' +
                        '                 <div class="rowBtn">\n' +
                        '                    <button id="remove" class="removeFinished"><h1>Remove</h1></button>\n' +
                        '                </div>\n' +
                        '             </div>\n' +
                        '         </div>'))
            }
            counter();
        },
        error: function (error) {
            console.log(error);
            errorChecker++;
        }
    });
}
// add new task
$('#addListBtn').on('click', (function() {
    var newTaskName = $('#addName').val().trim(), newTaskDescription = $('#addDescription').val().trim();
    if (newTaskDescription === '') {
        newTaskDescription = 'No description'
    }
    $('#addName').val('');
    $('#addDescription').val('');
    $('#addName').trigger('keyup');
    allTaskQuantity++
    counter();

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
    var nameText = $(this).parent().siblings('.taskName').children().text();
    var descriptionText = $(this).parent().siblings('.taskDescription').children().text();
    $(this).closest('.col-md-4').append('<div id="addList">\n' +
        '                 <div class="taskName"> <input type="text" id="editName" placeholder="Task Name" value="' + nameText + '"</div>\n' +
        '                 <div class="taskDescription"> <textarea  id="editDescription" cols="30" rows="10" placeholder="Description">' + descriptionText + '</textarea> </div>\n' +
        '                 <button id="save" class="saveBtnActive">\n' +
        '                     <h1>Save</h1>\n' +
        '                 </button>\n' +
        '             </div>');
    $(this).closest('#taskList').remove();

    $("#editName").on("keyup", function () {
        if ($(this).val() != "") {
            $("#save").attr('disabled', false).removeClass('saveBtnDisabled').addClass('saveBtnActive');
        } else {
            $("#save").attr('disabled', true).removeClass('saveBtnActive').addClass('saveBtnDisabled');
        }
    });

}));

$(document).on('click', '#save', (function () {
    var elementId = $(this).parent().parent().parent()[0].id;
    var editedNameText = $(this).siblings().val();
    var editedDescriptionText = $(this).siblings('.taskDescription').children().val();
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
}));

// done task
$(document).on('click', '#done', (function () {
    var elementId = $(this).parent().parent().parent()[0].id;
    doneTaskQuantity++
    counter();
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

        if (confirm('Are you sure you want to delete the task?')) {
            var elementId = $(this).parent().parent().parent()[0].id, taskStat = 0;

                $.ajax({
                    url: 'http://localhost:9999/api/tasks',
                    method: 'GET',
                    success: function(response) {
                        for (var i = 0; i < response.tasks.length; i++) {
                            if (response.tasks[i].id === elementId) {
                                if (response.tasks[i].taskStatus == "Done") {
                                    taskStat = 1
                                } else {
                                    taskStat = 0
                                }
                            }
                        }
                        if (taskStat == 0) {
                            allTaskQuantity--
                        } else {
                            allTaskQuantity--;
                            doneTaskQuantity--;
                        }
                        counter();
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });

            $.ajax({
                url: 'http://localhost:9999/api/tasks/' + elementId,
                method: 'DELETE',
                success: function (response) {
                    console.log(response)
                },
                error: function (error) {
                    console.log(error);
                }
            });

             $(this).parent().parent().parent().remove();
        }
    })
);
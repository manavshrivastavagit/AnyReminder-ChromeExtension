function setNotification(isDeactivated) {
    options.style.color = isDeactivated
        ? 'graytext'
        : 'black';
    options.frequency.disabled = isDeactivated;
}

function setNotificationSound(isDeactivated) {
    soundOptions.style.color = isDeactivated
        ? 'graytext'
        : 'black';
    soundOptions.sound.disabled = isDeactivated;
}

function showAllCards() {
    chrome
        .storage
        .sync
        .get(['reminders'], function (items) {
            reminders = items.reminders;
            console.log('showAllCards');
            console.log(items.reminders);
            $("#allcards").empty();
            items.reminders && items.reminders.length > 0 && items
                .reminders
                .forEach(function (reminder, index) {
                    $("#allcards").prepend(
                        `<div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>` +
                        reminder.message + `</strong> <br><span class="badge badge-primary">` +
                        this.formatDate(new Date(reminder.startDate)) + `</span> <span class="badge badge-secondary">` +
                        this.formatAMPM(new Date('04/01/1991 ' + reminder.startTime)) + `</span>
                        
                    <button type="button" id="` + index +
                        `" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>`
                    );
                });

            $('#message').val(items.message);
            $('#sound').val(items.sound);

            if (items.sound == null || items.sound == "") {
                $('#sound').val("A Beautiful Drop");
            }

        });
    $('#message').focus();
}


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  console.log(date)
  console.log(minutes)
  // minutes = minutes && minutes < 10 ? '0'+minutes : '00';
  minutes = ('0'+minutes).slice(-2);
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}



function storeReminder(allreminders) {
    if (allreminders.length > 0) {
        // alert(JSON.stringify(allreminders))
        chrome
            .storage
            .sync
            .set({
                'reminders': allreminders

            }, function () {
                var opt = {
                    type: "basic",
                    title: "Changes Saved Successfully.",
                    message: "Changes Saved Successfully!",
                    iconUrl: "icon.png"
                }
                chrome
                    .notifications
                    .create('saveChanges', opt, function () {});
                // close();
                showAllCards();
            });
    } else {
        alert("allreminders Not Set");
    }
}

window.addEventListener('load', function () {

    // options.isActivated.checked = JSON.parse(localStorage.isActivated);
    // options.frequency.value = localStorage.frequency;
    soundOptions.isSoundActivated.checked = JSON.parse(
        localStorage.isSoundActivated
    );
    // soundOptions.isSoundActivated.checked =
    // JSON.parse(localStorage.isSoundActivated);

    if (!options.isActivated.checked) {
        setNotification(true);
    }

    options.isActivated.onchange = function () {
        localStorage.isActivated = options.isActivated.checked;
        setNotification(!options.isActivated.checked);
    };

    if (!soundOptions.isSoundActivated.checked) {
        setNotificationSound(true);
    }

    soundOptions.isSoundActivated.onchange = function () {
        setNotificationSound(!soundOptions.isSoundActivated.checked);
    };

    options.frequency.onchange = function () {
        localStorage.frequency = options.frequency.value;
    };

});

$(function () {

    $('[data-toggle="datepicker"]').datepicker({autoHide: true});
    $('.clockpicker').clockpicker();
    $('#message').focus();
    
    var today = new Date();
    $('#startDate').val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
    $('#startTime').val(today.getHours()+':'+today.getMinutes());

    showAllCards();

    $(document).on("click", ".close", function (event) {
        var index = $(this).attr('id');
        var txt;
        var r = confirm("Are you want to delete this Reminder?");
        if (r == true) {
            if (index > -1) {
                reminders.splice(index, 1);
            }

            // console.log(reminders);
            $(this)
                .parent()
                .parent()
                .remove();
            chrome
                .storage
                .sync
                .set({
                    'reminders': reminders

                }, function () {
                    var opt = {
                        type: "basic",
                        title: "Changes Saved Successfully.",
                        message: "Changes Saved Successfully!",
                        iconUrl: "icon.png"
                    }
                    chrome
                        .notifications
                        .create('saveChanges', opt, function () {});
                    showAllCards();
                });
        } else {
            return
        }

    });

    $('#playAudio').click(function () {
        var notificationSound = $('#sound').val();
        var sound = new Audio('audio/' + notificationSound + '.mp3');
        sound.play();
    });

    $('#save').click(function () {
        var startDate = $('#startDate').val();
        var startTime = $('#startTime').val();
        var message = $('#message').val();
        var sound = $('#sound').val();
        // validation
        if (message) {
            chrome
                .storage
                .sync
                .get(['reminders'], function (items) {
                    var allreminders = [];
                    allreminders = items.reminders || [];

                    allreminders.push(
                        {'message': message, 'startDate': startDate, 'startTime': startTime, 'sound': sound}
                    );
                   
                    storeReminder(allreminders);

                });
        } else {
            alert("Enter Reminder Message")
        }

        localStorage.isSoundActivated = $('#soundCheck').is(":checked");
    });

    $('#reset').click(function () {
        chrome
            .storage
            .sync
            .set({
                'total': 0
            }, function () {
                var opt = {
                    type: "basic",
                    title: "Total Reset",
                    message: "Total Number of Glasses Consumed Today has been reset to zero.",
                    iconUrl: "icon.png"
                }
                chrome
                    .notifications
                    .create('reset', opt, function () {});
            });
    });

});

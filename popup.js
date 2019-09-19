$(function () {
    // alert("sd")

    showAllCards();
    $(document).on("click", ".close", function (event) {
        var index = $(this).attr('id');
        var txt;
        var r = confirm("Are you want to delete this Reminder?");
        if (r == true) {
            if (index > -1) {
                reminders.splice(index, 1);
            }

            console.log(reminders);
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
            txt = "You pressed Cancel!";
            alert(txt)
        }

    });

});

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
}
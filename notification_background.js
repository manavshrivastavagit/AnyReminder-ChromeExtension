function audioNotification(notificationSound){
  console.log("notification Sound Passed : "+notificationSound);
  var sound = new Audio('audio/'+notificationSound+'.mp3');
  sound.play();
}
function showAllCards() {
  alert("all cards")
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
                      reminder.message + `</strong>` + index +
                      `
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




function show() {
  var time = /(..)(:..)/.exec(new Date());     
  var hour = time[1] % 12 || 12;              
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; 
  var message;
  var notificationSound;

  chrome.storage.sync.get(['message','sound'], function(items){
     message =items.message;
     notificationSound=items.sound;

     if(message == ""){
      message = 'Hi, Friend. Time to set a notes.'
    }
    
    new Notification(hour + time[2] + ' ' + period, {
      icon: 'icon.png',
      body: message
    });

    console.log("localStorage.isSoundActivated : "+JSON.parse(localStorage.isSoundActivated));

    if(JSON.parse(localStorage.isSoundActivated)){
      audioNotification(notificationSound);
    }
  });
}

if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   
  localStorage.frequency = 1;        
  localStorage.isInitialized = true; 
  localStorage.isSoundActivated = true;
  var notes=10;
  var message = "Hello Friend!";
  var sound = "Bubble";
  var total = 0;
  chrome.storage.sync.set({ 'notes' :notes, 'message':message, 'sound': sound, 'total' : total}, function(){
    var opt = {
        type: "basic",
        title: "Thank You for Downloading. We will keep you updated.",
        message : "Right click on the icon at the top and select options to change settings.",
        iconUrl:"icon.png"
    }
    chrome.notifications.create('saveChanges', opt, function(){});
  });

}

if (window.Notification) {
  // if (JSON.parse(localStorage.isActivated)) { show(); }
  var interval = 0; 
  setInterval(function() {
   console.log("timer");
   var currentDate = new Date();
  
   chrome
      .storage
      .sync
      .get(['reminders'], function (items) {
          reminders = items.reminders;
          console.log('showAllCards');
          console.log(items.reminders);
          items.reminders && items.reminders.length > 0 && items
              .reminders
              .forEach(function (reminder, index) {
                // console.log(reminder.startDate);
                var reminderTime = new Date('04/01/1991 ' + reminder.startTime  );
                // var reminderTime =  new Date(reminder.startTime );
                var reminderDate = new Date(reminder.startDate );
                var currentDate = new Date();
                
                if( (currentDate.getDate() == reminderDate.getDate()) 
                  && (currentDate.getMonth() == reminderDate.getMonth()) 
                  && (currentDate.getFullYear() == reminderDate.getFullYear()) ){
                    console.log("==");
                  console.log(reminderTime.getHours());
                  console.log(currentDate.getHours());
                  /* checking with reminder startTime */
                  if( (currentDate.getHours() == reminderTime.getHours()) && (currentDate.getMinutes() == reminderTime.getMinutes()) ){
                    console.log("time ==")
                    var opt = {
                      type: "basic",
                      title: reminder.message,
                      message : 'Any Reminder: ' + reminder.message,
                      iconUrl:"icon.png"
                  }
                  chrome.notifications.create( reminder.startTime, opt, function(){
                    var sound = new Audio('audio/' + reminder.sound + '.mp3');
                    sound.play();
                  });
                  }
                }else{
                  console.log("not =");
                //   var opt = {
                //     type: "basic",
                //     title: reminder.message,
                //     message : reminder.message,
                //     iconUrl:"icon.png"
                // }
                // chrome.notifications.create( opt, function(){
                //   var sound = new Audio('audio/' + reminder.sound + '.mp3');
                //   sound.play();
                // });
                  console.log(currentDate.getDate());
                  console.log(reminderDate.getDate());
                }
              });

          
      });
  }, 5000);
}

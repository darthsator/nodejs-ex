class RoomEvent {
  constructor(ts, tid){
    this.ts = ts;
    this.tid = tid;
  }
}


$(document).ready(function(){
  appendToConsole('doc ready');
  appendToConsole(new RoomEvent(Date.now(), 111));
});


function appendToConsole(myText) {
  	$('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'+myText);
}

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
  if(typeof myText === 'string') {
    $('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'+myText);
  }
  else if (typeof myText === 'object') {
    for (var key in myText) {
      if (!myText.hasOwnProperty(key)) continue;
      var obj = myText[key];
      if(obj.count>1) {
        for (var prop in obj) {
          $('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'+prop + " = " + obj[prop]);
        }
      } else {
        $('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'+key + " = " + obj);
      }
    }
  }
}

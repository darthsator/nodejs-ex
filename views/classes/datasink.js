//this should be a singleton...
class DataSink {
  constructor(sendInterval=3000,maxSendCount=100){
    if(!DataSink.instance) {
      this.endpointURL = "http://nodejs-mongo-persistent-darthsator-example.7e14.starter-us-west-2.openshiftapps.com/sendEvents";
      this.sendInterval = sendInterval;
      this.maxSendCount = maxSendCount;
      this.eventQueue = [];
      this.toSend = [];
      this.localSavedEvents = [];
      this.timerVal = setInterval(this.sendEvents.bind(this), this.sendInterval);
      this.sendBlock = false;
      DataSink.instance = this;
    }
    return DataSink.instance;
}
static getInstance() {
  return DataSink.instance;
}

set localEvents(evts) {
  this.localSavedEvents = evts;
}

get localEvents() {
  return this.localSavedEvents;
}

set blockSend(block) {
  this.sendBlock = block;
}
addEvent(evt) {
  this.eventQueue.push(evt);
  if (this.eventQueue.length > this.maxSendCount)
  {
    this.sendEvents();
  }
}

sendEvents() {
  this.toSend = this.eventQueue.slice();
  if(this.toSend.length>0) {
    $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify(this.toSend),
      url: this.endpointURL
    })
    .done(this.sentEvents.bind(this))
    .fail(this.sendFailed.bind(this));
  }
}

sentEvents() {
  appendToConsole('events successfully sent to server');
  this.eventQueue = this.eventQueue.filter(item => !(this.toSend.some(item2 => item.ts === item2.ts)));
  this.toSend.length=0;

};

sendFailed() {
  appendToConsole('cant send events, just store them locally...');
  this.localSavedEvents = this.localSavedEvents.concat(this.toSend);
  this.eventQueue = this.eventQueue.filter(item => !(this.toSend.some(item2 => item.ts === item2.ts)));
  this.toSend.length=0;

  // console.log(this.toSend);
};

}

const dataSink = new DataSink();
Object.seal(dataSink);

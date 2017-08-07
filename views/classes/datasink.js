//this should be a singleton...
class DataSink {
  constructor(sendInterval=3000,maxSendCount=100){
    if(!DataSink.instance) {
      this.endpointURL = "http://nodejs-mongo-persistent-darthsator-example.7e14.starter-us-west-2.openshiftapps.com/sendEvents";
      this.sendInterval = sendInterval;
      this.maxSendCount = maxSendCount;
      this.eventQueue = [];
      this.toSend = [];
      this.timerVal = setInterval(this.sendEvents.bind(this), this.sendInterval);
      this.blockSend = false;
      DataSink.instance = this;
    }
    return DataSink.instance;
}
static getInstance(){
  return new DataSink();
}
addEvent(evt) {
  this.eventQueue.push(evt);
  if (this.eventQueue.length > this.maxSendCount)
  {
    this.sendEvents();
  }
}

sendEvents() {
  if(!this.blockSend) {
    this.blockSend = true;
    this.toSend = this.eventQueue.slice();
    if(this.toSend.length>0) {
      $.ajax({
        type: "POST",
        dataType: "json",
        data: toSend,
        url: this.endpointURL
      })
      .done(this.sentEvents)
      .fail(this.sendFailed);
    }
  }
}

sentEvents(){
  console.log('success');
  this.eventQueue = this.eventQueue.filter(item => !(arr2.some(item2 => item.name === item2.name)));
  this.toSend = [];
  this.blockSend=false;
};

sendFailed(){
  console.log('error');
  this.blockSend=false;
};

}

const dataSink = new DataSink();
Object.freeze(dataSink);

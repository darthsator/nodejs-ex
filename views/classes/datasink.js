//this should be a singleton...
class DataSink {
  constructor(sendInterval=3000,maxSendCount=100){
    if(!DataSink.instance) {
      this.endpointURL = "http://nodejs-mongo-persistent-darthsator-example.7e14.starter-us-west-2.openshiftapps.com/sendEvents";
      this.sendInterval = sendInterval;
      this.maxSendCount = maxSendCount;
      this.eventQueue = [];
      this.timerVal = setInterval(this.sendEvents.bind(this), this.sendInterval);
      DataSink.instance = this;
    }
    return DataSink.instance;
}
static getInstance(){
  return new DataSink();
}
addEvent(evt) {
  this.eventQueue.push(evt);
}

sendEvents(){
  if(this.eventQueue.length>0){
    $.ajax({
      dataType: "json",
      url: this.endpointURL,
      cache: false,
    })
    .done(this.sentEvents)
    .fail(this.sendFailed);
  }
}

sentEvents(){
  console.log('success');
};
sendFailed(){
  console.log('error');
};

}

const dataSink = new DataSink();
Object.freeze(dataSink);

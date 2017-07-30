class DataSink {
  constructor(endpointURL,sendInterval=15,maxSendCount=100){
    this.endpointURL = endpointURL;
    this.sendInterval = sendInterval;
    this.maxSendCount = maxSendCount;
    this.eventQueue = [];
  }
}

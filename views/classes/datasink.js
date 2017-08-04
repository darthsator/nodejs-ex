//this should be a singleton...
class DataSink {
  constructor(endpointURL,sendInterval=30,maxSendCount=100){
    if(!DataSink.instance) {
      this.endpointURL = endpointURL;
      this.sendInterval = sendInterval;
      this.maxSendCount = maxSendCount;
      this.eventQueue = [];
      DataSink.instance = this;
    }
    return DataSink.instance;
}

}

const dataSink = new DataSink();
Object.freeze(dataSink);

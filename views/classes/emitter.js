class Emitter {
  constructor(roomId, roomProds,emitInterval=2, active=false){
    this.emitterID = _emitterCount;
    _emitterCount++;
    this.room = roomId;
    this.rProds = roomProds;
    this.active = active;
    this.emitInterval = emitInterval;
    this.ivHolder = null;
  }
  set roomProducts(roomProds) {
    this.rProds = roomProds;
  }
  get roomProducts() {
    return this.rProds;
  }
  get isActive() {
    return this.active;
  }
  set isActive(active) {
    this.active = active;
    if(active) {
      this.ivHolder = setInterval(this.emit.bind(this), this.emitInterval*1000);
    } else {
      clearInterval(this.ivHolder);
    }
  }

  emit() {
    for (var i=0; i<this.roomProducts.length; i++) {
      DataSink.getInstance().addEvent(new TagEvent(Date.now(),this.roomProducts[i],this.room,this.emitterID));
    }
  }
}

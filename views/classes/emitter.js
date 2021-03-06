class Emitter {
  constructor(roomId, roomProds,emitInterval=2, active=false){
    this.emitterID = _emitterCount;
    _emitterCount++;
    this.room = roomId;
    this.rProds = roomProds;
    this.active = active;
    this.emitInterval = emitInterval;
    //Session shoould be a unique identifier...
    this.session = 0;
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
    if(!this.active && active) {
      this.session = Date.now();
      this.ivHolder = setInterval(this.emit.bind(this), this.emitInterval*1000);
    } else if(this.active && !active){
      clearInterval(this.ivHolder);
    }
    this.active = active;
  }

  emit() {
    for (var i=0; i<this.roomProducts.length; i++) {
      DataSink.getInstance().addEvent(new TagEvent(Date.now(),this.roomProducts[i],this.room,this.emitterID, this.session));
    }
  }
}

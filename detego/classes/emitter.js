class Emitter {
  constructor(roomId, emitInterval=2, active=true){
    this.emitterID = _emitterCount;
    _emitterCount++;
    this.roomId = roomId;
    this.active = active;
  }
}

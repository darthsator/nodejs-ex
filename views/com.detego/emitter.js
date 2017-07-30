class Emitter {
  constructor(roomId, emitInterval=2){
    this.emitterID = _emitterCount;
    _emitterCount++;
    this.roomId = roomId;
  }
}

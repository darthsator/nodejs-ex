class Emitter {
  constructor(roomId){
    this.emitterID = _emitterCount;
    _emitterCount++;
    this.roomId = roomId;
  }
}

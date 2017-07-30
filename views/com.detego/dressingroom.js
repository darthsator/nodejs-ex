class DressingRoom{
  constructor(id, cap=3){
    this.id=id;
    this.cap=cap;
    this.emitter = new Emitter(id);
  }

  set capacity(cap){
    this.cap = cap;
  }
  
  get capacity() {
    return this.cap;
  }
}

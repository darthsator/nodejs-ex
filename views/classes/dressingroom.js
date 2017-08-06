class DressingRoom{
  constructor(id, cap=3){
    this.identifier=id;
    this.cap=cap;
    this.rproducts = [];
    this.emitter = new Emitter(id,this.rproducts);
  }
  set id(id) {
    this.identifier=id;
  }
  get id() {
    return this.identifier;
  }

  set capacity(cap){
    this.cap = cap;
  }

  get capacity() {
    return this.cap;
  }

  addProduct(p) {
    if(!this.roomproducts.includes(p)) {
      this.rproducts.push(p);
    }
    if(this.roomproducts.length>0) {
      this.emitter.isActive=true;
    }
  }

  removeProduct(p) {
    var index = this.rproducts.indexOf(p);
    if (index > -1) {
      this.rproducts.splice(index, 1);
    }
    if(this.roomproducts.length<1) {
      this.emitter.isActive=false;
    }
  }

  get roomproducts() {
    return this.rproducts;
  }
}

var dressrooms    = [],
    products      = [],
    _emitterCount = 0,
    baseUrl       = "http://nodejs-mongo-persistent-darthsator-example.7e14.starter-us-west-2.openshiftapps.com/";

$(document).ready(function() {
  appendToConsole('doc ready');
  createRooms();

  console.log(dressrooms);
  $.ajax({
    dataType: "json",
    url: baseUrl+"getAllProducts",
    cache: true,
    success: getProductsSuccessful
  });
  $("#conf_rooms").change(createRooms);
// console.log(dataSink);

});

function createRooms(event=null) {
  console.log(event);
  if(event) {
    var maxVal = $("#conf_rooms").attr('max'),
        minVal = $("#conf_rooms").attr('min');
    if(parseInt(event.target.value)>maxVal)
    {
      event.target.value = maxVal;
    } else if(parseInt(event.target.value)<minVal) {
      event.target.value = minVal;
    }
  }
  var numDressRooms = $("#conf_rooms").val();
  var roomString = "";
  for(var i=0; i<numDressRooms;i++)
  {
    var dr = new DressingRoom(i);
    dressrooms.push(dr);
    roomString += "<div id='room"+i+"' class='dressroom'>"
                  +"<div class='emitter'>"
                  +"</div>"
                  +"</div>";
  }
  $('#dressrooms').html(roomString);
}

function getProductsSuccessful(data) {
  // var products = JSON.parse(data);
  // console.log(typeof data);
  // console.log(data);
  data.forEach(function(product){
    if(!jQuery.isEmptyObject(product))
    {
      var pr = new Product(product.tag,product.size,product.color,product.name);
      products.push(pr);
    }
  });
  createProducts(null);
}

function createProducts(event=null) {
  var productString = "";
  products.forEach(function(product) {
    productString += "<div id='product"+product.tag+"' class='product'>"
                  +"<p>"
                  +product.name
                  +"</p>"
                  +"</div>";
  });
  $('#products').html(productString);
}

function appendToConsole(myText) {

  if(typeof myText === 'string') {
    $('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'
        +new Date().toTimeString().substr(0, 8)+": "+myText);
  }
  else if (typeof myText === 'object') {
    $('#myLittleConsole').html($('#myLittleConsole').html()+'<br>'+new Date().toTimeString().substr(0, 8)+":");
    for (var key in myText) {
      if (!myText.hasOwnProperty(key)) continue;
      var obj = myText[key];
      if(obj && obj.length>1) {
        for (var prop in obj) {
          $('#myLittleConsole').html($('#myLittleConsole').html()+'<br> '+prop + " = " + obj[prop]);
        }
      } else {
        $('#myLittleConsole').html($('#myLittleConsole').html()+'<br> '+key + " = " + obj);
      }
    }
  }
}

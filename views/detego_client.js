var dressrooms    = [],
    products      = [],
    _emitterCount = 0,
    baseUrl       = "http://nodejs-mongo-persistent-darthsator-example.7e14.starter-us-west-2.openshiftapps.com/";

$(document).ready(function() {
  appendToConsole('doc ready');
  createRooms();

  $.ajax({
    dataType: "json",
    url: baseUrl+"getAllProducts",
    cache: true,
  })
  .done(getProductsSuccessful)
  .fail(getProductsFailed);

  $("#conf_rooms").change(createRooms);


  // var data;
  //      var chart;
  //
  //       // Load the Visualization API and the piechart package.
  //       google.charts.load('current', {'packages':['corechart']});
  //
  //       // Set a callback to run when the Google Visualization API is loaded.
  //       google.charts.setOnLoadCallback(drawChart);
  //
  //       // Callback that creates and populates a data table,
  //       // instantiates the pie chart, passes in the data and
  //       // draws it.
  //       function drawChart() {
  //
  //         // Create our data table.
  //         var data = google.visualization.arrayToDataTable([
  //          ['Minute', 'Events'],
  //          ['2004',    400],
  //          ['2005',    460],
  //          ['2006',    1120],
  //          ['2007',    540]
  //        ]);
  //
  //         // Set chart options
  //         var options = {'title':'How Much Pizza I Ate Last Night',
  //                        'width':400,
  //                        'height':300};
  //
  //         // Instantiate and draw our chart, passing in some options.
  //         chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  //         google.visualization.events.addListener(chart, 'select', selectHandler);
  //         chart.draw(data, options);
  //       }
  //
  //       function selectHandler() {
  //         var selectedItem = chart.getSelection()[0];
  //         var value = data.getValue(selectedItem.row, 0);
  //         alert('The user selected ' + value);
  //       }




});

function createRooms(event=null) {
   $("#conf_rooms").prop('disabled', true);
  // console.log(event);
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
  var numDressRooms = parseInt($("#conf_rooms").val());
  var roomString = "";
  var roomsToAdd = [];
  if(numDressRooms>dressrooms.length) {
    var toAdd = numDressRooms - dressrooms.length;
    for(var i=0; i < toAdd; i++) {
      let max = 0;
      if(dressrooms.length>0) {
        max = Math.max.apply(
          Math,dressrooms.map(function(o){
            return o.id;
        }))+1;
      } else {
        max=i;
      }
      var dr = new DressingRoom(max);
      roomsToAdd.push(dr);
    }
  } else if (numDressRooms<dressrooms.length) {
    var toRem = dressrooms.length - numDressRooms;
    for(var i=0; i < toRem; i++) {
      var lastRoom = dressrooms.pop();
      lastRoom.roomproducts.forEach(function(p) {
        $('#products').append($('#'+p));
        return false;
      });
      $('#room'+lastRoom.id).remove();
    }
  }

  for(var i=0; i<roomsToAdd.length;i++)
  {
    var room = roomsToAdd[i];
    roomString += "<div id='room"+room.id+"' class='dressroom droptarget' ondrop='drop(event)' ondragover='allowDrop(event)'>"
                  + "<div class='emitter'>"
                  + "</div>"
                  +"</div>";
  }
  dressrooms.push.apply(dressrooms, roomsToAdd);
  $('#dressrooms').append(roomString);
  $("#conf_rooms").prop('disabled', false);
}

function getProductsFailed(data, textStatus, err) {
  appendToConsole('getting products failed '+textStatus);
  appendToConsole('setting up local products');
  products.push(new Product(1337,'XXXL','PINK','Testpants1'));
  products.push(new Product(1338,'XXXS','PONK','Testpants2'));
  products.push(new Product(1339,'XXXM','PANK','Testpants3'));
  products.push(new Product(1339,'XXXM','PUNK','Testpants4'));
  createProducts(null);
}

function getProductsSuccessful(data) {
  // var products = JSON.parse(data);
  // console.log(typeof data);
  // console.log(data);
  appendToConsole('loaded products from server');
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
    productString += "<div id='product"+product.tag+"' class='product' draggable='true'"
                  +"ondragstart='drag(event)'>"
                  + "<p>"
                  +   product.name
                  + "</p>"
                  +"</div>";
  });
  $('#products').html(productString);

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
  let evTarget = ev.target;
  while(evTarget.nodeName != "DIV") {
    evTarget = evTarget.parentNode;
    if(!evTarget.parentNode) {
      return;
    }
  }
  ev.dataTransfer.setData("parent", evTarget.parentNode.id.replace('room', ''));
  ev.dataTransfer.setData("text", evTarget.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var src = parseInt(ev.dataTransfer.getData("parent"));
    var dropZone = ev.target;
    while(!dropZone.className.includes("droptarget")) {
      dropZone = dropZone.parentNode;
      if(!dropZone.parentNode) {
        return;
      }
    }
    var roomId = dropZone.id.replace('room','');
    var capacityExceeded = false;

    dressrooms.some(function(el) {
      if(roomId == el.id) {
        if(el.roomproducts.length>=el.capacity) {
          appendToConsole('capacity of room '+el.id+' exceeded');
          capacityExceeded = true;
          return true;
        }
        el.addProduct(data);
      }
      if(el.id == src) {
        el.removeProduct(data);
      }
    });
    if(!capacityExceeded) {
      dropZone.appendChild(document.getElementById(data));
    }
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

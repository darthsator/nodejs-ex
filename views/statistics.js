
var lastCommand;
$(document).ready(function() {
  $.ajax({
    dataType: "json",
    url: baseUrl+"getAllMethods",
    cache: true,
  })
  .done(getMethodsSuccessful)
  .fail(getMethodsFailed);
});

function getMethodsSuccessful(data) {
  if(!jQuery.isEmptyObject(data)) {
    data.forEach(function(d){
      $('#stats_method').append("<option value='"+d.method+"'>"+d.method+"</option>");
    });

  }
}

function getMethodsFailed(data, textStatus, err) {
  appendToConsole('getting methods failed '+textStatus);
}

function loadStats(command){
  command = $('#stats_method').val();
  lastCommand = command;
  var com = {cmd:command};
  if(command == 'roomUtilisation') {
    com.rooms = dressrooms.map(function(r){return r.id});
  }
  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(com),
    url: baseUrl+'loadStats'
  })
  .done(function(data){
    createChart(data, command)
  })
  .fail(createChart);
  // https://stackoverflow.com/questions/40802071/pass-an-extra-argument-to-a-callback-function
  // https://stackoverflow.com/questions/21985201/pass-extra-parameters-to-jquery-ajax-promise-callback
}

function createChart(data) {
  if(!jQuery.isEmptyObject(data)) {
    google.charts.load('current', {'packages':['corechart']});
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
    var dataArray = [];
    var dataArray2 = [];
    switch(lastCommand) {
      case "sessionCount":
        dataArray.push(['Session', 'Events', 'Products']);
        data.sort(sortSessionCount);
        data.forEach(function(d){
          var date = new Date(d._id.session);
          dataArray.push([date.toISOString().substr(5,5)+" "+(date.toTimeString().substr(0, 8)), d.ne,d.ut]);
        });
      break;
      case "sessionsByHour":
        dataArray.push(['Hour', 'Visits']);
        data.sort(sortSessionHour);
        data.forEach(function(d){
          dataArray.push([d._id.hour, d.sessions]);
        });
      break;
        case "roomUtilisation":
        dataArray.push(['Room', 'Events']);
        dataArray2.push(['Room', 'Products']);
        data.sort(sortRoom);
        data.forEach(function(d){
          dataArray.push(["'"+d._id.room+"''", d.numEvents]);
          dataArray2.push(["'"+d._id.room+"''", d.uniqueTags]);
        });
      default:
      break;
    }

    // Callback that creates and populates a data table,
    // instantiates the chart, passes in the data and
    // draws it.
    function drawChart() {
      // Create our data table.
      var data = google.visualization.arrayToDataTable(dataArray);
      if(!jQuery.isEmptyObject(dataArray2)) {
        var data2 = google.visualization.arrayToDataTable(dataArray2);
        var options2 = {'title':$('#stats_method').val().toUpperCase()+" BY PRODUCT",
        legend: { position: 'bottom' }
      };
      }
      // Set chart options
      var options = {'title':$('#stats_method').val().toUpperCase(),
          legend: { position: 'bottom' }
      };

    // Instantiate and draw our chart, passing in some options.
    switch(lastCommand) {
      case "sessionCount":
        chart = new google.visualization.LineChart(document.getElementById('line_chart_div'));
      break;
      case "sessionsByHour":
        chart = new google.visualization.ColumnChart(document.getElementById('bar_chart_div'));
      break;
      case "roomUtilisation":
        chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
        chart2 = new google.visualization.PieChart(document.getElementById('pie2_chart_div'));
      default:
      break;
    }
    //  google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
    if(!jQuery.isEmptyObject(chart2)) {
     chart2.draw(data2, options2);
    }
    }
  } else {
    appendToConsole('received empty object');
  }
}

function sortRoom(a,b) {
  return parseInt(a._id.room - b._id.room);
}

function sortSessionHour(a,b) {
  return parseInt(a._id.hour - b._id.hour);
}

function sortSessionCount(a,b) {
  return parseInt(a._id.session - b._id.session);
}

// function selectHandler() {
//   var selectedItem = chart.getSelection()[0];
//   var value = data.getValue(selectedItem.row, 0);
//   alert('The user selected ' + value);
// }

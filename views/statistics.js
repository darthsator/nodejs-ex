

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
  var com = {cmd:command};
  if(command=='roomUtilisation') {
    com.rooms = dressrooms.map(function(r){r.id});
  }
  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(com),
    url: baseUrl+'loadStats'
  })
  .done(createChart)
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
     dataArray.push(['Session', 'Events', 'Products']);
     data.sort(function(a,b) {
       if(a.session) {
         return parseInt(a.session - b.session);
       } else {
         return parseInt(a._id.session - b._id.session);
       }
     });
     data.forEach(function(d){
       var date = new Date(d._id.session);
       dataArray.push([date.toISOString().substr(5,5)+" "+(date.toTimeString().substr(0, 8)), d.ne,d.ut]);
     });
     // Callback that creates and populates a data table,
     // instantiates the pie chart, passes in the data and
     // draws it.
     function drawChart() {
       // Create our data table.
       var data = google.visualization.arrayToDataTable(dataArray);

       // Set chart options
       var options = {'title':$('#stats_method').val(),
                    legend: { position: 'bottom' }
                    };

     // Instantiate and draw our chart, passing in some options.
       chart = new google.visualization.LineChart(document.getElementById('line_chart_div'));
      //  google.visualization.events.addListener(chart, 'select', selectHandler);
       chart.draw(data, options);
     }
  } else {
    appendToConsole('received empty object');
  }
}

// function selectHandler() {
//   var selectedItem = chart.getSelection()[0];
//   var value = data.getValue(selectedItem.row, 0);
//   alert('The user selected ' + value);
// }

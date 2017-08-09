

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
  if(!jQuery.isEmptyObject(data) {
    data.forEach(function(d){
      $('#statsMethods').append("<option value='"+d.method+"'>"+d.method+"</option>");
    });

  }
}

function getMethodsFailed(data, textStatus, err) {
  appendToConsole('getting methods failed '+textStatus);
}

function loadStats(command){
  command = $('#stats_method').val();
  var command = {cmd:command};
  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(command),
    url: baseUrl+'loadStats'
  })
  .done(createChart);
}

function createChart(data) {
  if(!jQuery.isEmptyObject(data)) {
     google.charts.load('current', {'packages':['corechart']});
     // Set a callback to run when the Google Visualization API is loaded.
     google.charts.setOnLoadCallback(drawChart);
     var dataArray = [];
     dataArray.push(['Session', 'Events']);
     data.sort(function(a,b) {
       return parseInt(a._id - b._id);
     });
     data.forEach(function(d){
       dataArray.push([new Date(d._id).toTimeString().substr(0, 8), d.numSessions]);
     });
     // Callback that creates and populates a data table,
     // instantiates the pie chart, passes in the data and
     // draws it.
     function drawChart() {
       // Create our data table.
       var data = google.visualization.arrayToDataTable(dataArray
        // ['2004',    400],
        // ['2005',    460],
        // ['2006',    1120],
        // ['2007',    540]
      );

       // Set chart options
       var options = {'title':$('#stats_method').val(),
                      'width':700,
                      'height':300,
                    legend: { position: 'bottom' }
                    };

     // Instantiate and draw our chart, passing in some options.
       chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      //  google.visualization.events.addListener(chart, 'select', selectHandler);
       chart.draw(data, options);
     }
  } else {
    appendToConsole('received empty object');
  }
   // function selectHandler() {
   //   var selectedItem = chart.getSelection()[0];
   //   var value = data.getValue(selectedItem.row, 0);
   //   alert('The user selected ' + value);
   // }
}



$(document).ready(function() {

});


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
   google.charts.load('current', {'packages':['corechart']});
   // Set a callback to run when the Google Visualization API is loaded.
   google.charts.setOnLoadCallback(drawChart);
   var dataArray = [];
   dataArray.push(['Session', 'Events']);
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
                    'width':400,
                    'height':300};

     // Instantiate and draw our chart, passing in some options.
     chart = new google.visualization.PieChart(document.getElementById('chart_div'));
     google.visualization.events.addListener(chart, 'select', selectHandler);
     chart.draw(data, options);
   }

   // function selectHandler() {
   //   var selectedItem = chart.getSelection()[0];
   //   var value = data.getValue(selectedItem.row, 0);
   //   alert('The user selected ' + value);
   // }
}

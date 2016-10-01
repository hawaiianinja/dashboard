// Import modules used by this module
import View from './View';
import data from './data';

// Declare and export this module
var EventLengthByOrganizer = new View('Event Length By Organizer', 'EventLengthByOrganizer.html');
export default EventLengthByOrganizer;

// Excude Immediately-Invoked Function Expressions (IIFE) to prevent creation of globally scoped variables
(function(){

    // Declare module scoped variables

    // Declare module scoped functions

    function drawLengthCharts(data) {

        // Define charts
        var charts = [
            { name: 'CG', id: 'CGLength', data: [] },
            { name: 'DCG-N', id: 'DCGNLength', data: [] },
            { name: 'DCG-S', id: 'DCGSLength', data: [] },
            { name: 'DCG-NG', id: 'DCGNGLength', data: [] },
            { name: 'DCG-AR', id: 'DCGARLength', data: [] },
            { name: 'COS', id: 'COSLength', data: [] },
            { name: 'G3', id: 'G3Length', data: [] }
        ];

        // Load chart data from data module
        for (var i = 0, l = charts.length; i < l; i++) {
            if (data.organizers.hasOwnProperty(charts[i].name)) {
                var organizer = data.organizers[charts[i].name];
                for (var key in organizer.attendees) {
                    if (organizer.attendees.hasOwnProperty(key)) {
                        var attendees = organizer.attendees[key];
                        charts[i].data.push([key, attendees.length]);
                    }
                }
            }
        }

        // Set chart options
        var options = {
            title: 'Next Quarter Outlook'
        };

        for (var i = 0, l = charts.length; i < l; i++) {
            // Get chart data
            var chartData = [];
            chartData.push(['Event', 'Count']);
            chartData = chartData.concat(charts[i].data);
            // Create chart data table
            var dataTable  = google.visualization.arrayToDataTable(chartData);
            // Create chart object
            var chartObject = new google.visualization.PieChart(document.getElementById(charts[i].id));
            // Draw chart
            chartObject.draw(dataTable, options);
        }

    }

    // Code to run before view is loaded (i.e. before $(document).ready function)
    EventLengthByOrganizer.beforeLoad = function () {
        console.log('beforeLoad');
    };

    // Code to run before view is loaded (i.e. after $(document).ready function)
    EventLengthByOrganizer.afterLoad = function () {
        console.log('afterLoad');
        var promise = data.load();
        $.when(promise).done(function (data) {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(function () { 
                drawLengthCharts(data);
            });
        });
    };

})();
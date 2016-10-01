// Import modules used by this module
import View from './View';
import data from './data';

// Declare and export this module
var Test = new View('Jordan Test', 'JordanTest.html');
export default Test;

// Excude Immediately-Invoked Function Expressions (IIFE) to prevent creation of globally scoped variables
(function(){

    // Declare module scoped variables

    // Declare module scoped functions
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
            title: 'Next Quarter Outlook'
        };

        var chart = new google.visualization.PieChart(document.getElementById('CG'));
        var chart2 = new google.visualization.PieChart(document.getElementById('DCGN'));
        var chart3 = new google.visualization.PieChart(document.getElementById('DCGS'));
        var chart4 = new google.visualization.PieChart(document.getElementById('DCGNG'));
        var chart5 = new google.visualization.PieChart(document.getElementById('DCGAR'));
        var chart6 = new google.visualization.PieChart(document.getElementById('COS'));
        var chart7 = new google.visualization.PieChart(document.getElementById('G3'));

        chart.draw(data, options);
        chart2.draw(data, options);
        chart3.draw(data, options);
        chart4.draw(data, options);
        chart5.draw(data, options);
        chart6.draw(data, options);
        chart7.draw(data, options);
    }

    // Code to run before view is loaded (i.e. before $(document).ready function)
    Test.beforeLoad = function (options) {
        console.log('beforeLoad');
        console.log(options);
    };

    

    // Code to run before view is loaded (i.e. after $(document).ready function)
    Test.afterLoad = function (options) {
        console.log('afterLoad');
        console.log(options);
        var promise = data.load();
        $.when(promise).done(function(data) {
            displayData(data);
        });
    };

})();
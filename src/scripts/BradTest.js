// Import modules used by this module
import View from './View';
import data from './data';
import util from './util';

// Declare and export this module
var Test = new View('Brad Test', 'BradTest.html');
export default Test;

// Excude Immediately-Invoked Function Expressions (IIFE) to prevent creation of globally scoped variables
(function(){

    // Declare module scoped variables

    // Declare module scoped functions
    var displayData = function(data) {

        console.log(data);

        var header = '<th>Organizer</th>' + 
            '<th>Attendees</th>' + 
            '<th>StartDateTime</th>' + 
            '<th>EndDateTime</th>' + 
            '<th>Length</th>';
        var rows = '';
        for (var i = 0, l = data.events.length; i < l; i++) {
            rows += '<tr>' +
                '<td>' + data.events[i].organizer + '</td>' +
                '<td>' + data.events[i].attendees + '</td>' +
                '<td>' + util.formatDateTime(data.events[i].startDateTime) + '</td>' +
                '<td>' + util.formatDateTime(data.events[i].endDateTime) + '</td>' +
                '<td>' + data.events[i].length + '</td>' +
                '</tr>';
        }
        $('#eventData').html('<table>' + header + rows + '</table>');

    };

    // Code to run before view is loaded (i.e. before $(document).ready function)
    Test.beforeLoad = function () {
        console.log('beforeLoad');
    };

    // Code to run before view is loaded (i.e. after $(document).ready function)
    Test.afterLoad = function () {        
        console.log('afterLoad');
        var promise = data.load();
        $.when(promise).done(function(data) {
            displayData(data);
        });
    };

})();
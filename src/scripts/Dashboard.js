// Import modules used by this module
import View from './View';
import util from './util';

// Declare and export this module
var Dashboard = new View('Dashboard', 'Dashboard.html');
export default Dashboard;

// Excude Immediately-Invoked Function Expressions (IIFE) to prevent creation of globally scoped variables
(function(){

    // Declare module scoped variables

    // Declare module scoped functions

    // Code to run before view is loaded (i.e. before $(document).ready function)
    Dashboard.beforeLoad = function (options) {
        console.log('beforeLoad');
        console.log(options);
        console.log(util.getCurrentDate());
    };

    // Code to run before view is loaded (i.e. after $(document).ready function)
    Dashboard.afterLoad = function (options) {
        console.log('afterLoad');
        console.log(options);
    };

})();
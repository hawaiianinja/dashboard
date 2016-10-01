﻿// Import modules used by this module
import View from './View';

// Declare and export this module
var Test = new View('Jordan Test', 'JordanTest.html');
export default Test;

// Excude Immediately-Invoked Function Expressions (IIFE) to prevent creation of globally scoped variables
(function(){

    // Declare module scoped variables

    // Declare module scoped functions

    // Code to run before view is loaded (i.e. before $(document).ready function)
    Test.beforeLoad = function (options) {
        console.log('beforeLoad');
        console.log(options);
    };

    // Code to run before view is loaded (i.e. after $(document).ready function)
    Test.afterLoad = function (options) {
        console.log('afterLoad');
        console.log(options);
    };

})();
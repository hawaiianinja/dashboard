export default {
    // Parse query string and return object of key value pairs
    parseQueryString: function (url) {
        var queryString = '';
        if (typeof url === 'undefined') {
            // Use url in address bar
            queryString = window.location.search.substr(1);
        } else {
            // Use url passed to function
            var queryStringStart = url.indexOf('?');
            if (queryStringStart >= 0) {
                var queryStringEnd = url.indexOf('#');
                if (queryStringEnd >= 0) {
                    queryString = url.substring(queryStringStart + 1, queryStringEnd);
                } else {
                    queryString = url.substr(queryStringStart + 1);
                }
            }
        }
        var queryArguments = {};
        var nameValuePairs = queryString.split('&');
        for (var i = 0; i < nameValuePairs.length; i++) {
            var nameValuePair = nameValuePairs[i].split('=');
            if (nameValuePair[0].length !== 0) {
                queryArguments[decodeURIComponent(nameValuePair[0])] = decodeURIComponent(nameValuePair[1] || '');
            }
        }
        return queryArguments;
    },
    isEven: function (n) {
        return !(n % 2);
    },
    isOdd: function (n) {
        return !!(n % 2);

    },
    getCurrentDate: function () {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    },
    formatDate: function (datetime) {
        if (typeof datetime === 'string') {
            datetime = datetime.replace('-', '/').replace(/-/g, '/'); // JavaScript uses / (not -) as date delimiter
            datetime = new Date(datetime);
        }
        if (isNaN(datetime)) {
            return '';
        } else {
            return (datetime.getMonth() + 1) + '/' + datetime.getDate() + '/' + datetime.getFullYear();
        }
    },
    formatDateTime: function (datetime) {
        if (typeof datetime === 'string') {
            datetime = datetime.replace('-', '/').replace(/-/g, '/'); // JavaScript uses / (not -) as date delimiter
            datetime = new Date(datetime);
        }
        if (isNaN(datetime)) {
            return '';
        } else {
            return (datetime.getMonth() + 1) + '/' + datetime.getDate() + '/' + datetime.getFullYear() + ' ' + datetime.getHours() + ':' + ('0' + datetime.getMinutes()).slice(-2);
        }
    },
    // Convert associative array into regular array
    objectToArray: function (obj) {
        var arr = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(obj[key]);
            }
        }
        return arr;
    },
    // Convert regular array to associative array
    // Note: Used when we want to search array values quickly
    arrayToObject: function (arr) {
        var obj = {};
        for (var i = 0, l = arr.length; i < l; i++) {
            obj[arr[i]] = i;
        }
        return obj;
    },
    getSelectOptionHtml: function (arr, options) {
        var html = '';
        options = options || {};
        if (options.addBlank) {
            html += '<option></option>';
        }
        if (options.addAll) {
            html += '<option value="">All</option>';
        }
        if (options.valueProperty && options.textProperty) {
            for (var i = 0, l = arr.length; i < l; i++) {
                html += '<option value="' + arr[i][options.valueProperty] + '"' + (arr[i][options.valueProperty] === options.selectedValue ? ' selected' : '') + '>' + arr[i][options.textProperty] + '</option>';
            }
        } else {
            for (var i = 0, l = arr.length; i < l; i++) {
                html += '<option value="' + arr[i] + '"' + (arr[i] === options.selectedValue ? ' selected' : '') + '>' + arr[i] + '</option>';
            }
        }
        return html;
    }
};
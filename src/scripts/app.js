import router from './router';

import Dashboard from './Dashboard';
import PageNotFound from './PageNotFound';
import Test from './Test';

(function(){

    var views = {};
    views.Dashboard = Dashboard;
    views.PageNotFound = PageNotFound;
    views.Test = Test;

    // View load function
    var loadView = function(name, options) {
        if (views.hasOwnProperty(name)) {
            views[name].load(options);
        } else {
            views.PageNotFound.load();
        }
    };

    $(document).ready(function () {

        // Initialize and configure router
        router
        .add(/(.+)(\+.*)/, function () {
            var options = {};
            var nameValuePairs = arguments[1].substr(1).split('&');
            for (var i = 0; i < nameValuePairs.length; i++) {
                var nameValuePair = nameValuePairs[i].split('=');
                if (nameValuePair[0].length !== 0) {
                    options[decodeURIComponent(nameValuePair[0])] = decodeURIComponent(nameValuePair[1] || '');
                }
            }
            loadView(arguments[0], options);
        })
        .add(/(.+)/, function () {
            loadView(arguments[0]);
        })
        .add(function () {
            router.navigate('Dashboard');
        });
        router.listen();

        // Add hash based navigation to quick launch menu to prevent re-download of single page application
        // Note: SharePoint automatically removes hashes added to quick launch URLs to support  it's minimal download strategy
        var viewKeysByTitle = {};
        for (var key in views) {
            if (views.hasOwnProperty(key)){
                var view = views[key];
                viewKeysByTitle[view.title] = key;
            }
        }

        // Initialize global error handler for ajax Errors
        $(document).ajaxError(function() {
            // Initialize new user session
            // Note: We delete session cookies and refresh current page to trigger new session.
            // Depending on web server and web application setup, user will establish a new
            // session and reopen current page or will redirected to an entry point such
            // as a homepage, login page, or acceptable use page.
            // Note: We may need to manually delete web server or web proxy session cookies to
            // prevent use from being redirected to the URL last request by ajax.
            //document.cookie = 'LastMRH_Session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=' + document.domain + '; path=' + '/';
            //document.cookie = 'MRHSession=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=' + document.domain + '; path=' + '/';
            window.location.reload();
        });

    });

})();
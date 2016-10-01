export default {
    // Router based on the following article:
    // http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
    routes: [],
    getFragment: function () {
        var fragment = '';
        var match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
        return this.clearSlashes(fragment);
    },
    clearSlashes: function (path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function (re, handler) {
        if (typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({ re: re, handler: handler });
        return this;
    },
    remove: function (param) {
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if (route.re.toString() === param.toString() || route.handler === param) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    },
    flush: function () {
        this.routes = [];
        this.mode = null;
        return this;
    },
    check: function (fragment) {
        var _fragment = fragment || this.getFragment();
        for (var i = 0; i < this.routes.length; i++) {
            var match = _fragment.match(this.routes[i].re);
            if (match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }
        }
        return this;
    },
    listen: function () {
        var self = this;
        var currentFragment;
        var fn = function () {
            var fragment = self.getFragment();
            if (currentFragment !== fragment) {
                currentFragment = fragment;
                self.check(currentFragment);
            }
        };
        clearInterval(self.interval);
        self.interval = setInterval(fn, 50);
        return this;
    },
    navigate: function (path) {
        path = path ? path : '';
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        return this;
    }
};
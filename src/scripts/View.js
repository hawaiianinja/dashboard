var View = function (title, fileName) {
    this.title = title;
    this.fileName = fileName;
};
export default View;

(function(){

    View.prototype.hide = function (showViewLoading) {
        $('#view').hide();
        if (showViewLoading) {
            $('#viewLoading').show();
        }
    };
    View.prototype.show = function () {
        $('#viewLoading').hide();
        $('#view').show();
    };
    View.prototype.load = function (options) {

        var _this = this;

        _this.loading = $.Deferred();

        // Show view by default but allow this to be overridden during the beforeLoad and afterLoad events
        $('#viewLoading').hide();
        $('#view').show();

        // Trigger beforeLoad event
        if (_this.hasOwnProperty('beforeLoad')) {
            _this.beforeLoad(options);
        }

        $(document).ready(function () {
            // Load view
            document.title = _this.title;
            if (_this.html) {
                $('#view').html(_this.html);
                _this.loading.resolve();
            } else {
                $.get('views/' + _this.fileName, function (data) {
                    //_this.html = data;
                    //$('#view').html(_this.html);
                    console.log(data);
                    $('#view').html(data);
                    _this.loading.resolve();
                });
            }
        });

        _this.loading.done(function () {
            // Set view title in loaded view if needed
            $('.view-title').text(_this.title);
            // Trigger afterLoad event
            if (_this.hasOwnProperty('afterLoad')) {
                _this.afterLoad(options);
            }
        });

    };

})();
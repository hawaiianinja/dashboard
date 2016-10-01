// Import modules used by this module
//import util from './util';

// Declare and export this module
var data = {};
export default data;

(function(){

    var _data = {
        filePaths: [
            '/data/CG.json',
            '/data/COS.json',
            '/data/DCGAR.json',
            '/data/DCGN.json',
            '/data/DCGNG.json',
            '/data/DCGS.json',
            '/data/G3.json'
        ],
        filePromises: [],
        events: [],
        count: 0,
        length: 0
    };

    data.load = function () {

        var deferred = $.Deferred();

        setTimeout(function () {

            for (var i = 0, l = _data.filePaths.length; i < l; i++) {

                var promise = $.getJSON(_data.filePaths[i]);

                promise.done(function (jsonData) {
                    // Parse jsonData for desired event data
                    for (var i = 0, l = jsonData.items.length; i < l; i++) {
                        var startDateTime = new Date(jsonData.items[i].start.dateTime);
                        var endDateTime = new Date(jsonData.items[i].end.dateTime);
                        var length =  Math.abs(endDateTime - startDateTime) / 36e5;
                        var event = {
                            'organizer': jsonData.items[i].organizer.displayName,
                            'attendees': jsonData.items[i].summary,
                            'startDateTime': new Date(startDateTime),
                            'endDateTime': new Date(endDateTime),
                            'length': length
                        };
                        _data.events.push(event);
                        _data.length += event.length;
                        _data.count += 1;
                    }
                });

                _data.filePromises.push(promise);
                
            }

            $.when.apply($, _data.filePromises).done(function() {

                // Process event data grouped by field
                if(!_data.hasOwnProperty('organizers')){
                    _data.organizers = {};
                }
                for (var i = 0, l = _data.events.length; i < l; i++) {
                    if(!_data.organizers.hasOwnProperty(_data.events[i].organizer)){
                        _data.organizers[_data.events[i].organizer] = {};
                        _data.organizers[_data.events[i].organizer].events = [];
                        _data.organizers[_data.events[i].organizer].length = 0;
                        _data.organizers[_data.events[i].organizer].count = 0;
                    }
                    _data.organizers[_data.events[i].organizer].events.push(_data.events[i]); 
                    _data.organizers[_data.events[i].organizer].length += _data.events[i].length;
                    _data.organizers[_data.events[i].organizer].count += 1;

                    // Process event data grouped by organizers and attendees fields
                    if(!_data.organizers[_data.events[i].organizer].hasOwnProperty('attendees')){
                        _data.organizers[_data.events[i].organizer].attendees = {};
                    }
                    if(!_data.organizers[_data.events[i].organizer].attendees.hasOwnProperty(_data.events[i].attendees)){
                        _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees] = {};
                        _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].events = [];
                        _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].length = 0;
                        _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].count = 0;
                    }
                    _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].events.push(_data.events[i]);
                    _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].length += _data.events[i].length;
                    _data.organizers[_data.events[i].organizer].attendees[_data.events[i].attendees].count += 1;
                
                }

                // Process event data grouped by attendees field
                if(!_data.hasOwnProperty('attendees')){
                    _data.attendees = {};
                }
                for (var i = 0, l = _data.events.length; i < l; i++) {
                    if(!_data.attendees.hasOwnProperty(_data.events[i].attendees)){
                        _data.attendees[_data.events[i].attendees] = {};
                        _data.attendees[_data.events[i].attendees].events = [];
                        _data.attendees[_data.events[i].attendees].length = 0;
                        _data.attendees[_data.events[i].attendees].count = 0;
                    }
                    _data.attendees[_data.events[i].attendees].events.push(_data.events[i]);
                    _data.attendees[_data.events[i].attendees].length += _data.events[i].length;
                    _data.attendees[_data.events[i].attendees].count += 1;
                }

                deferred.resolve(_data);

            });

        }, 0);

        return deferred;

    };

})();
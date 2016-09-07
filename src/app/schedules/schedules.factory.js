(function () {
    'use strict';

    angular
    .module('app')
    .factory('schedules', schedules);

    /** @ngInject */
    function schedules($q, $http, toastr, lodash, Restangular, APP_CONFIG) {

        var service = {
            dows: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            validation: validation,
            event: event,
            create: create,
            createEvent: createEvent
        };

        return service;

        function validation(event) {
            if(event.startDay < 1) return true;
            if(event.endDay < 1) return true;
            if(!event.startTime) return true;
            if(!event.endTime) return true;
            return false;
        }

        function event(event, events, cb) {

            events.push({
                action_type: 'start',
                dow: lodash.indexOf(service.dows, event.startDay),
                hours: moment(event.startTime).format('HH'),
                minutes: moment(event.startTime).format('mm')
            });

            events.push({
                action_type: 'stop',
                dow: lodash.indexOf(service.dows, event.endDay),
                hours: moment(event.endTime).format('HH'),
                minutes: moment(event.endTime).format('mm')
            });

            return cb(events);
        }

        function createEvent(id, event) {
            var deferred = $q.defer();

            $http.post(APP_CONFIG.API_URL + '/schedules/{id}/events'.replace('{id}', id), event)
            .then(eventSuccess).catch(eventError);

            function eventSuccess(res) {
                deferred.resolve(res);
            }

            function eventError(err) {
                toastr.error(JSON.stringify(err), 'Create event schedule error');
                deferred.reject(err);
            }
            return deferred.promise;
        }

        function create(schedule) {
            var deferred = $q.defer();

            Restangular.all('schedules').post({
                name: schedule.name,
                description: schedule.description || ''
            }).then(createSuccess).catch(createError);

            function createSuccess(res) {
                var promises = [];
                lodash.each(schedule.events, iterate);

                function iterate(e) {
                    promises.push(service.createEvent(res.data.id, e));
                }

                $q.all(promises).then(eventsSuccess).catch(eventsError);

                function eventsSuccess(events) {
                    res.data.events = lodash.flatten(events);
                    deferred.resolve(res.data);
                }

                function eventsError(err) {
                    toastr.error(JSON.stringify(err), 'Create events error');
                    deferred.reject(err);
                }
            }

            function createError(err) {
                toastr.error(JSON.stringify(err), 'Create schedule error');
                deferred.reject(err);
            }

            return deferred.promise;
        }




    }
})();

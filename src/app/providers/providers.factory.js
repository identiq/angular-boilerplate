(function () {
    'use strict';

    angular
    .module('app')
    .factory('providers', providers);

    /** @ngInject */
    function providers($q, $http, toastr, $log, APP_CONFIG) {

        var service = {
            providers: [],
            options: [],
            all: all,
            providersOptions: providersOptions
        };

        return service;

        function all() {

            var deferred = $q.defer();

            if(service.providers.length) return deferred.resolve(service.providers);

            $http.get(APP_CONFIG.API_URL + '/providers.json')
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {

                service.providers = res.data;

                deferred.resolve({
                    data: res.data,
                    meta: JSON.parse(res.headers('X-Pagination'))
                });
            }

            function allError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;

        }

        function providersOptions() {
            var deferred = $q.defer();

            if (service.options.length) return deferred.resolve(service.options);

            $http({
                url: APP_CONFIG.API_URL + '/providers.json',
                method: 'OPTIONS'
            })
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {
                service.options = res.data;
                deferred.resolve(res.data);
            }

            function allError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }


    }
})();

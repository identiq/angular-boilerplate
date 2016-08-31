(function () {
    'use strict';

    angular
    .module('app')
    .factory('requests', requests);

    /** @ngInject */
    function requests($q, $http, toastr, $log, APP_CONFIG) {

        var service = {
            page: page
        };

        return service;

        function page(page) {
            page = page || 1;

            var deferred = $q.defer();

            $http.get(APP_CONFIG.API_URL + '/provision_requests.json', {
                params: {
                    page: page
                }
            })
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {
                $log.debug(res);

                deferred.resolve({
                    data: res.data,
                    meta: JSON.parse(res.headers('X-Pagination'))
                });
            }

            function allError(err) {
                $log.debug(err);
                toastr.error(JSON.stringify(err),'Error');
                deferred.reject(err);
            }

            return deferred.promise;

        }


    }
})();

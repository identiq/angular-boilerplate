(function () {
    'use strict';

    angular
    .module('app')
    .factory('requests', requests);

    /** @ngInject */
    function requests($q, $http, toastr, $log, APP_CONFIG) {

        var service = {
            page: page,
            approve: approve,
            deny: deny
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
                toastr.error(JSON.stringify(err), 'Error');
                deferred.reject(err);
            }

            return deferred.promise;

        }

        function approve(id, reason) {

            reason = reason || '';

            var deferred = $q.defer();

            $http({
                url: APP_CONFIG.API_URL + '/provision_requests/{id}/approve.json'.replace('{id}', id),
                method: 'PUT',
                params: {
                    reason: reason
                }
            })
            .then(approveSuccess)
            .catch(approveError);

            function approveSuccess(res) {
                toastr.success( 'Request approbation successful');
                deferred.resolve(res.data);
            }

            function approveError(err) {
                $log.debug(err);
                toastr.error(JSON.stringify(err), 'Error');
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function deny(id, reason) {

            reason = reason || '';

            var deferred = $q.defer();

            $http.put(APP_CONFIG.API_URL + '/provision_requests/{id}/deny.json'.replace('{id}', id), {reason: reason})
            .then(denySuccess)
            .catch(denyError);

            function denySuccess(res) {
                toastr.success( 'Request denied successful');
                deferred.resolve(res.data);
            }

            function denyError(err) {
                $log.debug(err);
                toastr.error(JSON.stringify(err), 'Error');
                deferred.reject(err);
            }

            return deferred.promise;
        }


    }
})();

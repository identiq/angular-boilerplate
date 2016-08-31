(function () {
    'use strict';

    angular
    .module('app')
    .factory('instances', instances);

    /** @ngInject */
    function instances($q, $http, toastr, lodash, $log, APP_CONFIG, $rootScope, $timeout) {

        var service = {
            flavors: [],
            providers: [],
            page: page,
            flavorsList: flavorsList,
            flavorsPage: flavorsPage,
            providersList: providersList,
            powerAction: powerAction,
            start: start,
            stop: stop,
            restart: restart,
            suspend: suspend,
            terminate: terminate,
            refresh: refresh,
            attach: attach,
            clone: clone,
            rename: rename,
            changeType: changeType,
            broadcastAction: broadcastAction
        };

        return service;

        function page(page, tenant, search, filter) {

            search = search || false;

            filter = lodash.isObject(filter) ? filter : false;

            var deferred = $q.defer();

            var filters = [
                'tenant_id={id}'.replace('{id}', tenant)
            ];

            if (search && search.length > 2) filters.push('name=%{query}%'.replace('{query}', search));
            if (filter && lodash.isString(filter.provider)) filters.push('vendor={vendor}'.replace('{vendor}', filter.provider));
            if (filter && lodash.isString(filter.status)) filters.push('power_state={state}'.replace('{state}', filter.status));


            $http.get(APP_CONFIG.API_URL + '/vms.json', {
                params: {
                    'filter[]': filters,
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
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;

        }

        function flavorsList() {

            var deferred = $q.defer();
            var promises = [];

            if (service.flavors.length) return deferred.resolve(service.flavors);

            $http.get(APP_CONFIG.API_URL + '/flavors.json', {params: {per_page: 50}})
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {
                var totalPages = res.headers('X-Pagination') ? JSON.parse(res.headers('X-Pagination')).total_pages : 1;

                _.times(totalPages, iterate);
                $q.all(promises).then(promiseSuccess).catch(allError);

                function iterate(page) {
                    promises.push(service.flavorsPage(parseInt(page) + 1));
                }
            }

            function promiseSuccess(res) {

                service.flavors = lodash.flatten(res);
                deferred.resolve(service.flavors);
            }

            function allError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function flavorsPage(page) {
            var deferred = $q.defer();

            $http.get(APP_CONFIG.API_URL + '/flavors.json', {params: {page: page, per_page: 50}})
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {
                deferred.resolve(res.data);
            }

            function allError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function providersList() {
            var deferred = $q.defer();

            if (service.providers.length) return deferred.resolve(service.providers);

            $http({
                url: APP_CONFIG.API_URL + '/providers.json',
                method: 'OPTIONS'
            })
            .then(allSuccess)
            .catch(allError);

            function allSuccess(res) {
                service.providers = res.data;
                deferred.resolve(res.data);
            }

            function allError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function powerAction(id, action) {
            var deferred = $q.defer();

            $http.post(APP_CONFIG.API_URL + '/vms/{id}/power_action.json'.replace('{id}', id), {power_action: action})
            .then(powerSuccess)
            .catch(powerError);

            function powerSuccess(res) {
                service.providers = res.data;
                $timeout(service.broadcastAction, 3000);
                toastr.success(lodash.capitalize(action) + ' successful');
                deferred.resolve(res.data);
            }

            function powerError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function start(instance) {

            return powerAction(instance.id, 'start');

        }

        function stop(instance) {

            return powerAction(instance.id, 'stop');

        }

        function restart(instance) {
            return powerAction(instance.id, 'restart');

        }

        function suspend(instance) {
            return powerAction(instance.id, 'suspend');
        }

        function terminate(instance) {
            return powerAction(instance.id, 'terminate');

        }

        function refresh(instance) {

        }

        function attach(instance) {

        }

        function clone(instance) {

        }

        function rename(instance) {

        }

        function changeType(instance) {

        }

        function broadcastAction(action) {
            $rootScope.$broadcast('instances:action', action || 'unknown');
        }


    }
})();

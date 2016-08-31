(function () {
    'use strict';

    angular
    .module('app')
    .factory('tenants', tenants);

    /** @ngInject */
    function tenants($q, $http, topLoader, toastr, lodash, $log, $localForage, APP_CONFIG, $rootScope) {

        var service = {
            ancestries: [],
            tenants: [],
            totalLevel: 1,
            currentTenant: false,
            init: init,
            all: all,
            page: page,
            getChildrens: getChildrens,
            setCurrent: setCurrent,
            getCurrent: getCurrent,
            getCurrentResolve: getCurrentResolve
        };

        service.init();

        return service;

        function init() {
            service.getCurrentResolve().then(getSuccess);

            function getSuccess(id) {
                service.currentTenant = id;
            }
        }

        function all() {

            var deferred = $q.defer();
            var promises = [];

            if (service.tenants.length) return deferred.resolve(service.tenants);

            topLoader.show();

            $http.get(APP_CONFIG.API_URL + '/tenants.json',{params: {per_page: 50}})
            .then(allSuccess)
            .catch(allError);

            return deferred.promise;

            function allSuccess(res) {
                var totalPages = res.headers('X-Pagination') ? JSON.parse(res.headers('X-Pagination')).total_pages : 1;

                _.times(totalPages, iterate);
                $q.all(promises).then(promiseSuccess).catch(allError);

                function iterate(page) {
                    promises.push(service.page(parseInt(page)+1));
                }
            }

            function allError(err) {
                $log.debug(err);
                topLoader.hide();
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            function promiseSuccess(res) {

                topLoader.hide();

                lodash.forEach(lodash.flatten(res), function(tenant) {
                    tenant.ancestry = lodash.indexOf(tenant.ancestry, '/') >= 0 ? lodash.split(tenant.ancestry, '/'): [tenant.ancestry];
                    tenant.level = tenant.ancestry.length ? tenant.ancestry.length: 0;
                    service.totalLevel = tenant.level > service.totalLevel ? tenant.level: service.totalLevel;
                    service.ancestries.push(tenant.ancestry);

                    if(!lodash.find(service.tenants, {id: tenant.id})) {
                        service.tenants.push(tenant);
                    }
                });


                deferred.resolve(service.tenants);
            }
        }

        function page(page) {

            var deferred = $q.defer();

            $http.get(APP_CONFIG.API_URL + '/tenants.json', {params: {page: page, per_page: 50}})
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

        function getChildrens(id) {
            var deferred = $q.defer();

            topLoader.show();

            $http.get(APP_CONFIG.API_URL + '/tenants/{id}/tenants.json'.replace('{id}', id))
            .then(oneSuccess)
            .catch(oneError);

            function oneSuccess(res) {
                topLoader.hide();
                if(!res.data.length) toastr.info('No childrens', 'Empty');
                deferred.resolve(res.data);
            }

            function oneError(err) {
                $log.debug(err);
                toastr.error('Error', JSON.stringify(err));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function getCurrentResolve() {
            return $localForage.getItem('currentTenantId');
        }

        function getCurrent() {
            return service.currentTenant;
        }

        function setCurrent(tenant) {
            service.currentTenant = tenant;
            $rootScope.$broadcast('tenants:change', tenant);
            return $localForage.setItem('currentTenantId', tenant);
        }
    }
})();

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
            getCurrentResolve: getCurrentResolve,
            nested: nested,
            allTenants: allTenants
        };

        service.init();

        return service;

        function init() {
            service.getCurrentResolve().then(getSuccess);

            function getSuccess(id) {
                service.currentTenant = id;
            }
        }


        function nested(tenantsList, cb) {

            $localForage.getItem('nestedTenants').then(getSuccess);

            function getSuccess(nestedTenants) {

                if (lodash.isArray(nestedTenants) && nestedTenants.length > 0) return cb(nestedTenants);

                $localForage.setItem('nestedTenants', lodash.map(lodash.filter(tenantsList, {level: 0}), insertChild)).then(setSuccess);

                function setSuccess() {
                    return cb(nestedTenants);
                }
            }


            function insertChild(tenant) {
                tenant.nodes = lodash.filter(lodash.map(lodash.filter(tenantsList, {level: 1}), insertChildSecond), ancestryTenant);
                return tenant;

                function ancestryTenant(o) {
                    return lodash.indexOf(o.ancestry, lodash.toString(tenant.id)) === 0;
                }

                function insertChildSecond(second) {
                    second.nodes = lodash.filter(lodash.map(lodash.filter(tenantsList, {level: 2}), insertChildThird), ancestryTenantSecond);
                    return second;

                    function ancestryTenantSecond(o) {
                        return lodash.indexOf(o.ancestry, lodash.toString(second.id)) === 1;
                    }
                }

                function insertChildThird(third) {
                    third.nodes = lodash.filter(lodash.map(lodash.filter(tenantsList, {level: 3}), insertChildFour), ancestryTenantThree);
                    return third;

                    function ancestryTenantThree(o) {
                        return lodash.indexOf(o.ancestry, lodash.toString(third.id)) === 2;
                    }
                }

                function insertChildFour(four) {
                    four.nodes = lodash.filter(lodash.map(lodash.filter(tenantsList, {level: 4}), insertChildFive), ancestryTenantFour);
                    return four;

                    function ancestryTenantFour(o) {
                        return lodash.indexOf(o.ancestry, lodash.toString(four.id)) === 3;
                    }
                }

                function insertChildFive(five) {
                    five.nodes = lodash.map(lodash.filter(tenantsList, {level: 5}), ancestryTenantFive);
                    return five;

                    function ancestryTenantFive(o) {
                        return lodash.indexOf(o.ancestry, lodash.toString(five.id)) === 4;
                    }
                }
            }

        }

        function allTenants() {

            var deferred = $q.defer();
            var promises = [];

            if (service.tenants.length) return deferred.resolve(service.tenants);

            topLoader.show();

            $http.get(APP_CONFIG.API_URL + '/tenants.json', {params: {per_page: 50}})
            .then(allSuccess)
            .catch(allError);

            return deferred.promise;

            function allSuccess(res) {
                var totalPages = res.headers('X-Pagination') ? JSON.parse(res.headers('X-Pagination')).total_pages : 1;

                lodash.times(totalPages, iterate);
                $q.all(promises).then(promiseSuccess).catch(allError);

                function iterate(page) {
                    promises.push(service.page(parseInt(page) + 1));
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

                lodash.forEach(lodash.flatten(res), function (tenant) {
                    tenant.ancestry = lodash.indexOf(tenant.ancestry, '/') >= 0 ? lodash.split(tenant.ancestry, '/') : [tenant.ancestry];
                    tenant.level = _.isString(tenant.ancestry[0]) && tenant.ancestry.length ? tenant.ancestry.length : 0;
                    tenant.nodes = [];
                    delete tenant.errors;
                    service.totalLevel = tenant.level > service.totalLevel ? tenant.level : service.totalLevel;
                    service.ancestries.push(tenant.ancestry);

                    if (!lodash.find(service.tenants, {id: tenant.id})) {
                        service.tenants.push(tenant);
                    }
                });

                $localForage.setItem('tenantsList', service.tenants).then(setTenants);

                function setTenants() {
                    deferred.resolve(service.tenants);
                }
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
                if (!res.data.length) toastr.info('No childrens', 'Empty');
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

        function all() {
            var deferred = $q.defer();

            $localForage.getItem('tenantsList').then(getSuccess).catch(errorTenants);

            function getSuccess(tenantsList) {

                if (lodash.isArray(tenantsList) && tenantsList.length) return deferred.resolve(tenantsList);

                service.allTenants().then(successTenants);

                function successTenants(res) {
                    deferred.resolve(res);
                }
            }

            function errorTenants(err) {
                deferred.reject(err);
            }

            return deferred.promise;
        }
    }
})();

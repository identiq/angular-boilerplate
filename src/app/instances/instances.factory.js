(function () {
    'use strict';

    angular
    .module('app')
    .factory('instances', instances);

    /** @ngInject */
    function instances($q, $http, toastr, lodash, $log, APP_CONFIG, $rootScope, $timeout, Restangular, providers) {

        var service = {
            flavors: [],
            actions: [
                {name: 'START', icon: 'zmdi-play-circle-outline', disabled: ['on', 'powering_up', 'terminated', 'unknow'], edit: true, md: 'md-primary', fn: start},
                {name: 'STOP', icon: 'zmdi-power', disabled: ['off', 'powering_down', 'terminated', 'unknow'], edit: true, md: '', fn: stop},
                {name: 'RESTART', icon: 'zmdi-repeat', disabled: ['terminated', 'unknow'], edit: true, md: '',fn: restart},
                {name: 'SUSPEND', icon: 'zmdi-pause-circle-outline', disabled: ['terminated', 'unknow'], edit: true, md: '',fn: suspend},
                {name: 'TERMINATE', icon: 'zmdi zmdi-close-circle-o', disabled: ['terminated', 'unknow'], edit: true, md: 'md-warn', fn: terminate},
                {name: 'REFRESH', icon: 'zmdi-refresh-alt', disabled: ['terminated', 'unknow'], edit: false, fn: refresh},
                {name: 'ATTACH', icon: 'zmdi-attachment-alt', disabled: ['terminated', 'unknow'], edit: false, fn: attach},
                {name: 'CLONE', icon: 'zmdi-copy', disabled: ['terminated', 'unknow'], edit: false, fn: clone},
                {name: 'RENAME', icon: 'zmdi-edit', disabled: ['terminated', 'unknow'], edit: false, fn: rename},
                {name: 'INSTANCE', icon: 'zmdi-dns', disabled: ['terminated', 'unknow'], edit: false, fn: changeType}
            ],
            status: [
                {name: 'on', label: 'label-success', btn: 'btn-success'},
                {name: 'off', label: 'label-danger', btn: 'btn-danger'},
                {name: 'powering_up', label: 'label-info', btn: 'btn-info'},
                {name: 'powering_down', label: 'label-info', btn: 'btn-info'},
                {name: 'suspended', label: 'label-warning', btn: 'btn-warning'},
                {name: 'terminated', label: 'label-default', btn: 'btn-default'},
                {name: 'unknown', label: 'label-primary', btn: 'btn-primary'},
            ],
            page: page,
            one: one,
            flavorsList: flavorsList,
            flavorsPage: flavorsPage,
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
            broadcastAction: broadcastAction,
            actionDisable: actionDisable,
            flavorDetails: flavorDetails,
            locationDetails: locationDetails
        };

        return service;

        function page(page, tenant, search, filter) {

            search = search || false;
            page = page || 1;
            tenant = tenant || 1;

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

                deferred.resolve({
                    data: res.data,
                    meta: JSON.parse(res.headers('X-Pagination'))
                });
            }

            function allError(err) {
                $log.debug('pageError', err);
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

        function powerAction(id, action) {
            var deferred = $q.defer();

            $http.post(APP_CONFIG.API_URL + '/vms/{id}/power_action.json'.replace('{id}', id), {power_action: action})
            .then(powerSuccess)
            .catch(powerError);

            function powerSuccess(res) {
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

        function one(id) {
            return Restangular.one('vms', id).get();
        }

        function actionDisable(disabled, power_state) {
            return lodash.indexOf(disabled, power_state) >= 0;
        }

        function flavorDetails(id) {
            return lodash.find(service.flavors, {id: id});
        }

        function locationDetails(name, provider) {
            if (!provider || !providers.providers.kinds || !providers.providers.kinds.length) return {name: 'n/a'};
            var regionIndex = lodash.find(providers.providers.kinds, {id: provider}).name;
            return lodash.split(name, '.', 2) ? lodash.find(providers.providers.regions[regionIndex], {name: lodash.split(name, '.', 2)[1]}) : null;
        }

    }
})();

(function () {
    'use strict';

    angular
    .module('app')
    .controller('InstanceController', InstanceController);

    /** @ngInject */
    function InstanceController($scope, $state, tenants, $log, lodash, instancesList, flavorsList, providersList, topLoader, instances, currentTenantId, $timeout) {
        var vm = this;

        vm.instances = instancesList.data;
        vm.currentPage = instancesList.meta.current_page;
        vm.totalItems = instancesList.meta.total_count;
        vm.itemsPerPage = instancesList.meta.per_page;
        vm.providers = providersList;
        vm.numPerPageOpt = [3, 5, 10, 20];
        vm.query = '';
        vm.filters = {};

        vm.actions = [
            {
                name: 'START',
                icon: 'zmdi-play-circle-outline',
                disabled: ['on', 'powering_up', 'terminated', 'unknow'],
                fn: instances.start
            },
            {
                name: 'STOP',
                icon: 'zmdi-power',
                disabled: ['off', 'powering_down', 'terminated', 'unknow'],
                fn: instances.stop
            },
            {name: 'RESTART', icon: 'zmdi-repeat', disabled: ['terminated', 'unknow'], fn: instances.restart},
            {
                name: 'SUSPEND',
                icon: 'zmdi-pause-circle-outline',
                disabled: ['terminated', 'unknow'],
                fn: instances.suspend
            },
            {
                name: 'TERMINATE',
                icon: 'zmdi zmdi-close-circle-o',
                disabled: ['terminated', 'unknow'],
                fn: instances.terminate
            },
            {name: 'REFRESH', icon: 'zmdi-refresh-alt', disabled: ['terminated', 'unknow'], fn: instances.refresh},
            {name: 'ATTACH', icon: 'zmdi-attachment-alt', disabled: ['terminated', 'unknow'], fn: instances.attach},
            {name: 'CLONE', icon: 'zmdi-copy', disabled: ['terminated', 'unknow'], fn: instances.clone},
            {name: 'RENAME', icon: 'zmdi-edit', disabled: ['terminated', 'unknow'], fn: instances.rename},
            {name: 'INSTANCE', icon: 'zmdi-dns', disabled: ['terminated', 'unknow'], fn: instances.changeType}
        ];

        vm.status = [
            {name: 'on', label: 'label-success'},
            {name: 'off', label: 'label-danger'},
            {name: 'powering_up', label: 'label-info'},
            {name: 'powering_down', label: 'label-info'},
            {name: 'suspended', label: 'label-warning'},
            {name: 'terminated', label: 'label-default'},
            {name: 'unknown', label: 'label-primary'},
        ];

        vm.vendors = [
            {name: 'amazon', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_amazon.png'},
            {name: 'azure', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_azure.png'},
            {name: 'ovh', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_azure.png'}
        ];

        var flavors = flavorsList;
        var running = false;

        vm.flavorDetails = flavorDetails;
        vm.prodiverDetails = providerDetails;
        vm.locationDetails = locationDetails;
        vm.pageTo = pageTo;
        vm.search = search;
        vm.action = action;
        vm.actionDisable = actionDisable;
        vm.filterProvider = filterProvider;
        vm.filterStatus = filterStatus;

        $scope.$on('tenants:change', tenantsChange);
        $scope.$on('instances:action', tenantsChange);

        function flavorDetails(id) {
            return lodash.find(flavors, {id: id});
        }

        function providerDetails(name) {
            return lodash.find(vm.vendors, {name: name}) || vm.vendors[0];
        }

        function locationDetails(name, provider) {
            if (!provider) return;
            var regionIndex = lodash.find(vm.providers.kinds, {id: provider}).name;
            return lodash.split(name, '.', 2) ? lodash.find(vm.providers.regions[regionIndex], {name: lodash.split(name, '.', 2)[1]}) : null;
        }


        function pageTo(page) {
            topLoader.show();

            instances.page(page, tenants.getCurrent(), vm.query, vm.filters).then(pageSuccess).catch(pageError);

            function pageSuccess(res) {
                setMeta(res.meta);
                vm.instances = res.data;
                topLoader.hide();
            }

            function pageError() {
                topLoader.hide();

            }
        }

        function filterStatus(status) {
            topLoader.show();

            vm.filters.status = status || false;

            instances.page(1, tenants.getCurrent(), vm.query, {status: status}).then(pageSuccess).catch(pageError);

            function pageSuccess(res) {
                setMeta(res.meta);
                $log.debug(res.data);
                vm.instances = res.data;
                topLoader.hide();
            }

            function pageError() {
                topLoader.hide();

            }
        }

        function filterProvider(provider) {
            topLoader.show();

            vm.filters.provider = provider || false;

            instances.page(1, tenants.getCurrent(), vm.query, {provider: provider}).then(pageSuccess).catch(pageError);

            function pageSuccess(res) {
                setMeta(res.meta);
                $log.debug(res.data);
                vm.instances = res.data;
                topLoader.hide();
            }

            function pageError() {
                topLoader.hide();

            }
        }

        function search(query) {
            if (query.length < 3) return;

            vm.query = query;

            topLoader.show();

            $timeout.cancel(running);
            running = $timeout(request, 1000);

            function request() {
                instances.page(1, tenants.getCurrent(), query).then(pageSuccess).catch(pageError);
            }

            function pageSuccess(res) {
                setMeta(res.meta);
                $log.debug(res.data);
                vm.instances = res.data;
                topLoader.hide();
            }

            function pageError() {
                topLoader.hide();

            }
        }

        function tenantsChange() {
            pageTo(1);
        }

        function setMeta(meta) {
            vm.currentPage = meta.current_page;
            vm.totalItems = meta.total_count;
        }

        function action(action, instance) {

        }

        function actionDisable(disabled, power_state) {
            return lodash.indexOf(disabled, power_state) >= 0;
        }


    }
})();
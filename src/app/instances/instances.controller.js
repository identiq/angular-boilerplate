(function () {
    'use strict';

    angular
    .module('app')
    .controller('InstancesController', InstancesController);

    /** @ngInject */
    function InstancesController($scope, tenants, lodash, instancesList, topLoader, instances, $timeout) {
        var vm = this;

        vm.instances = instancesList.data;
        vm.currentPage = instancesList.meta.current_page;
        vm.totalItems = instancesList.meta.total_count;
        vm.itemsPerPage = instancesList.meta.per_page;
        vm.numPerPageOpt = [3, 5, 10, 20];
        vm.query = '';
        vm.filters = {};

        vm.actions = instances.actions;

        vm.status = instances.status;

        vm.vendors = [
            {name: 'amazon', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_amazon.png'},
            {name: 'azure', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_azure.png'},
            {name: 'ovh', src: 'https://portal.dev.emea.sd.lbn.fr/styles/img/logos/logo_azure.png'}
        ];

        var running = false;

        vm.flavorDetails = instances.flavorDetails;
        vm.prodiverDetails = providerDetails;
        vm.locationDetails = instances.locationDetails;
        vm.actionDisable = instances.actionDisable;
        vm.filterProvider = filterProvider;
        vm.filterStatus = filterStatus;
        vm.pageTo = pageTo;
        vm.search = search;
        vm.action = action;

        $scope.$on('tenants:change', tenantsChange);
        $scope.$on('instances:action', tenantsChange);


        function providerDetails(name) {
            return lodash.find(vm.vendors, {name: name}) || vm.vendors[0];
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



    }
})();
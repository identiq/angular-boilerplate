(function () {
    'use strict';

    angular
    .module('app')
    .directive('tenantsNav', tenantsNav);

    /** @ngInject */
    function tenantsNav() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/tenantsNav/tenantsNav.html',
            controller: TenantsNavController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function TenantsNavController(tenants, lodash, $log, $state) {
            var vm = this;

            vm.tenants = [];
            vm.childTenants = [];
            vm.currentTenantId = false;
            vm.currentChildTenantId = false;
            vm.show = show;
            vm.showChildren = showChildren;
            vm.setRoot = setRoot;

            activate();

            function activate() {

                tenants.all().then(tenantsSuccess);

                function tenantsSuccess(tenants) {
                    vm.tenants = lodash.sortBy(lodash.filter(tenants, findByParent), ['name', 'description']);
                }

                function findByParent(o) {
                    return lodash.indexOf(o.ancestry, '1') >= 0 && o.level == 1;
                }

            }

            function setRoot() {
                vm.currentTenantId = 1;
                vm.currentChildTenantId = false;
                tenants.setCurrent(1);
            }

            function show(id) {

                vm.currentTenantId = id;
                vm.currentChildTenantId = false;

                tenants.setCurrent(id);

                tenants.getChildrens(id).then(showSuccess).catch(showError);

                function showSuccess(res) {
                    vm.tenants[lodash.indexOf(vm.tenants, lodash.find(vm.tenants, {id: id}))].childs = res;
                }

                function showError(err) {

                }
            }

            function showChildren(parent, id) {

                vm.currentChildTenantId = id;

                tenants.setCurrent(id);

                var parentIndex = lodash.indexOf(vm.tenants, lodash.find(vm.tenants, {id: parent}));

                var childIndex = lodash.indexOf(vm.tenants[parentIndex].childs, lodash.find(vm.tenants[parentIndex].childs, {id: id}));

                tenants.getChildrens(id).then(showSuccess).catch(showError);

                function showSuccess(res) {
                    vm.tenants[parentIndex].childs[childIndex].childs = res;
                }

                function showError(err) {

                }
            }
        }
    }

})();
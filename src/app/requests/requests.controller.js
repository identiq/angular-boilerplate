(function () {
    'use strict';

    angular
    .module('app')
    .controller('RequestController', RequestController);

    /** @ngInject */
    function RequestController($scope, $log, lodash, topLoader, requestsList, requests) {
        var vm = this;

        vm.requests = requestsList.data;
        vm.currentPage = requestsList.meta.current_page;
        vm.totalItems = requestsList.meta.total_count;
        vm.itemsPerPage = requestsList.meta.per_page;

        vm.numPerPageOpt = [3, 5, 10, 20];

        vm.pageTo = pageTo;

        $scope.$on('tenants:change', tenantsChange);

        function pageTo(page) {
            topLoader.show();

            requests.page(page).then(pageSuccess).catch(pageError);

            function pageSuccess(res) {
                setMeta(res.meta);
                vm.requests = res.data;
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


    }
})();
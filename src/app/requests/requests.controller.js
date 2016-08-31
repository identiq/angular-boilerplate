(function () {
    'use strict';

    angular
    .module('app')
    .controller('RequestController', RequestController);

    /** @ngInject */
    function RequestController($scope, $log, lodash, topLoader, requestsList, requests, tenants, $mdDialog, $timeout) {
        var vm = this;

        vm.requests = requestsList.data;
        vm.currentPage = requestsList.meta.current_page;
        vm.totalItems = requestsList.meta.total_count;
        vm.itemsPerPage = requestsList.meta.per_page;

        vm.states = [
            {name: 'approved', icon: 'zmdi-cloud-done'},
            {name: 'denied', icon: 'zmdi-cloud-off'},
            {name: 'pending_approval', icon: 'zmdi-hourglass-alt'}
        ];

        vm.status = [
            {name: 'Ok', label: 'label-success'},
            {name: 'Error', label: 'label-warning'},
            {name: 'Denied', label: 'label-danger'}
        ];

        vm.numPerPageOpt = [3, 5, 10, 20];

        vm.pageTo = pageTo;
        vm.approval = approval;
        vm.statusLabel = statusLabel;
        vm.tenant = tenant;
        vm.approbe = approbe;

        $scope.$on('tenants:change', tenantsChange);

        function pageTo(page) {

            page = page || vm.currentPage;

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
            pageTo();
        }

        function setMeta(meta) {
            vm.currentPage = meta.current_page;
            vm.totalItems = meta.total_count;
        }

        function approval(name) {
            return lodash.find(vm.states, {name: name}).icon;
        }

        function statusLabel(name) {
            return lodash.find(vm.status, {name: name}).label;
        }

        function tenant(id) {
            return lodash.find(tenants.tenants, {id: id});
        }

        function approbe(ev, request, type) {
            $mdDialog.show({
                controller: RequestDialogController,
                templateUrl: 'app/requests/approbation.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(dialogClose);

            function dialogClose(reason) {

                if (type === 'deny') {
                    return requests.deny(request.id, reason);
                }

                requests.approve(request.id, reason).then(approveSuccess);

                function approveSuccess() {
                    $timeout(vm.pageTo, 2000);
                }
            }

            /** @ngInject */
            function RequestDialogController($scope, $mdDialog) {

                $scope.type = lodash.capitalize(type);
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.reason = function (reason) {
                    $mdDialog.hide(reason);
                };
            }
        }


    }
})();
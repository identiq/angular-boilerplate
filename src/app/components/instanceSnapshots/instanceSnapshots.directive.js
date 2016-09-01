(function () {
    'use strict';

    angular
    .module('app')
    .directive('instanceSnapshots', instanceSnapshots);

    /** @ngInject */
    function instanceSnapshots() {
        var directive = {
            restrict: 'E',
            scope: {
              instance: '='
            },
            templateUrl: 'app/components/instanceSnapshots/instanceSnapshots.html',
            controller: InstanceSnapshotsController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function InstanceSnapshotsController(toastr, topLoader, $log, $q) {
            var vm = this;

            vm.volumes = [];
            vm.snapshots = [];

            activate();

            function activate() {
                topLoader.show();
                var promises = [];
                vm.instance.getList('volumes').then(volumesSuccess).catch(volumesError);

                function volumesSuccess(volumes) {
                    _.each(volumes, addPromise);

                    function addPromise() {
                        promises.push(volumes.getList('snapshots'));
                    }

                    $q.all(promises).then(snapshotsSuccess).catch(snapshotsError);
                }

                function volumesError(err) {
                    toastr.error(JSON.stringify(err), "volumesError");
                }

                function snapshotsError(err) {
                    toastr.error(JSON.stringify(err), "snapshotsError");
                }

                function snapshotsSuccess(res) {
                    $log.debug(res.data);
                    topLoader.hide();
                    vm.snapshots = res.data;
                }

            }

        }
    }

})();
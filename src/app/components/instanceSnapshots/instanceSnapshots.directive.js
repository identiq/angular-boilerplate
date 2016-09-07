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
        function InstanceSnapshotsController($scope, $rootScope, toastr, topLoader, $log, $q, lodash, $timeout) {
            var vm = this;

            vm.volumes = [];
            vm.snapshots = [];
            vm.actions = [
                {name: 'Remove', icon: 'zmdi-delete', fn: remove, volume: ['attached', 'attaching'], instance:['on', 'powering_down']},
                {name: 'Volume', icon: 'zmdi-dns', fn: volume, volume: ['detached', 'attaching'], instance:['on', 'powering_down']},
            ];

            $scope.$on('instance:snapshots:new', activate);

            activate();

            function activate() {
                topLoader.show();

                var promises = [];

                vm.instance.getList('volumes').then(volumesSuccess).catch(volumesError);

                function volumesSuccess(volumes) {
                    vm.snapshots = [];

                    lodash.each(volumes.data, addPromise);

                    function addPromise(volume) {
                        promises.push(volume.getList('snapshots'));
                        vm.volumes[volume.id] = volume;
                    }

                    $q.all(promises).then(snapshotsSuccess).catch(snapshotsError);
                }

                function volumesError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "volumesError");
                }

                function snapshotsError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "snapshotsError");
                }

                function snapshotsSuccess(res) {

                    topLoader.hide();
                    lodash.each(res, returnData);

                    function returnData(o) {
                        lodash.each(o.data, pushSnapshot);
                    }

                    function pushSnapshot(snap) {
                        vm.snapshots.push(snap);
                    }
                }

            }

            function remove(snapshot) {
                topLoader.show();

                snapshot.remove().then(removeSuccess).catch(removeError);

                function removeSuccess() {
                    topLoader.hide();
                    toastr.success('Snapshot deleted successfully');
                    $timeout(activate, 3000);
                }

                function removeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "Snapshot deletion error");
                }

            }

            function volume(snapshot) {

                topLoader.show();
                snapshot.customPOST({}, 'volume').then(volumeSuccess).catch(volumeError);

                function volumeSuccess() {
                    topLoader.hide();
                    toastr.success('Snapshot volume restore successful');
                    $rootScope.$broadcast('instance:volumes:new', snapshot);
                    $timeout(activate, 3000);
                }

                function volumeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Snapshot volume restore error');
                }

            }

        }
    }

})();
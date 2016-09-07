(function () {
    'use strict';

    angular
    .module('app')
    .directive('instanceBackups', instanceBackups);

    /** @ngInject */
    function instanceBackups() {
        var directive = {
            restrict: 'E',
            scope: {
              instance: '='
            },
            templateUrl: 'app/components/instanceBackups/instanceBackups.html',
            controller: InstanceBackupsController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function InstanceBackupsController(toastr, topLoader, $timeout) {
            var vm = this;

            vm.backups = [];
            vm.backupForm = {};
            vm.actions = [
                {name: 'Remove', icon: 'zmdi-delete', fn: remove, volume: ['attached', 'attaching'], instance:['on', 'powering_down']},
                {name: 'Restore', icon: 'zmdi-time-restore', fn: restore, volume: ['detached', 'attaching'], instance:['on', 'powering_down']},
            ];

            vm.create = create;
            activate();

            function activate() {
                topLoader.show();

                vm.instance.getList('backups').then(backupsSuccess).catch(backupsError);

                function backupsSuccess(backups) {
                    topLoader.hide();
                    vm.backupForm = {};
                    vm.backups = backups.data;
                }

                function backupsError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "backupsError");
                }


            }

            function remove(backup) {
                topLoader.show();

                backup.remove().then(removeSuccess).catch(removeError);

                function removeSuccess() {
                    topLoader.hide();
                    toastr.success('Backup deleted successfully');
                    $timeout(activate, 3000);
                }

                function removeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "Backup deletion error");
                }

            }

            function restore(backup) {

                topLoader.show();
                backup.customPOST({}, 'restore').then(restoreSuccess).catch(restoreError);

                function restoreSuccess() {
                    topLoader.hide();
                    toastr.success('Backup restore successful');
                    $timeout(activate, 3000);
                }

                function restoreError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Backup restore error');
                }

            }

            function create() {
                topLoader.show();
                vm.backups.post(vm.backupForm).then(volumeSuccess).catch(volumeError);

                function volumeSuccess() {
                    topLoader.hide();
                    toastr.success('Backup added successful');
                    $timeout(activate, 3000);
                }

                function volumeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Backup creation error');
                }
            }

        }
    }

})();
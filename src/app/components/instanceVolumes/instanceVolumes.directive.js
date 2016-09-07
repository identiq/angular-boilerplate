(function () {
    'use strict';

    angular
    .module('app')
    .directive('instanceVolumes', instanceVolumes);

    /** @ngInject */
    function instanceVolumes() {
        var directive = {
            restrict: 'E',
            scope: {
              instance: '='
            },
            templateUrl: 'app/components/instanceVolumes/instanceVolumes.html',
            controller: InstanceVolumesController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function InstanceVolumesController($rootScope, toastr, $log, lodash, $timeout, topLoader, instances, providers) {
            var vm = this;

            vm.volumes = [];
            vm.volumeForm = {};
            vm.actions = [
                {name: 'Attach', icon: 'zmdi-attachment-alt', fn: attach, volume: ['attached', 'attaching'], instance:['on', 'powering_down']},
                {name: 'Detach', icon: 'zmdi-arrow-split', fn: detach, volume: ['detached', 'attaching'], instance:['on', 'powering_down']},
                {name: 'Remove', icon: 'zmdi-delete', fn: remove, volume: [], instance:[]},
                {name: 'Snapshot', icon: 'zmdi-camera', fn: snapshot, volume: [], instance:[]},
                {name: 'Extend', icon: 'zmdi-fullscreen-alt', fn: extend, volume: [], instance: ['on', 'powering_down']}
            ];
            vm.provider = lodash.find(providers.providers, {id: vm.instance.provider_id || 1});
            vm.devices = providers.options.volumes.devices[vm.provider.kind];
            vm.kinds = providers.options.volumes.kinds[vm.provider.kind];

            vm.actionDisable = actionDisable;
            vm.create = create;

            $scope.$on('instance:volumes:new', activate);

            activate();

            function activate() {
                topLoader.show();
                vm.instance.getList('volumes').then(volumeSuccess).catch(volumesError);

                function volumeSuccess(res) {
                    topLoader.hide();
                    vm.volumes = res.data;
                }

                function volumesError(err) {
                    toastr.error(JSON.stringify(err), "volumesError");
                }

            }

            function attach(volume) {
                topLoader.show();
                volume.all('attach').post({device: volume.device}).then(attachSuccess).catch(attachError);

                function attachSuccess() {
                    topLoader.hide();
                    toastr.success('Attach successful');
                    $timeout(activate, 3000);
                }

                function attachError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Attach error');
                }
            }

            function detach(volume) {
                topLoader.show();
                volume.all('detach').post().then(detachSuccess).catch(detachError);

                function detachSuccess() {
                    topLoader.hide();
                    toastr.success('Detach successful');
                    $timeout(activate, 3000);
                }

                function detachError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Detach error');
                }
            }

            function snapshot(volume) {
                topLoader.show();
                volume.all('snapshots').post().then(snapSuccess).catch(snapError);

                function snapSuccess() {
                    topLoader.hide();
                    toastr.success('Snapshot successful');
                    $timeout(activate, 3000);
                    $rootScope.$broadcast('instance:snapshots:new', volume)

                }

                function snapError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Snapshot error');
                }
            }

            function remove(volume) {
                topLoader.show();
                volume.remove().then(removeSuccess).catch(removeError);

                function removeSuccess() {
                    topLoader.hide();
                    toastr.success('Volume remove successful');
                    $timeout(activate, 3000);
                }

                function removeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Volume remove error');
                }
            }

            function extend(volume) {

            }

            function actionDisable(action, volume, instance) {
                return lodash.indexOf(vm.actions[action].volume, volume.status) >= 0 || lodash.indexOf(vm.actions[action].instance, instance.power_state) >= 0;
            }

            function create() {
                topLoader.show();
                vm.volumes.post(vm.volumeForm).then(volumeSuccess).catch(volumeError);

                function volumeSuccess() {
                    topLoader.hide();
                    toastr.success('Volume added successful');
                    $timeout(activate, 3000);
                }

                function volumeError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), 'Volume remove error');
                }
            }




        }
    }

})();
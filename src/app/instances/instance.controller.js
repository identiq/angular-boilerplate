(function () {
    'use strict';

    angular
    .module('app')
    .controller('InstanceController', InstanceController);

    /** @ngInject */
    function InstanceController($scope, $state, $log, lodash, instance, instances, $timeout) {
        var vm = this;

        vm.instance = instance.data;

        vm.actions = lodash.filter(instances.actions, {edit: true});

        vm.status = instances.status;

        vm.actionClass = actionClass;
        vm.actionDisable = instances.actionDisable;
        vm.flavorDetails = instances.flavorDetails;
        vm.locationDetails = instances.locationDetails;


        $log.debug(instance.data);

        function actionClass(name) {
            return lodash.find(vm.status, {name: name}).btn;
        }



    }
})();
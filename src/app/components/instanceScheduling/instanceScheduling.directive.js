(function () {
    'use strict';

    angular
    .module('app')
    .directive('instanceScheduling', instanceScheduling);

    /** @ngInject */
    function instanceScheduling() {
        var directive = {
            restrict: 'E',
            scope: {
              instance: '='
            },
            templateUrl: 'app/components/instanceScheduling/instanceScheduling.html',
            controller: InstanceSchedulingController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function InstanceSchedulingController(toastr, topLoader, Restangular, lodash, schedules, $log) {
            var vm = this;

            vm.schedules = [];
            vm.scheduleForm = {
                events: []
            };
            vm.eventForm = {};
            vm.activeSchedule = false;
            vm.events = [];
            vm.dows = schedules.dows;

            vm.eventValidation = schedules.validation;
            vm.addEvent = addEvent;
            vm.create = create;
            vm.change = change;
            vm.save = save;
            vm.cancel = cancel;

            activate();

            function activate() {
                topLoader.show();

                Restangular.all('schedules').getList().then(schedulesSuccess).catch(schedulesError);

                function schedulesSuccess(schedules) {
                    vm.schedules = schedules.data;
                    vm.activeSchedule = vm.instance.schedule_id ? lodash.find(schedules.data, {id: vm.instance.schedule_id.id}) : null;
                    if(vm.activeSchedule) change();
                }

                function schedulesError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "schedulesError");
                }


            }

            function change() {
                topLoader.show();

                vm.activeSchedule.getList('events').then(eventsSuccess).catch(eventsError);

                function eventsSuccess(res) {
                    topLoader.hide();
                    vm.events['start'] = lodash.filter(res.data, {action: 'start'}) || [];
                    vm.events['stop'] = lodash.filter(res.data, {action: 'stop'}) || [];
                }

                function eventsError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "eventsError");
                }
            }


            function addEvent(event) {

                schedules.event(event, vm.scheduleForm.events, eventFormatted);

                function eventFormatted(events) {
                    vm.eventForm = {};
                    vm.scheduleForm.eventsStart = lodash.filter(events, {action_type: 'start'}) || [];
                    vm.scheduleForm.eventsEnd = lodash.filter(events, {action_type: 'stop'}) || [];
                    vm.scheduleForm.events = events;
                }
            }

            function create() {
                topLoader.show();

                schedules.create(vm.scheduleForm).then(createSuccess).catch(createError);

                function createSuccess(res) {
                    topLoader.hide();
                    vm.activeSchedule = res;
                    vm.schedules.push(res);
                    change();
                    toastr.success('Schedule added successfully');
                }

                function createError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "createError");
                }
            }

            function save() {
                topLoader.show();

                vm.instance.customPOST({schedule_id: vm.activeSchedule.id}, 'schedule').then(saveSuccess).catch(saveError);

                function saveSuccess(res) {
                    topLoader.hide();
                    vm.instance.schedule_id = res.data;
                    toastr.success('Schedule linked successfully');
                }

                function saveError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "saveError");
                }
            }

            function cancel() {
                topLoader.show();

                vm.instance.customDELETE('schedule').then(cancelSuccess).catch(cancelError);

                function cancelSuccess() {
                    topLoader.hide();
                    vm.instance.schedule_id = null;
                    toastr.success('Schedule unlinked successfully');
                }

                function cancelError(err) {
                    topLoader.hide();
                    toastr.error(JSON.stringify(err), "cancelError");
                }
            }




        }
    }

})();
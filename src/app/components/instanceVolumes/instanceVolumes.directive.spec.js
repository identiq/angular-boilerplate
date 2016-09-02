(function() {
    'use strict';


    fdescribe('directive instanceVolumes', function() {
        var vm;
        var el;
        var instance;
        var scope;

        beforeEach(module('app', function ($provide, $translateProvider) {
            $provide.factory('customLoader', function ($q) {
                return function () {
                    var deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('customLoader');

        }));

        beforeEach(inject(function($compile, $rootScope, providers, $q) {

            var deferred = $q.defer();

            instance = {
                "id": 5203,
                "name": "ldap - ldapsrv1",
                "provider_id": null,
                "vendor": "amazon",
                "location": "unknown",
                "created_on": "2016-08-10T16:07:38.889Z",
                "updated_on": "2016-08-11T07:57:30.873Z",
                "guid": "8f42e16e-5f14-11e6-98b1-06c1179ac85f",
                "power_state": "terminated",
                "state_changed_on": "2016-08-11T07:57:30.869Z",
                "template": false,
                "previous_state": "running",
                "type": "ManageIQ::Providers::Amazon::CloudManager::Vm",
                "ems_ref": "i-11fa0e9c",
                "flavor_id": 322,
                "cloud": true,
                "availability_zone_id": null,
                "raw_power_state": "unknown",
                "last_scan_attempt_on": null,
                "last_perf_capture_on": null,
                "cloud_network_id": null,
                "cloud_subnet_id": null,
                "orchestration_stack_id": null,
                "tenant_id": 1,
                "description": null,
                "retired": null,
                "retirement_state": null,
                "miq_group_id": 1,
                "evm_owner_id": null,
                "retirement_requester": null,
                "key_pairs": [
                    {
                        "id": 42,
                        "name": "a.claden",
                        "resource_id": 11,
                        "resource_type": "ExtManagementSystem",
                        "created_on": "2016-08-02T15:32:41.218Z",
                        "updated_on": "2016-08-02T15:32:41.218Z",
                        "type": "ManageIQ::Providers::Amazon::CloudManager::AuthKeyPair",
                        "fingerprint": "69:ec:9b:a6:22:e9:fd:d0:7a:35:9d:ba:0b:3f:02:5f:4c:07:e2:64",
                        "htpassd_users": [],
                        "ldap_id": [],
                        "ldap_email": [],
                        "ldap_name": [],
                        "ldap_preferred_user_name": [],
                        "request_header_headers": [],
                        "request_header_preferred_username_headers": [],
                        "request_header_name_headers": [],
                        "request_header_email_headers": [],
                        "open_id_extra_scopes": [],
                        "github_organizations": []
                    }
                ],
                "security_groups": [],
                "floating_ips": [],
                "cloud_subnets": [],
                "cloud_networks": [],
                "miq_provision_template": null,
                "ipaddresses": [
                    "10.100.61.82",
                    "52.50.160.163"
                ],
                "hostnames": [
                    "ip-10-100-61-82.eu-west-1.compute.internal"
                ],
                "allocated_disk_storage": "34359738368.0",
                "archived": true,
                "retirement_warn": null,
                "tenant": {
                    "errors": {},
                    "id": 1,
                    "name": "Selfdeploy",
                    "divisible": true,
                    "description": "Tenant for My Company",
                    "use_config_for_attributes": true,
                    "default_miq_group_id": 1
                },
                "retirement_last_warn": null,
                "platform": "linux",
                "storages": [],
                "users": [],
                "groups": [],
                "ems_events": [],
                "backup_policy": null,
                "lifecycle_events": [],
                "miq_events": [
                    {
                        "id": 12075,
                        "event_type": "vm_create",
                        "message": "Policy resolved successfully!",
                        "timestamp": "2016-08-10T16:07:46.299Z",
                        "source": "POLICY",
                        "created_on": "2016-08-10T16:07:46.300Z",
                        "type": "MiqEvent",
                        "target_type": "VmOrTemplate",
                        "target_id": 5203
                    }
                ],
                "message": null,
                "success": null,
                "backup_retention": 0,
                "managed_service": null,
                "schedule_id": null,
                "expiration_date": null
            };

            providers.options = {
                volumes: {
                    devices: [],
                    kinds: {
                        aws: []
                    }
                }
            };

            providers.providers = [{
                id: 1
            }];

            scope = $rootScope.$new();

            scope.instance = instance;
            scope.instance.getList = jasmine.createSpy('getList').and.returnValue(deferred.promise);

            el = angular.element('<instance-volumes instance="instance"></instance-volumes>');

            $compile(el)(scope);
            $rootScope.$digest();
            vm = el.isolateScope().vm;
        }));

        it('should be compiled', function() {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function() {
            expect(vm).toEqual(jasmine.any(Object));

            expect(vm.volumeForm).toEqual(jasmine.any(Object));
            expect(vm.volumes).toEqual(jasmine.any(Array));
            expect(vm.actions).toEqual(jasmine.any(Array));
        });



    });
})();

(function() {
    'use strict';

    describe('service instances', function() {
        var instances;
        var $httpBackend;
        var $log;
        var APP_CONFIG;
        var toastr;
        var $rootScope;
        var Restangular;

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
        beforeEach(inject(function(_instances_, _$httpBackend_, _$log_, _APP_CONFIG_, _toastr_, _$rootScope_, _Restangular_) {
            instances = _instances_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            APP_CONFIG = _APP_CONFIG_;
            toastr = _toastr_;
            $rootScope = _$rootScope_;
            Restangular = _Restangular_;

            spyOn(toastr, 'error');
            spyOn(toastr, 'success');

        }));

        it('should be registered', function() {
            expect(instances).not.toEqual(null);
        });

        describe('flavors variable', function() {
            it('should exist', function() {
                expect(instances.flavors).not.toEqual(null);
            });
        });

        describe('actions variable', function() {
            it('should exist', function() {
                expect(instances.actions).not.toEqual(null);
            });
        });

        describe('actions status', function() {
            it('should exist', function() {
                expect(instances.status).not.toEqual(null);
            });
        });

        describe('page function', function() {
            it('should exist', function() {
                expect(instances.page).not.toEqual(null);
            });

            it('page and tenant param should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/vms.json?filter%5B%5D=tenant_id%3D1&page=1').respond(200, res['vms']);
                var data;
                instances.page(1, 1).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(data.data.length === 1).toBeTruthy();
                expect(data.data).toEqual(jasmine.any(Array));
            });

            it('search and filter should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/vms.json?filter%5B%5D=tenant_id%3D1&filter%5B%5D=name%3D%25search%25&filter%5B%5D=vendor%3Dprovider&filter%5B%5D=power_state%3Dstatus&page=1').respond(200, res['vms']);
                var data;
                instances.page(1, 1, 'search', {provider: 'provider', status: 'status'}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(data.data.length === 1).toBeTruthy();
                expect(data.data).toEqual(jasmine.any(Array));
            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/vms.json?filter%5B%5D=tenant_id%3D1&page=1').respond(500);
                instances.page();
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('pageError'));

            });
        });

        describe('flavorsList function', function() {
            it('should exist', function() {
                expect(instances.flavorsList).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/flavors.json?per_page=50').respond(200, res['flavors']);
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/flavors.json?page=1&per_page=50').respond(200, res['flavors']);

                var data;
                instances.flavorsList().then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length === 1).toBeTruthy();
                expect(data[0]).toEqual(jasmine.any(Object));
            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/flavors.json?per_page=50').respond(500);
                instances.flavorsList();
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('flavorsError'));

            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/flavors.json?per_page=50').respond(200, res['flavors']);
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/flavors.json?page=1&per_page=50').respond(500);
                instances.flavorsList();
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('flavorsError'));

            });
        });


        describe('powerAction function', function() {
            it('should exist', function() {
                expect(instances.powerAction).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.powerAction(1, 'start').then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });

            it('should log a error', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/2/power_action.json').respond(500);
                instances.powerAction(2, 'stop');
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('powerActionError'));

            });


        });

        describe('start function', function() {
            it('should exist', function() {
                expect(instances.start).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.start({id: 1}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });
        });

        describe('stop function', function() {
            it('should exist', function() {
                expect(instances.stop).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.stop({id: 1}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });
        });

        describe('restart function', function() {
            it('should exist', function() {
                expect(instances.restart).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.restart({id: 1}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });
        });

        describe('suspend function', function() {
            it('should exist', function() {
                expect(instances.suspend).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.suspend({id: 1}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });
        });

        describe('terminate function', function() {
            it('should exist', function() {
                expect(instances.terminate).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/vms/1/power_action.json').respond(200, res['power']);

                var data;
                instances.terminate({id: 1}).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));
                expect(toastr.success).toHaveBeenCalled();

            });
        });

        describe('broadcastAction function', function() {

            beforeEach(function() {
                spyOn($rootScope, '$broadcast');
            });

            it('should exist', function() {
                expect(instances.broadcastAction).not.toEqual(null);
            });

            it('should broadcast', function() {
                instances.broadcastAction('start');

                expect($rootScope.$broadcast).toHaveBeenCalledWith('instances:action', 'start');
            });

        });

        describe('one function', function() {
            it('should exist', function() {
                expect(instances.one).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/vms/1.json').respond(200, res['power']);

                var data;
                instances.one(1).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data.data).toEqual(jasmine.any(Object));

            });
        });

        describe('actionDisable function', function() {

            it('should exist', function() {
                expect(instances.actionDisable).not.toEqual(null);
            });

            it('should return false', function() {
                expect(instances.actionDisable(['on'], 'on')).toBeTruthy();
            });

        });

        describe('flavorDetails function', function() {

            beforeEach(function() {
                instances.flavors = [{id: 1}];
            });

            it('should exist', function() {
                expect(instances.flavorDetails).not.toEqual(null);
            });

            it('should return item', function() {
                expect(instances.flavorDetails(1)).toEqual({id: 1});
            });

        });

        describe('locationDetails function', function() {

            it('should exist', function() {
                expect(instances.locationDetails).not.toEqual(null);
            });

            it('should return item', function() {
                expect(instances.locationDetails('eu', 1)).toEqual({name: 'n/a'});
            });

        });


    });

    var res = [];

    res['vms'] = [
        {
            "id": 5667,
            "name": "testzt69",
            "provider_id": 1,
            "vendor": "amazon",
            "location": "ec2-52-210-241-162.eu-west-1.compute.amazonaws.com",
            "created_on": "2016-09-02T08:28:20.634Z",
            "updated_on": "2016-09-02T08:28:54.367Z",
            "guid": "34c3090a-70e7-11e6-98b1-06c1179ac85f",
            "power_state": "on",
            "state_changed_on": "2016-09-02T08:28:20.612Z",
            "template": false,
            "previous_state": null,
            "type": "ManageIQ::Providers::Amazon::CloudManager::Vm",
            "ems_ref": "i-1d130823",
            "flavor_id": 349,
            "cloud": true,
            "availability_zone_id": 10,
            "raw_power_state": "running",
            "last_scan_attempt_on": null,
            "last_perf_capture_on": null,
            "cloud_network_id": null,
            "cloud_subnet_id": null,
            "orchestration_stack_id": null,
            "tenant_id": 1,
            "description": "test zt",
            "retired": null,
            "retirement_state": null,
            "miq_group_id": 1,
            "evm_owner_id": 15,
            "retirement_requester": null,
            "key_pairs": [
                {
                    "id": 74,
                    "name": "zt-aws-lbn",
                    "resource_id": 11,
                    "resource_type": "ExtManagementSystem",
                    "created_on": "2016-08-02T15:32:41.261Z",
                    "updated_on": "2016-08-02T15:32:41.261Z",
                    "type": "ManageIQ::Providers::Amazon::CloudManager::AuthKeyPair",
                    "fingerprint": "d2:ee:bf:7a:93:79:a7:d9:a6:bc:f5:83:a6:8b:66:f5:6b:6d:4e:36",
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
            "security_groups": [
                {
                    "id": 123,
                    "name": "default",
                    "description": "default VPC security group",
                    "type": "ManageIQ::Providers::Amazon::NetworkManager::SecurityGroup",
                    "ems_id": 12,
                    "ems_ref": "sg-43ed2527",
                    "cloud_network_id": 8
                }
            ],
            "floating_ips": [],
            "cloud_subnets": [
                {
                    "id": 13,
                    "name": "SD_LAB_SUB_1C",
                    "ems_ref": "subnet-c13e62a4",
                    "ems_id": 12,
                    "availability_zone_id": 10,
                    "cloud_network_id": 8,
                    "cidr": "172.31.0.0/20",
                    "status": "available",
                    "type": "ManageIQ::Providers::Amazon::NetworkManager::CloudSubnet"
                }
            ],
            "cloud_networks": [
                {
                    "id": 8,
                    "name": "SD_LAB_VPC",
                    "ems_ref": "vpc-2288e447",
                    "ems_id": 12,
                    "cidr": "172.31.0.0/16",
                    "status": "inactive",
                    "enabled": true,
                    "type": "ManageIQ::Providers::Amazon::NetworkManager::CloudNetwork"
                }
            ],
            "miq_provision_template": {
                "id": 4,
                "vendor": "amazon",
                "name": "Ubuntu AMI",
                "location": "784568486242/Ubuntu AMI",
                "created_on": "2016-07-25T16:20:00.539Z",
                "updated_on": "2016-08-02T15:32:43.057Z",
                "guid": "a2b5a580-5283-11e6-859c-06c1179ac85f",
                "ems_id": 11,
                "uid_ems": "ami-2b3ebf58",
                "power_state": "never",
                "state_changed_on": "2016-07-25T16:20:00.534Z",
                "template": true,
                "miq_group_id": 1,
                "type": "ManageIQ::Providers::Amazon::CloudManager::Template",
                "ems_ref": "ami-2b3ebf58",
                "cloud": true,
                "raw_power_state": "never",
                "publicly_available": false,
                "tenant_id": 1
            },
            "ipaddresses": [
                "172.31.15.75",
                "52.210.241.162"
            ],
            "hostnames": [
                "ip-172-31-15-75.eu-west-1.compute.internal",
                "ec2-52-210-241-162.eu-west-1.compute.amazonaws.com"
            ],
            "allocated_disk_storage": "171798691840.0",
            "archived": false,
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
                    "id": 23233,
                    "event_type": "vm_create",
                    "message": "Policy resolved successfully!",
                    "timestamp": "2016-09-02T08:28:29.021Z",
                    "source": "POLICY",
                    "created_on": "2016-09-02T08:28:29.022Z",
                    "type": "MiqEvent",
                    "target_type": "VmOrTemplate",
                    "target_id": 5667
                },
                {
                    "id": 23234,
                    "event_type": "vm_provisioned",
                    "message": "Policy resolved successfully!",
                    "timestamp": "2016-09-02T08:28:29.244Z",
                    "source": "POLICY",
                    "created_on": "2016-09-02T08:28:29.245Z",
                    "type": "MiqEvent",
                    "target_type": "VmOrTemplate",
                    "target_id": 5667
                }
            ],
            "message": null,
            "success": null,
            "backup_retention": 0,
            "managed_service": 0,
            "schedule_id": null,
            "expiration_date": null
        }
    ];

    res['flavors'] = [
        {
            "name": "hg-15-ssd",
            "id": 660,
            "ems_id": 27,
            "description": null,
            "cpus": 4,
            "cpu_cores": null,
            "memory": 15728640000,
            "ems_ref": "ff48c2cf-c17f-4682-aaf6-31d66786f808",
            "type": "ManageIQ::Providers::Openstack::CloudManager::Flavor",
            "supports_32_bit": null,
            "supports_64_bit": null,
            "enabled": true,
            "supports_hvm": null,
            "supports_paravirtual": null,
            "block_storage_based_only": null,
            "cloud_subnet_required": null,
            "ephemeral_disk_size": 0,
            "ephemeral_disk_count": 0,
            "root_disk_size": 214748364800,
            "swap_disk_size": 0,
            "provider_id": 7
        }
    ];

    res['power'] = {
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
        "message": "The VM is terminated",
        "success": false,
        "backup_retention": 0,
        "managed_service": null,
        "schedule_id": null,
        "expiration_date": null
    };
})();

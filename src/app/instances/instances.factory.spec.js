(function() {
    'use strict';

    describe('service instances', function() {
        var instances;
        var $httpBackend;
        var $log;
        var APP_CONFIG;
        var toastr;

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
        beforeEach(inject(function(_instances_, _$httpBackend_, _$log_, _APP_CONFIG_, _toastr_) {
            instances = _instances_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            APP_CONFIG = _APP_CONFIG_;
            toastr = _toastr_;
            toastr = jasmine.createSpyObj('toastr', ['error', 'success']);
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
                expect($log.debug.logs).toEqual(jasmine.stringMatching('pageError'));
                expect(toastr.error).toHaveBeenCalled();
            });

        });

        /*
        describe('getContributors function', function() {
            it('should exist', function() {
                expect(githubContributor.getContributors).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('GET',  githubContributor.apiHost + '/contributors?per_page=1').respond(200, [{pprt: 'value'}]);
                var data;
                githubContributor.getContributors(1).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length === 1).toBeTruthy();
                expect(data[0]).toEqual(jasmine.any(Object));
            });

            it('should define a limit per page as default value', function() {
                $httpBackend.when('GET',  githubContributor.apiHost + '/contributors?per_page=30').respond(200, new Array(30));
                var data;
                githubContributor.getContributors().then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length === 30).toBeTruthy();
            });

            it('should log a error', function() {
                $httpBackend.when('GET',  githubContributor.apiHost + '/contributors?per_page=1').respond(500);
                githubContributor.getContributors(1);
                $httpBackend.flush();
                expect($log.error.logs).toEqual(jasmine.stringMatching('XHR Failed for'));
            });
        });
        */
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
})();

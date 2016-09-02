(function() {
    'use strict';

    describe('service tenants', function() {
        var tenants;
        var $httpBackend;
        var $log;
        var APP_CONFIG;
        var toastr;
        var $rootScope;
        var Restangular;
        var deferred;
        var $localForage;

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

        beforeEach(inject(function(_tenants_, _$httpBackend_, _$log_, _APP_CONFIG_, _toastr_, _$rootScope_, _Restangular_, $q, _$localForage_) {
            tenants = _tenants_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            APP_CONFIG = _APP_CONFIG_;
            toastr = _toastr_;
            $rootScope = _$rootScope_;
            Restangular = _Restangular_;
            $localForage = _$localForage_;

            spyOn(toastr, 'error');
            spyOn(toastr, 'success');

            deferred = $q.defer();

        }));

        it('should be registered', function() {
            expect(tenants).not.toEqual(null);
        });

        describe('ancestries variable', function() {
            it('should exist', function() {
                expect(tenants.ancestries).not.toEqual(null);
            });
        });

        describe('tenants variable', function() {
            it('should exist', function() {
                expect(tenants.tenants).not.toEqual(null);
            });
        });

        describe('totalLevel status', function() {
            it('should exist', function() {
                expect(tenants.totalLevel).not.toEqual(null);
            });
        });

        describe('currentTenant status', function() {
            it('should exist', function() {
                expect(tenants.currentTenant).not.toEqual(null);
            });
        });

        describe('init function', function() {

            beforeEach(function () {
                tenants.init();
            });

            it('should exist', function() {
                expect(tenants.init).not.toEqual(null);
            });

            it('should return currentTenant', function() {
                deferred.resolve(false);
                $rootScope.$digest();
                expect(tenants.currentTenant).toEqual(false);
            });

        });

        describe('allTenants function', function() {
            it('should exist', function() {
                expect(tenants.allTenants).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants.json?per_page=50').respond(200, res['tenants']);
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants.json?page=1&per_page=50').respond(200, res['tenants']);

                var data;
                tenants.allTenants().then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length === 1).toBeTruthy();
                expect(data[0]).toEqual(jasmine.any(Object));
            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants.json?per_page=50').respond(500);
                tenants.allTenants();
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('allTenantsError'));

            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants.json?per_page=50').respond(200, res['tenants']);
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants.json?page=1&per_page=50').respond(500);
                tenants.allTenants();
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('allTenantsError'));

            });
        });


        describe('getChildrens function', function() {
            it('should exist', function() {
                expect(tenants.getChildrens).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants/1/tenants.json').respond(200, res['tenants']);

                var data;
                tenants.getChildrens(1).then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));

            });

            it('should log a error', function() {
                $httpBackend.when('GET',  APP_CONFIG.API_URL + '/tenants/2/tenants.json').respond(500);
                tenants.getChildrens(2);
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('getChildrensError'));

            });


        });

        describe('setCurrent function', function() {

            beforeEach(function() {
                spyOn($rootScope, '$broadcast');
            });

            it('should exist', function() {
                expect(tenants.setCurrent).not.toEqual(null);
            });

            it('should broadcast', function() {
                tenants.setCurrent({id: 1});

                expect($rootScope.$broadcast).toHaveBeenCalledWith('tenants:change', {id: 1});
            });

        });

        describe('all function', function() {
            it('should exist', function() {
                expect(tenants.all).not.toEqual(null);
            });

        });

        describe('nested function', function() {
            it('should exist', function() {
                expect(tenants.nested).not.toEqual(null);
            });

        });



    });

    var res = [];

    res['tenants'] = [
        {
            "errors": {},
            "id": 111,
            "name": "Tenant-chef-organization-6",
            "ancestry": "1/2/24/64",
            "divisible": true,
            "description": "Tenant chef organization 6",
            "use_config_for_attributes": false,
            "default_miq_group_id": 771,
            "tenant_quotas": [],
            "pricing_model_id": 1,
            "disabled_providers": []
        }
    ];



})();

(function () {
    'use strict';

    fdescribe('service auth', function () {
        var auth;
        var $httpBackend;
        var $log;
        var APP_CONFIG;
        var toastr;
        var $rootScope;
        var Restangular;
        var deferred;
        var $localForage;
        var $auth;

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

        beforeEach(inject(function (_auth_, _$httpBackend_, _$log_, _APP_CONFIG_, _toastr_, _$rootScope_, _Restangular_, $q, _$localForage_, _$auth_) {
            deferred = $q.defer();

            auth = _auth_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            APP_CONFIG = _APP_CONFIG_;
            toastr = _toastr_;
            $rootScope = _$rootScope_;
            Restangular = _Restangular_;
            $localForage = _$localForage_;
            $auth = _$auth_;
            spyOn(toastr, 'error');
            spyOn(toastr, 'success');

            $auth.validateUser = jasmine.createSpy('validateUser').and.returnValue(deferred.promise);


        }));

        it('should be registered', function () {
            expect(auth).not.toEqual(null);
        });

        describe('user variable', function() {
            it('should exist', function() {
                expect(auth.user).toEqual(jasmine.any(Object));
            });
        });

        describe('login function', function() {
            it('should exist', function() {
                expect(auth.login).not.toEqual(null);
            });

            it('should return data', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/auth/sign_in').respond(200, {});

                var data;
                auth.login('username', 'password').then(function(fetchedData) {
                    data = fetchedData;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Object));

            });

            it('should log a error', function() {
                $httpBackend.when('POST',  APP_CONFIG.API_URL + '/auth/sign_in').respond(500);
                auth.login('username', 'password');
                $httpBackend.flush();
                expect(toastr.error).toHaveBeenCalled();
                expect($log.debug.logs).toEqual(jasmine.stringMatching('loginError'));

            });
        });

        describe('me function', function() {

            beforeEach(inject(function(_$rootScope_) {
                auth.me();
                $rootScope = _$rootScope_;
                auth.setUser = jasmine.createSpy('setUser').and.returnValue();
            }));

            it('should exist', function() {
                expect(auth.me).not.toEqual(null);
            });

            it('should call $auth service', function() {
                expect($auth.validateUser).toHaveBeenCalled();
            });

            describe('when the $auth.validateUserSuccess is executed,', function() {

                it('should return data', function() {
                    $httpBackend.when('GET',  APP_CONFIG.API_URL + '/auth/me').respond(200, {});

                    deferred.resolve();
                    $rootScope.$digest();

                    $httpBackend.flush();
                    expect(auth.setUser).toHaveBeenCalled();
                });

                it('should log a error', function() {
                    $httpBackend.when('GET',  APP_CONFIG.API_URL + '/auth/me').respond(500);

                    deferred.resolve();
                    $rootScope.$digest();

                    $httpBackend.flush();
                    expect(toastr.error).toHaveBeenCalled();

                });

            });
        });

        describe('setUser function', function() {

            beforeEach(inject(function(_$rootScope_) {
                $rootScope = _$rootScope_;
                $localForage.setItem = jasmine.createSpy('setItem').and.returnValue(deferred.promise);
            }));

            it('should exist', function() {
                expect(auth.setUser).not.toEqual(null);
            });

            it('should call $auth service', function() {
                auth.setUser({id: 1}, function(user) {

                    it('should call $localForage service', function() {
                        expect($localForage.setItem).toHaveBeenCalled();
                    });

                    describe('when the $localForage.setItem is executed,', function() {

                        it('should return data', function() {

                            deferred.resolve();
                            $rootScope.$digest();

                            $httpBackend.flush();
                            expect(auth.user).toEqual({id: 1});
                            expect(user).toEqual({id: 1});
                        });

                        it('should reject', function() {

                            deferred.reject({});
                            $rootScope.$digest();

                            $httpBackend.flush();
                            expect(auth.user).toEqual({});
                            expect(user).toEqual({});
                        });

                    });

                });
            });

        });




    });


})();

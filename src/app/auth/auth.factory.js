(function () {
    'use strict';

    angular
    .module('app')
    .factory('auth', auth);

    /** @ngInject */
    function auth($q, $auth, topLoader, toastr, lodash, $log, $http, APP_CONFIG, $localForage, tenants) {

        var service = {
            user: {},
            login: login,
            me: me,
            setUser: setUser,
            setDefaultTenant: setDefaultTenant
        };

        return service;

        function login(username, password) {
            var deferred = $q.defer();

            topLoader.show();

            $auth.submitLogin({
                miq_userid: username,
                password: password,
            })
            .then(loginSuccess)
            .catch(loginError);

            function loginSuccess(res) {
                topLoader.hide();
                deferred.resolve(res);
            }

            function loginError(err) {
                $log.debug('loginError', err);
                topLoader.hide();
                toastr.error(err.errors[0], lodash.capitalize(err.reason));
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function me() {

            var deferred = $q.defer();

            $auth.validateUser().then(validateUserSuccess);

            function validateUserSuccess() {

                $http.get(APP_CONFIG.API_URL + '/auth/me').then(meSuccess).catch(meError);

                function meSuccess(res) {
                    service.setUser(res.data, deferred.resolve);
                }

                function meError(err) {
                    toastr.error('Error', JSON.stringify(err));
                    deferred.reject(err);

                }

            }

            return deferred.promise;
        }

        function setUser(user, cb) {
            $localForage.setItem('user', user).then(setUserSuccess).catch(setUserError);

            function setUserSuccess() {
                service.user = user;
                cb(user);
            }

            function setUserError() {
                cb(user);
            }
        }

        function setDefaultTenant() {
            return tenants.setCurrent(service.user.tenant.id);
        }


    }
})();

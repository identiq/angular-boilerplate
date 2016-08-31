(function () {
    'use strict';

    angular
    .module('app')
    .controller('AuthController', AuthController);

    /** @ngInject */
    function AuthController(auth, $state, topLoader, tenants) {
        var vm = this;

        vm.loginForm = {};
        vm.handleLogin = handleLogin;

        function handleLogin() {

            topLoader.show();

            auth.login(vm.loginForm.username, vm.loginForm.password)
            .then(auth.me)
            .then(auth.setDefaultTenant)
            .then(loginSuccess)
            .catch(loginError);

            function loginSuccess() {
                $state.go('app.dashboard');
            }

            function loginError() {

            }


        }

    }
})();
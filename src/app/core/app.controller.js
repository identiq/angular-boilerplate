(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', AppCtrl);

    /** @ngInject */
    function AppCtrl($scope, $rootScope, $state, $document, appConfig, $auth, auth) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;

        activate();

        $scope.$watch('main', function (newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);

        function activate() {

            auth.me().then(meSuccess).catch(meError);

            function meSuccess(user) {
                $rootScope.user = user;
            }

            function meError() {

            }
        }

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });

        $rootScope.handleLogout = function() {
            $auth.signOut()
            .then(logoutSuccess)
            .catch();

            function logoutSuccess() {
                $state.go('login');
            }
        };

    }

})(); 
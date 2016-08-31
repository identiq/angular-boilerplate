(function () {
    'use strict';

    angular
    .module('app')
    .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/auth/login.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        })

        .state('app', {
            url: '/app',
            abstract: true,
            template: '<ui-view/>',
            resolve: {
                auth: authenticateRoute
            }
        })

        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/dashboard/dashboard.html',
            controllerAs: 'vm',
            resolve: {
                tenants: tenantsRoute
            }
        })

        .state('app.instances', {
            url: '/instances',
            templateUrl: 'app/instances/instances.html',
            controller: 'InstanceController',
            controllerAs: 'vm',
            resolve: {
                currentTenantId: currentTenantRoute,
                instancesList: instancesRoute,
                flavorsList: flavorsRoute,
                providersList: providersRoute
            }
        })

        .state('app.requests', {
            url: '/requests',
            templateUrl: 'app/requests/requests.html',
            controller: 'RequestController',
            controllerAs: 'vm',
            resolve: {
                currentTenantId: currentTenantRoute,
                requestsList: requestsRoute
            }
        });


        $urlRouterProvider.otherwise('/app/dashboard');

        function authenticateRoute($auth, $state) {
            return $auth.validateUser()
            .catch(function () {
                $state.go('login');
            });
        }

        /** @ngInject */
        function tenantsRoute(tenants) {
            return tenants.all();
        }

        /** @ngInject */
        function currentTenantRoute(tenants) {
            return tenants.getCurrentResolve();
        }

        /** @ngInject */
        function instancesRoute(instances, currentTenantId) {
            return instances.page(1, currentTenantId);
        }

        /** @ngInject */
        function flavorsRoute(instances) {
            return instances.flavorsList();
        }

        /** @ngInject */
        function providersRoute(instances) {
            return instances.providersList();
        }

        /** @ngInject */
        function requestsRoute(requests) {
            return requests.page();
        }

        /*
         function meRoute($localForage, $q, $log) {
         var deferred = $q.defer();

         $localForage.getItem('user').then(getItemSuccess).catch(getItemError);

         function getItemSuccess(user) {
         $log.debug(user);
         }

         function getItemError(err) {
         $log.debug(err);

         }

         return deferred.promise;
         }
         */

    }

})();


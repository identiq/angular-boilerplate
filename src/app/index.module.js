(function () {
  'use strict';

  angular
  .module('app', [
    'LocalForageModule',
    'ngLodash',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'restangular',
    'ui.router',
    'mgcrea.ngStrap',
    'toastr',
    'angularMoment',

    // App
    'app.core'

    // Custom Feature modules
    , 'app.chart'
    , 'app.ui'
    , 'app.ui.form'
    , 'app.ui.form.validation'
    , 'app.page'
    , 'app.table'

    // 3rd party feature modules
    , 'mgo-angular-wizard'
    , 'ui.tree'
    , 'ngMap'
    , 'textAngular'

    // Selfdeploy
    , 'ng-token-auth'
    , 'ui.gravatar'

  ]);

})();
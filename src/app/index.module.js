(function() {
  'use strict';

  angular
    .module('app', [

      'ngAnimate',
      'ngCookies',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'restangular',
      'ui.router',
      'mgcrea.ngStrap',
      'toastr',

      // App
      'app.core'

      // Custom Feature modules
      ,'app.chart'
      ,'app.ui'
      ,'app.ui.form'
      ,'app.ui.form.validation'
      ,'app.page'
      ,'app.table'

      // 3rd party feature modules
      ,'mgo-angular-wizard'
      ,'ui.tree'
      ,'ngMap'
      ,'textAngular'

    ]);

})();
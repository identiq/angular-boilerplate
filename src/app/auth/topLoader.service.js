(function() {
  'use strict';

  angular
  .module('app')
  .service('topLoader', topLoader);

  /** @ngInject */
  function topLoader($rootScope) {

    var service = {
      show: show,
      hide: hide
    };

    return service;

    function show() {
      $rootScope.$broadcast('preloader:active');

    }
    function hide() {
      $rootScope.$broadcast('preloader:hide');
    }
  }
})();

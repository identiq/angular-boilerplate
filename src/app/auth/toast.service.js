(function() {
  'use strict';

  angular
  .module('app')
  .service('toast', toast);

  /** @ngInject */
  function toast($mdToast) {

    var conf = {
      delay: 6000,
      position: 'top right'
    };

    var service = {
      error: error
    };

    return service;

    function error(message) {
      $mdToast
      .simple()
      .content(message)
      .position(conf.position)
      .hideDelay(conf.delay);
      //.toastClass('md-toast-ink-ripple')

    }

  }
})();

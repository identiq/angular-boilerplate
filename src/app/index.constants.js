/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('app')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('APP_CONFIG', {
      API_URL: 'https://api.dev.emea.sd.lbn.fr/v1'
    });

})();

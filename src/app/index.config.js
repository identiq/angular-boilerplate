(function () {
  'use strict';

  angular
  .module('app')
  .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, RestangularProvider, $authProvider, gravatarServiceProvider, $localForageProvider, APP_CONFIG) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    RestangularProvider.setBaseUrl(APP_CONFIG.API_URL);
    RestangularProvider.setRequestSuffix('.json');
    RestangularProvider.setFullResponse(true);

    $authProvider.configure({
      apiUrl: APP_CONFIG.API_URL,
      passwordResetSuccessUrl: '/forgot'
    });

    gravatarServiceProvider.defaults = {
      size: 100,
      "default": 'mm'  // See https://github.com/wallin/angular-gravatar
    };

    $localForageProvider.config({
      name: 'API'
    });
  }
})();

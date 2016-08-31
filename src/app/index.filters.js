/* global malarkey:false, moment:false */
(function () {
    'use strict';

    angular
    .module('app')
    .filter('capitalize', capitalize);

    /** @ngInject */
    function capitalize(lodash) {
        return function(v) {
            return lodash.capitalize(v).replace('_', ' ');
        }

    }


})();

import 'angular';

angular.module('debug.module', []);

angular.element(document).ready(() => {
    angular.bootstrap(document, ['debug.module']);
});
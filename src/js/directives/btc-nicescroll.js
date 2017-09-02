angular.module('web').directive('btcNicescroll', ['appConfig', function(appConfig) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.niceScroll(element.find('table'), appConfig.niceScroll);
        }
    }
}]);
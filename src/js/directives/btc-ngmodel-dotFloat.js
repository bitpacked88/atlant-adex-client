angular.module('web').directive('btcNgmodelDotFloat', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(text) {
                return text.replace(/,/g, '.');
            });
        }
    }
});
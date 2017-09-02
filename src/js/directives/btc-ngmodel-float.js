angular.module('web').directive('btcNgmodelFloat', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (text) {
                var transformedInput = text.replace(/[^0-9\.]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }

                return transformedInput;
            });
        }
    }
});
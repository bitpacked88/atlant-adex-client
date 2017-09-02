angular.module('web').directive('btcNgmodelTofixed', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function(data) {
                return angular.isNumber(data) ? data.toFixed(3) : data;
            });
        }
    }
});
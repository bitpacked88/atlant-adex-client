angular.module('web').directive('btcGatewayField', [function() {
    return {
        restrict: 'A',
        templateUrl: function(el, attr){
            return 'views/directives/btc-gateway-field.html';
        },
        scope: {
            field: '='
        },
        controller: ['$scope', '$element', function($scope, $element){}],
        link: function(scope, element, attrs){}
    }
}]);
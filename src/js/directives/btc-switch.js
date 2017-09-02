angular.module('web').directive('btcSwitch', [function() {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/btc-switch.html',
        scope: {
            state: '='
        },
        link: function ($scope) {
            $scope.toggle = function(){
                $scope.state = !$scope.state;
            };
        }
    }
}]);
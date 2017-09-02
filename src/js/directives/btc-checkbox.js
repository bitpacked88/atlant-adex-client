angular.module('web').directive('btcCheckbox', [function() {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/btc-checkbox.html',
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
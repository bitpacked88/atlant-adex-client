angular.module('web').directive('btcInnerLoader', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/btc-inner-loader.html',
        scope: {
            show: '='
        },
        controller: ['$scope', '$attrs', function ($scope, attrs) {
            $scope.title = attrs.title || 'Loading...';
        }]
    }
});
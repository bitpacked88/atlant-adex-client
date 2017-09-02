angular.module('web').directive('btcShowMore', [function() {
    return {
        restrict: 'C',
        template: '<span ng-hide="hide || isLoading" class="button" ng-click="onClick()">{{title}}</span><span class="_local-loading-plane" ng-show="isLoading">Loading...</span>',
        scope: {
            limit: '=',
            count: '=',
            offset: '=',
            isLoading: '='
        },
        controller: ['$scope', '$attrs', function($scope, $attrs){
            $scope.hide = true;
            $scope.title = $attrs.title || 'Show more';

            $scope.$watch('isLoading', function(){
                if ($scope.isLoading);
            });

            $scope.$watchGroup(['count', 'offset'], function(){
                $scope.hide = $scope.offset + $scope.limit >= $scope.count;

            });

            $scope.onClick = function(){
                $scope.offset += $scope.limit;
            }
        }]
    }
}]);
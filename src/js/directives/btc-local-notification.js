angular.module('web').directive('btcLocalNotification', [function() {
    return {
        restrict: 'A',
        template: '<div class="btc-local-notification" ng-show="btcLocalNotification">{{btcLocalNotification}}</div>',
        scope: {
            btcLocalNotification: '='
        },
        controller: ['$scope', '$attrs', 'apiService', function($scope, attrs){

        }]
    }
}]);
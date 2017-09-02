angular.module('web').directive('btcLocalNotificationHtml', [function() {
    return {
        restrict: 'A',
        template: '<div class="btc-local-notification" ng-show="btcLocalNotification">{{btcLocalNotification}}</div>',
        scope: {
            btcLocalNotificationHtml: '='
        },
        controller: ['$scope', '$attrs', 'apiService', function($scope, attrs){
            //console.log($scope.btcLocalNotificationHtml);
            //console.log(attrs);
            //attrs.ngBindHtml = $scope.btcLocalNotificationHtml
        }],
        link: function(scope, element, attrs) {
            console.log(scope);
            //attrs.ngBindHtml = scope.btcLocalNotificationHtml
        }
    }
}]);
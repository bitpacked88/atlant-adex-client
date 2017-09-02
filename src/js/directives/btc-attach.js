angular.module('web').directive('btcAttach', [function() {
    return {
        restrict: 'A',
        templateUrl: 'views/directives/btc-attach.html',
        scope: {
            files: '='
        },
        controller: ['$scope', '$attrs', 'apiService', function($scope, attrs, apiService){
            $scope.title = attrs.title;

            $scope.$watch('selected', function(){
                Array.prototype.push.apply($scope.files, $scope.selected);
            });

            $scope.submitFiles = function(){
                angular.forEach($scope.files, function(file){
                    apiService.upload(apiService.methods.verification.sendDocs, file);
                });
            }
        }]
    }
}]);
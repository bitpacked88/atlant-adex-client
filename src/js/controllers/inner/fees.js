angular.module('web').controller('innerFeesCtrl',['$scope', '$rootScope', 'apiService', function($scope, $rootScope, apiService){
    $rootScope.rootTitle = 'Fees';

    $scope.deposits = [];
    $scope.withdrawals = [];

    /*apiService.get(apiService.methods.fiat.methods).then(function(result) {
        for(var i in result.data.result) {
            var method = result.data.result[i];
            if(method.side) {
                $scope.deposits.push(method);
            } else {
                $scope.withdrawals.push(method);
            }
        }
    });*/

}]);

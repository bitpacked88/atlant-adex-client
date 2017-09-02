!function () {
    InnerAccountsColumnCtrl.$inject = ['$rootScope', '$scope', 'appMessages', 'authService', 'apiService'];

    function InnerAccountsColumnCtrl($rootScope, $scope, appMessages, authService, apiService) {
        $scope.show = authService.isLoggedIn();
        $scope.user = {};

        if($scope.show){
            apiService.get(apiService.methods.member.myProfile).then(function(res){
                var data = res.data;
                if (data.code==0){
                    $scope.user = data.result;

                    $scope.verified = $scope.user.proofOfIdentityConfirmed && $scope.user.proofOfResidencyConfirmed;
                    $scope.statusText = $scope.verified ? 'Documents accepted, account verified' : 'Account not verified';
                    authService.setAfterReload(data.result);
                }

                $rootScope.$broadcast(appMessages.system.profileLoaded, data);
            });
        }


    }

    angular.module('web').controller('innerAccountsColumnCtrl', InnerAccountsColumnCtrl);
}();
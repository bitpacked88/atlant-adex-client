!function () {
    InnerHistoryCtrl.$inject = ['$scope', '$rootScope', 'apiService', 'appConfig', 'splashService'];
    function InnerHistoryCtrl($scope, $rootScope, apiService, appConfig, splashService) {

        var vm = this;
        vm.data = [];
        vm.limit = appConfig.itemsPerPage;
        vm.offset = 0;
        vm.count = 0;
        vm.list = {
            0: 'Login',
            1: 'Logout',
            2: '2FA toggled',
            3: 'Password reset',
            4: 'Password change',
            5: 'Profile updated'
        };

        $rootScope.rootTitle = 'Security Log';
        $scope.pageIsLoaded = false;
        $scope.showLocalLoading = false;

        function request(offset) {
            $scope.localSplash("start");
            apiService.get(apiService.methods.account.securityLog, {
                limit: vm.limit,
                offset: offset
            }).then(function (res) {
                var data = res.data;
                if (data.code == 0) {
                    vm.count = data.result.count;

                    Array.prototype.push.apply(vm.data, data.result.items);

                    $scope.processing = false;
                    // throw new Error("Let's look");
                }
            }).finally(function () {
                $scope.localSplash("finish");
            });
        }

        $scope.localSplash = function(whatToDo){
            if (whatToDo === "start" ){
                $scope.pageIsLoaded   ?   $scope.showLocalLoading = true    :   splashService.start();
            }else if (whatToDo === "finish" ){
                $scope.pageIsLoaded   ?   $scope.showLocalLoading = false   :   ( function(){ $scope.pageIsLoaded = true; splashService.finish(); } )();
            }
        };

        $scope.$watch(function () { return vm.offset; }, request);

    }

    angular.module('web').controller('innerHistoryCtrl', InnerHistoryCtrl);
}();
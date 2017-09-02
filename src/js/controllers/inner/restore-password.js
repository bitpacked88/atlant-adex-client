!function () {
    angular.module('web').controller('innerRestorePasswordCtrl', ['$state', '$timeout', '$stateParams', '$scope', '$rootScope', 'apiService', Controller]);
    function Controller($state, $timeout, $stateParams, $scope, $rootScope, apiService) {
        $scope.password = "";
        $scope.confirmPassword = "";
        $scope.submitLabel = 'Set password';

        $rootScope.rootTitle = "Password Restore";

        $scope.submitAction = function (event) {
                    console.log('restore action');
                    if(event.keyCode == 13) {
                        $scope.restorePassword();
                    }
                };

        $scope.restorePassword = function () {
            $scope.alertToShow = '';
            $scope.submitLabel = 'Loading...';

            apiService.post(apiService.methods.member.finishPasswordRestore($stateParams.code), {
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            }).then(function (res) {
                if (res.data.code === 0) {
                    $scope.successMessage = 'Your password has been set. You will now be redirected to the main page for signing in...';

                    $timeout(function () {
                        $state.go("root.desktop.main");
                    }, 3000);
                }
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 5)
                    $scope.alertToShow = 'Minimal password length is 6 symbols';
                else if (res.data.code === 6)
                    $scope.alertToShow = "Email code is invalid. Please try again.";
                else if (code == 8)
                    $scope.alertToShow = 'Minimal password length is 6 symbols';
                else if (code == 9)
                    $scope.alertToShow = 'Password mismatch. Please make sure you entered two identical passwords';
                else
                    $scope.alertToShow = 'Unexpected error';

                $scope.submitLabel = 'Set password';
            });
        }
    }
}();

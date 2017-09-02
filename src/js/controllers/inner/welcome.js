!function () {
    angular.module('web').controller('innerWelcomeCtrl', ['authService', '$state', '$stateParams', '$rootScope', '$scope', 'apiService', 'appMessages', 'modalService', Controller]);
    function Controller(authService, $state, $stateParams, $rootScope, $scope, apiService, appMessages, modalService) {
        $rootScope.rootTitle = "Welcome to ATLANT DEX";

        $scope.toShow = 0;
        $scope.phoneAttached = false;
        $scope.alertToShow = undefined;
        $scope.submitLabel = 'Get started';

        $scope.password = "";
        $scope.confirmPassword = "";
        $scope.isLoading = true;
        $scope.displayForm = false;

        apiService.put(apiService.methods.member.regcheck($stateParams.code), false).then(function (res) {
            $scope.isLoading = false;
            $scope.displayForm = true;
        }).catch(function (res) {
            $scope.isLoading = false;
            $scope.displayForm = false;

            if (res.data.code == 6)
                $scope.alertToShow = 'Confirmation code is invalid';
            else
                $scope.alertToShow = 'An error occurred';
        });

        $rootScope.$on(appMessages.twoFA.phoneVerified.onWelcome, function () {
            $scope.phoneAttached = true;
        });

        $scope.attachPhone = function (e) {
            e.preventDefault();
            modalService.twoFA({todo: "register", guid: $stateParams.code});
        };

        $scope.submitAction = function (event) {
            console.log('submit action');
            if(event.keyCode == 13) {
                $scope.savePassword();
            }
        };

        $scope.savePassword = function () {
            $scope.alertToShow = '';
            $scope.submitLabel = 'Loading...';

            apiService.post(apiService.methods.member.regfinish($stateParams.code), {
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            }).then(function (res) {
                if (res.data.code === 0) {
                    authService.applyLogin(res.data.result);
                    $state.go("root.desktop.main");
                }
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 5)
                    $scope.alertToShow = 'Minimal password length is 6 symbols';
                else if (code == 8)
                    $scope.alertToShow = 'Minimal password length is 6 symbols';
                else if (code == 9)
                    $scope.alertToShow = 'Password mismatch. Please make sure you entered two identical passwords';

                $scope.submitLabel = 'Get started';
            });
        }
    }
}();

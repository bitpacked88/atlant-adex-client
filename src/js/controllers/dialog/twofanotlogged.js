(function () {
    angular.module('web').controller('dialogTwofaNotLoggedCtrl', ['$scope', '$rootScope', 'authService', 'modalService', 'apiService', 'appMessages', '$interval', '$timeout', Controller]);

    function Controller($scope, $rootScope, authService, modalService, apiService, appMessages, $interval, $timeout) {
        var action = $scope.twoFAParams.todo;

        // vars
        $scope.twoFAParams.smsCode = "";
        $scope.toShow = undefined;

        $scope.newRequestAllowed = true;
        $scope.newRequestAllowedTimerMessage = undefined;

        $scope.operationsToConfirm = {
            'restorePassword': 'password reset'
        };

        $scope._title = $scope.operationsToConfirm[action];

        $scope.resendCode = function (e) {
            if (e)e.preventDefault();

            if ($scope.newRequestAllowed === false) return;

            $scope.error = undefined;

            apiService.post(apiService.methods.member.requestPasswordRestore, {email: $scope.twoFAParams.email}).then(function (res) {
                $scope.toShow = "code_input"; // show code input
                $scope.forbidNewRequest();
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 12)
                    $scope.error = 'Invalid phone number format';
                else if (code == 14)
                    $scope.error = "One minute has not been expired since last code request";
                else if (code == 37)
                    $scope.toShow = "2FA codes limit exceeded";
                else if (code == 92)
                    $scope.toShow = "2FA codes daily limit exceeded";
                else
                    $scope.error = 'An error occurred';
            });
        };

        $scope.forbidNewRequest = function () {
            var newRequestAllowedTimer = 60;

            $scope.newRequestAllowed = false;
            $scope.newRequestAllowedTimerMessage = undefined;
            $scope.secondsInterval = $interval(function () {
                newRequestAllowedTimer -= 1;
                if (newRequestAllowedTimer === 0) {
                    $scope.newRequestAllowed = true;
                    $scope.newRequestAllowedTimerMessage = undefined;
                    $interval.cancel($scope.secondsInterval);
                    $scope.secondsInterval = undefined;
                    return;
                }
                $scope.newRequestAllowedTimerMessage = "New code request will be available in " + newRequestAllowedTimer + " seconds";
            }, 1000);
        };

        $scope.sendCode = function () {
            $scope.error = undefined;

            // send code
            apiService.post(apiService.methods.member.confirmRequestPasswordRestore, {
                code: $scope.twoFAParams.smsCode,
                email: $scope.twoFAParams.email
            }).then(function (res) {
                $scope.toShow = "result_okay";

                if ($scope.twoFAParams.cb)
                    $scope.twoFAParams.cb();

                $timeout(function () {
                    $scope.$close()
                }, 3000);
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 13)
                    $scope.error = 'Incorrect 2FA code. Please request a new one.';
                else if (code == 37)
                    $scope.toShow = "2FA codes limit exceeded";
                else if (code == 92)
                    $scope.toShow = "2FA codes daily limit exceeded";
                else
                    $scope.error = 'An error occurred';
            });
        };

        $scope.toShow = "code_input";
    }
}());



    //  this contains all the actions around 2fa:
    // inputting phone and showing code for confirming operations
    // (code for all operations via one view)



(function(){
    angular.module('web').controller('dialogWithdrawConfirmCtrl',['$rootScope', 'appNotifications', '$scope', 'apiService', '$interval', Controller]);

    function Controller($rootScope, appNotifications, $scope, apiService, $interval) {
        var params = $scope.params,
            url = apiService.methods[params.gateway].confirmTransaction(params.currency, params.transactionId);

        $scope.submitLabel = 'Confirm';
        if(params.type == 'sms')
            $scope.send_type = 'SMS';
        else
            $scope.send_type = params.type == 'telegram' ? 'Telegram' : 'Email';

        $scope.newRequestAllowed = false;

        $scope.sendCode = function () {
            var params = {code: $scope.twoFAParams.smsCode},
                apiMethods = {
                    enable2fa: apiService.methods.member.confirmEnable2fa,
                    disable2fa: apiService.methods.member.confirmDisable2fa,
                    register: apiService.methods.member.verifyphone,
                    restorePassword: apiService.methods.member.confirmRequestPasswordRestore,
                    changePassword: apiService.methods.member.confirmChangePassword
                };

            var requestedUrl = apiMethods[action];

            if (action == "register") {
                params.phoneNumber = $scope.twoFAParams.phoneNumber;
                requestedUrl = requestedUrl + '/' + $scope.twoFAParams.guid;
            } else if (action == 'restorePassword')
                params.email = $scope.twoFAParams.email;
            else if (action == 'changePassword') {
                params.oldPassword = $scope.twoFAParams.oldPassword;
                params.newPassword = $scope.twoFAParams.newPassword;
                params.confirmPassword = $scope.twoFAParams.confirmPassword;
            }

            $scope.error = undefined;

            // send code
            apiService.post(requestedUrl, params).then(function (res) {
                if (action === "enable2fa" || action === "disable2fa")
                $rootScope.$broadcast(appMessages.twoFA.switched, {done: action});
                else if (action === "register")
                    $rootScope.$broadcast(appMessages.twoFA.phoneVerified.onWelcome);

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

        $scope.resendCode = function () {

            if ($scope.newRequestAllowed === false) return;

            $scope.error = undefined;

            apiService.get(apiService.methods[params.gateway].resendConfirmationCode(params.currency, $scope.params.transactionId)).then(function (res) {
                $scope.forbidNewRequest()
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
            var newRequestAllowedTimer = $scope.type == 'sms' ? 60 : 10;

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

        $scope.confirm = function(){
            $scope.errorMessage = '';
            $scope.submitLabel = 'Loading...';

            apiService.post(url, {code: $scope.code}).then(function(res){
                appNotifications.show(2001);
                if($scope.cb) {
                    $scope.cb(res);
                }

                $scope.$close();
            }).catch(function(res) {
                var code = res.data.code;
                if (code == 13) {
                    $scope.error = 'Incorrect 2FA code. Please request a new one.';
                }
                else if (code == 25)
                    $scope.error = "Insufficient funds";
                else
                    $scope.error = 'An error occurred';
            }).finally(function(){
                $scope.submitLabel = 'Confirm';
            });
        };

        $scope.forbidNewRequest();
    }
}());
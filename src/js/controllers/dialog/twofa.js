//  this contains all the actions around 2fa:
// inputting phone and showing code for confirming operations
// (code for all operations via one view)


(function () {
    angular.module('web').controller('dialogTwofaCtrl', ['$scope', '$rootScope', 'authService', 'modalService', 'apiService', 'appMessages', '$interval', '$timeout', Controller]);

    function Controller($scope, $rootScope, authService, modalService, apiService, appMessages, $interval, $timeout) {
        var action = $scope.twoFAParams.todo;

        // vars
        $scope.twoFAParams.smsCode = "";
        $scope.toShow = undefined;
        // phone_number_input
        // code_input
        // code_sending_result

        $scope.submit = function() {

        };

        $scope.newRequestAllowed = true;
        $scope.newRequestAllowedTimerMessage = undefined;

        $scope.operationsToConfirm = {
            'enable2fa': 'enabling 2-factor authentication',
            'disable2fa': 'disabling 2-factor authentication',
            'register': 'phone confirmation',
            'restorePassword': 'password reset',
            'changePassword': 'password change'
        };

        $scope.types = [
            {id: 'sms', name: 'SMS'},
            {id: 'telegram', name: 'Telegram'}
        ];
        $scope.type = $scope.twoFAParams.defaultType || 'sms';

        $scope._title = $scope.operationsToConfirm[action];

        // functions
        $scope.getDefaultType = function(){
            return $scope.type == 'sms' ? 'SMS' : 'Telegram';
        };

        $scope.getAlternateType = function(){
            return $scope.type == 'sms' ? 'Telegram' : 'SMS';
        };

        $scope.requestCode = function () {
            var toShow = $scope.toShow;

            $scope.loading = true;
            $scope.toShow = '';

            var requestParams = {}, apiMethod, reqMethod;

            if (action == "enable2fa") {
                requestParams = {phoneNumber: $scope.twoFAParams.phoneNumber, type: $scope.type};
                apiMethod = apiService.methods.member[$scope.twoFAParams.todo];
                reqMethod = "put";
            } else if (action == "disable2fa") {
                apiMethod = apiService.methods.member[$scope.twoFAParams.todo];
                reqMethod = "put";
            } else if (action == "register") {
                requestParams = {phoneNumber: $scope.twoFAParams.phoneNumber, type: $scope.type};
                apiMethod = apiService.methods.member.regphone($scope.twoFAParams.guid);
                reqMethod = "post";
            }

            apiService[reqMethod](apiMethod, requestParams).then(function (res) {
                $scope.forbidNewRequest();
                $scope.toShow = "code_input";
            }).catch(function (res) {
                $scope.toShow = toShow;
                var code = res.data.code;
                if (code == 12)
                    $scope.error = 'Invalid phone number format';
                else if (code == 13)
                    $scope.error = 'Incorrect 2FA code. Please request a new one.';
                else if (code == 14)
                    $scope.error = "One minute has not been expired since last code request";
                else if (code == 37)
                    $scope.toShow = "2FA codes limit exceeded";
                else if (code == 92)
                    $scope.toShow = "2FA codes daily limit exceeded";
                else
                    $scope.error = 'An error occurred';
            }).finally(function () {
                $scope.loading = false;
            });
        };

        $scope.resendCode = function (e, alternate) {
            if (e)e.preventDefault();

            if ($scope.newRequestAllowed === false) return;

            $scope.error = undefined;

            var type = $scope.type;
            if(alternate)
                type = $scope.type == 'sms' ? 'telegram' : 'sms';

            var resendRequest = {
                phoneNumber: $scope.twoFAParams.phoneNumber //encodeURIComponent($scope.twoFAParams.phoneNumber)
            };

            if(type != undefined)
                resendRequest.type = type;

            var apiMethod, reqMethod;

            if (action == "register") {
                apiMethod = apiService.methods.member.regphone($scope.twoFAParams.guid);
                reqMethod = "post";
            }
            else {
                apiMethod = apiService.methods.member.resend2FACode();
                reqMethod = "get";
            }

            apiService[reqMethod](apiMethod, resendRequest).then(function (res) {
                $scope.toShow = "code_input"; // show code input
                $scope.forbidNewRequest();
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 12)
                    $scope.error = 'Invalid phone number format';
                else if (code == 13)
                    $scope.error = 'Incorrect 2FA code. Please request a new one.';
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
                requestedUrl = requestedUrl+'/'+$scope.twoFAParams.guid;
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

        // executing flow
        if (action === "enable2fa")
            $scope.toShow = "phone_number_input";
        else if (action === "disable2fa")
            $scope.requestCode();
        else if (action === "register")
            $scope.toShow = "phone_number_input";
        else if (action == 'restorePassword' || action == 'changePassword')
            $scope.toShow = "code_input";
    }
}());
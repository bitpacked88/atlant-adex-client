!function () {
    angular.module('web').controller('innerSettingsCtrl', ['$rootScope', '$scope', 'modalService', 'authService', 'appMessages', 'apiService', 'notificationService', 'splashService', '$sce', Controller]);

    function Controller($rootScope, $scope, modalService, authService, appMessages, apiService, notificationService, splashService, $sce) {
        var saveProfileButton = 'Save my profile',
            changePasswordButton = 'Change password';

        splashService.start();

        $rootScope.rootTitle = 'Settings';

        $scope.saveProfileButtonLabel = 'Save my profile';

        $scope.profileAlertToShow = undefined;
        $scope.alertToShow = undefined;
        $scope.profile = {};
        $scope.defaultType = 'sms';
        $scope.months = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        };

        $scope.error = {
            firstName: false,
            lastName: false,
            country: false,
            city: false,
            postalCode: false,
            address: false,
            dayOfBirth: false,
            monthOfBirth: false,
            yearOfBirth: false
        };

        $scope.listVisible = false;

        $scope.verificationRequired = false;

        $scope.select = function (id) {
            $scope.monthOfBirth = id;
            $scope.listVisible = false;
        };

        $scope.isSelected = function (id, item) {
            return id === $scope.monthOfBirth;
        };

        $scope.toggle = function () {
            $scope.listVisible = !$scope.listVisible;
        };

        $scope.$watch("monthOfBirth", function () {
            $scope.display = $scope.months[$scope.monthOfBirth] || 'Select month';
        });

        $scope.$on(appMessages.verification.verificationRequired, function(e, data) {
            $scope.verification1 = 'Please fill in this form to pass basic verification and access fiat operations with the limit of 1 BTC per month.';
            $scope.verification2 = 'We will review your information in the background and increase your limits up to 5 BTC per month upon approval.';
            $scope.verification3 = 'After that you may also upload documents and get 100 000 EUR limits on fiat operations per month.';
        });

        $scope.$on(appMessages.system.profileLoaded, function(e, data){
            var profile = {};

            if (data.code == 0) {
                profile.firstName = data.result.firstName;
                profile.lastName = data.result.lastName;
                profile.dateOfBirth = data.result.dateOfBirth;
                profile.country = data.result.country;
                profile.address = data.result.address;
                profile.twoFactorEnabled = data.result.twoFactorEnabled;
                profile.phoneNumber = data.result.phoneNumber;
                profile.postalCode = data.result.postalCode;
                profile.city = data.result.city;

                if (profile.dateOfBirth) {
                    var match = profile.dateOfBirth.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
                    if (match) {
                        $scope.dayOfBirth = match[1];
                        $scope.monthOfBirth = match[2];
                        $scope.yearOfBirth = match[3];
                    }
                }

                $scope.profile = profile;
                $scope.defaultType = data.result.defaultType;

                splashService.finish();
            }
        });

        function resetSettingsError() {
            $scope.error = {
                firstName: false,
                lastName: false,
                country: false,
                city: false,
                postalCode: false,
                address: false,
                dayOfBirth: false,
                monthOfBirth: false,
                yearOfBirth: false
            };
        }

        $scope.saveMyProfile = function () {
            var edited = false;
            var noEmptyFields = ['firstName', 'lastName', 'country', 'address', 'postalCode', 'city'];
            var noEmptyDateFields = ['dayOfBirth', 'monthOfBirth', 'yearOfBirth'];

            resetSettingsError();
            var isErrors = false;

            noEmptyFields.forEach(function(item) {
                if($scope.profile[item] == null || $scope.profile[item] == undefined || $scope.profile[item] == '') {
                    $scope.error[item] = true;
                    isErrors = true;
                }
            });

            noEmptyDateFields.forEach(function(item) {
                if(!$scope[item]) {
                    $scope.error[item] = true;
                    isErrors = true;
                }
            });

            if(isErrors) {
                $scope.settingsError = 'Please fill in all required fields.';
                return;
            } else {
                $scope.settingsError = '';
            }

            if ($scope.dayOfBirth && $scope.monthOfBirth && $scope.yearOfBirth)
                $scope.profile.dateOfBirth = $scope.dayOfBirth + '-' + $scope.monthOfBirth + '-' + $scope.yearOfBirth;
            else
                $scope.profile.dateOfBirth = null;

            $scope.saveProfileButtonLabel = 'Loading...';

            apiService.post(apiService.methods.member.myProfile, $scope.profile).then(function (res) {
                if (res.data.code == 0)
                    $scope.profileAlertToShow = 'Profile saved. We will verify your profile data in the background for the purposes of basic verification';
            }).finally(function () {
                $scope.saveProfileButtonLabel = 'Save my profile';
            });

        };

        $scope.oldPassword = "";
        $scope.newPassword = "";
        $scope.confirmNewPassword = "";
        $scope.securityAlertToShow = '';
        $scope.changePasswordButtonLabel = "Change Password";
        $scope.fields = {
            oldPassword: { title: 'Current password', error: 'oldPasswordError' },
            newPassword: { title: 'New password', error: 'newPasswordError' },
            confirmNewPassword: { title: 'Repeat new password', error: 'confirmNewPasswordError' }
        };

        $scope.changePassword = function () {
            $scope.oldPasswordError = '';
            $scope.newPasswordError = '';
            $scope.confirmNewPasswordError = '';

            for(var i in $scope.fields) {
                var field = $scope.fields[i];

                if($scope[i].length < 6) {
                    $scope[field.error] = 'Minimal length is 6 symbols';

                    return false;
                }
            }

            if($scope.newPassword !== $scope.confirmNewPassword) {
                $scope.confirmNewPasswordError = 'Password mismatch';

                return false;
            }

            var params = {
                    oldPassword: $scope.oldPassword,
                    newPassword: $scope.newPassword,
                    confirmPassword: $scope.confirmNewPassword
                },
                cb = function () {
                    $scope.securityAlertToShow = 'Password successfully changed';
                    $scope.oldPassword = "";
                    $scope.newPassword = "";
                    $scope.confirmNewPassword = "";
                };

            $scope.changePasswordButtonLabel = "Loading...";

            apiService.post(apiService.methods.member.changePassword, params).then(function (res) {
                if (res.data.code === 0)
                    cb();
                else if (res.data.code == 15) {
                    params.todo = 'changePassword';
                    params.cb = cb;
                    params.type = $scope.defaultType;

                    modalService.twoFA(params);
                }
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 5)
                    $scope.newPasswordError = 'Minimal password length is 6 symbols';
                else if (code == 8)
                    $scope.oldPasswordError = 'Please fill in the password field';
                else if (code == 9)
                    $scope.confirmNewPasswordError = 'Password mismatch. Please make sure you entered two identical passwords';
                else if (code == 16)
                    $scope.oldPasswordError = 'Incorrect current password';
                else
                    $scope.alertToShow = 'Unexpected error';
            }).finally(function () {
                $scope.changePasswordButtonLabel = "Change Password";
            });
        };

        $scope.twoFA = function (params) {
            params.defaultType = $scope.defaultType;

            modalService.twoFA(params);
        };

        // watch twofa state and update button visibility due to it
        $rootScope.$on(appMessages.twoFA.switched, function (event, args) {
            $scope.profile.twoFactorEnabled = args.done === "enable2fa";
        })
    }
}();

(function () {
    angular.module('web').controller('dialogPersonalDataCtrl', ['$scope', 'modalService', 'apiService', 'appMessages', '$rootScope',  Controller]);
    function Controller($scope, modalService, apiService, appMessages, $rootScope) {

        $scope.saveProfileButtonLabel = 'Save my profile';
        $scope.verification = 'Please fill in this form to pass basic verification and access fiat operations with the limit of 2 000 EUR per month.';

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
                if (res.data.code == 0) {
                    $rootScope.$broadcast(appMessages.notification.success, {
                        text: 'Personal data submitted'
                    });
                    $rootScope.$broadcast(appMessages.verification.changePersonalDataStatus, true);
                    $scope.cb();
                }
            }).finally(function () {
                $scope.$close();
            });
        };
    }
}());
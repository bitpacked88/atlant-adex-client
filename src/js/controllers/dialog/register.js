(function () {
    angular.module('web').controller('dialogRegisterCtrl', ['$scope', 'modalService', 'apiService', '$window', Controller]);
    function Controller($scope, modalService, apiService, $window) {
        $scope.email = '';
        $scope.agree = false;
        $scope.submitLabel = 'Sign Up';
        $scope.submitAction = 'submit';
        $scope.errorMessage = undefined;

        // functions
        $scope.register = function () {
            // checking email
            if ($scope.submitAction === 'check_email') {
                var parts = $scope.email.split('@');
                window.location.href = 'http://' + parts[1];
                return;
            }

            $scope.submitLabel = 'Loading...';

            var registrationData = {
                email: $scope.email,
                agree: $scope.agree
            };

            if($window.localStorage.puser != null) {
                registrationData.parentUser = $window.localStorage.puser;
            }

            apiService.post(apiService.methods.member.regemail, registrationData).then(function (res) {
                if (res.data.code > 0)
                    $scope.showError(res.data.code);
                else {
                    $scope.submitLabel = 'Proceed to my Email';
                    $scope.submitAction = 'check_email';
                    $scope.successMessage = 'Confirmation link sent to your Email';
                }

                $scope.errorMessage = '';
            }).catch(function (res) {
                var code = res.data.code;
                if (code == 1)
                    $scope.errorMessage = 'Please provide a valid Email address';
                else if (code == 7)
                    $scope.errorMessage = 'Please confirm that you agree with Terms of Service';
                else if (code == 33)
                    $scope.errorMessage = 'You are already a registered member! Please sign in to continue.';
                else if (code == 93)
                    $scope.errorMessage = 'Registration temporarily closed. We will get back to you shortly.';
                else
                    $scope.errorMessage = 'Oops, something went wrong here. Please contact us with the code: ' + code;

                $scope.submitLabel = 'Sign Up';
            });
        };

        $scope.onSignIn = function (e) {
            e.preventDefault();
            modalService.dismissAll();
            modalService.login();
        };
    }
}());
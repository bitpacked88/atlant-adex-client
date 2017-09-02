(function () {
    angular.module('web').controller('dialogForgotCtrl', ['$scope', 'apiService', 'modalService', Controller]);

    function Controller($scope, apiService, modalService) {

        $scope.email = '';
        $scope.submitLabel = 'Reset password';
        $scope.submitAction = 'submit';
        $scope.alertToShow = undefined;

        $scope.onSubmit = function () {
            if ($scope.submitAction === "check_email") {
                var parts = $scope.email.split("@");
                window.location.href = "http://" + parts[1];
                return;
            }

            $scope.alertToShow = undefined;
            $scope.submitLabel = "Loading...";

            apiService.post(apiService.methods.member.requestPasswordRestore, {email: $scope.email}).then(function (res) {
                if (res.data.code == 15) {
                    modalService.twoFAnotLogged({
                        todo: 'restorePassword',
                        email: $scope.email
                    });
                }

                $scope.submitLabel = "Proceed to my Email";
                $scope.submitAction = "check_email";

                $scope.alertToShow = '';
            }).catch(function () {
                $scope.alertToShow = "Email not found";
                $scope.submitLabel = "Send Email";
            });
        };

        $scope.onRegister = function (e) {
            e.preventDefault();
            modalService.dismissAll();
            modalService.register();
        };
    }
}());
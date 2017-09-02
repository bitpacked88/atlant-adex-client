(function () {
    angular.module('web').controller('dialogSigninCtrl', ['$scope', 'authService', 'modalService', Controller]);

    function Controller($scope, authService, modalService) {
        $scope.credentials = {};

        $scope.submitLabel = 'Sign In';
        $scope.alertToShow = undefined;

        $scope.login = function () {
            $scope.alertToShow = undefined;
            $scope.submitLabel = "Loading...";

            authService.login($scope.credentials).then(function (result) {
                if (result === "access_granted" || result === "2fa_required")
                    $scope.$dismiss(); // close if logged in or 2fa window will appear
                else if (result === "access_denied")
                    $scope.alertToShow = "Incorrect Email or password. Please try again.";
                else if (result === "2fa_required")
                    $scope.$close();

                $scope.submitLabel = 'Sign In';
            });
        };

        $scope.onRegister = function (e) {
            e.preventDefault();
            modalService.dismissAll();
            modalService.register();
        };

        $scope.onForgot = function (e) {
            e.preventDefault();
            modalService.dismissAll();
            modalService.forgot();
        };
    }
}());
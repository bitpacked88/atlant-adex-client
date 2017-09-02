!function () {
    angular.module('web').controller('commonHeaderCtrl', ['$scope', 'authService', 'appMessages', 'modalService', 'desktopService', Controller]);

    function Controller($scope, authService, appMessages, modalService, desktopService) {

        $scope.auth = false;

        if (authService.isLoggedIn())
            $scope.auth = true;

        $scope.$on(appMessages.auth.change, function (event, state, user) {
            $scope.auth = state;
        });

        $scope.onRegisterClick = modalService.register;

        $scope.onSigninClick = function (e) {
            e.preventDefault();
            modalService.login();
        };


        $scope.onLogoutClick = function (e) {
            e.preventDefault();
            authService.logout();
        };
    }
}();
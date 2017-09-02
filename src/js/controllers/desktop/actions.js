(function () {
    "use strict";

    function Controller($rootScope, $scope, appMessages, authService){
        $scope.show = authService.isLoggedIn();

        $scope.$on(appMessages.auth.change, function (e, state) {
            $scope.show = state;
        });

        $scope.onTrade = function () {
            $rootScope.$broadcast(appMessages.ui.tradePopupToggle);
        };
    }

    /*global angular */
    angular.module('web').controller('desktopActionsCtrl', ['$rootScope', '$scope', 'appMessages', 'authService', Controller]);
}());
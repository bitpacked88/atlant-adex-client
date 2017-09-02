angular.module('web').controller('maintenanceCtrl',['$rootScope', '$scope', '$state', 'desktopService', 'splashService', function($rootScope, $scope, $state, desktopService, splashService){
    if($rootScope.webChecked == undefined || $rootScope.webChecked == false) {
        desktopService.checkWeb().then(function (data) {
            if (data == null || data.status == 400) {
                appLoader.finish();
                splashService.finish();
            }
            else
                $state.go('root.desktop.main');
        });
    }

    appLoader.finish();
    splashService.finish();
}]);
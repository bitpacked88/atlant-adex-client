(function () {
    angular.module('web').controller('desktopDesktopSettingsCtrl', ['$scope', '$rootScope', '$window', 'appMessages', Controller]);

    function Controller($scope, $rootScope, $window, appMessages) {
        var white_theme = $window.localStorage['white_theme'];

        $scope.theme = white_theme=='true';
        $scope.sound = true;

        $scope.$watch('theme', function (n) {
            $window.localStorage['white_theme'] = n;
            $rootScope.$broadcast(appMessages.settings.themeSwitch, n ? 'white' : 'black');
        });

        $scope.$watch('sound', function (n) {
            $rootScope.$broadcast(appMessages.settings.soundSwitch, n);
        });
    }
}());
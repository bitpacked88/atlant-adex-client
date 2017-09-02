!function () {
    angular.module('web').controller('desktopGeneralStatsCtrl', ['$scope', 'appMessages', 'desktopService', '$interval', 'splashService', Controller]);

    function Controller($scope, appMessages, desktopService, $interval, splashService) {
        $scope.stats = {};
        $scope.classes = {};

        setData();

        $interval(function () {
            var stats = desktopService.getGeneralStats();

            $scope.stats.volume = stats.volume;
            $scope.stats.change = stats.change;
            $scope.stats.changeVector = parseFloat(stats.change) > 0;
        }, 60000);

        $scope.$on(appMessages.desktop.loaded, setData);

        function setData() {
            var data = desktopService.getGeneralStats();

            $scope.classes = {};

            angular.forEach(data, function (value, key) {
                if ($scope.stats && $scope.stats.hasOwnProperty(key) && key !== 'change')
                    $scope.classes[key] = $scope.stats[key] < value ? '_text_green-fade-in' : '_text_red-fade-in';

                $scope.stats[key] = value;
            });

            if(data.change)
                $scope.stats.changeVector = parseFloat(data.change) > 0;
        }
    }
}();
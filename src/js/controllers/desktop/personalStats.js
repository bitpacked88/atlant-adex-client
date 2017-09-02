!function () {
    DesktopPersonalStatsCtrl.$inject = ['$rootScope', '$scope', 'authService', 'appMessages', 'desktopService'];
    function DesktopPersonalStatsCtrl($rootScope, $scope, authService, appMessages, desktopService) {
        var vm = this;
        vm.classes = {};
        vm.info = {};
        vm.auth = authService.isLoggedIn();

        setData();

        $scope.$on(appMessages.auth.change, function (e, state) {
            if (state) {
                setData();
                vm.auth = true;
            } else
                vm.auth = false;
        });

        $rootScope.$on(appMessages.desktop.loaded, setData);

        function setData() {
            var data = desktopService.getPersonalStats();
            if (data !== null) {
                data.tradeFunds = parseFloat(data.availableFunds) + parseFloat(data.blockedFunds);
                data.derivedTradeFunds = parseFloat(data.derivedAvailableFunds) + parseFloat(data.derivedBlockedFunds);

                angular.forEach(data, function (value, key) {
                    if (vm.info && vm.info.hasOwnProperty(key) && vm.info[key] !== value)
                        vm.classes[key] = vm.info[key] < value ? '_text_green-fade-in' : '_text_red-fade-in';

                    vm.info[key] = value;
                });
            }
        }
    }

    angular.module('web').controller('desktopPersonalStatsCtrl', DesktopPersonalStatsCtrl);
}();


!function () {
    Controller.$inject = ['$scope', 'appMessages', 'desktopService'];
    function Controller($scope, appMessages, desktopService) {
        var vm = this;

        setData();

        $scope.$on(appMessages.desktop.loaded, setData);

        function setData() {
            var data = [];

            angular.forEach(desktopService.getTrades(), function (trade) {
                data.push({
                    side: trade[3],
                    amount: trade[1],
                    rate: trade[0],
                    ticks: trade[2]
                });
            });

            vm.data = data;
        }
    }

    angular.module('web').controller('desktopTradesCtrl', Controller);
}();
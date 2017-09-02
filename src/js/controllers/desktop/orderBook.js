!function () {
    DesktopOrderBookCtrl.$inject = ['$rootScope', '$scope', 'appMessages', 'desktopService', 'authService'];
    function DesktopOrderBookCtrl($rootScope, $scope, appMessages, desktopService, authService) {
        var vm = this;
        vm.orders = desktopService.getOrderBook();
        vm.is_logged = authService.isLoggedIn();

        setData();

        $scope.$on(appMessages.auth.change, function (e, state) {
            vm.is_logged = state;
        });

        $scope.$on(appMessages.desktop.loaded, function (e, state) {
            if(!state) {
                vm.asks = null;
                vm.bids = null;
            }

            setData();
        });

        $scope.openTradeModal = function (order) {
            $rootScope.$broadcast(appMessages.ui.tradePopupToggle, order);
        };

        function setData() {
            var asks = [],
                bids = [],
                orders = desktopService.getOrderBook();

            angular.forEach(orders.asks, function (data) {
                var sum = data[0] * data[1];

                asks.push({
                    sum: sum,
                    rate: data[0],
                    amount: data[1],
                    is_new: is_new('ask', sum)
                });
            });

            angular.forEach(orders.bids, function (data) {
                var sum = data[0] * data[1];

                bids.push({
                    sum: sum,
                    rate: data[0],
                    amount: data[1],
                    is_new: is_new('bid', sum)
                });
            });

            vm.asks = asks;
            vm.bids = bids;
        }

        function is_new(side, sum) {
            var data = side == 'ask' ? vm.asks : vm.bids;
            if (!data)
                return false;

            for (var i in data)
                if (sum == data[i].sum)
                    return false;

            return true;
        }
    }

    angular.module('web').controller('desktopOrderBookCtrl', DesktopOrderBookCtrl);
}();
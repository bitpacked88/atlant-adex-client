!function () {
    angular.module('web').controller('innerMytradesCtrl', ['$scope', '$rootScope', 'apiService', 'appConfig', '$sce', 'appMessages', 'currencyService', Controller]);

    function Controller($scope, $rootScope, apiService, appConfig, $sce, appMessages, currencyService) {
        $rootScope.rootTitle = 'Trade History';

        var statuses = {
                0: 'accepted',
                1: 'partiallyFilled',
                2: 'filled',
                3: 'cancelled'
            },
            types = {
                0: 'LIMIT',
                1: 'MARKET',
                2: 'STOPLOSS',
                3: 'TAKEPROFIT',
                4: 'TRAILINGSTOP'
            };

        $scope.orders = [];
        $scope.statuses = {
            filled: 'Filled',
            accepted: 'Accepted',
            partiallyFilled: 'Partially filled',
            cancelled: 'Cancelled'
        };
        $scope.pageIsLoaded = false;
        $scope.showLocalLoading = false;

        $scope.request = function (offset) {

            var currentPair = currencyService.getCurrentPair().split('_');

            var params = {
                limit: appConfig.itemsPerPage,
                offset: offset,
                currency: currentPair[1],
                baseCurrency: currentPair[0]
            };

            if ($scope.$stateParams.filter)
                params.status = $scope.$stateParams.filter;

            apiService.get(apiService.methods.account.tradeHistory, params).then(function (res) {
                var data = res.data;
                if (data.code == 0) {
                    $scope.count = data.result.total;
                    angular.forEach(data.result.orders, function (order) {
                        order.status = statuses[order.status];
                        order.type = types[order.type];

                        if (order.side) {
                            order.total_spend = order.cashOrderQty - order.leavesQty;
                            order.total_get = order.total_spend * order.price;
                        } else {
                            order.total_get = order.cashOrderQty - order.leavesQty;
                            order.total_spend = order.total_get * order.price;
                        }

                        $scope.orders.push(order);
                    });
                }
            });
        };

        $scope.getRate = function(order){
            return order.type == 'TRAILINGSTOP' ? order.tsLevel : order.price;
        };

        $scope.onCancel = function (id) {
            apiService.put(apiService.methods.trade.cancelOrder(id));
        };

        $scope.$on(appMessages.hub.newOrder, function (event, order) {
            var data = {
                id: order[0],
                derivedCurrency: order[1],
                side: order[2],
                cashOrderQty: order[3],
                leavesQty: order[4],
                price: order[5],
                tsLevel: order[6],
                status: statuses[order[7]],
                type: types[order[8]],
                source: order[9],
                openDate: order[10],
                trades: []
            };

            if (data.side) {
                data.total_spend = data.cashOrderQty - data.leavesQty;
                data.total_get = data.total_spend * data.price;
            } else {
                data.total_get = data.cashOrderQty - data.leavesQty;
                data.total_spend = data.total_get * data.price;
            }

            if (!$scope.$stateParams.filter || ($scope.$stateParams.filter == order[7]))
                $scope.orders.unshift(data);
        });

        $scope.$on(appMessages.hub.newOrderMatch, function (event, order) {
            for (var i = $scope.orders.length - 1; i >= 0; i--)
                if ($scope.orders[i].id === order[0]) {
                    $scope.orders[i].status = statuses[order[3]];
                    $scope.orders[i].leavesQty = order[2];
                    $scope.orders[i].closeDate = order[4];

                    if ($scope.$stateParams.filter && $scope.$stateParams.filter !== order[7])
                        $scope.orders.splice(i, 1);
                }
        });

        $scope.$on(appMessages.hub.newOrderCancel, function (event, order) {
            for (var i = $scope.orders.length - 1; i >= 0; i--)
                if ($scope.orders[i].id === order[0]) {
                    $scope.orders[i].status = 'cancelled';
                    $scope.orders[i].closeDate = order[2];
                }
        });

        $scope.$on(appMessages.hub.newTrade, function (event, trade) {
            var order_id = trade[6] ? trade[1] : trade[2];

            for (var i = $scope.orders.length - 1; i >= 0; i--)
                if ($scope.orders[i].id === order_id) {
                    $scope.orders[i].trades.push({
                        lastQty: trade[7],
                        lastPx: trade[8],
                        buyerFee: trade[9],
                        sellerFee: trade[10],
                        ticks: trade[11]
                    });
                }
        });

        $scope.$on(appMessages.hub.newOrderModify, function(e, order){
            for (var i = $scope.orders.length - 1; i >= 0; i--)
                if ($scope.orders[i].id === order[0])
                    $scope.orders[i].rate = order[2];
        });

        $scope.isClosed = function (order) {
            return order.status == 'filled' || order.status == 'cancelled';
        };

        $scope.getCurrency = function (side) {
            return $sce.trustAsHtml(side ? $scope.currentPair.derived.symbol : $scope.baseCurrency.symbol);
        };

        $scope.$watch('offset', $scope.request);

        $scope.$on(appMessages.currency.pairChanged, function () {
            $scope.offset = 0;
            $scope.count = 0;
            $scope.orders = [];
            $scope.request($scope.offset);
        });

        $scope.limit = appConfig.itemsPerPage;
        $scope.offset = 0;
        $scope.count = 0;
    }
}();
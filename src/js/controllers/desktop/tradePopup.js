(function () {
    angular.module('web').controller('desktopTradePopupCtrl', ['$rootScope', '$scope', '$timeout', 'appMessages', 'apiService', 'authService', Controller]);

    function Controller($rootScope, $scope, $timeout, appMessages, apiService, authService) {
        var types = {
            limit: 'limit',
            market: 'market',
            instant: 'instant',
            stoploss: 'stoploss',
            takeproit: 'takeprofit',
            trailingstop: 'trailingstop'
        };

        $scope.hide = true;
        $scope.processing = false;

        $scope.tabs = [
            {title: 'Limit', type: types.limit, hint: "Limit order is used to buy / sell at a fixed price (or better)."},
            {title: 'Market', type: types.market, hint: "Market order is used to buy / sell at the best average market price."}
        ];

        $scope.popup = {buy: false, sell: false};
        $scope.base_cur_amount = false;

        $scope.activeTab = types.limit;

        $scope.fields = {};
        $scope.fields[types.limit] = ['amount', 'rate', 'stoploss', 'takeprofit', 'trailingstop'];
        $scope.fields[types.market] = ['amount', 'stoploss', 'takeprofit', 'trailingstop'];
        $scope.fields[types.instant] = ['amount', 'stoploss', 'takeprofit', 'trailingstop'];
        $scope.fields[types.stoploss] = ['amount', 'stoploss'];
        $scope.fields[types.takeproit] = ['amount', 'takeprofit'];
        $scope.fields[types.trailingstop] = ['amount', 'trailingstop'];

        var defaultValues = {
            amount: '0.0',
            rate: '0.0',
            stoploss: '0.0',
            takeprofit: '0.0',
            trailingstop: '0.0',
            multiply: 1,
            stoplossSwitch: false,
            takeprofitSwitch: false,
            trailingstopSwitch: false
        };

        $scope.buy = angular.extend({}, defaultValues);
        $scope.sell = angular.extend({}, defaultValues);

        $scope.checkFieldVisibility = function (field) {
            var fields = $scope.fields[$scope.activeTab];
            for (var i = 0; i < fields.length; i++) {
                if (field === fields[i]) return true;
            }
            return false;
        };

        $scope.selectTab = function (tab) {
            $scope.activeTab = tab;
            $scope.base_cur_amount = false;
        };

        $scope.togglePopup = function (type) {
            if ($scope.activeTab == 'market')
                $scope.popup[type] = !$scope.popup[type];
        };

        $scope.selectCurrency = function () {
            $scope.popup.buy = false;
            $scope.popup.sell = false;
            $scope.base_cur_amount = !$scope.base_cur_amount;
        };

        // this turning on processing mode when loading 
        //
        $scope.onTrade = function (side) {
            $scope.processing = true;
            $scope.errorMessage = '';

            var sideName = side ? 'sell' : 'buy',
                info = $scope[sideName],
                data = {
                    side: side,
                    amount: parseFloat(replaceDot(info.amount)) * info.multiply
                },
                url;

            if ($scope.activeTab == types.limit) {
                url = apiService.methods.trade.placeLimit($rootScope.currentPair.name);

                data.price = replaceDot(info.rate);
            } else {
                url = apiService.methods.trade.placeMarket($rootScope.currentPair.name);

                data.base_cur_amount = $scope.base_cur_amount;
            }

            if (info.stoplossSwitch)
                data.sl_price = replaceDot(info.stoploss);

            if (info.takeprofitSwitch)
                data.tp_price = replaceDot(info.takeprofit);

            if (info.trailingstopSwitch)
                data.ts_level = replaceDot(info.trailingstop);

            apiService.post(url, data).then(function () {
                $rootScope.$broadcast(appMessages.ui.tradePopupClose);
            }).catch(function (res) {
                var data = res.data;

                if(data.code == 23)
                    $scope.errorMessage = 'Insufficient funds';
                else if(data.code == 40)
                    $scope.errorMessage = 'Insufficient order book volume';
                else if(data.code == 41)
                    $scope.errorMessage = 'Stop Loss unavailable';
                else if(data.code == 42)
                    $scope.errorMessage = 'Take Profit unavailable';
                else if(data.code == 43)
                    $scope.errorMessage = 'Trailing Stop unavailable';
                else if(data.code == 44)
                    $scope.errorMessage = 'Incorrect Stop Loss price';
                else if(data.code == 45)
                    $scope.errorMessage = 'Incorrect Take Profit price';
                else if(data.code == 46)
                    $scope.errorMessage = 'Incorrect Trailing Stop level';
            }).finally(function () {
                $scope.processing = false;
            });
        };

        function replaceDot(val) {
            return val.toString().replace(/,/g, '.');
        }

        $scope.onReset = function (side) {
            $scope[side] = angular.extend({}, defaultValues);
        };

        $scope.getAmountCurrency = function () {
            return $scope.base_cur_amount ? $scope.currentPair.base.name : $scope.currentPair.derived.name;
        };

        $scope.getPopupCurrency = function () {
            var result = $scope.base_cur_amount ? $scope.currentPair.derived.name : $scope.currentPair.base.name;
            return result;
        };

        $scope.$on(appMessages.ui.tradePopupToggle, function (event, order) {
            if (!authService.isLoggedIn())
                return false;

            if (order) {
                $scope.activeTab = types.limit;
                $scope.sell.rate = order.rate;
                $scope.buy.rate = order.rate;
                $scope.hide = false;
            } else
                $scope.hide = !$scope.hide;
        });

        $scope.$on(appMessages.auth.logout, function () {
            $scope.hide = true;
        });

        $scope.$on(appMessages.ui.tradePopupClose, function () {
            $scope.hide = true;
        });
    }
}());
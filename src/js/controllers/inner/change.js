!function () {
    angular.module('web').controller('changeCtrl', ['$rootScope', '$scope', 'apiService', 'authService', 'desktopService', 'appMessages', 'currencyService', 'modalService', Controller]);

    function Controller($rootScope, $scope, apiService, authService, desktopService, appMessages, currencyService, modalService) {
        $rootScope.rootTitle = 'Token Swap';

        $scope.side = false;
        $scope.amount = 0;
        $scope.receive = 0;
        $scope.tabs = {
            buy: 'Buy',
            sell: 'Sell'
        };
        $scope.loading = false;

        //general stat
        $scope.bids = [];
        $scope.asks = [];

        //personal stat
        $scope.fee = 0;
        $scope.availableFunds = 0;
        $scope.derivedAvailableFunds = 0;
        $scope.classes = {};

        $scope.isLogged = authService.isLoggedIn();

        $scope.$on(appMessages.auth.change, function (e, state) {
            $scope.isLogged = state;

            if (state)
                $scope.bindFunds();
        });

        $scope.$on(appMessages.desktop.loaded, function () {
            $scope.bindRates();
            $scope.toggleCurrency();
        });

        $scope.$on(appMessages.hub.newOrderBookTop, function (e, data) {
            var side = data[1],
                orders = data[2];

            if (orders.length) {
                $scope[side ? 'asks' : 'bids'] = orders;

                $scope.calculate();
            }
        });

        $scope.$on(appMessages.hub.newAccountFee, function (event, data) {
            if(data.isTaker) {
                $scope.fee = data.feeInPercent;
            }
        });

        $scope.$on(appMessages.hub.newBalance, function (event, data) {
            currencyService.isBase(data.base, data.currency, function (flag) {
                var key = flag ? 'availableFunds' : 'derivedAvailableFunds',
                    value = parseFloat(data.availableFunds);

                $scope.classes[key] = $scope[key] < value ? '_text_green' : '_text_red';

                $scope[key] = value;
            });
        });

        $scope.$on(appMessages.system.updatePairBalance, function() {
            $scope.bindFunds();
        });

        $scope.bindRates = function () {
            var data = desktopService.getOrderBook();

            $scope.bids = data.bids;
            $scope.asks = data.asks;
        };

        $scope.bindFunds = function () {
            var data = desktopService.getPersonalStats();
            $scope.availableFunds = data.availableFunds;
            $scope.derivedAvailableFunds = data.derivedAvailableFunds;
            $scope.fee = data.takerFee;
        };

        $scope.change = function (side) {
            $scope.side = side == 'sell';
            $scope.amount = 0;
            $scope.receive = 0;
        };

        $scope.onSigninClick = function (e) {
            e.preventDefault();
            modalService.login();
        };

        $scope.onSignupClick = function (e) {
            e.preventDefault();
            modalService.register();
        };

        $scope.getSubmitButtonLabel = function () {
            if ($scope.loading)
                return 'Loading...';

            var side = $scope.side ? 'Sell' : 'Buy';

            return side + ' ' + $rootScope.currentPair.derived.name;
        };

        $scope.onTrade = function () {
            var balance = $scope.side ? $scope.derivedAvailableFunds : $scope.availableFunds;

            $scope.successMessage = false;
            $scope.errorMessage = '';
            $scope.loading = true;

            if ($scope.amount > balance) {
                $scope.errorMessage = 'Insufficient funds';
                $scope.loading = false;

                return false;
            }

            if ($scope.amount > 0)
                apiService.post(apiService.methods.trade.placeMarket($rootScope.currentPair.name), {
                    side: $scope.side,
                    amount: parseFloat(replaceDot($scope.amount)),
                    base_cur_amount: !$scope.side
                }).then(function () {
                    //TODO: Unhardcode logic
                    var amount = ($scope.currency == 'EUR' || $scope.currency == 'USD')? parseFloat($scope.amount).toFixed(2):parseFloat($scope.amount).toFixed(4);
                    var receive = ($scope.receiveCurrency == 'EUR' || $scope.receiveCurrency == 'USD')? parseFloat($scope.receive).toFixed(2):parseFloat($scope.receive).toFixed(4);

                    $scope.successMessage = 'Successfully exchanged ' + amount
                        + ' ' + $scope.currency + ' for ' + receive + ' ' + $scope.receiveCurrency;

                    $scope.amount = 0;
                    $scope.receive = 0;
                }).catch(function (res) {
                    if (res.data.code == 23)
                        $scope.errorMessage = 'Insufficient funds';
                    else if (res.data.code == 38)
                        $scope.errorMessage = 'Account suspended';
                    else if (res.data.code == 40)
                        $scope.errorMessage = 'Insufficient order book volume';
                }).finally(function () {
                    $scope.loading = false;
                });
            else {
                $scope.errorMessage = ($scope.side ? 'Sell' : 'Spend') + ' amount not specified';
                $scope.loading = false;
            }
        };

        $scope.$watch('side', function (side) {
            $scope.currentTab = side ? 'sell' : 'buy';
            $scope.toggleCurrency();
        });

        $scope.toggleCurrency = function () {
            if ($scope.side) {
                $scope.currency = $rootScope.currentPair.derived.name;
                $scope.receiveCurrency = $rootScope.currentPair.base.name;
            } else {
                $scope.currency = $rootScope.currentPair.base.name;
                $scope.receiveCurrency = $rootScope.currentPair.derived.name;
            }
        };

        $scope.calculate = function () {
            var data = $scope.side ? $scope.bids : $scope.asks,
                amount = parseFloat($scope.amount),
                receive = 0,
                rate = 0,
                fee = $scope.fee || 0;

            if (data.length) {
                angular.forEach(data, function (item) {
                    var sum = 0,
                        size = parseFloat(item[1]);

                    if (amount > 0) {
                        rate = parseFloat(item[0]);

                        if ($scope.side) {
                            if (amount >= size)
                                amount = amount - size;
                            else {
                                size = amount;
                                amount = 0;
                            }

                            sum = size * rate;

                            receive = receive + sum;
                        } else {
                            sum = rate * size;

                            if (amount >= sum)
                                amount = amount - sum;
                            else {
                                size = amount / rate;
                                amount = 0;
                            }

                            receive = receive + size;
                        }
                    }
                });

                if (amount > 0)
                    receive = receive + ($scope.side ? rate * amount : amount / rate);

                $scope.receive = receive * (100 - fee) / 100;
            } else
                $scope.receive = 0;
        };

        $scope.bindRates();

        if ($scope.isLogged)
            $scope.bindFunds();

        $scope.$watch('receive', function (val) {
            //TODO: Unhardcode logic
            $scope.receive = ($scope.receiveCurrency == 'EUR' || $scope.receiveCurrency == 'USD')? parseFloat(val).toFixed(2):parseFloat(val).toFixed(4);
        });
    }

    function replaceDot(val) {
        return val.toString().replace(/,/g, '.');
    }
}();

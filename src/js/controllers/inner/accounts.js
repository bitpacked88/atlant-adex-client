!function () {
    angular.module('web').controller('innerAccountsCtrl', ['$rootScope', '$scope', 'appMessages', 'modalService', 'apiService', 'splashService', '$state', Controller]);

    function Controller($rootScope, $scope, appMessages, modalService, apiService, splashService, $state) {
        $rootScope.rootTitle = 'My Wallet';


        function callFiatPaymentModal(wallet, way) {
            if(way == "in") {
                // in
                modalService.fiatPaymentIn(wallet);
            } else {
                // out
                modalService.fiatPaymentOut(wallet);
            }
        }

        $scope.onPayment = function (wallet, way) {
            //check verification
            if(wallet.base == undefined && wallet.currency != "BTC") {
                // for base currencies only
                apiService.get(apiService.methods.member.verificationRequired).then(function(data) {
                    var code = data.data.code;
                    if(code != 0) return;

                    if(data.data.result.verificationRequired == false) {
                        modalService.personalData(function() {
                            callFiatPaymentModal(wallet, way);
                        });
                    } else {
                        callFiatPaymentModal(wallet, way);
                    }
                });
            } else {
                modalService.cryptoPayment(wallet, way);
            }
        };

        $scope.wallets = {base:{}, derived:{}};

        $scope.funds = {
            trade_available: {
                first: "999.9999",
                second: "999.999"
            }
        };

        splashService.start();

        $scope.loadWallets = function () {
            apiService.get(apiService.methods.trade.traderWallets).then(function (res) {
                var data = res.data;
                if (data.code != 0) {
                    splashService.finish();
                    return;
                }

                var baseCurrencies = {};
                var derivedCurrencies = {};
                angular.forEach(data.result, function(derivedCurrencyWallets, baseCurrency) {
                    baseCurrencies[baseCurrency] = {};
                    angular.forEach(derivedCurrencyWallets, function(wallet){
                        if(wallet.currency == baseCurrency) {
                            if (wallet.currency == "BTC") wallet.pair = "BTC_BTC";
                            baseCurrencies[baseCurrency] = wallet;
                        } else {
                            wallet.base = baseCurrency;
                            wallet.pair = baseCurrency+'_'+wallet.currency;
                            derivedCurrencies[wallet.pair] = wallet;
                        }
                    });
                });

                $scope.wallets = {
                    base: baseCurrencies,
                    derived: derivedCurrencies
                };

                angular.forEach($scope.wallets.derived, function(wallet) {
                    if($scope.wallets.base[wallet.base].derived == undefined) {
                        $scope.wallets.base[wallet.base].derived = [];
                    }
                    $scope.wallets.base[wallet.base].derived.push(wallet);
            });

                splashService.finish();
            });
        };

        $scope.loadWallets();

        $scope.$on(appMessages.hub.newBalance, function (event, data) {
            if(data.base == data.currency) {
                // base
                angular.forEach($scope.wallets.base, function (wallet, i) {
                    if (wallet.currency == data.currency) {
                        $scope.wallets.base[i].availableFunds = data.availableFunds;
                        $scope.wallets.base[i].blockedFunds = data.blockedFunds;
                    }
                });
            } else {
                // derived
                var pair = data.base.toUpperCase() + "_" + data.currency.toUpperCase();
                if($scope.wallets.derived[pair] != undefined) {
                    $scope.wallets.derived[pair].availableFunds = data.availableFunds;
                    $scope.wallets.derived[pair].blockedFunds = data.blockedFunds;
                }
            }
        });
    }
}();
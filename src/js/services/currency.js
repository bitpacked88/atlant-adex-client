(function () {
    angular.module('web').factory('currencyService', ['$rootScope', 'appMessages', '$window', '$injector', Service]);

    function Service($rootScope, appMessages, $window, $injector) {
        var params = {
            pairs: [],
            pairsList: [],
            currentPair: "",
            defaultPair: "BTC_ATL",

            currencies: [],
            currenciesByName: []

        };

        function getPairObjectByName(pairName) {
            if(pairName == null || pairName == undefined) {
                return null;
            }

            // 0 - baseCurrency, 1 - derivedCurrency
            var pairCurrencies = pairName.split('_');
            return {
                name: pairName,
                base: params.currenciesByName[pairCurrencies[0]],
                derived: params.currenciesByName[pairCurrencies[1]]
            }
        }

        return {
            setup: function (currencies, pairs, currentPair) {
                params.currencies = currencies;
                params.currentPair = currentPair;
                params.pairs = pairs;

                angular.forEach(params.currencies, function (currency) {
                    params.currenciesByName[currency.name] = currency;
                });

                $rootScope.pairs = pairs;
                $rootScope.currentPair = getPairObjectByName(params.currentPair);
                $rootScope.baseCurrency = $rootScope.currentPair.base;
            },

            getPairs: function () {
                var pairs = [];
                angular.forEach(params.pairs, function (derivedCurrencies, baseCurrency) {
                    angular.forEach(derivedCurrencies, function(currency) {
                        pairs.push({
                            base: baseCurrency,
                            derived: currency,
                            name: baseCurrency + '_' + currency
                        });
                    });
                });
                return pairs;
            },

            getRequestParams: function () {
                return {currency: params.currenciesByName[params.defaultCurrencyKey]}
            },

            // todo: Remove async - ?
            isBase: function (base, currency, cb) {
                var flag = base === currency;
                cb(flag);
                return flag

            },

            getBaseCurrency: function(){
                return $rootScope.baseCurrency.name;
            },

            getCurrentPair: function(){
                var item = $window.localStorage.getItem('currentPair');
                if(!item)
                    return params.defaultPair;
                if(!item.includes('BTC_') && !item.includes('ETH_')) {
                    $window.localStorage.setItem('currentPair', params.defaultPair);
                }
                return $window.localStorage.getItem('currentPair');
            },

            setActivePair: function (index) {
                $window.localStorage.setItem('currentPair', index);

                params.defaultPair = index;
                $rootScope.currentPair = index;
                $rootScope.$broadcast(appMessages.currency.pairChanged, index);
            },

            getNameByAlias: function(alias) {
                return params.currenciesByName[alias];
            }
        }
    }
}());

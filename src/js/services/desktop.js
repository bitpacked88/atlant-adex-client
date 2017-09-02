!function () {
    desktopService.$inject = ['currencyService', 'authService', 'apiService', '$q', 'splashService', '$rootScope', 'appMessages', '$state'];
    function desktopService(currencyService, authService, apiService, $q, splashService, $rootScope, appMessages, $state) {

        var defaultData = { // old desktop info, todo: del this
            personalStats: {},
            generalStats: {},
            orderBook: null,
            trades: [],
            orders: null
        };

        var data = angular.extend({}, defaultData);

        return {
            // This method used only for checking the api availability
            checkWeb: function() {
                var currentPair = currencyService.getCurrentPair(),
                    params = {limit: 30, pair: currentPair},
                    self = this;

                return apiService.get(apiService.methods.trade.getDesktop, params)
            },
            init: function () {
                var currentPair = currencyService.getCurrentPair(),
                    params = {limit: 30, pair: currentPair},
                    self = this;

                return apiService.get(apiService.methods.trade.getDesktop, params).then(function (res) {
                    if (res.data.code === 0) {
                        var result = res.data.result;
                        data = angular.extend({}, defaultData);

                        // currencies, pairs, current base pair
                        currencyService.setup(result.currencies, result.pairs, result.pair);

                        // stat
                        // overriding default or old data
                        data.generalStats = {
                            ask: result.ask,
                            bid: result.bid,
                            volume: result.volume,
                            change: result.change,
                            high: result.high,
                            low: result.low
                        };

                        data.generalStats.bid = result.bid;

                        // order book
                        data.orderBook = {
                            bids: result.bids,
                            asks: result.asks
                        };

                        data.trades = result.trades;

                        // others left (olds)

                        var q = [];

                        if (authService.isLoggedIn())
                            q.push(self.requestPersonalStats(currentPair));

                        return $q.all(q).then(function () {
                            $rootScope.$broadcast(appMessages.desktop.loaded);
                        });
                    }
                });
            },

            //general stats
            getGeneralStats: function () {
                return data.generalStats;
            },
            setGeneralStats: function(stats){
                for(var i in stats)
                    data.generalStats[i] = stats[i];
            },

            //order book top
            getOrderBook: function () {
                return data.orderBook;
            },
            setOrderBook: function(order_book) {
                var side = order_book[1],
                    orders = order_book[2];

                if(side && orders.length)
                    data.generalStats.ask = orders[0][0];
                else if(orders.length)
                    data.generalStats.bid = orders[0][0];

                if(orders.length)
                    data.orderBook[side ? 'asks' : 'bids'] = orders;
                else {
                    data.orderBook[side ? 'asks' : 'bids'] = [];
                }
            },

            //trades
            getTrades: function () {
                return data.trades;
            },
            getLastTrade: function () {
                return data.trades[0] != 'undefined' ? data.trades[0] : [];
            },
            addTrade: function(trade){
                var incomingTrade = [trade[8], trade[7], trade[11], trade[6]];
                data.trades.unshift(incomingTrade);

                if (data.trades.length > 30)
                    data.trades.pop();
            },

            //orders
            getOrders: function () {
                if (!data.personalStats)
                    return [];

                return data.personalStats.orders;
            },
            addOrder: function(order){
                data.personalStats.orders.unshift(order);
            },
            editOrder: function(i, order){
                data.personalStats.orders[i] = order;
            },

            //personal statistic
            requestPersonalStats: function () {
                var currentCurrency = currencyService.getCurrentPair();

                return apiService.get(apiService.methods.trade.getTraderInfo(currentCurrency)).then(function (res) {
                    data.personalStats = res.data.result;

                    $rootScope.$broadcast(appMessages.system.updatePairBalance);

                    return data.personalStats;
                });
            },
            setPersonalStats: function (stats) {
                for(var i in stats)
                    data.personalStats[i] = stats[i];

            },
            getPersonalStats: function () {
                return data.personalStats;
            }
        };
    }

    angular.module('web').factory('desktopService', desktopService)
}();

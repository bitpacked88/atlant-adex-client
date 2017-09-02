(function () {

    //
    //   holding
    //   init graphic loading function
    //   and other function for stock graphic
    //

    angular.module('web').factory('datafeedService', ['apiService', 'currencyService', Service]);

    function Service(apiService, currencyService) {


        var dataFeedOptions = [
            {   index:0, name: "1 hour",   seconds: 3600,      rangeSeconds: 60,    key: "1h",   rangeKey: "1m"    },
            {   index:1, name: "1 day",    seconds: 86400,     rangeSeconds: 60,    key: "1d",   rangeKey: "1m"    },
            {   index:2, name: "1 week",   seconds: 604800,    rangeSeconds: 60,    key: "1w",   rangeKey: "1m"    },
            {   index:3, name: "1 month",  seconds: 2592000,   rangeSeconds: 60,    key: "1mn",  rangeKey: "1m"    },
            {   index:4, name: "1 year",   seconds: 31104000,  rangeSeconds: 900,   key: "1y",   rangeKey: "15m"   }
        ];

        function getBars(inputPeriod) {
            return apiService.get(
                apiService.methods.trade.chart, {
                    pair: currencyService.getCurrentPair(),
                    period: dataFeedOptions[inputPeriod].key
                }
            )
        }

        return {
            options: function () { return dataFeedOptions; },
            getBars: getBars
        }
    }
}());


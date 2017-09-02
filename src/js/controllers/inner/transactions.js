(function () {
    "use strict";

    InnerTransactionsCtrl.$inject = ['$scope', '$rootScope', 'apiService', '$stateParams', 'appConfig'];
    function InnerTransactionsCtrl($scope, $rootScope, apiService, $stateParams, appConfig){

        $rootScope.rootTitle = 'Transaction History';

        $scope.currencyType = null;
        $scope.transactions = [];

        $scope.limit = appConfig.itemsPerPage;
        $scope.offset = 0;
        $scope.count = 0;

        $scope.statuses = [
            "Authentication",
            "Processing",
            "Completed",
            "Cancelled",
            "Declined",
            "Authorization"
        ];

        $scope.getConfirmation = function(confirmation, currency) {
            if(currency == 'BTC' && confirmation > 3)
                return '3+';
            if(currency == 'ETH' && confirmation > 12)
                return '12+';
            if(currency == 'ATL' && confirmation > 12)
                return '12+';

            return confirmation;
        };

        $scope.cancel = function(transaction, type){
            apiService.put(apiService.methods[type].cancelOutTransaction(transaction.currency, transaction.id)).then(function(res){
                angular.forEach($scope.transactions, function(t, i){
                    if(t.id == transaction.id)
                        $scope.transactions[i].status = 3;
                });
            });
        };

        $scope.request = function (offset) {
            var currentPair = $stateParams.id.toUpperCase().split('_');

            var params = {
                limit: $scope.limit,
                offset: offset || 0,
                status: $stateParams.status || 'all',
                baseCurrency: currentPair[0],
                currency: currentPair[1]
            };

            if(!offset)
                $scope.transactions = [];

            apiService.get(apiService.methods.account.transactionList, params).then(function (res) {
                var data = res.data;
                if(data.code==0) {
                    $scope.currencyType = data.result.type;

                    angular.forEach(data.result.items, function(item){
                        if(item.currency == 'BTC')
                            item.link = 'http://blockchain.info/tx/' + item.hash;
                        else if (item.currency == 'LTC')
                            item.link = 'http://ltc.blockr.io/tx/info/' + item.hash;
                        else if (item.currency == 'ETH')
                            item.link = 'http://etherscan.io/tx/' + item.hash;
                        else if (item.currency == 'CCRB')
                            item.link = 'http://etherscan.io/tx/' + item.hash;
                        else if (item.currency == 'HMQ')
                            item.link = 'http://etherscan.io/tx/' + item.hash;
                        else if (item.currency == 'EMC')
                            item.link = 'https://emercoin.mintr.org/tx/' + item.hash;

                        $scope.transactions.push(item);
                    });

                    $scope.count = data.result.count;
                }
            });
        };

        $scope.$watch('offset', $scope.request);
    }

    angular.module('web').controller('innerTransactionsCtrl', InnerTransactionsCtrl);
}());

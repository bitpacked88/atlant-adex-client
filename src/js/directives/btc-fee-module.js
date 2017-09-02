angular.module('web').directive('btcFeeModule', [function() {
    function getCurrencySymbol(currency) {
        switch(currency.toUpperCase()) {
            case 'EUR':
                return '€';
            case 'USD':
                return '$';
        }
        return '';
    }

    return {
        restrict: 'A',
        scope: {
            fee: '=',
            wallet: '='
        },
        template: 'Payment fee: <strong>{{ feeResult }}</strong>',
        link: function (scope, element, attrs) {
            var feeResult = '';

            scope.feeResult = '';
            var currencySymbol = getCurrencySymbol(scope.wallet.currency);
            if((scope.fee.percent == 0 && scope.fee.abs == 0) || (scope.fee.percent == 0 && scope.fee.abs != 0)) {
                feeResult = currencySymbol+scope.fee.abs;
            } else if(scope.fee.abs == 0 && scope.fee.percent != 0) {
                feeResult = scope.fee.percent+'%';
            } else {
                feeResult = scope.fee.percent+'% + '+currencySymbol+scope.fee.abs;
            }

            if(scope.fee.minFee != 0 && scope.fee.maxFee != 0) {
                feeResult += " (min {0}, max {1})".replace('{0}', currencySymbol+scope.fee.minFee).replace('{1}', currencySymbol+scope.fee.maxFee);
            } else if(scope.fee.minFee) {
                feeResult += " (min {0})".replace('{0}', currencySymbol+scope.fee.minFee);
            } else if(scope.fee.maxFee) {
                feeResult += " (max {0})".replace('{0}', currencySymbol+scope.fee.maxFee);
            }

            scope.feeResult = feeResult;
        }
    }
}]);
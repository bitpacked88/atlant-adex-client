angular.module('web').filter('currencyToFixed', function(){
    return function(input, currency) {
        if(currency == 'EUR' || currency == 'USD') {
            return parseFloat(input).toFixed(2);
        } else if(currency == 'BTC') {
            return parseFloat(input).toFixed(4);
        } else {
            return parseFloat(input).toFixed(4);
        }
    }
});

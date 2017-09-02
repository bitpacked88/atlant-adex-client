angular.module('web').directive('btcCreditMask', [function() {
    return {
        restrict: 'A',
        link: function ($scope, element) {

            function isAtRange(code) {
                if(code>=48 && code<=57)
                    return true;
                if(code>=96 && code<=105)
                    return true;
                if(code == 8 ||
                    code == 46 ||
                    code == 16 ||
                    code == 17 ||
                    (code >=37 && code <= 40))
                    return true;

                return false;
            }

            var available = false;

            element.on('keydown', function(event) {
                if(!isAtRange(event.keyCode)) {
                    event.preventDefault();
                    available = false;
                    return;
                }
                available = true;
            });

            element.on('keyup', function(event) {
                if(available) {
                    var cardNumber = element.val().replace(/ /g, '').match(/.{1,18}/g)[0].match(/.{1,4}/g);
                    element.val(cardNumber.join(' '));
                }
            });


        }
    }
}]);
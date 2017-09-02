angular.module('web').directive('btcFaqToggle', [function() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('click', function(){
                element.toggleClass('_opened');
                element.next().slideToggle();
            });
        }
    }
}]);
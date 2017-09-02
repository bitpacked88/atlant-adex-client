angular.module('web').directive('btcHint', [function() {
    return {
        restrict: 'EA',
        template: '<span class="btc-hint"><span class="_hint-ico"></span><span class="_hint-popup"></span></span>',
        link: function(scope, element, attr){
            element.find('._hint-popup').html(attr.text);
        }
    }
}]);
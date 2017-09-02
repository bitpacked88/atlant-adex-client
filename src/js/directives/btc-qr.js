angular.module('web').directive('btcQr', [function() {
    return {
        restrict: 'A',
        //template: '<div></div>',
        link: function(scope, element, attrs){
            scope.qrcode = new QRCode(element[0]);

            scope.$watch(attrs.value, function(val) {
                scope.qrcode.makeCode(val);
            });
        }
    }
}]);
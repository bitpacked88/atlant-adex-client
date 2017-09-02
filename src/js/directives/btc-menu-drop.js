angular.module('web').directive('btcMenuDrop', [function() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var child = element.find("ul").first(),
                defaultChildWidth = child.width();


            scope.$on('$stateChangeSuccess', function(){
                var elWidth;
                element.css('width', 'auto');
                elWidth = element.width();

                if (defaultChildWidth < elWidth) {
                    element.css({width: elWidth});
                    child.css({width: elWidth})
                }
            });
        }
    }
}]);
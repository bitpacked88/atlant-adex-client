
  //
  //  makes element fill height of window or parent from having top offset
  //

angular.module('web').directive('btcResizable', ['$window', 'splashService', '$timeout', function($window, splashService, $timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {

            // measure height by window or by parent block
            var inner = attrs.btcResizable === "parent";

            var elementTop  =  $element.offset().top - $element.parent().offset().top;
            var w           =  angular.element($window);
            var p           =  $element.parent();
            var minHeight   =  50;

            function resize(){


                $timeout (function(){
                    var h = p.height() - elementTop;
                    h = h > minHeight ? h : minHeight;
                    $element.css({height: h});
                }, 100);
            }

            $scope.$on('$destroy', function(){
                w.off('resize.btc-resizable');
            });

            resize();
            // $scope.$watch(splashService.checkState, function (val) {
            //     resize();
            // });
            w.on('resize.btc-resizable', resize);

        }
    }
}]);
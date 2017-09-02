angular.module('web').directive('btcGraphResize', ['authService', 'appMessages', '$window', function(authService, appMessages, $window) {
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){






            var window = angular.element($window),
                offset = 100,
                chartWrapperHeight;

            // set changeable on window resize
            window.on("resize.btcGraphResize", redraw);

            authDecision(authService.isLoggedIn());
            $scope.$on(appMessages.auth.change, function(e, state){
                authDecision(state);
            });


            function redraw(){
                var newHeightValue = (window.height() - offset) / 100 * chartWrapperHeight;
                $element.css({
                    height: newHeightValue
                });
            }


            function authDecision (authState){
                // if the directive is of order view - set it's view to 65 anyway
                // otherwise - if it is of graph view - set if to 65 or 100% according to auth state

                if(attrs.btcGraphResize === "graph"){
                    chartWrapperHeight = authState ? 65 : 100;
                }else if(attrs.btcGraphResize === "order_book"){
                    chartWrapperHeight = 65;
                }else if(attrs.btcGraphResize === "bottom"){
                    chartWrapperHeight = 35;
                }
                redraw();
            }





        }
    }
}]);
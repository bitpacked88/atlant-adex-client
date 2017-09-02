!function(){
    Controller.$inject = ['$scope', 'appMessages', 'desktopService', 'currencyService', 'splashService', '$rootScope'];
    function Controller($scope, appMessages, desktopService, currencyService, splashService, $rootScope){
        $scope.show = false;
        $scope.rate = '0.000000';
        $scope.side = true;
        $scope.pairs = currencyService.getPairs();
        $scope.current_class = '_value';

        $scope.changePair = function(e, index){
            e.preventDefault();
            currencyService.setActivePair(index);
            $scope.show = false;
            splashService.start();
            desktopService.init().then(function(){
                update();
                splashService.finish();
            });
        };

        function update() {
            if (lastTrade = desktopService.getLastTrade()) $scope.rate = lastTrade[0];
        }

        $scope.$on(appMessages.hub.newTrade, function(e, d){
            if(d[8] != $scope.rate) {
                $scope.current_class = $scope.rate > d[8] ? '_value red' : '_value';

                $scope.side = d[6];
                $scope.rate = d[8];
            }
        });

        $scope.toggle = function(){
            $scope.show = !$scope.show;
        };

        update();
    }

    angular.module('web').controller('innerOptionsCtrl', Controller);
}();
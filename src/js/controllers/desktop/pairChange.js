!function(){

    PairChangeCtrl.$inject = ['$scope', 'desktopService', 'currencyService', 'appMessages', 'splashService', '$timeout'];
    function PairChangeCtrl($scope, desktopService, currencyService, appMessages, splashService, $timeout){
        var vm = this;
        vm.show = false;
        vm.pairs = currencyService.getPairs();
        vm.toggle = function(){
            vm.show = !vm.show;
        };

        vm.changePair = function(e, index){
            splashService.start("pair change");
            e.preventDefault();
            vm.show = false;
            currencyService.setActivePair(index);
            desktopService.init().then(function(){
                splashService.finish("pair change");
            });
        };

        setData();

        $scope.$on(appMessages.desktop.loaded, setData);

        function setData(){
            var trade = desktopService.getLastTrade(),
                rate = (trade && trade[0])? trade[0] : 0;

            if(vm.rate != rate) {

                if (vm.rate)
                    vm.rate_class = vm.rate < rate ? '_value' : '_value red';
                else
                    vm.rate_class = '_value';

                vm.rate = rate;
            }
        }
    }

    angular.module('web').controller('desktopPairChangeCtrl', PairChangeCtrl);
}();
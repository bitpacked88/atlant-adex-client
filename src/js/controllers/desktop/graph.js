!function(){
    angular.module('web').controller('desktopGraphCtrl',['$scope', '$rootScope', 'apiService', 'appMessages', Controller]);
    function Controller($scope, $rootScope, apiService, appMessages){
        /*$scope.rangeOptions = [
            {name: '1m', id: '1m'},
            {name: '5m', id: '5m'},
            {name: '15m', id: '15m'},
            {name: '1h', id: '1h'}
        ];
        $scope.range = $scope.rangeOptions[0].id;
        $scope.loaded = false;

        apiService.get(apiService.methods.account.graphicsStat, {range: $scope.range}).then(function(res){
            $rootScope.$broadcast(appMessages.graph.loaded, res.data.data.data);
            $scope.loaded = true;
        });

        function getData(){
            if (!$scope.loaded) return;
            apiService.get(apiService.methods.account.graphicsStat, {range: $scope.range}).then(function(res){
                $rootScope.$broadcast(appMessages.graph.rangeSwitch, res.data.data.data);
            });
        }

        $scope.$watch('range', getData);*/
    }
}();
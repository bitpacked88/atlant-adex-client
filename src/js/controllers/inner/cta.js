!function(){
    angular.module('web').controller('innerCtaCtrl', ['$scope', 'appMessages', Controller]);

    function Controller($scope, appMessages){
        $scope.show = false;

        $scope.$on(appMessages.auth.change, function(e, res){
            $scope.show = !res;
        });
    }
}();
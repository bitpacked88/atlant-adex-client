(function(){
    angular.module('web').controller('dialogAddApiCtrl',['$scope', 'apiService', Controller]);

    function Controller($scope, apiService){

        $scope.isType = function(type){
            return type === $scope.type;
        };

        $scope.onGenerate = function(){
            $scope.cb();
            $scope.$close();
        };
    }
}());
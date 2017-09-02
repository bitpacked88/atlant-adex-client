!function () {
    angular.module('web').controller('innerTransactionsColumnCtrl', ['$scope', '$rootScope', '$stateParams', Controller]);

    function Controller($scope, $rootScope, $stateParams) {

        $scope.params = $rootScope.pairs;
        $scope.visible = {
            base: false,
            derived: false
        };

        var pair = $stateParams.id.split('_');
        if($scope.params[pair[0].toUpperCase()] == undefined
            || $scope.params[pair[0].toUpperCase()].indexOf(pair[1].toUpperCase()) == undefined) {

            setFirsPair();
        } else {
            $scope.currency = {
                base: pair[0].toUpperCase(),
                derived: pair[1].toUpperCase()
            };
        }

        function setFirsPair() {
            var base = Object.keys($scope.params)[0].toUpperCase();

            $scope.currency = {
                base: base,
                derived: base
            };

            $stateParams.id = base + "_" + base;
        }

        $scope.toggle = function (type) {
            if(type === "base") {
                $scope.visible.base = !$scope.visible.base;
            } else {
                $scope.visible.derived = !$scope.visible.derived;
            }
        };
    }
}();
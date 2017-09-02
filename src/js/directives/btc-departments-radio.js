angular.module('web').directive('btcDepartmentsRadio', function() {
    return {
        restrict: 'E',
        scope: { model: '=' },
        controller: ['$scope', function($scope) {

            $scope.myOptions = [
                { id: 'general',        name: "General" },
                { id: 'finance',        name: "Finance" },
                { id: 'verification',   name: "Verification" },
                { id: 'security',       name: "Security" },
            ];
            $scope.model = $scope.myOptions[0].id;
        }],
        template: "<btc-radio model='model' options='myOptions'></btc-radio>"
    };
});
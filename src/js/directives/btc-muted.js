angular.module('web').directive('btcMuted', [function() {
    return {
        restrict: 'A',
        template: '<span>{{notMuted}}<span class="_muted">{{muted}}</span></span>',
        scope: {
            value: '='
        },
        controller: ['$scope', function($scope){
            $scope.$watch('value', function(v){
                if (v === null || v === undefined) return;
                var tmp = v,
                    zeros = 0;

                for(var i = tmp.length - 1; i>=0; i--){
                    if (tmp.charAt(i) === '0') {
                        zeros++;
                    } else {
                        if (tmp.charAt(i) === '.') zeros--;
                        break
                    }
                }

                tmp = tmp.slice(0, tmp.length - zeros);
                $scope.notMuted = tmp;
                $scope.muted = Array(zeros + 1).join('0');
            });
        }],

        link: function ($scope, element) {

        }
    }
}]);
angular.module('web').directive('btcFocus', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            focus: '@'
        },
        link: function (scope, element) {
            function doFocus() {
                $timeout(function () {
                    element[0].focus();
                });
            }

            if (scope.focus != null) {
                if (scope.focus !== 'false')
                    doFocus();

                scope.$watch('focus', function (value) {
                    if (value === 'true')
                        doFocus();
                });
            } else
                doFocus();
        }
    }
}]);
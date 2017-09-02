angular.module('web').directive('btcRadio', function() {
    return {
        restrict: 'E',
        scope: { model: '=', options: '=', callback: '&' },
        controller: ['$scope', function($scope) {
            $scope.activate = function (option, $event) {
                $scope.model = option.id;
                // stop the click event to avoid that Bootstrap toggles the "active" class
                if ($event.stopPropagation) {
                    $event.stopPropagation();
                }
                if ($event.preventDefault) {
                    $event.preventDefault();
                }
                $event.cancelBubble = true;
                $event.returnValue = false;
            };

            $scope.isActive = function(option) {
                return option.id == $scope.model;
            };

            $scope.getName = function (option) {
                return option.name;
            }
        }],
        template: "<div class='directive-btc-radio'><span ng-click='activate(option, $event)' ng-repeat='option in options' ng-class='{_active: isActive(option)}'>{{getName(option)}}</span></div>"
    };
});
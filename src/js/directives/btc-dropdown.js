angular.module('web').directive("btcDropdown", ['$rootScope', function ($rootScope) {
    return {
        restrict: "A",
        templateUrl: 'views/directives/btc-dropdown.html',
        scope: {
            placeholder: "@",
            list: "=",
            selected: "="
        },
        link: function (scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;

            scope.select = function (item) {
                scope.isPlaceholder = false;
                scope.selected = item;
                scope.listVisible = false;
            };

            scope.isSelected = function (id, item) {
                return id === scope.selected;
            };

            scope.toggle = function () {
                scope.listVisible = !scope.listVisible;
            };

            scope.$watch("selected", function () {
                scope.isPlaceholder = scope.selected === undefined;
                scope.display = scope.list[scope.selected] || scope.placeholder;
            });
        }
    }
}]);
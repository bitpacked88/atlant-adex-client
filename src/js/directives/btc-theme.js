angular.module('web').directive('btcTheme', ['appMessages', function(appMessages) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on(appMessages.settings.themeSwitch, function(event, theme){
                element.attr('class', 'theme-' + theme);
            });
        }
    }
}]);
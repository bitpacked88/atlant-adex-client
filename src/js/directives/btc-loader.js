angular.module('web').directive('btcLoader',
    ['$rootScope', 'appMessages', 'splashService', '$timeout',
        function($rootScope, appMessages, splashService, $timeout) {
            return {
                restrict: 'E',
                templateUrl: 'views/directives/btc-loader.html',
                controller: ['$scope', '$attrs', '$element', function($scope, attrs, element){

                    $scope.loadings = 0;
                    applyLoadingState( splashService.checkState() );
                    $scope.$on (appMessages.loading.stateChanged, function(event, stateInput){
                        applyLoadingState(stateInput);
                    });
                    function applyLoadingState(stateInput){
                        $scope.loadings   = stateInput.loadings;
                        $scope.whiteTheme = stateInput.whiteTheme;

                        //$timeout(
                        //    function(){
                        //        $scope.loadings   = stateInput.loadings;
                        //        $scope.whiteTheme = stateInput.whiteTheme;
                        //    },
                        //    stateInput.loadings == 0 ? 1500 : 0
                        //);
                    }

                }]
            }
        }]);
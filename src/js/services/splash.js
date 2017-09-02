//  set of functions setting and getting app loading state
//  to true or false to show or hide loading plane
//  getState function is watched from src/js/controllers/root.js

(function () {
    angular.module('web').factory('splashService',
        ['$rootScope', 'appMessages', '$window',
            function splashService($rootScope, appMessages, $window) {

        var loadingState = {
            loadings:    0,
            global:      false,
            whiteTheme:  true
        };

        return {
            start: function (globalInput) {


                if (globalInput === true)          loadingState.global = true;
                //if (loadingState.global === false) loadingState.loadings = 0; // обнуляем если нажали на кнопку не дожидаясь окончания загрузки последнего

                loadingState.loadings += 1;
                loadingState.whiteTheme = $window.localStorage.getItem("white_theme") == "true";
                $rootScope.$broadcast (appMessages.loading.stateChanged, loadingState);

                //console.log("start-2", globalInput, loadingState.loadings);

            },
            finish: function (globalInput) {

                if (globalInput === true){
                    loadingState.global = false;
                    appLoader.finish(); // setting pre-angular loader off
                }
                if (loadingState.loadings > 0)     loadingState.loadings -= 1;
                $rootScope.$broadcast (appMessages.loading.stateChanged, loadingState);

                //console.log("finish / ", globalInput+" /", loadingState.loadings);

            },
            checkState: function (){
                return loadingState;
            }
        }
    }])
})();
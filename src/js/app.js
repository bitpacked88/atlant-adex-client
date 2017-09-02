angular.module('web', ['ngCookies', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'angularFileUpload']);

angular.module('web').config(['appConfig', '$logProvider', function (appConfig, $logProvider) {
    $logProvider.debugEnabled(appConfig.debug);
}]);

angular.module('web').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = false;
    $httpProvider.interceptors.push('authInterceptor');
}]);

//Hotkeys
angular.module('web').run(['keyboardService', function (keyboardService) {
    keyboardService.init();
}]);

//todo reinit highcharts

angular.module('web').run(['$rootScope', '$state', '$stateParams', 'appConfig', 'appMessages', function ($rootScope, $state, $stateParams, appConfig, appMessages) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.rootTitle = '';
    $rootScope.tradeChart = null;
    $rootScope.currentPair = {
        name: '',
        base: {
            name: "",
            symbol: "",
            title: ""
        },
        derived: {
            name: "",
            symbol: "",
            title: ""
        }
    };
    $rootScope.baseCurrency = {name: '', symbol: '', title: ''};

    // console.log("Current pair: ", $rootScope.currentPair);

    //$rootScope.rootLoader = true;

    /*
     $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
     $rootScope.$broadcast(appMessages.graph.destroy);
     $rootScope.rootLoader = true;
     });

     $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
     $rootScope.rootLoader = false;
     })
     */
}]);

(function () {


    angular.module('web').factory('authInterceptor', ['$rootScope', '$q', '$window', '$timeout', '$injector', 'notificationService', Service]);

    function Service($rootScope, $q, $window, $timeout, $injector, notificationService) {

        return {

            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.ATLANTToken) {
                    config.headers.Authorization = 'Token ' + $window.localStorage.ATLANTToken;
                }
                return config;
            },

            response: function (response) {
                return response || $q.when(response);
            },

            responseError: function(rejection) {
                if (rejection.status === 401) {
                    authService = $injector.get("authService");
                    authService.applyLogout();
                }
                return $q.reject(rejection);
            }

        };
    }


})();
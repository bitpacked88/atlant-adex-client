(function () {
    angular.module('web').factory('hubService', ['$rootScope', 'appConfig', '$log', '$window', 'currencyService', 'appMessages', '$timeout', Service]);

    function Service($rootScope, appConfig, $log, $window, currencyService, appMessages, $timeout) {

        var started = false,
            connection = $.hubConnection(appConfig.hubDomain),
            proxy = connection.createHubProxy(appConfig.hubName),
            token = $window.localStorage.getItem('ATLANTToken'),
            qs = {
                pair: currencyService.getCurrentPair(),
                candleSize: "1m"
            };

        if (token)
            qs.token = token;

        connection.qs = qs;

        angular.forEach(appMessages.hub, function (message) {
            proxy.on(message, function (data) {
                //$log.warn(message, data);
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(message, data);
                });
            });
        });

        $rootScope.$on(appMessages.auth.change, function (event, state) {
            if(state)
                proxy.invoke('setAuthToken', $window.localStorage.ATLANTToken);
        });

        $rootScope.$on(appMessages.currency.pairChanged, function (event, currency) {
            proxy.invoke('setPair', currency);
        });

        function setCandleSize(candleSize) {
            if (started)
                proxy.invoke('setCandleSize', candleSize);
            else
                $timeout(function () {
                    setCandleSize(candleSize);
                }, 200);
        }

        return {
            init: function () {
                connection.start().done(function () {
                    $log.info('WebSocket starting');

                    started = true;
                });
            },
            setCandleSize: setCandleSize,
            on: function (eventName, callback) {
                proxy.on(eventName, function (result) {
                    $rootScope.$apply(function () {
                        if (callback)
                            callback(result);
                    });
                });
            },

            invoke: function (methodName, callback) {
                proxy.invoke(methodName).done(function (result) {
                    $rootScope.$apply(function () {
                        if (callback)
                            callback(result);
                    });
                });
            }
        };
    }
}());
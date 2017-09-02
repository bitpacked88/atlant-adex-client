//   this is root controller
//   it is called first of all
//   it controls what to show and what to hide while the page is loading
//   it measures app loading time, shows notification when it is over 15 seconds
//   and sets timer to 4 seconds to reload page

(function () {
    "use strict";
    function Controller($scope, $rootScope, appMessages, desktopService, currencyService, $window) {

        // variables affecting <html ng-class> of /src/index_old.html
        $scope.isDesktop = false;
        $scope.isLite = false; // todo: delete

        // page loading time measurer declaration
        // listening to loading measuring timer
        $scope.appLoadingTimer = null;

        // assigning splash state (stored in /src/js/services/splash.js) watcher
        // to switch globalLoader attr
        // in <btc-loader> directive in root index_old.html

        //splashService.start();

        // set timer to restart loading
        //if (val === true) {
        //    $scope.appLoadingTimer = $timeout(function () {
        //        $rootScope.$broadcast(appMessages.loading.timeExpired);
        //        $timeout(function(){
        //            $window.location.reload();
        //        }, 3000);
        //    }, 15000);
        //} else {
        //    $timeout.cancel ($scope.appLoadingTimer);
        //}

        // src/bower_components/angular-ui-router/release/angular-ui-router.js
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isDesktop = $scope.$state.includes('root.desktop');
            $scope.isLite = $scope.$state.includes('root.lite');
        });

        $scope.on = function(name, callback){

            $scope.$on(name, function(event, data){
                callback(event, data);

                $rootScope.$broadcast(appMessages.desktop.loaded, true);
            });
        };

        $scope.on(appMessages.hub.newBalance, function (event, data) {
            currencyService.isBase(data.base, data.currency, function (flag) {
                if (flag)
                    desktopService.setPersonalStats({
                        availableFunds: parseFloat(data.availableFunds),
                        blockedFunds: parseFloat(data.blockedFunds),
                        tradeFunds: parseFloat(data.availableFunds) + parseFloat(data.blockedFunds)
                    });
                else
                    desktopService.setPersonalStats({
                        derivedAvailableFunds: parseFloat(data.availableFunds),
                        derivedBlockedFunds: parseFloat(data.blockedFunds),
                        derivedTradeFunds: parseFloat(data.availableFunds) + parseFloat(data.blockedFunds)
                    });
            });
        });

        $scope.on(appMessages.hub.newAccountFee, function (event, data) {
            var stats = (data.isTaker == 'True')? {takerFee: data.feeInPercent}: {makerFee: data.feeInPercent};
            desktopService.setPersonalStats(stats);
        });

        $scope.on(appMessages.hub.newMarginInfo, function (event, data) {
            desktopService.setPersonalStats({
                equity: data[0],
                margin: data[1],
                freeMargin: data[2],
                marginLevel: data[3]
            });
        });

        $scope.on(appMessages.hub.newOrder, function (e, data) {
            desktopService.addOrder(data);
        });

        $scope.on(appMessages.hub.newOrderMatch, function (e, data) {
            angular.forEach(desktopService.getOrders(), function (order, i) {
                if (data[0] == order[0]) {
                    order[4] = data[2];
                    order[7] = data[3];

                    desktopService.editOrder(i, order);
                }
            });
        });

        $scope.on(appMessages.hub.newOrderCancel, function (e, data) {
            angular.forEach(desktopService.getOrders(), function (order, i) {
                if (data[0] == order[0]) {
                    order[7] = 3;

                    desktopService.editOrder(i, order);
                }
            });
        });

        $scope.on(appMessages.hub.newOrderModify, function (e, data) {
            angular.forEach(desktopService.getOrders(), function (order, i) {
                if (data[0] == order[0]) {
                    order[5] = data[2];
                    order[6] = data[3];

                    desktopService.editOrder(i, order);
                }
            });
        });

        $scope.on(appMessages.hub.newTrade, function(e, data){
            desktopService.addTrade(data);
        });

        $scope.on(appMessages.hub.newOrderBookTop, function (e, data) {
            desktopService.setOrderBook(data);
        });

        $scope.on(appMessages.hub.newDesktop, function(e, data){
            desktopService.setGeneralStats({
                volume: data[0],
                change: data[1],
                high: data[2],
                low: data[3]
            });
        });
    }

    /*global angular */
    angular.module('web').controller('rootCtrl', ['$scope', '$rootScope', 'appMessages', 'desktopService', 'currencyService', '$window', Controller]);
}());
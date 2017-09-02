!function () {
    angular.module('web').controller('commonAlertsCtrl', ['$scope', 'notificationService', 'appMessages', 'appConfig', 'currencyService', Controller]);


    function Controller($scope, notificationService, appMessages, appConfig, currencyService) {
        $scope.$on(appMessages.notification.success, function (e, data) {
            notificationService.showMessage({
                message: data.text,
                type: notificationService.defaultMessages.types.success,
                title: notificationService.defaultMessages.titles.success
            }, data.permanent || false);
        });

        $scope.$on(appMessages.notification.warning, function (e, data) {
            notificationService.showMessage({
                message: data.text,
                type: notificationService.defaultMessages.types.warning,
                title: 'Warning'
            });
        });

        $scope.$on(appMessages.notification.error, function (e, data) {
            notificationService.showMessage({
                message: data.text,
                type: notificationService.defaultMessages.types.error,
                title: notificationService.defaultMessages.titles.error(data.num)
            });
        });

        $scope.$on(appMessages.notification.message, function (e, data) {
            notificationService.showMessage({
                message: data.text,
                type: notificationService.defaultMessages.types.message,
                title: notificationService.defaultMessages.titles.message
            });
        });

        $scope.$on(appMessages.hub.newMarginCall, function () {
            notificationService.showMessage({
                message: 'Margin Call',
                type: notificationService.defaultMessages.types.warning
            }, true);
        });

        $scope.$on(appMessages.hub.newForcedLiquidation, function () {
            notificationService.showMessage({
                message: 'Forced Liquidation',
                type: notificationService.defaultMessages.types.error
            }, true);
        });

        $scope.$on(appMessages.hub.newOrder, function (e, data) {
            notificationService.showMessage({
                title: 'Success',
                message: 'New order placed',
                type: notificationService.defaultMessages.types.success
            });
        });

        $scope.$on(appMessages.hub.newOrderCancel, function (e, data) {
            notificationService.showMessage({
                title: 'Success',
                message: 'Order cancelled',
                type: notificationService.defaultMessages.types.success
            });
        });

        $scope.$on(appMessages.hub.newOrderMatch, function (e, data) {
            notificationService.showMessage({
                title: 'Success',
                message: 'Order matched',
                type: notificationService.defaultMessages.types.success
            });
        });

        $scope.$on(appMessages.hub.newOrderModify, function (e, data) {
            notificationService.showMessage({
                title: 'Success',
                message: 'Order modified',
                type: notificationService.defaultMessages.types.success
            });
        });

        $scope.$on(appMessages.hub.newFiatDeposit, function (e, data) {
            notificationService.showMessage({
                title: 'Success',
                message: data[2] + ": " + data[0] + " " + data[1] +  " successfully credited to your account",
                type: notificationService.defaultMessages.types.success
            });
        });

        $scope.$on(appMessages.hub.newCryptoDeposit, function (e, data) {
            var params = {
                    title: 'Success',
                    type: notificationService.defaultMessages.types.success
                },
                price = data[1] + ' ' + data[0],
                currency = currencyService.getNameByAlias(data[0]);

            if (data[3])
                params.message = 'credited ' + price + ' to your account (' +
                    appConfig.confirmations[data[0]] + ' confirmations received)';
            else
                params.message = 'deposited ' + price + '. Funds will become available after receiving ' +
                    appConfig.confirmations[data[0]] + ' confirmations in the ' + currency.title + ' network.';

            notificationService.showMessage(params);
        });

        $scope.$on(appMessages.hub.cryptoOutCompleted, function (e, data) {
            var params = {
                    title: 'Success',
                    type: notificationService.defaultMessages.types.success
                },
                price = data[1] + ' ' + data[0];

            params.message = 'your withdrawal of ' + price + ' has been completed';

            notificationService.showMessage(params);
        });

        $scope.$on(appMessages.hub.txVerification, function(e, data) {
            $scope.$broadcast(appMessages.notification.error, {
                text: data[0]
            });
        });

        $scope.alerts = notificationService.getMessages();
        $scope.onClose = function (id) {
            notificationService.hideMessage(id);
        };

    }
}();
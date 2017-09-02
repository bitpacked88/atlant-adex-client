(function () {
    angular.module('web').controller('cryptoGatewayCtrl', ['$rootScope', '$scope', 'appMessages', 'apiService', 'currencyService', 'modalService', Controller]);

    function Controller($rootScope, $scope, appMessages, apiService, currencyService, modalService) {
        $scope.amount = 0;
        $scope.to_get = 0;
        $scope.address = '';
        $scope.show_button = false;
        $scope.loading = false;
        $scope.errorMessage = '';

        $scope.getSubmitLabel = function () {
            if ($scope.loading)
                return 'Loading...';

            return 'Transfer ' + $scope.wallet.currency + ' funds';
        };

        $scope.onChangeAmount = function () {
            var val = parseFloat($scope.amount),
                result = isNaN(val) ? 0 : parseFloat(val - $scope.wallet.fee);

            if (result <= 0)
                result = 0;

            $scope.to_get = result.toFixed(8);
        };

        $scope.onChangeToGet = function () {
            var val = parseFloat($scope.to_get),
                result = isNaN(val) ? 0 : parseFloat(val + $scope.wallet.fee);

            if (result <= 0)
                result = 0;

            $scope.amount = result.toFixed(8);
        };

        $scope.getNewAdress = function (recreate) {
            var params = {};

            if (recreate)
                params.recreate = 1;

            apiService.get(apiService.methods.crypto.getAddress($scope.wallet.pair), params).then(function (res) {
                var data = res.data;

                if (res.data.code == 0) {
                    $scope.address = data.result.address;
                    $scope.show_button = data.result.isUsed;

                    var client = new ZeroClipboard(document.getElementById("copy-button"));
                    client.on("aftercopy", function (event) {
                        $rootScope.$broadcast(appMessages.notification.success, {text: 'Link copied to clipboard'});
                    });
                }
            }).catch(function (res) {
                if (res.data.code == 27)
                    $scope.errorMessage = 'This address has not yet been used';
            });
        };

        if ($scope.way == 'in')
            $scope.getNewAdress();

        $scope.submit = function () {
            if ($scope.way == 'in')
                $scope.$close();
            else {
                var amount = parseFloat($scope.amount);

                if (!$scope.address.length) {
                    $scope.errorMessage = 'You ' + $scope.wallet.currency + ' address is empty';
                    return false;
                }

                if (!amount.length && amount <= 0) {
                    $scope.errorMessage = 'Invalid amount';
                    return false;
                }

                $scope.loading = true;

                apiService.post(apiService.methods.crypto.out($scope.wallet.pair), {
                    address: $scope.address,
                    amount: amount
                }).then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        data.result.currency = $scope.wallet.currency;
                        data.result.amount = $scope.amount;
                        data.result.gateway = 'crypto';

                        modalService.withdrawConfirm(data.result);

                        $scope.$close();
                    }
                }).catch(function (res) {
                    if (res.data.code == 21)
                        $scope.errorMessage = 'Invalid address';
                    else if (res.data.code == 19 || res.data.code == 22)
                        $scope.errorMessage = 'Invalid amount';
                    else if (res.data.code == 23)
                        $scope.errorMessage = 'Insufficient funds';

                    //$scope.errorMessage = appNotifications.getMessage(res.data.code); //todo обработка ошибки

                    $scope.loading = false;
                });
            }
        };
    }
}());
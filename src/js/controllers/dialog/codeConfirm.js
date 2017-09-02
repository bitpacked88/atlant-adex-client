(function(){
    angular.module('web').controller('dialogCodeConfirmCtrl',['$scope', 'modalService', 'apiService', '$rootScope', 'appMessages', Controller]);

    function Controller($scope, modalService, apiService, $rootScope, appMessages) {

        if($scope.request.fiatCode != undefined) {
            setTimeout(function() {
                var client = new ZeroClipboard(document.getElementById("copy-button"));
                client.on("aftercopy", function (event) {
                    $rootScope.$broadcast(appMessages.notification.success, {text: 'Code copied to clipboard'});
                });
            }, 1000);
        }

        $scope.confirm = function() {
            apiService.post(apiService.methods.fiat.out($scope.request.currency), $scope.request).then(function (res) {
                var result = res.data.result;
                result.currency = $scope.request.currency;
                result.amount = $scope.request.amount;
                result.gateway = 'fiat';

                modalService.withdrawConfirm(result, function(data) {
                    $scope.request.fiatCode = data.data.result.fiatCode;
                    modalService.codeConfirm($scope.request);
                });

                $scope.$close();
            });
        }

    }
}());
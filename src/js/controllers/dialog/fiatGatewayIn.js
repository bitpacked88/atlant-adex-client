(function () {
    angular.module('web').controller('fiatGatewayInCtrl', ['$scope', 'apiService', 'appNotifications', 'modalService', 'authService', Controller]);

    function Controller($scope, apiService, appNotifications, modalService, authService) {
        $scope.amount = '';
        $scope.methods = [];
        $scope.currentFee = '0';

        // true - in, false - out
        $scope.side = true;

        $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];

        $scope.years = {
            2016: '2016',
            2017: '2017',
            2018: '2018',
            2019: '2019',
            2020: '2020',
            2021: '2021',
            2022: '2022',
            2023: '2023',
            2024: '2024',
            2025: '2025',
            2026: '2026',
            2027: '2027',
            2028: '2028',
            2029: '2029',
            2030: '2030'
        };

        $scope.user = authService.getUser();

        function getMethodByName(name) {
            for(var i = 0; i != $scope.methods.length; i++) {
                if($scope.methods[i].name == name && $scope.methods[i].side == $scope.side) {
                    return $scope.methods[i];
                }
            }
            return null;
        }

        $scope.onChangeAmount = function(idFrom, idTo) {
            var val = parseFloat($('#'+idFrom).val());
            var result = isNaN(val) ? 0 : val * (1-($scope.currentFee.percent/100));
            result -= $scope.currentFee.abs;

            if (result <= 0)
                result = 0;

            $('#'+idTo).val(result.toFixed(2));
        };

        $scope.onChangeToGet = function(idFrom, idTo) {
            var val = parseFloat($('#'+idFrom).val());
            var result = isNaN(val) ? 0 : (val + $scope.currentFee.abs) / (1 - ($scope.currentFee.percent/100));

            if (result <= 0)
                result = 0;

            $('#'+idTo).val(result.toFixed(2));
        };
        var that = this;

        $scope.moneyPolo = {
            amount: '',
            account: '',
            description: ''
        };

        $scope.sofort = {
            amount: ''
        };

        $scope.ac = {
            amount: ''
        };

        $scope.switchExtra = function() {
            console.log("TEST");
            $scope.fcode.extraFieldsVisible = !$scope.fcode.extraFieldsVisible;
        };

        $scope.fcode = {
            code: ""
        };

        $scope.currentFee = '0';

        $scope.setCurrentMethod = function(method) {
            $scope.current_method = method;
            var methodObj = getMethodByName(method);
            $scope.currentFee = {
                percent: methodObj.percFee,
                abs: methodObj.absFee,
                minFee: methodObj.minFee,
                maxFee: methodObj.maxFee
            };
        };

        apiService.get(apiService.methods.fiat.methods($scope.wallet.currency)).then(function(res){
            var data = res.data;
            if(data.code == 0) {
                var methods = data.result;
                var firstMethodName =  null;
                for(var i = 0; i != methods.length; i++) {
                    if(methods[i].side == true) {
                        if(firstMethodName == null) {
                            firstMethodName = methods[i].name;
                        }
                        $scope.methods.push(methods[i]);
                    }
                }
                if(firstMethodName != null) {
                    $scope.setCurrentMethod(firstMethodName);
                }
            }
        });

        $scope.submit = function () {
            $scope.errorMessage = '';
            if($scope.current_method == 'SOFORT') {
                apiService.post(apiService.methods.fiat.SofortSend, {
                    amount: $scope.sofort.amount,
                    currency: $scope.wallet.currency
                }).then(function(data) {
                    var paymentData =  data.data.result;

                    $("#SofortIn [name='user_id']").val(paymentData.user_id);
                    $("#SofortIn [name='project_id']").val(paymentData.project_id);
                    $("#SofortIn [name='currency_id']").val(paymentData.currency_id);
                    $("#SofortIn [name='reason_1']").val(paymentData.reason_1);
                    $("#SofortIn [name='reason_2']").val(paymentData.reason_2);
                    $("#SofortIn [name='user_variable_0']").val(paymentData.user_variable_0);
                    $("#SofortIn [name='hash']").val(paymentData.hash);

                    $("#SofortIn").submit();

                }).catch(function(errorData) {
                    console.log(errorData);
                });
            } else if($scope.current_method == 'MoneyPolo') {
                apiService.post(apiService.methods.fiat.moneyPoloSend, {
                    amount: $scope.moneyPolo.amount,
                    currency: $scope.wallet.currency
                }).then(function(data) {
                    var paymentData = data.data.result;

                    $("#moneyPoloIn [name='Currency']").val(paymentData.currency);
                    $("#moneyPoloIn [name='MerchantCode']").val(paymentData.merchantCode);
                    $("#moneyPoloIn [name='MerchantDocID']").val(paymentData.merchantDocId);
                    $("#moneyPoloIn [name='Signature']").val(paymentData.signature);
                    $("#moneyPoloIn [name='TestMode']").val(paymentData.testMode);
                    $("#moneyPoloIn [name='Details']").val(paymentData.details);

                    $("#moneyPoloIn [name='description']").remove();

                    $("#moneyPoloIn").submit();

                }).catch(function(errorData) {
                    console.log('Error:');
                    console.log(errorData);
                })
            } else if($scope.current_method == 'AdvCash') {
                apiService.post(apiService.methods.fiat.acSend, {
                    amount: $scope.ac.amount,
                    currency: $scope.wallet.currency
                }).then(function(data) {
                    var paymentData = data.data.result;

                    $("#advCashIn [name='ac_account_email']").val(paymentData.ac_account_email);
                    $("#advCashIn [name='ac_sci_name']").val(paymentData.ac_sci_name);
                    $("#advCashIn [name='ac_currency']").val(paymentData.ac_currency);
                    $("#advCashIn [name='ac_order_id']").val(paymentData.ac_order_id);
                    $("#advCashIn [name='ac_sign']").val(paymentData.ac_sign);
                    $("#advCashIn [name='ac_comments']").val(paymentData.ac_comments);

                    $("#advCashIn").submit();

                }).catch(function(errorData) {
                    console.log('Error:');
                    console.log(errorData);
                })
            } else if($scope.current_method == 'Fiat Code') {
                var request = {
                    code: $scope.fcode.code,
                    currency: $scope.wallet.currency
                };

                apiService.post(apiService.methods.fiat.Codes, request).then(function(data) {
                    appNotifications.show(10100);
                    $scope.$close();
                }).catch(function(errorData) {
                    appNotifications.show(errorData.data.code);
                });

            } else {
                $scope.$close();
            }
        }
    }
}());
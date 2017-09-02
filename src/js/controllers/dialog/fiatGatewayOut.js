(function () {
    angular.module('web').controller('fiatGatewayOutCtrl', ['$scope', 'apiService', 'appNotifications', 'modalService', 'authService', Controller]);

    function Controller($scope, apiService, appNotifications, modalService, authService) {
        $scope.amount = '';
        $scope.methods = [];
        $scope.currentFee = '0';

        // true - in, false - out
        $scope.side = false;

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

        $scope.moneyPolo = {
            amount: '',
            account: '',
            description: ''
        };

        $scope.out = {
            account: '',
            toget: ''
        };

        $scope.currentFee = '0';

        $scope.sepaWireOut = {
            IBAN: "",
            BankSWIFT: "",
            BeneficiaryName: "",
            BeneficiaryAddress: ""
        };

        $scope.swiftOut = {
            IBAN: "",
            BankSWIFT: "",
            BeneficiaryName: "",
            BankName: "",
            BankAddress: "",
            BeneficiaryAddress: ""
        };

        $scope.cardOut = {
            CardNumber: "",
            Month: "",
            Year: ""
        };

        $scope.fcode = {
            extraFieldsVisible: false,
            switchExtra: function() {
                $scope.fcode.extraFieldsVisible = !$scope.fcode.extraFieldsVisible;
            },
            resetExpirationDate: function() {
                $scope.fcode.data.expired = {day: "", month: "", year: ""};
            },
            checkDataIsValid: function() {
                var date = $scope.fcode.data.expired;
                var oneIsFill = date.day !== "" || date.month !==  "" || date.year !== "";
                var allValid =  date.day !== "" && date.month !== "" && date.year !== "";
                if(allValid)
                    return 'valid';
                if(!allValid && oneIsFill)
                    return 'invalid';
                if(!allValid && !oneIsFill)
                    return 'empty';
            },
            data: {
                amount: "",
                email: "",
                expired: {
                    day: "",
                    month: "",
                    year: ""
                }
            }
        };

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
                    if(methods[i].side == false) {
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
            var currentMethod = getMethodByName($scope.current_method);

            if($scope.current_method == 'MoneyPolo' ||
                $scope.current_method == 'OKPay' ||
                $scope.current_method == 'PerfectMoney' ||
                $scope.current_method == 'AdvCash'
            ) {
                apiService.post(apiService.methods.fiat.out($scope.wallet.currency), {
                    methodId: currentMethod.id,
                    amount: $scope.amount,
                    BeneficiaryAccount: $scope.out.account
                }).then(function (res) {

                    var result = res.data.result;
                    result.currency = $scope.wallet.currency;
                    result.amount = $scope.amount;
                    result.gateway = 'fiat';

                    modalService.withdrawConfirm(result);

                    $scope.$close();
                });
            } else if($scope.current_method == 'SEPA') {

                $scope.sepaWireOut.methodId = currentMethod.id;
                $scope.sepaWireOut.amount = $scope.amount;

                apiService.post(apiService.methods.fiat.out($scope.wallet.currency), $scope.sepaWireOut).then(function (res) {

                    var result = res.data.result;
                    result.currency = $scope.wallet.currency;
                    result.amount = $scope.amount;
                    result.gateway = 'fiat';

                    modalService.withdrawConfirm(result);

                    $scope.$close();
                });

            } else if($scope.current_method == 'SWIFT') {

                $scope.swiftOut.methodId = currentMethod.id;
                $scope.swiftOut.amount = $scope.amount;

                apiService.post(apiService.methods.fiat.out($scope.wallet.currency), $scope.swiftOut).then(function (res) {

                    var result = res.data.result;
                    result.currency = $scope.wallet.currency;
                    result.amount = $scope.amount;
                    result.gateway = 'fiat';

                    modalService.withdrawConfirm(result);

                    $scope.$close();
                });
            } else if($scope.current_method == 'Credit Card') {

                $scope.cardOut.methodId = currentMethod.id;
                $scope.cardOut.amount = $scope.amount;

                $scope.cardOut.Month = parseInt($scope.cardOut.Month)+1;

                apiService.post(apiService.methods.fiat.out($scope.wallet.currency), $scope.cardOut).then(function (res) {

                    var result = res.data.result;
                    result.currency = $scope.wallet.currency;
                    result.amount = $scope.amount;
                    result.gateway = 'fiat';

                    modalService.withdrawConfirm(result);

                    $scope.$close();
                });
            } else if($scope.current_method == 'Fiat Code') {
                var method = getMethodByName($scope.current_method);
                var request = {
                    amount: $scope.amount,
                    methodId: method.id,
                    currency: $scope.wallet.currency,
                    gateway: 'fiat'
                };

                if (request.amount == "") {
                    // Invalid amount error
                    appNotifications.show(22);
                    return;
                }

                if($scope.fcode.data.email != "") {
                    request.email = $scope.fcode.data.email;
                }

                var validData = $scope.fcode.checkDataIsValid();
                if(validData == 'invalid') {
                    // Invalid date error
                    appNotifications.show(90);
                    return;
                }

                if(validData == 'valid') {
                    var currentDate = new Date();
                    var targetDate = new Date($scope.fcode.data.expired.year, $scope.fcode.data.expired.month, $scope.fcode.data.expired.day+1);
                    var difference = parseInt(((targetDate - currentDate)/1000)/60);
                    if(difference <= 0) {
                        // Invalid date error
                        appNotifications.show(90);
                        return;
                    }
                    request.expiryPeriod = difference;
                    request.targetDate = targetDate;
                }

                modalService.codeConfirm(request);
                $scope.$close();
            }
        }
    }
}());
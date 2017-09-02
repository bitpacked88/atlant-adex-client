!function () {

    DesktopOrdersCtrl.$inject = ['$scope', '$rootScope', 'authService', 'desktopService', 'appMessages', 'apiService', '$state'];
    function DesktopOrdersCtrl($scope, $rootScope, authService, desktopService, appMessages, apiService, $state) {
        var isTs = false;

        var vm = this,
            statuses = {
                0: 'accepted',
                1: 'partiallyFilled',
                2: 'filled',
                3: 'cancelled'
            },
            types = {
                0: 'LIMIT',
                1: 'MARKET',
                2: 'STOPLOSS',
                3: 'TAKEPROFIT',
                4: 'TRAILINGSTOP'
            };

        vm.auth = authService.isLoggedIn();
        vm.data = [];
        vm.items = [];
        vm.statuses = {
            filled: 'Filled',
            accepted: 'Accepted',
            partiallyFilled: 'Partially filled',
            cancelled: 'Cancelled'
        };
        vm.types = {
            STOPLOSS: 'Stop loss',
            TAKEPROFIT: 'Take profit',
            TRAILINGSTOP: 'Trailing stop',
            LIMIT: 'Limit',
            MARKET: 'Market'
        };

        vm.isEditable = function (i, field) {
            var item = vm.data[i];

            if (item.order_type == 'MARKET')
                return false;

            if (field == 'rate' || field == 'ts_level')
                return item.editable;
            else
                return item.editable && item.order_type == 'LIMIT';
        };

        vm.change = function(i, field) {
            var item = vm.data[i];

            vm.items[item.id][field] = item[field];
        };

        vm.onCancel = function (i, id) {
            vm.data[i].editable = false;
            apiService.put(apiService.methods.trade.cancelOrder($rootScope.currentPair.name, id));
        };

        vm.onEdit = function (i) {
            var item = vm.data[i];

            vm.items[item.id] = {
                edit_old: item.edit,
                edit: item.edit,
                original_amount_old: item.original_amount,
                original_amount: item.original_amount,
                editable: true
        };

            vm.data[i].editable = true;
        };

        vm.onSave = function (i) {

            var item = vm.data[i],
                temp_item = vm.items[item.id];

            vm.data[i].editable = false;
            vm.items[item.id].editable = false;

            console.log(temp_item);

            if (temp_item.edit_old == temp_item.edit && temp_item.original_amount_old == temp_item.original_amount)
                return false;

            vm.data[i].edit = temp_item.edit;
            vm.data[i].original_amount = temp_item.original_amount;

            if (item.order_type == 'LIMIT')
                apiService.post(apiService.methods.trade.replaceLimit($rootScope.currentPair.name, item.id), {
                    price: item.edit,
                    qty: item.original_amount
                });
            else
                apiService.post(apiService.methods.trade.modifyCond(item.id), {
                    price: item.edit
                });
        };

        vm.onTrade = function () {
            $rootScope.$broadcast(appMessages.ui.tradePopupToggle);
        };

        vm.onAddFunds = function () {
            $state.go('root.inner.right-col.accounts');
        };

        $scope.$on(appMessages.auth.change, function (e, state) {
            if (state) {
                setData();
                vm.auth = true;
            } else
                vm.auth = false;
        });

        $scope.$on(appMessages.desktop.loaded, setData);

        $scope.isTS = function() {
            return isTs;
        };

        setData();

        function setData() {
            var data = desktopService.getPersonalStats();
            if (data.orders) {
                vm.data = [];

                angular.forEach(data.orders, function (order) {
                    var item = {
                        id: order[0],
                        derived_currency: order[1],
                        side: order[2],
                        original_amount: order[3],
                        actual_amount: order[4],
                        rate: order[5],
                        ts_level: order[6],
                        status: statuses[order[7]],
                        order_type: types[order[8]],
                        source: order[9],
                        datetime: order[10]
                    };

                    if(item.order_type == 'TRAILINGSTOP') {
                        isTs = true;
                    }

                    item.edit = item.order_type == 'TRAILINGSTOP' ? item.ts_level : item.rate;
                    //item.edit = item.rate;

                    if(vm.items[item.id] && vm.items[item.id].editable) {
                        item.editable = true;
                        item.edit = vm.items[item.id].edit || item.edit;
                        item.original_amount = vm.items[item.id].original_amount || item.original_amount;
                    }

                    vm.data.push(item);
                });
                vm.showCTA = vm.data.length === 0;
            } else {
                vm.data = [];
                vm.showCTA = true;
            }

            vm.fundsAreLow = !(data.derivedAvailableFunds < 0.01 && data.availableFunds < 1);
        }
    }

    angular.module('web').controller('desktopOrdersCtrl', DesktopOrdersCtrl);
}();

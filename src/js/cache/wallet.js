(function(){
    angular.module('web').factory('walletCache', ['apiService', '$q', Cache]);

    function Cache(apiService, $q){
        var id = null,
            wallet = {};

        return {
            getWallet: function(walletId){
                if (walletId === id) return $q.when(wallet);

                id = walletId;
                return apiService.get(apiService.methods.account.getWallet, {id: walletId}).then(function(res){
                    wallet = res.data.data;
                    return wallet;
                });
            }
        }
    }
}());


!function(){
    angular.module('web').factory('EntityCollectionAbstract', ['apiService', 'appConfig', Service]);

    function Service(apiService, appConfig){

        function EntityCollectionAbstract(method, Type){
            this.Type = Type;
            this.method = method;
            this.collection = [];
        }

        var proto = EntityCollectionAbstract.prototype;

        proto.fetch = function(params, append){
            append = !!append;
            params = params || {};
            params.limit = params.limit || appConfig.itemsPerPage;
            params.offset = params.offset || 0;

            return apiService.get(this.method, params).then(function(res){

            });
        };

        proto.getCollection = function(){
            return this.collection;
        };

        proto.clear = function(){
          this.collection = [];
        };

        return EntityCollectionAbstract;
    }
}();
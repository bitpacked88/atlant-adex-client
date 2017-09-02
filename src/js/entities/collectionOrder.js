!function(){
    angular.module('web').factory('EntityCollectionOrder', ['EntityCollectionAbstract', 'EntityOrder', 'apiMethods', Service]);

    function Service(EntityCollectionAbstract, EntityOrder, apiMethods){
        function EntityCollectionOrder(){
            EntityCollectionAbstract.call(this, apiMethods.news.all, EntityOrder);
        }

        EntityCollectionOrder.prototype = Object.create(EntityCollectionAbstract.prototype);

        return EntityCollectionOrder;
    }
}();
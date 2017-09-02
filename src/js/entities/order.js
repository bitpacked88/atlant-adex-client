!function(){
    angular.module('web').factory('EntityOrder', ['EntityAbstract', Service]);

    function Service(EntityAbstract){

        function EntityOrder(){
            EntityAbstract.call(this);
        }

        var proto = EntityOrder.prototype = Object.create(EntityAbstract.prototype);

        proto.makeOrder = function(){

        };

        return EntityOrder;
    }
}();
!function(){
    innerResolver.$inject = ['$q', 'splashService'];
    function innerResolver($q, splashService){
        return {
            init: function(){
                splashService.finish(true);

                return true;
            }
        }
    }

    angular.module('web').factory('innerResolver', innerResolver)
}();
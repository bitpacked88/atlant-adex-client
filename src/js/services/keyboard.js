(function(){
    angular.module('web').factory('keyboardService', ['appHotkeys', '$rootScope', Service]);

    function Service(appHotkeys, $rootScope){
        var listener = null;

        return {
            init: function(){
                listener = new window.keypress.Listener();

                angular.forEach(appHotkeys, function(messages, keys){
                    angular.forEach(messages, function(message){
                        listener.simple_combo(keys, function(){
                            $rootScope.$apply(function(){
                                $rootScope.$broadcast(message);
                            });
                        });
                    });
                });
            }
        }
    }
}());


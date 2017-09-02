(function(){
    angular.module('web').factory('appHotkeys', ['appMessages', Config]);

    function Config(m){
        return {
            'f9': [m.ui.tradePopupToggle],
            'esc': [m.ui.tradePopupClose]
        }
    }
}());
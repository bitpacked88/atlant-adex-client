!function(){
    desktopResolver.$inject = ['$q', 'desktopService', 'splashService'];
    function desktopResolver($q, desktopService, splashService){
        return {
            init: function(){
                // console.log("test desktop resolver");
                //splashService.start("---");

                // // this was called from desktop view switching on
                // // now it is deprecated
                //
                // return desktopService.init().then(function(){
                //     // splashService.off();
                // });
            }
        }
    }

    angular.module('web').factory('desktopResolver', desktopResolver)
}();
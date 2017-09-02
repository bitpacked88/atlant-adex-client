!function () {


    //
    //   this is root state preloading resolver
    //   it is called after app routing configuration is initiated
    //
    //   - - - - - - - - - - - - - - -
    //
    //   it turns loading screen on,
    //   makes an attempt to authorise user
    //   and initiates websocket service
    //


    rootResolver.$inject = ['$q', 'desktopService', 'splashService', 'hubService', 'appMessages'];
    function rootResolver($q, desktopService, splashService, hubService, appMessages) {
        return {
            init: function () {
                splashService.start(true);
                return $q.all([desktopService.init()]).then(function(){
                    splashService.finish("root resolver");
                    hubService.init();
                });
            }
        }
    }

    angular.module('web').factory('rootResolver', rootResolver)
}();
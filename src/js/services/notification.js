(function(){
    angular.module('web').factory('notificationService', ['$timeout', '$rootScope', 'appNotifications', 'appConfig', 'appMessages', Service]);
    function Service($timeout, $rootScope, appNotifications, appConfig, appMessages){
        'use strict';
        var messages = {},
            timeout = appConfig.notificationsTimeout || 5000,
            currentId = 0,
            count = 0;

        return {
            defaultMessages: appNotifications,

            debugMessage: function(message){
                message = {message: message, type: appNotifications.types.warning, title: 'Log:'};
                if (appConfig.debug) this.showMessage(message);
            },

            showMessage: function(message, permanent){
                if (!message.message) return;

                messages[currentId] = {
                    title: message.title || appNotifications.titles.message,
                    type: message.type || appNotifications.types.message,
                    message: message.message,
                    timeout: message.timeout || timeout,
                    id: currentId
                };

                $timeout(function() { $rootScope.$apply(); });

                if (!permanent) {
                    this.hideMessage(currentId, messages[currentId].timeout);
                }


                count++;
                return currentId++;
            },

            showPermanentMessage: function(){

            },

            hideMessage: function(id, timeout){
                if (timeout) {
                    $timeout(function(){
                        if (messages[id]) {
                            delete messages[id];
                            count--
                        }
                    }, timeout);
                } else {
                    if (messages[id]) {
                        delete messages[id];
                        count--;
                        $timeout(function() { $rootScope.$apply(); });
                    }
                }
            },

            getMessages: function(){
                return messages;
            }
        }
    }
}());
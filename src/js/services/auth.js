(function () {
    angular.module('web').factory('authService', ['$window', '$state', '$rootScope', 'appMessages', 'apiService', '$injector', 'appConfig', 'splashService', 'hubService', '$q', Service]);

    function Service($window, $state, $rootScope, appMessages, apiService, $injector, appConfig, splashService, hubService, $q) {
        var user = null;

        $rootScope.$on(appMessages.hub.tokenExpired, function () {
            applyLogout();
        });

        function setUserData(u) {
            return user = {
                '2fa': u.data['2fa'],
                rights: u.data.access === null ? {} : u.data.access,
                email: u.data.email,
                id: u.data.id,
                isDocumentsSent: u.data.isDocumentsSent,
                isVerified: u.data.isVerified,
                openTickets: u.data.openTickets,
                role: u.data.role,
                verified: u.data.verified
            };
        }

        function setUserAfterReload(u) {
            user = {
                id: u.id,
                email: u.email
            };
        }

        function applyLogin(data) {
            $window.localStorage.ATLANTToken = data.token;

            $injector.get('desktopService').requestPersonalStats().then(function (res) {
                $rootScope.$broadcast(appMessages.auth.change, true, user);
                $rootScope.$broadcast(appMessages.auth.login, user);
            });

        }

        function logout() {
            return apiService.get(apiService.methods.member.logout).then(function (res) {
                if (res.data.code === 0) {
                    applyLogout();
                } else {
                    alert('error');
                }
            });
        }

        function applyLogout() {
            $window.localStorage.removeItem('ATLANTToken');
            user = false; // deprecating
            $rootScope.$broadcast(appMessages.auth.change, false);
            $rootScope.$broadcast(appMessages.auth.logout);

            splashService.finish("auth");
            $state.go('root.desktop.main');
        }

        window.addEventListener('storage', function(event){
            if(event.key == 'ATLANTToken')
                event.newValue ? applyLogin({token: event.newValue}) : applyLogout();
        });

        return {
            applyLogin: applyLogin,
            applyLogout: applyLogout,
            requestProfileInfo: function(){
                return apiService.get(apiService.methods.member.myProfile).then(function (res) {
                    $rootScope.$broadcast(appMessages.system.profileLoaded, res.data);
                });
            },
            login: function (credentials) {
                return apiService.post(apiService.methods.member.login, credentials).then(function (res) {
                    if (res.data.code === 0) {
                        applyLogin(res.data.result);

                        return "access_granted"; // for modal dialog behavior
                    } else {
                        alert("this is error: (1) " + res.data.code);
                    }
                }).catch(function (res) {
                    if (res.data.code == 11) {
                        return "access_denied";
                    } else if (res.data.code == 13) {
                        modalService.twoFA({todo: "login", credetials: credentials, resend: true});
                        return "2fa_required"; // for modal dialog closing
                    } else {
                        //todo handle
                    }
                });
            },
            setUserFromTwoFA: function (twoFAResponse) {
                setUserData(twoFAResponse.data);
            },
            logout: logout,
            getUser: function () {
                return user;
            },
            setAfterReload: setUserAfterReload,
            isLoggedIn: function () {
                return $window.localStorage.getItem('ATLANTToken');
            },
            switchTwoFA: function () {
                user['2fa'] = !user['2fa'];
                $rootScope.$broadcast(appMessages.twoFA.switched);
            },
            checkLogin: function () {
                var deferred = $q.defer();
                if($window.localStorage.getItem('ATLANTToken'))
                    return deferred.resolve();

                $state.go('root.desktop.main');
                return deferred.reject(0);
            }
        };
    }
}());

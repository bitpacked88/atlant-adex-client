!function () {
    angular.module('web').controller('referralCtrl', ['$scope', '$stateParams', '$state', '$window', Controller]);

    function Controller($scope, $stateParams, $state, $window) {
        $window.localStorage.puser = $stateParams.refId;
        $state.go('root.desktop.main');
    }
}();
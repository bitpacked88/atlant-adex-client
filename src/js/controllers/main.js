angular.module('web').controller('mainCtrl', ['$scope', '$rootScope', 'appMessages', 'desktopService',
    function ($scope, $rootScope, appMessages, desktopService) {
    $rootScope.rootTitle = 'ATLANT DEX';
    $scope.onLoad = function () {

        function onWindowResize() {
            var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                top = $('.block-desktop-myorders ._scrollable').position().top;

            var ordersHeight = viewportHeight - top;
            if (ordersHeight < 150) {
                ordersHeight = 150;
            }

            $('.block-desktop-myorders ._scrollable').css({height: ordersHeight});
            $('.block-desktop-trades   ._scrollable').css({height: ordersHeight});
        }

        onWindowResize();
        $(window).on('resize', onWindowResize);

        $('.block-desktop-alerts ._close').each(function () {
            var $this = $(this);

            $this.on('click', function () {
                $this.parent().fadeOut();
            });
        });

        $('.block-common-header ._login ._button').on('click', function () {
            $('.component-overlay').show();
            $('.component-dialog._register').show();
        });

        $('.component-dialog ._header ._close').on('click', function () {
            $(this).closest('.component-dialog').hide();
            $('.component-overlay').hide();
        });
    };

    //$scope.onLoad();
}]);

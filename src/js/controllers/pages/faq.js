angular.module('web').controller('innerFaqCtrl',['$rootScope', '$scope', function($rootScope, $scope){
    $rootScope.rootTitle = 'Frequently Asked Questions';

    $scope.active = 'general';

    $scope.slideTo = function(block){
        var element = '#' + block + '-block';

        $scope.active = block;

        $('html, body').animate({
            scrollTop: $(element).offset().top - 25
        }, 400);
    };
}]);
angular.module('web').directive('btcSlider', ['$document', function($document) {
    return {
        restrict: 'A',
        scope: {
            value: '='
        },
        compile: function($el, attrs){
            var options = {
                min: parseInt(attrs.min) || 1,
                max: parseInt(attrs.max) || 5,
                prefix: attrs.prefix || '',
                postfix: attrs.postfix || ''
                };

            options.prefix = options.prefix.replace(/_/gi, ' ');
            options.postfix = options.postfix.replace(/_/gi, ' ');

            var mousedownClientX = null,
                dragMouseX = null,
                $$drag = $el.find('._sl_drag'),
                width = $el.find('.component-slider').width(),
                captionsCount = options.max - options.min + 1,
                dotsCount = captionsCount + captionsCount - 1,
                dotsStep = 100/(dotsCount-1),
                captionsStep = 100/(captionsCount-1);

            $document.on('mouseup', function(){
                $document.off('mousemove.btc-slider');
            });

            return function($scope){
                $scope.value = options.min;
                $scope.prefix = options.prefix;
                $scope.postfix = options.postfix;

                $scope.dots = [];
                for (var i = 0; i < dotsCount; i++) $scope.dots.push({left: i*dotsStep, small: !!(i%2)});

                $scope.captions = [];
                for (var i = 0; i < captionsCount; i++) $scope.captions.push({left: i*captionsStep, caption: (options.min + i)});

                $scope.$watch('value', function(value){
                    if (value === '' || value < options.min) {
                        $scope.value = options.min;
                        return;
                    }

                    if (value > options.max) {
                        $scope.value = options.max;
                    }

                    var position = (value - options.min) / (options.max - options.min) * width;
                    $$drag.css({left: position});
                });

                $$drag.on('mousedown', function(e){
                    e.preventDefault();
                    mousedownClientX = e.clientX;
                    dragMouseX = $$drag.position().left;

                    $document.on('mousemove.btc-slider', function(e){
                        var position = dragMouseX + e.clientX - mousedownClientX;
                        position = position >= 0 ? position : 0;
                        position = position <= width ? position : width;

                        $scope.$apply(function(){
                            $scope.value = position / width * (options.max - options.min) + options.min;
                        });
                    });
                });
            }
        },
        templateUrl: 'views/directives/btc-slider.html'
    };
}]);
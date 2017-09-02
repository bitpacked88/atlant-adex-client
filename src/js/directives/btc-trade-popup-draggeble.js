angular.module('web').directive('btcTradePopupDraggable', ['$document', function($document) {
    return {
        restrict: 'A',
        link: function(scope, element){
            function StartParams(left, top, startX, startY, viewportWidth, viewportHeight, popupWidth, popupHeight){
                var borderWidth = 2,
                    stickyOffset = 20;

                this.offsetX = left - startX;
                this.offsetY = top - startY;

                this.maxTop = 60;
                this.maxLeft = 0;
                this.maxBottom = viewportHeight - popupHeight - 2 * borderWidth;
                this.maxRight  = viewportWidth  - popupWidth  - 2 * borderWidth;

                this.topStick = this.maxTop + stickyOffset;
                this.leftStick = this.maxLeft + stickyOffset;
                this.bottomStick = this.maxBottom - stickyOffset;
                this.rightStick = this.maxRight - stickyOffset;
            }

            var startParams;

            element.find('input, ._leverage, ._footer').on('mousedown.tradePopup', function(e){
                e.stopPropagation();
            });

            element.on('mousedown.tradePopup', function(e){
                startParams = new StartParams(
                    element.position().left,
                    element.position().top,
                    e.pageX,
                    e.pageY,
                    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                    Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                    element.width(),
                    element.height()
                );


                $document.on('mousemove.tradePopup', function(e){
                    var newLeft = startParams.offsetX + e.pageX;
                    var newTop = startParams.offsetY + e.pageY;

                    if (newLeft < startParams.leftStick) newLeft = startParams.maxLeft;
                    if (newLeft > startParams.rightStick) newLeft = startParams.maxRight;

                    if (newTop > startParams.bottomStick) newTop = startParams.maxBottom;
                    if (newTop < startParams.topStick) newTop = startParams.maxTop;

                    element.css({left: newLeft, top: newTop});
                });

            });

            $document.on('mouseup.tradePopup', function(){
                $document.off('mousemove.tradePopup');
            })
        }
    }
}]);
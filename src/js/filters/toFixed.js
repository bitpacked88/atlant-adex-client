angular.module('web').filter('toFixed', function(){
    return function(input, num){
        if (!angular.isNumber(num)) return input;

        if (angular.isNumber(input)) return input.toFixed(num);
        if (angular.isString(input)) {
            var out = parseFloat(input);
            if (!out && out !== 0) out = parseInt(input);
            if (!out && out !== 0) return input;

            return out.toFixed(num);
        }

        return input;
    }
});
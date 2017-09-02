angular.module('web').filter('toBool', function() {
    return function(input, trueText, falseText) {
        var out = input;

        //Костыль для bool
        if (typeof input === 'boolean') {
            input = input ? '1' : '0';
        }

        input = parseInt(input);
        if (angular.isNumber(input) && !isNaN(input)) {
            var res = input > 0;
            out = String(res);

            if (trueText && res) out = trueText;
            if (falseText && !res) out = falseText;
        }

        return out;
    };
});
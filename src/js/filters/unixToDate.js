angular.module('web').filter('unixToDate', function() {
    return function(input) {
        var out = parseInt(input);

        if (angular.isNumber(out) && !isNaN(out)) {
            out *= 1000;
            var date = new Date();
            date.setTime(out);
            out = date.toLocaleDateString();
            return out;
        }

        return input;
    };
});
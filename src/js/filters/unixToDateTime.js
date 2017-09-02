angular.module('web').filter('unixToDateTime', function() {
    return function(input) {
        var out = parseInt(input);

        if (angular.isNumber(out) && !isNaN(out)) {
            out *= 1000;
            var date = new Date();
            date.setTime(out);
            out = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            return out;
        }

        return input;
    };
});
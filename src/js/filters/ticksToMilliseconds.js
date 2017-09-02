angular.module('web').filter('ticksToMillisecondsNoEpoch', function() {
    return function(input) {
        return Math.round((input / 10000));
    };
});

angular.module('web').filter('ticksToLocalMilliseconds', function() {
    return function(input) {
        var theTime = Math.round((input - 621355968000000000) / 10000);

        return (theTime + moment().utcOffset()*60*1000);
    };
});
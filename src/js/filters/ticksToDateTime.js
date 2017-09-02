angular.module('web').filter('ticksToDateTime', function() {
    return function (input, format, is_local) {
        var time = Math.round((input - 621355968000000000) / 10000);

        format = format || 'LL';

        if(is_local)
            return moment.utc(time).local().format(format);
        else
            return moment.utc(time).format(format);
    };
});
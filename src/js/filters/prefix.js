angular.module('web').filter('prefix', function(){
    return function(input, prefix){
        if (prefix) {
            return String(prefix) + String(input);
        } else {
            return input;
        }
    }
});
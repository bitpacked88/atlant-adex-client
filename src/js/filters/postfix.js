angular.module('web').filter('postfix', function(){
    return function(input, postfix){
        if (postfix) {
            return String(input) + String(postfix);
        } else {
            return input;
        }
    }
});
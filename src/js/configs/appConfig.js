angular.module('web').constant('appConfig', {
    //debug: true,
    debug: false,

    domain: 'https://trade.atlant.io',

    //api
    apiDomain: 'https://apiex.atlant.io',

    //hub
    hubDomain: 'https://apiex.atlant.io/signalr/hubs',
    hubName: 'notificationHub',

    confirmations: {
        BTC: 3,
        ETH: 12,
        ATL: 12
    },

    itemsPerPage: 20,
    notificationsTimeout: 5000,

    niceScroll: {
        autohidemode: 'leave',
        cursorwidth: '3px',
        cursorcolor: '#abacac',
        bouncescroll: false
    }
});

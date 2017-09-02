angular.module('web').constant('apiMethods', {

    // new methods

    member: {
        login: "/member/login",
        logout: "/member/logout",
        regemail: "/member/regemail",
        regcheck: function (guid) {
            return "/member/regcheck/" + guid;
        },
        regfinish: function (guid) {
            return "/member/regfinish/" + guid;
        },
        regphone: function (guid) {
            return "/member/regphone/" + guid;
        },
        requestPasswordRestore: "/member/requestPasswordRestore",
        confirmRequestPasswordRestore: '/member/confirmRequestPasswordRestore',
        finishPasswordRestore: function (guid) {
            return "/member/finishPasswordRestore/" + guid;
        },
        changePassword: "/member/changePassword",
        confirmChangePassword: "/member/confirmChangePassword",
        myProfile: '/member/myProfile',
        proofDocument: function (documentType) {
            return '/member/ProofDocument/' + documentType;
        },
        getDocument: function (userId, documentType) {
            return '/member/' + userId + '/ProofDocument/' + documentType
        },
        verifyphone: '/member/verifyphone',
        enable2fa: '/member/enable2fa',
        confirmEnable2fa: '/member/confirmEnable2fa',
        disable2fa: '/member/disable2fa',
        confirmDisable2fa: '/member/confirmDisable2fa',
        resend2FACode: function (phoneNumber, type) {
            return '/member/Resend2FACode'; //?phoneNumber=' + encodeURIComponent(phoneNumber) + '&type=' + type;
        },

        //TODO: Changed API
        affiliate: function(baseCurrency) {
            if(baseCurrency == null) {
                return '/member/affiliate';
            } else {
                return '/member/affiliate?baseCurrency=' + baseCurrency;
            }
        },
        verificationRequired: '/member/VerificationRequired'
    },

    account: {
        securityLog: '/account/securityLog',
        tradeHistory: '/account/tradeHistory',
        transactionList: '/account/transactionList',

        //api settings
        apiKeys: '/account/apiKeys',
        generateApiKey: function (type) {
            return '/account/generateApiKey?rights=' + type;
        },
        updateApiKeyRights: '/account/updateApiKeyRights',
        disableApiKey: function (key) {
            return '/account/DisableApiKey/' + key;
        },

        //fix api settings
        fixLogins: '/account/FixApiLogins',
        createFixLogin: '/account/CreateFixApiLogin',
        disableFixLogin: function(login) {
            return '/account/DisableFixLogin/'+login;
        }
    },

    fiat: {
        out: function (currency) {
            return '/fiat/out/' + currency;
        },
        confirmTransaction: function (currency, transaction_id) {
            return '/fiat/' + currency + '/confirmOutTransaction/' + transaction_id;
        },
        cancelOutTransaction: function (currency, transaction_id) {
            return '/fiat/' + currency + '/cancelOutTransaction/' + transaction_id;
        },
        resendConfirmationCode: function (currency, transaction_id) {
            return '/fiat/' + currency + '/resendConfirmationCode/' + transaction_id;
        },
        methods: function(currency) {
            return '/fiat/methods/'+currency;
        }, 
        moneyPoloSend: '/moneypolo/internal/create',
        acSend: '/AdvCash/preparePayment',
        EUSend: '/moneypolo/sp/create',
        SofortSend: '/sofort/preparePayment',
        Codes: '/pcode/activate'
    },

    crypto: {
        //TODO: Changed API
        out: function (pair) {
            return '/crypto/out/' + pair;
        },
        //TODO: Changed API
        getAddress: function (pair) {
            return '/crypto/getaddress/' + pair;
        },
        confirmTransaction: function (currency, transaction_id) {
            return '/crypto/' + currency + '/confirmOutTransaction/' + transaction_id;
        },
        cancelOutTransaction: function (currency, transaction_id) {
            return '/crypto/' + currency + '/cancelOutTransaction/' + transaction_id;
        },
        resendConfirmationCode: function (currency, transaction_id, method) {
            return '/crypto/' + currency + '/resendConfirmationCode/' + transaction_id;
        }
    },

    news: {
        all: '/news/List',
        get: function (id) {
            return '/news/get/' + id;
        }
    },

    trade: {
        getDesktop: '/trade/getDesktop',

        placeMarket: function (pair) {
          return '/trade/' + pair + '/placeMarket';
        },
        placeLimit: function (pair) {
            return '/trade/' + pair + '/placeLimit';
        },

        traderWallets: '/trade/traderWallets',

        //TODO: Changed API
        getTraderInfo: function (pair) {
            return '/trade/getTraderInfo?pair=' + pair;
        },
        cancelOrder: function (pair, order_id) {
            return '/trade/' + pair + '/cancelOrder/' + order_id;
        },
        modifyCond: function (pair, order_id) {
            return '/trade/' + pair + '/modifyCond/' + order_id;
        },
        replaceLimit: function (pair, order_id) {
            return '/trade/' + pair + '/replaceLimit/' + order_id;
        },
        chart: "/trade/chart"
    },

    // old methods

    init: {
        desktop: '/api/init/desktop'
    },
    user: {
        //Активировать пользователя
        //id(приходит на почту)
        activate: '/api/user/activate',

        //Сменить пароль
        //cid(приходит на почту), newPassword, newPasswordConfirm
        changePassword: '/api/user/changepassword',

        //Продолжить регистрацию (после подтверждения)
        //cid(приходит на почту), password, passwordConfirm, phone(номер вида +79993335544)
        сontinueRegister: '/api/user/continueregister',

        //email, phone
        lostPassword: '/api/user/lostPassword',

        //2fa activation
        activate2FA: '/api/user/activate2FA',
        deactivate2FA: '/api/user/deactivate2FA',
        savePhone: '/api/user/savePhone',

        //email, password
        login: '/api/user/login',
        logout: '/api/user/logout',
        getCaptcha: '/api/user/getcaptcha',

        // deprecated 01.08.2015
        //  isLogged: 'api/user/logged',

        affiliateProgram: '/api/user/affiliateProgram',

        //Восстановить доступ по аварийному коду
        //code, password, passwordConfirm
        repairByAlarm: '/api/user/repairByAlarm',

        //email, password, invite
        register: '/api/user/register'
    },
    sms: {
        // sms-codes are sent here
        verify: '/api/sms/verify',
        alarmCode: '/api/sms/alarmCode',
        resend: '/api/sms/resend'
    },
    accountOld: {
        //pair:['BTC','USD']
        getWalletList: '/api/account/getwalletlist',

        //id
        getWallet: '/api/account/getwallet',

        //Получить открытые заявки
        getActiveOrders: '/api/account/getactiveorders',

        //text, title, department:['general', 'finance', 'verification', 'security'], files: (filesIds)
        createTicket: '/api/account/createticket',

        //ticketId
        getTicket: '/api/account/getticket',

        getAllTickets: '/api/account/getalltickets',

        //ticketId, text, files: (filesIds)
        replyForTicket: '/api/account/replyforticket',

        getOrders: '/api/account/getorders',

        //последние трейды
        allTrades: '/api/account/alltrades',

        //range: 1m, 5m, 15m, 1h
        graphicsStat: '/api/account/graphicsstat',

        //Стакан
        getOrderBook: '/api/account/GetOrderBook',

        //Transactions
        getTransactions: '/api/account/GetTransactions',

        //Список ордеров на странице My History
        getTrades: '/api/account/gettrades',

        getPairBalance: '/api/account/getpairbalance',

        getSecurityLog: '/api/account/GetSecurityLog'
    },

    stat: {
        mainStat: '/api/stat/mainstat'
    }
});
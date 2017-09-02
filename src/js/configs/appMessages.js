angular.module('web').constant('appMessages', {

    auth: {
        login: 'messages.auth.login',
        loginError: 'messages.auth.loginError',
        logout: 'messages.auth.logout',
        change: 'message.auth.change',
        twoFARequired: 'message.auth.twoFARequired'
    },
    loading:{
        stateChanged:'loading.stateChanged',
        timeExpired: 'loading.timeExpired'
    },

    twoFA: {
        switched: 'messages.twoFA.switched',
        phoneVerified:{
            onWelcome: 'messages.twoFA.phoneVerifiedOnWelcome',
            onSettings: 'messages.twoFA.phoneVerifiedOnSettings'
        }
    },

    register: {
        register: 'messages.register.register',
        registerError: 'messages.register.registerError'
    },

    currency: {
        ready: 'messages.currency.ready',
        pairChanged: 'messages.currency.pairChanged'
    },

    verification: {
        documentsSent: 'messages.verification.documentsSent',
        verificationRequired: 'messages.verification.required',
        changePersonalDataStatus: 'messages.verification.changePersonalDataStatus'
    },

    userApis: {
        counts: 'messages.api.counts'
    },

    notification: {
        success: 'alert.success',
        warning: 'alert.warning',
        error: 'alert.error',
        message: 'alert.message'
    },

    api: {
        error: 'api.error'
    },

    system: {
        apiKey: 'system.apiKey',
        fixApiKey: 'system.fixApiKey',
        newApiKey: 'system.newApiKey',
        profileLoaded: 'system.profileLoaded',
        updatePairBalance: 'system.updatePairBalance',
    },

    graph: {
        loaded: 'graph.loaded',
        rangeSwitch: 'graph.rangeSwitch',
        newCandle: 'graph.newCandle',
        destroy: 'graph.destroy',
        switchType: 'graph.switchType',
        newCandleSize: 'graph.newCandleSize'
    },

    ui: {
        tradePopupToggle: 'ui.tradePopupToggle',
        tradePopupClose: 'ui.tradePopupClose'
    },

    desktop: {
        loaded: 'desktop.loaded',
        orders: 'desktop.orders'
    },

    settings: {
        themeSwitch: 'settings.themeSwitch',
        soundSwitch: 'settings.soundSwitch'
    },

    hub: {
        newBalance: 'newBalance',
        newMarginInfo: 'newMarginInfo',
        newAccountFee: 'newAccountFee',
        newMarginCall: 'newMarginCall',
        newCandle: 'newCandle',
        newTrade: 'newTrade',
        newOrder: 'newOrder',
        newOrderBookTop: 'newOrderBookTop',
        newOrderMatch: 'newOrderMatch',
        newOrderCancel: 'newOrderCancel',
        newOrderModify: 'newOrderModify',
        newForcedLiquidation: 'newForcedLiquidation',
        newDesktop: 'newDesktop',
        newCryptoDeposit: 'newCryptoDeposit',
        newFiatDeposit: 'newFiatDeposit',
        cryptoOutCompleted: 'cryptoOutCompleted',
        tokenExpired: 'tokenExpired',
        txVerification: 'txVerification'
    }
});

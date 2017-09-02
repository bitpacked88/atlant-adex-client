(function () {
    angular.module('web').factory('appNotifications', ['$rootScope', 'appMessages', NotificationMessages]);

    function NotificationMessages($rootScope, appMessages) {
        var titles = {
                error: function(code) {
                    return 'Error #'+code+' : ';
                },
                success: 'Success',
                message: 'Message'
            },
            types = {
                error: '_error',
                warning: '_warning',
                success: '_success',
                message: '_message'
            },
            messageCodes = [32],
            warningCodes = [],
            successCodes = [15,2001, 10100],
            codes = {
                1: 'Please provide a valid Email address',
                2: 'You are already a registered member! Please sign in to continue.',
                3: 'You have exceeded a number of attempts to verify Email. Please contact us if you were unable to verify your Email.',
                4: 'An error occurred during user creation process. Please contact us with this error code.',
                5: 'An error occurred during user update process. Please contact us with this error code.',
                6: 'Incorrect confirmation code provided. Please retry verifying your Email.',
                7: 'Please confirm that you agree with Terms of Service',
                8: 'This password cannot be used. Please make it more complex.',
                9: 'Passwords do not match. Please input passwords once again.',

                10: 'Your Email address is not verified. Please verify your Email.',
                11: 'Incorrect Email or password. Please try again.',
                12: 'Invalid phone format. Please provide your phone number in the international format.',
                13: 'Incorrect 2FA code provided. Please retry sending 2FA code.',
                14: 'Please wait until you can request another 2FA code',
                15: '2FA code sent',
                16: 'Current password is incorrect. Please try again.',
                17: 'Oops, we have not found your Email in our registry. Please contact us with this error code.',
                18: 'Failed to upload this file to our secure system. Please try again.',

                20: 'Oops, we have not found this proof document in our registry. Please contact us with this error code.',
                21: 'Invalid withdrawal address provided. Please check your address.',
                22: 'Invalid amount provided. Please check amount value.',
                23: 'Insufficient funds to perform this operation. Please check your account balance and amount specified.',
                24: 'Your withdrawal has been queued for processing',
                25: 'Balance rounding error. Please try to set a smaller amount.',
                26: 'Oops, something went wrong here. It is most likely that our system is being updated. In case this error persists, please contact us with this error code.',
                27: 'You already have a brand new address for deposits. Please make it used before trying to generate a new address.',
                28: 'Email is required. Please provide your Email.',
                29: 'Password is required. Please provide your password.',

                30: 'Oops, something went wrong here. Your browser has sent an empty request. In case this error persists, please contact us with this error code.',
                31: 'This error will be removed',
                32: 'You have been logged out due to a period of inactivity. Please log in to continue.',
                33: 'Insufficient privileges to access this data. Access denied.',
                34: 'Failed to send 2FA code. Please check you phone number (must be in the international format) and try sending code by other means. In case this error persists, please contact us with this error code.',
                36: 'Entry not found. Please check your search parameters.',
                37: 'You have exceeded the allowed number of 2FA codes sent. Please try again later.',
                38: 'Your account has been suspended. Please contact us and inquire about this issue.',
                39: 'Please repay your margin loans to proceed with your withdrawal',

                40: 'This market order cannot be placed due to insufficient order book volume. Please try to place a smaller market order.',
                41: 'Stop Loss is currently unavailable due to an empty order book',
                42: 'Take Profit is currently unavailable due to an empty order book',
                43: 'Trailing Stop is currently unavailable due to an empty order book',
                44: 'Stop Loss price must be less than market price for BUY orders / higher than market price for SELL orders',
                45: 'Take Profit price must be higher than market price for BUY orders / less than market price for SELL orders',
                46: 'Trailing Stop level must be less than current market price',
                47: '',
                48: '',
                49: '',

                50: 'It is not allowed to have more than 5 active HTTP API keys or FIX API logins at the same time',
                51: 'HTTP API key not found. Please make sure it exists.',
                52: 'We have detected a signature duplicate on your HTTP API key. Please check your signature creation procedure.',
                53: 'We have detected an incorrect nonce on your HTTP API key. Please make sure your nonce is being constantly incremented.',
                54: 'Incorrect signature for this HTTP API key. Please check your signature creation procedure.',
                55: 'Incorrect HTTP API key detected. Please check your API key.',
                56: 'Your HTTP API key has no rights to use this API method.',

                65: 'FIX API login not found. Please make sure this login exists.',
                66: 'At the moment, our exchange core is being automatically updated. Please retry in just a few seconds.',
                67: 'At the moment, market is closed. Please check our News page, Twitter for updates or contact us.',
                68: 'At the moment, this order book is closed. Please check our News page, Twitter for updates or contact us.',
                69: 'Requested leverage size exceeds current margin limit for this order book. Please reduce your leverage size.',

                71: 'Order size is too small (min. 0.01 BTC / 0.1 ETH / 0.1 LTC)',
                72: 'Order size is too large (max. 1,000 BTC / 10,000 ETH / 100,000 LTC)',
                73: 'It is not allowed to have more than 2,000 open orders per order book',
                75: 'Invalid withdrawal details. Please make sure you have filled in the details correctly.',

                81: 'MoneyPolo account not found',
                82: 'Invalid card number. Please make sure you have entered your card number correctly.',
                83: 'Invalid card expiration date. Please make sure you have entered your card expiration date correctly.',
                84: 'Invalid AdvCash wallet ID or Email',

                85: 'Invalid currency',
                86: 'Negative or zero value. Please correct the value provided.',
                87: 'Negative value. Please correct the value provided.',
                88: 'Invalid proof document type',
                89: 'Chart not found',
                90: 'Invalid date format. Please correct the date provided.',
                91: 'Invalid FIX API credentials',
                92: 'Too many 2FA codes requested. Please try again later.',

                94: 'Your account has been suspended. Please contact us and inquire about this issue.',
                96: 'Amount too small with respect to fee. Please set a higher amount.',

                102: 'Invalid code. Please make sure you enter correct code.',
                103: 'Invalid code. Please make sure you enter correct code.',

                1402: 'Invalid MoneyPolo account number',
                1403: 'Invalid Beneficiary Name',
                1404: 'Invalid Beneficiary Address Line 1',
                1405: 'Invalid Beneficiary Address Line 2',
                1406: 'Invalid Beneficiary City',
                1407: 'Invalid Beneficiary State',
                1408: 'Invalid Beneficiary Country Code',
                1409: 'Invalid Beneficiary Postal Code',
                1410: 'Invalid Beneficiary INN Code',
                1411: 'Invalid Beneficiary BIC Code',
                1412: 'Invalid Beneficiary Correspondent Account',
                1413: 'Invalid Beneficiary Payment Type',
                1414: 'Invalid Beneficiary Bank Code Type',
                1415: 'Invalid Beneficiary Bank Code',
                1416: 'Invalid Beneficiary Bank SWIFT Code',
                1417: 'Field Beneficiary Bank SWIFT Code Or Bank Code Is Required',
                1418: 'Invalid Beneficiary Bank Name',
                1419: 'Invalid Beneficiary Bank Other Info',
                1420: 'Invalid Beneficiary Bank Address Line 1',
                1421: 'Invalid Beneficiary Bank Address Line 2',
                1422: 'Invalid Beneficiary Bank City',
                1423: 'Invalid Beneficiary Bank State',
                1424: 'Invalid Beneficiary Bank Country Code',
                1425: 'Invalid Beneficiary Bank Postal Code',
                1444: 'Invalid Bank Country Or Bank SWIFT Code',
                1706: 'Invalid Beneficiary Account Format',

                1709: 'Invalid Beneficiary First Name Format',
                1710: 'Invalid Beneficiary Last Name Format',
                1711: 'Invalid Beneficiary Birth Date Format',

                1800: 'Invalid IBAN provided',
                2001: 'Your withdrawal has been successfully queued for execution',

                10100: 'SPACE-CODE successfully activated'

            };


        return {
            show: function (code) {
                if(successCodes.indexOf(code) != -1) {
                    $rootScope.$broadcast(appMessages.notification.success, {text: codes[code], num: code});
                } else if(warningCodes.indexOf(code) != -1) {
                    $rootScope.$broadcast(appMessages.notification.warning, {text: codes[code], num: code});
                } else if(messageCodes.indexOf(code) != -1) {
                    $rootScope.$broadcast(appMessages.notification.message, {text: codes[code], num: code});
                } else if (codes[code])
                    $rootScope.$broadcast(appMessages.notification.error, {text: codes[code], num: code});
            },

            getMessage: function (code) {
                if (codes[code])
                    return codes[code];
            },

            accessDenied: {
                title: titles.error, type: types.error, message: 'You are not authorized'
            },
            invalidUserNameOrPassword: {
                title: titles.error, type: types.error, message: 'Invalid username or password'
            },
            emailIncorrect: {
                title: titles.error, type: types.warning, message: 'Email incorrect'
            },
            emailFound: {
                title: titles.success, type: types.success, message: 'Email found'
            },
            exampleMessage: {
                title: titles.message, type: types.message, message: 'Example message'
            },
            userLogin: {
                title: titles.success, type: types.success, message: 'User login'
            },
            titles: titles,
            types: types
        }
    }
}());
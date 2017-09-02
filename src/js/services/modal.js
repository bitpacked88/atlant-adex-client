(function () {

    angular.module('web').factory('modalService', ['$modal', '$rootScope', '$modalStack', Service]);

    function Service($modal, $rootScope, $modalStack) {
        function openModal(params) {
            params.backdrop = params.backdrop || 'static';
            params.windowTemplateUrl = params.windowTemplateUrl || 'views/dialogs/modal-window.html';
            params.scope = params.scope || $rootScope.$new();
            params.scope._title = params.title || false;
            params.scope._confirmButtonText = params.buttonText || 'OK';
            return $modal.open(params);
        }

        return {
            dismissAll: function () {
                $modalStack.dismissAll();
            },
            login: function () {
                return openModal({
                    templateUrl: 'views/dialogs/signin.html',
                    controller: 'dialogSigninCtrl',
                    title: 'Sign In'
                });
            },
            register: function () {
                return openModal({
                    templateUrl: 'views/dialogs/register.html',
                    controller: 'dialogRegisterCtrl',
                    title: 'Sign Up'
                });
            },
            forgot: function () {
                return openModal({
                    templateUrl: 'views/dialogs/forgot.html',
                    controller: 'dialogForgotCtrl',
                    title: 'Password Recovery'
                });
            },
            fiatPaymentIn: function (wallet) {
                var scope = $rootScope.$new();
                scope.wallet = wallet;

                return openModal({
                    templateUrl: 'views/dialogs/fiat-gateway-in.html',
                    controller: 'fiatGatewayInCtrl',
                    windowClass: '_withdraw',
                    title: "Deposit funds",
                    scope: scope
                });
            },
            fiatPaymentOut: function (wallet) {
                var scope = $rootScope.$new();
                scope.wallet = wallet;

                return openModal({
                    templateUrl: 'views/dialogs/fiat-gateway-out.html',
                    controller: 'fiatGatewayOutCtrl',
                    windowClass: '_withdraw',
                    title: "Deposit funds",
                    scope: scope
                });
            },
            cryptoPayment: function (wallet, way) {
                var scope = $rootScope.$new();
                scope.wallet = wallet;
                scope.way = way;

                return openModal({
                    templateUrl: 'views/dialogs/crypto-gateway.html',
                    controller: 'cryptoGatewayCtrl',
                    title: way == 'out' ? 'Withdraw funds' : 'Add funds',
                    windowClass: '_withdraw',
                    scope: scope
                });
            },
            withdrawConfirm: function (params, cb) {
                var scope = $rootScope.$new();
                scope.params = params;
                scope.cb = cb;

                return openModal({
                    templateUrl: 'views/dialogs/withdraw_confirm.html',
                    controller: 'dialogWithdrawConfirmCtrl',
                    title: 'Confirm withdraw funds',
                    windowClass: '_withdraw',
                    scope: scope
                });
            },
            codeConfirm: function (request) {
                var scope = $rootScope.$new();
                scope.request = request;

                return openModal({
                    templateUrl: 'views/dialogs/code_confirm.html',
                    controller: 'dialogCodeConfirmCtrl',
                    title: 'Confirm new code',
                    windowClass: '_withdraw',
                    scope: scope
                });
            },
            twoFA: function (params) {

                var scope = $rootScope.$new();
                scope.twoFAParams = params;

                return openModal({
                    templateUrl: 'views/dialogs/twofa.html',
                    controller: 'dialogTwofaCtrl',
                    title: 'Authentication',
                    scope: scope,
                    windowClass: '_twofa'
                });
            },
            twoFAnotLogged: function (params) {
                var scope = $rootScope.$new();
                scope.twoFAParams = params;
                return openModal({
                    templateUrl: 'views/dialogs/twofanotlogged.html',
                    controller: 'dialogTwofaNotLoggedCtrl',
                    title: 'Authentication',
                    scope: scope,
                    windowClass: '_twofa'
                });
            },

            openDocument: function (image, title) {
                var scope = $rootScope.$new();
                scope.image = image;

                return openModal({
                    templateUrl: 'views/dialogs/view-document.html',
                    controller: 'dialogAddApiCtrl',
                    title: title,
                    scope: scope,
                    size: 'lg',
                    windowClass: '_view-document'
                });
            },

            apiKey: function (type, title, buttonText, cb) {
                var scope = $rootScope.$new();
                scope.type = type;
                scope.cb = cb;

                return openModal({
                    templateUrl: 'views/dialogs/api-key.html',
                    controller: 'dialogAddApiCtrl',
                    title: title,
                    buttonText: buttonText,
                    scope: scope,
                    windowClass: '_add-api'
                });
            },
            fixKey: function (type, title, buttonText, cb) {
                var scope = $rootScope.$new();
                scope.type = type;
                scope.cb = cb;

                return openModal({
                    templateUrl: 'views/dialogs/fix-key.html',
                    controller: 'dialogAddApiCtrl',
                    title: title,
                    buttonText: buttonText,
                    scope: scope,
                    windowClass: '_add-api'
                });
            },
            sendQuestion: function () {
                return openModal({
                    templateUrl: 'views/dialogs/send-question.html',
                    controller: 'dialogSendQuestionCtrl',
                    title: 'Send question',
                    windowClass: '_question'
                });
            },
            secretKey: function(secret) {
                var scope = $rootScope.$new();
                scope.secret = secret;

                return openModal({
                    templateUrl: 'views/dialogs/secret-key.html',
                    title: 'Secret key',
                    scope: scope,
                    windowClass: '_add-api'
                });
            },
            personalData: function(cb) {
                var scope = $rootScope.$new();
                scope.cb = cb;

                return openModal({
                    templateUrl: 'views/dialogs/personal-data.html',
                    controller: 'dialogPersonalDataCtrl',
                    title: 'Basic Verification',
                    size: 'lg',
                    windowClass: '_personal-data',
                    scope: scope
                });
            }
        }
    }
}());


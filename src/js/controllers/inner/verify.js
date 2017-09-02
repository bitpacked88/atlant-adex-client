!function () {
    angular.module('web').controller('innerVerifyCtrl', ['$rootScope', '$scope', 'apiService', 'modalService', '$http', 'appMessages', 'splashService', 'appNotifications', Controller]);
    function Controller($rootScope, $scope, apiService, modalService, $http, appMessages, splashService, appNotifications) {

        splashService.start();

        var labels = {
                identityButton: 'Attach Proof of Identity',
                residenceButton: 'Attach Proof of Residency'
            },
            successMessage = 'Document submitted. Please wait for verification results.';


        $rootScope.rootTitle = 'Verify Account';

        $scope.hideIdentity = false;
        $scope.hideResidence = false;

        $scope.identityButtonLabel = labels.identityButton;
        $scope.residenceButtonLabel = labels.residenceButton;


        $scope.isPersonalDataExist = false;

        function checkPersonalData() {
            apiService.get(apiService.methods.member.verificationRequired).then(function(data) {
                if(data.data.code != 0) return;
                $scope.isPersonalDataExist = data.data.result.verificationRequired;
            });
        }

        $scope.$on(appMessages.verification.changePersonalDataStatus, function(event, status) {
            $scope.isPersonalDataExist = status;
        });

        $scope.personalData = function() {
            modalService.personalData();
        };

        $scope.$watch('proofOfIdentity', function (file) {
            if (angular.isDefined(file)) {
                $scope.identityButtonLabel = 'Loading...';
                apiService.upload(apiService.methods.member.proofDocument('ProofOfIdentity'), file).then(function (res) {
                    if (res.data.code == 0) {
                        $scope.hideIdentity = true;
                        $scope.alertToShow = successMessage;

                        load();
                    }
                }, null, function (e) {
                    $scope.identityButtonLabel = 'Loading (' + e.percent + '%)';
                }).catch(function(e) {
                    appNotifications.show(e.data.code);
                    $scope.identityButtonLabel = labels.identityButton;
                });
            }
        });

        $scope.$watch('proofOfResidence', function (file) {
            if (angular.isDefined(file)) {
                $scope.residenceButtonLabel = 'Loading...';
                apiService.upload(apiService.methods.member.proofDocument('ProofOfResidence'), file).then(function (res) {
                    if (res.data.code == 0) {
                        $scope.hideResidence = true;
                        $scope.alertToShow = successMessage;

                        load();
                    }
                }, null, function (e) {
                    $scope.residenceButtonLabel = 'Loading (' + e.percent + '%)';
                }).catch(function(e) {
                    appNotifications.show(e.data.code);
                    $scope.residenceButtonLabel = labels.residenceButton;
                });
            }
        });

        $scope.openPopup = modalService.openDocument;

        function load() {
            $scope.$on(appMessages.system.profileLoaded, function (e, data) {
                if (data.code == 0) {

                    $scope.hideIdentity = data.result.proofOfIdentityUploaded || data.result.proofOfIdentityUrl;
                    $scope.hideResidence = data.result.proofOfResidencyUploaded || data.result.proofOfResidenceUrl;

                    if(data.result.proofOfIdentityUploaded)
                        $scope.identityDocsProvided = 'Proof of Identity attached';

                    if(data.result.proofOfResidencyUploaded)
                        $scope.residenceDocsProvided = 'Proof of Residency attached';

                    splashService.finish();
                }
            });
        }

        load();
        checkPersonalData();
    }
}();
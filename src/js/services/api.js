(function () {
    angular.module('web').factory('apiService', ['$http', 'appConfig', '$q', '$log', '$rootScope', 'appMessages', 'apiMethods', '$upload', 'currencyService', 'appNotifications', '$state', Service]);

    function Service($http, appConfig, $q, $log, $rootScope, appMessages, apiMethods, $upload, currencyService, appNotifications, $state) {

        function getUrl(method, params) {
            method = method || '';
            var query = params ? '?' + $.param(params) : '';

            return appConfig.apiDomain + method + query;
        }

        function request(method, apiMethod, params) {
            return $q(function (resolve, reject) {
                $http[method](
                    method === "get" ? getUrl(apiMethod, params) : getUrl(apiMethod),
                    params
                ).success(function (data, status, headers, config) {
                        $log.debug(apiMethod, data);
                        appNotifications.show(data.code);
                        resolve({data: data, status: status, headers: headers, config: config});
                    }).error(function (data, status, headers, config) {
                        if(data === null || data.code == 66) {
                            $rootScope.webChecked = true;
                            $state.go('maintenance');
                            reject({data: data, status: status, headers: headers, config: config});
                            return;
                        }

                        $rootScope.$broadcast(appMessages.api.err, {
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                        });

                        appNotifications.show(data.code);

                        reject({data: data, status: status, headers: headers, config: config});
                    });
            });
        }

        function requestWithPair(method, apiMethod, data) {
            data = data || {};

            return request(method, apiMethod, angular.extend(data, currencyService.getRequestParams()));
        }

        function upload(apiMethod, file) {
            var defer = $q.defer();
            if (file._uploading || file._uploaded) {
                defer.reject({file: file});
            } else {
                file._uploading = true;
                $upload.upload({url: getUrl(apiMethod), file: file}).progress(function (e) {
                    var percent = parseInt(100.0 * e.loaded / e.total);
                    file._progress = percent;
                    defer.notify({file: file, percent: percent, loaded: e.loaded, total: e.total});
                }).success(function (data, status, headers, config) {
                    appNotifications.show(data.code);
                    file._uploaded = true;
                    file._uploading = false;
                    defer.resolve({file: file, data: data, status: status, headers: headers, config: config});
                }).error(function (data, status, headers, config) {
                    file._uploading = false;
                    file._uploaded = false;
                    file._error = true;
                    defer.reject({file: file, data: data, status: status, headers: headers, config: config});
                    $rootScope.$broadcast(appMessages.api.err, {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    });
                });
            }
            return defer.promise;
        }

        return {
            getUrl: getUrl,
            methods: apiMethods,

            get: function (apiMethod, data) {
                return request('get', apiMethod, data);
            },
            getWithPair: function (apiMethod, data) {
                return requestWithPair('get', apiMethod, data);
            },
            post: function (apiMethod, data) {
                return request('post', apiMethod, data);
            },
            put: function (apiMethod, data) {
                return request('put', apiMethod, data);
            },
            postWithCurrencies: function (apiMethod, data) {
                return requestWithPair('post', apiMethod, data);
            },
            upload: upload
        }
    }
}());


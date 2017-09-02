angular.module('web').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
    $stateProvider

        .state('referal', {
            url: '/reg/:refId',
            controller: 'referralCtrl'
        })

        .state('root', {
            resolve: {
                $rootResolve: ['rootResolver', function (rootResolver) {
                    return rootResolver.init();
                }]
            },
            abstract: true,
            templateUrl: 'views/layouts/root.html'
        })

        .state('root.desktop', {
            resolve: {
                $resolve: ['desktopResolver', '$rootResolve', function (desktopResolver, $rootResolve) {
                    return desktopResolver.init();
                }]
            },
            abstract: true,
            templateUrl: 'views/layouts/desktop.html',
            controller: 'mainCtrl'
        })

        .state('root.desktop.main', {
            url: '/',
            views: {
                'pair_change': {
                    templateUrl: 'views/desktop/pairChange.html',
                    controller: 'desktopPairChangeCtrl',
                    controllerAs: 'pair'
                },
                'general_stats': {
                    templateUrl: 'views/desktop/general_stats.html',
                    controller: 'desktopGeneralStatsCtrl'
                },
                'personal_stats': {
                    templateUrl: 'views/desktop/personal_stats.html',
                    controller: 'desktopPersonalStatsCtrl',
                    controllerAs: 'personalStats'
                },
                'desktop_settings': {
                    templateUrl: 'views/desktop/desktop_settings.html',
                    controller: 'desktopDesktopSettingsCtrl'
                },
                'actions': {
                    templateUrl: 'views/desktop/actions.html',
                    controller: 'desktopActionsCtrl'
                },
                'order_book': {
                    templateUrl: 'views/desktop/order_book.html',
                    controller: 'desktopOrderBookCtrl',
                    controllerAs: 'orderBook'
                },
                'trades': {
                    templateUrl: 'views/desktop/trades.html',
                    controller: 'desktopTradesCtrl',
                    controllerAs: 'trades'
                },
                'graph': {
                    templateUrl: 'views/desktop/graph.html',
                    controller: 'desktopGraphCtrl'
                },
                'orders': {
                    templateUrl: 'views/desktop/orders.html',
                    controller: 'desktopOrdersCtrl',
                    controllerAs: 'orders'
                },
                'trade_popup': {
                    templateUrl: 'views/desktop/trade_popup.html',
                    controller: 'desktopTradePopupCtrl'
                }
            }
        })


        // - - - - inner root and subs - - - - - //


        .state('root.inner', {
            resolve: {
                $resolve: ['innerResolver', '$rootResolve', function (innerResolver, $rootResolve) {
                    return innerResolver.init();
                }]
            },
            abstract: true,
            templateUrl: 'views/layouts/inner.html'
        })

        .state('root.inner.change', {
            url: '/change',
            templateUrl: 'views/inner/change.html',
            controller: 'changeCtrl'
        })

        .state('root.inner.left-col', {
            abstract: true,
            templateUrl: 'views/layouts/inner/left-col.html'
        })

        .state('root.inner.left-col.mytrades', {
            url: '/myhistory/{filter}',
            templateUrl: 'views/inner/mytrades-column.html',

            views: {
                column: {
                    templateUrl: 'views/inner/mytrades-column.html',
                    controller: 'innerMytradesColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/mytrades.html',
                    controller: 'innerMytradesCtrl'
                }
            }
        })


        .state('root.inner.left-col.api_access', {
            url: '/access_api/:filter',

            views: {
                column: {
                    templateUrl: 'views/inner/api-column.html',
                    controller: 'innerApiColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/api.html',
                    controller: 'innerApiCtrl'
                }
            }
        })

        .state('root.inner.left-col.transactions', {
            url: '/transactions/:id?status',

            views: {
                column: {
                    templateUrl: 'views/inner/transactions-column.html',
                    controller: 'innerTransactionsColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/transactions.html',
                    controller: 'innerTransactionsCtrl'
                }
            }
        })

        .state('root.inner.right-col-logo', {
            abstract: true,
            templateUrl: 'views/layouts/inner/right-col-logo.html'
        })

        .state('root.inner.right-col-logo.restore-password', {
            url: '/restore-password/:code',
            templateUrl: 'views/inner/restore-password.html',
            controller: 'innerRestorePasswordCtrl'
        })
        .state('root.inner.right-col-logo.welcome', {
            url: '/welcome/:code',
            templateUrl: 'views/inner/welcome.html',
            controller: 'innerWelcomeCtrl'
        })
        .state('root.inner.right-col-logo.news', {
            url: '/news',
            templateUrl: 'views/inner/news.html',
            controller: 'innerNewsCtrl'
        })
        .state('root.inner.right-col-logo.new', {
            url: '/news/:id',
            templateUrl: 'views/inner/article.html',
            controller: 'innerArticleCtrl'
        })
        .state('root.inner.right-col-logo.contacts', {
            url: '/contacts',
            templateUrl: 'views/inner/contacts.html',
            controller: 'innerContactsCtrl'
        })
        .state('root.inner.right-col-logo.fees', {
            url: '/fees',
            templateUrl: 'views/inner/fees.html',
            controller: 'innerFeesCtrl'
        })
        .state('root.inner.right-col-logo.about_us', {
            url: '/about_us',
            templateUrl: 'pages/about-us.html',
            resolve: {
                $title: ['$resolve', '$rootScope', function($resolve, $rootScope) {
                    $rootScope.rootTitle = 'About Us';
                }]
            }
        })

        //pages
        .state('root.inner.faq', {
            url: '/faq',
            templateUrl: 'pages/faq.html',
            controller: 'innerFaqCtrl'
        })


        .state('root.inner.right-col', {
            abstract: true,
            templateUrl: 'views/layouts/inner/right-col.html'
        })

        .state('root.inner.right-col.settings', {
            resolve: {
                checkLogin: ['$resolve', 'authService', function($resolve, authService) {
                    return authService.checkLogin();
                }]
            },

            url: '/settings',

            views: {
                column: {
                    templateUrl: 'views/inner/accounts-column.html',
                    controller: 'innerAccountsColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/settings.html',
                    controller: 'innerSettingsCtrl'
                }
            }
        })
        .state('root.inner.right-col.verify', {
            resolve: {
                checkLogin: ['$resolve', 'authService', function($resolve, authService) {
                    return authService.checkLogin();
                }]
            },

            url: '/verify',

            views: {
                column: {
                    templateUrl: 'views/inner/accounts-column.html',
                    controller: 'innerAccountsColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/verify.html',
                    controller: 'innerVerifyCtrl'
                }
            }
        })
        .state('root.inner.right-col.accounts', {
            resolve: {
                checkLogin: ['$resolve', 'authService', function($resolve, authService) {
                    return authService.checkLogin();
                }]
            },

            url: '/accounts',

            views: {
                column: {
                    templateUrl: 'views/inner/accounts-column.html',
                    controller: 'innerAccountsColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/accounts.html',
                    controller: 'innerAccountsCtrl'
                }
            }
        })
        .state('root.inner.right-col.history', {
            url: '/actions',

            views: {
                column: {
                    templateUrl: 'views/inner/accounts-column.html',
                    controller: 'innerAccountsColumnCtrl'
                },
                content: {
                    templateUrl: 'views/inner/history.html',
                    controller: 'innerHistoryCtrl',
                    controllerAs: 'actions'
                }
            }
        })


        // - - - - affiliate - - - - // logically inner, but separated because of single-column view


        .state('root.inner.affiliate', {
            // abstract: true,
            url: '/affiliate',
            templateUrl: 'views/inner/affiliate.html',
            controller: 'affiliateCtrl'
        })

        .state('maintenance', {
            url: '/maintenance',
            templateUrl: 'views/layouts/maintenance.html',
            controller: 'maintenanceCtrl'
        })

}]);

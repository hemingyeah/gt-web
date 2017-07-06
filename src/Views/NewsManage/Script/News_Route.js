app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.News', {
                url: '/News',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/NewsManage/Script/News_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/NewsManage/Script/News_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.News.List", {
                url: '/List',
                templateUrl: '/Views/NewsManage/NewsManage.html',
                controller: 'NewsCtrl'
            })
    });

app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.NewsComment', {
                url: '/NewsComment',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/NewsCommentManage/Script/NewsComment_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/NewsCommentManage/Script/NewsComment_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.NewsComment.List", {
                url: '/List',
                templateUrl: '/Views/NewsCommentManage/NewsCommentManage.html',
                controller: 'NewsCommentCtrl'
            })
    });

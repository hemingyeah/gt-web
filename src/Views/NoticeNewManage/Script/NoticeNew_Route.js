app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.NoticeNew', {
                url: '/NoticeNew',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/NoticeNewManage/Script/NoticeNew_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/NoticeNewManage/Script/NoticeNew_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.NoticeNew.List", {
                url: '/List',
                templateUrl: '/Views/NoticeNewManage/NoticeNewManage.html',
                controller: 'NoticeNewCtrl'
            })
    });

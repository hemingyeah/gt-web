app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.Advertisement', {
                url: '/Advertisement',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/AdvertisementManage/Script/Advertisement_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/AdvertisementManage/Script/Advertisement_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.Advertisement.List", {
                url: '/List',
                templateUrl: '/Views/AdvertisementManage/AdvertisementManage.html',
                controller: 'AdvertisementCtrl'
            })
    });

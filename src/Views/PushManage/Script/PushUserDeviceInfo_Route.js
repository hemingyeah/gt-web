app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.PushUserDeviceInfo', {
                url: '/PushUserDeviceInfo',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/PushManage/Script/PushUserDeviceInfo_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/PushManage/Script/PushUserDeviceInfo_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.PushUserDeviceInfo.List", {
                url: '/List',
                templateUrl: '/Views/PushManage/PushUserDeviceInfoManage.html',
                controller: 'PushUserDeviceInfoCtrl'
            })
    });

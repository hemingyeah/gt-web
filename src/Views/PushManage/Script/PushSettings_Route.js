app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.PushSettings', {
                url: '/PushSettings',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/PushManage/Script/PushSettings_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/PushManage/Script/PushSettings_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.PushSettings.List", {
                url: '/List',
                templateUrl: '/Views/PushManage/PushSettingsManage.html',
                controller: 'PushSettingsCtrl'
            })
    });

app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
            //Git目录管理
            .state('GT.GitManage', {
                url: '/GitManage',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '/Views/DataBaseManage/Script/DataBase_Controller.js',

                                '/Views/GitManage/Script/GitManage_Controller.js',
                                '/Views/GitManage/Script/GitManage_Service.js',

                                '/Views/UserManage/Script/GroupManage_Controller.js',
                                '/Views/UserManage/Script/GroupManage_Service.js',
                                '/Views/UserManage/Script/GroupUser_Controller.js',
                                '/Views/UserManage/Script/GroupUser_Service.js',

                                '/Views/RoleManage/Script/Role_Service.js'
                            ]);
                        }
                    ]
                }
            })
            .state("GT.GitManage.List", {
                 //url: '/{MenuType}',
                url: '/List',
                templateUrl: '/views/GitManage/GitManageManage.html',
                controller: "GitManageListCtrl"
            })
	});
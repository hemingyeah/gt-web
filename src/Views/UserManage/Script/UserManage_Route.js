app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
            .state('GT.User', {
                url: '/User',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('ui.select').then(function () {
                                return $ocLazyLoad.load([
                                    '/Views/UserManage/Script/UserManage_Service.js',
                                    '/Views/UserManage/Script/UserManage_Controller.js',
                                    '/Views/RoleManage/Script/Role_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.User.Manage", {
                url: '/Manage',
                templateUrl: '/views/UserManage/UserManage.html',
                controller: 'UserManageCtrl'
            });
	});

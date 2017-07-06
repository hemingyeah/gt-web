app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
            .state('GT.Group', {
                url: '/Group',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('ui.select').then(function () {
                                return $ocLazyLoad.load([
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/RoleManage/Script/Role_Service.js'

                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.Group.Manage", {
                url: '/Manage',
                templateUrl: '/views/UserManage/GroupManage.html',
                controller: 'GroupManageCtrl'
            });
	});

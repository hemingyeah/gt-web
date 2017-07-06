app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.User', {
				url: '/User',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.select').then(function() {
								return $ocLazyLoad.load([
									'/Views/UserManage/Script/GroupUser_Service.js',
									'/Views/UserManage/Script/GroupUser_Controller.js'
								]);
							});
						}
					]
				}
			})
			.state('GT.GroupUser', {
				url: '/GroupUser',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.tree').then(function() {
								return $ocLazyLoad.load([
									'/Views/UserManage/Script/GroupUser_Service.js',
									'/Views/UserManage/Script/GroupUser_Controller.js',
									'/Views/Authority/AccountManage/Script/Account_Service.js',
									'/Views/UserManage/Script/GroupManage_Controller.js',
									'/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/ImportManage/Script/ImportManage_Service.js',
                                    '/Views/ImportManage/Script/ImportManage_Controller.js'

								]);
							});
						}
					]
				}
			})
			.state("GT.GroupUser.Manage", {
			    url: '/Manage/:menuId',
				templateUrl: '/views/UserManage/GroupUserManage.html',
				controller: 'GroupUserManageCtrl'
			})
			//标签管理
			.state("GT.GroupUser.Import", {
				url: '/ImportOperate',
				templateUrl: '/views/UserManage/ImportOperate.html',
				controller: "ImportOperateCtrl"
			})
	});
app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.App', {
				url: '/App',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/AppManage/Script/App_Service.js',
								'/Views/Authority/AccountManage/Script/AccountNotePermissions_Service.js',
								'/Views/Authority/AccountManage/Script/AccountClassification_Service.js',
								'/Views/RoleManage/Script/Role_Service.js',
								'/Views/TagManage/Script/Tag_Service.js',
								'/Views/Base/PluginInstanceManage/Script/PluginInstance_Service.js',
								'/Views/Base/PluginManage/Script/PluginClassificationPermission_Service.js',
								'/Views/AppManage/Script/App_Controller.js',
								'/Views/DeptmentManage/Script/Deptment_Controller.js',
								'/Views/TagManage/Script/Tag_Controller.js',
								'/Views/Base/PluginInstanceManage/Script/PluginInstance_Controller.js'
							]);
						}
					]
				}
			})
			.state("GT.App.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/AppManage/Applist.html',
				controller: "AppListCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/DeptmentManage/Script/Deptment_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.App.Add", {
				url: '/Add',
				templateUrl: '/views/AppManage/AppOperate.html',
				controller: 'AppOperateCtrl'
			})
			.state("GT.App.Edit", {
				url: '/{Id}',
				templateUrl: '/views/AppManage/AppOperate.html',
				controller: 'AppOperateCtrl'
			})
	});

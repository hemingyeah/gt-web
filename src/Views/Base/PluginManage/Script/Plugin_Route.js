app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Plugin', {
				url: '/Plugin',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load("ui.select").then(function() {
								return $ocLazyLoad.load([
									'/Views/Base/PluginManage/Script/Plugin_Service.js',
									'/Views/Authority/AccountManage/Script/Account_Service.js',
									'/Views/Base/PluginManage/Script/Plugin_Controller.js',
									'/Views/Base/PageManage/Script/Page_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.Plugin.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/Base/PluginManage/PluginList.html',
				controller: 'PluginListCtrl'
			})
			.state("GT.Plugin.Add", {
				url: '/Add',
				templateUrl: '/views/Base/PluginManage/PluginOperate.html',
				controller: 'PluginOperateCtrl'
			})
			.state("GT.Plugin.Edit", {
				url: '/{Id}',
				templateUrl: '/views/Base/PluginManage/PluginOperate.html',
				controller: 'PluginOperateCtrl'
			})
	}]);

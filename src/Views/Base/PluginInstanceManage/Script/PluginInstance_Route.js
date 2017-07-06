app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.PluginInstance', {
				url: '/PluginInstance',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/Base/PluginInstanceManage/Script/PluginInstance_Service.js',
								'/Views/Base/PluginInstanceManage/Script/PluginInstance_Controller.js',
								'/Views/Base/PluginManage/Script/Plugin_Service.js',
								'/Views/AppManage/Script/App_Service.js',
								'/Views/RoleManage/Script/Role_Service.js'
							]);
						}
					]
				}
			})
			.state('GT.PluginInstance.List', {
				url: '/List/{MenuType}',
				templateUrl: '/views/Base/PluginInstanceManage/PluginInstanceList.html',
				controller: 'PluginInstanceListCtrl'
			})
			.state("GT.PluginInstance.Add", {
				url: '/Add',
				templateUrl: '/views/Base/PluginInstanceManage/PluginInstanceOperate.html',
				controller: 'PluginInstanceOperateCtrl'
			})
			.state("GT.PluginInstance.Edit", {
				url: '/{Id}',
				templateUrl: '/views/Base/PluginInstanceManage/PluginInstanceOperate.html',
				controller: 'PluginInstanceOperateCtrl'
			})
	}]);

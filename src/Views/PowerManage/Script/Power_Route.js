app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state("GT.PowerSet", {
				url: '/PowerSet/{Id}',
				templateUrl: '/views/Layout/Default.html',
				controller: 'PowerSetCtrl',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/PowerManage/Script/Power_Service.js',
								'/Views/UserManage/Script/User_Service.js',
								'/Views/PluginInstanceManage/Script/PluginInstance_Service.js',
								'/Views/DeptmentManage/Script/Deptment_Service.js'
							]);
						}
					]
				}
			})
	});
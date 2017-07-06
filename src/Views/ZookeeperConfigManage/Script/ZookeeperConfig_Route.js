app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
			.state('GT.ZookeeperConfig', {
			    url: '/ZookeeperConfig',
			    templateUrl: '/views/Layout/Default.html',
			    resolve: {
			        deps: ['$ocLazyLoad',
						function ($ocLazyLoad) {
						    return $ocLazyLoad.load([
                                '/Views/ZookeeperConfigManage/Script/ZookeeperConfig_Service.js',
                                '/Views/ZookeeperConfigManage/Script/ZookeeperConfig_Controller.js',
						    ]);
						}
			        ]
			    }
			})
			.state("GT.ZookeeperConfig.List", {
			    url: '/List',
			    templateUrl: '/views/ZookeeperConfigManage/ZookeeperConfigList.html',
			    controller: "ZookeeperConfigListCtrl"
			})
			.state("GT.ZookeeperConfig.Add", {
			    url: '/Add',
			    templateUrl: '/views/ZookeeperConfigManage/ZookeeperConfigOperate.html',
			    controller: 'ZookeeperConfigOperateCtrl'
			})
			.state("GT.ZookeeperConfig.Edit", {
			    url: '/{Id}',
			    templateUrl: '/views/ZookeeperConfigManage/ZookeeperConfigOperate.html',
			    controller: 'ZookeeperConfigOperateCtrl'
			})
	});

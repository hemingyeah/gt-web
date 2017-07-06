app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
			.state('GT.Server', {
			    url: '/Server',
			    templateUrl: '/views/Layout/Default.html',
			    resolve: {
			        deps: ['$ocLazyLoad',
						function ($ocLazyLoad) {
						    return $ocLazyLoad.load([
                                '/Views/ServerManage/Script/Server_Service.js',
                                '/Views/ServerManage/Script/Server_Controller.js',
						    ]);
						}
			        ]
			    }
			})
			.state("GT.Server.List", {
			    url: '/List',
			    templateUrl: '/views/ServerManage/KitServerList.html',
			    controller: "KitServerListCtrl"
			})
			.state("GT.Server.Add", {
			    url: '/Add',
			    templateUrl: '/views/ServerManage/KitServerOperate.html',
			    controller: 'KitServerOperateCtrl'
			})
			.state("GT.Server.Edit", {
			    url: '/{Id}',
			    templateUrl: '/views/ServerManage/KitServerOperate.html',
			    controller: 'KitServerOperateCtrl'
			})
	});

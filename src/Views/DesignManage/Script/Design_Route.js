app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
			.state('GT.Design', {
			    url: '/Design',
			    templateUrl: '/views/Layout/Default.html',
			    resolve: {
			        deps: ['$ocLazyLoad',
						function ($ocLazyLoad) {
						    return $ocLazyLoad.load([
                                '/Views/DesignManage/Script/Design_Service.js',
                                '/Views/DesignManage/Script/Design_Controller.js',
						    ]);
						}
			        ]
			    }
			})
			.state("GT.Design.List", {
			    url: '/List',
			    templateUrl: '/views/DesignManage/KitDesignList.html',
			    controller: "KitDesignListCtrl"
			})
			.state("GT.Design.Add", {
			    url: '/Add',
			    templateUrl: '/views/DesignManage/KitDesignOperate.html',
			    controller: 'KitDesignOperateCtrl'
			})
			.state("GT.Design.Edit", {
			    url: '/{Id}',
			    templateUrl: '/views/DesignManage/KitDesignOperate.html',
			    controller: 'KitDesignOperateCtrl'
			})
	});

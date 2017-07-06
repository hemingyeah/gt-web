app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
			.state('GT.Log', {
			    url: '/Log',
			    templateUrl: '/views/Layout/Default.html',
			    resolve: {
			        deps: ['$ocLazyLoad',
						function ($ocLazyLoad) {
						    return $ocLazyLoad.load([
                                '/Views/LogManage/Script/Log_Service.js',
                                '/Views/DesignManage/Script/Design_Service.js',
                                '/Views/LogManage/Script/Log_Controller.js',
						    ]);
						}
			        ]
			    }
			})
			.state("GT.Log.List", {
			    url: '/List',
			    templateUrl: '/views/LogManage/LogList.html',
			    controller: "LogListCtrl"
			})
	});

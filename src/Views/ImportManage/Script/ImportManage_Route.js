app
	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
            .state('GT.Import', {
                url: '/Import',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('ui.select').then(function () {
                                return $ocLazyLoad.load([
                                    '/Views/ImportManage/Script/ImportManage_Service.js',
                                    '/Views/ImportManage/Script/ImportManage_Controller.js'
                                ]);
                            });
                        }
                    ]
                }
            })
           //导入历史
			.state("GT.Import.Manage", {
			    url: '/Manage',
			    templateUrl: '/views/ImportManage/ImportManage.html',
			    controller: "ImportManageCtrl"
			})
	});

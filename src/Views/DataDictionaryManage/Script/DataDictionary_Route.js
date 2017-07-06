app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.DataDictionary', {
				url: '/DataDictionary',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.tree').then(function() {
								return $ocLazyLoad.load([
									'/Views/DataDictionaryManage/Script/DataDictionary_Controller.js',
									'/Views/DataDictionaryManage/Script/DataDictionaryInstance_Service.js',
									'/Views/RoleManage/Script/Role_Service.js',
                                     '/Views/ImportManage/Script/ImportManage_Service.js',
                                    '/Views/ImportManage/Script/ImportManage_Controller.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.DataDictionary.DataDictionaryManage", {
				url: '/List',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryRootList.html',
				controller: "DataDictionaryRootListCtrl"
			})
	});

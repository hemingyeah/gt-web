app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Account', {
				url: '/Account',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load("ui.select").then(function() {
								return $ocLazyLoad.load([
									'/Views/AppManage/Script/App_Controller.js',
									'/Views/RoleManage/Script/Role_Controller.js',
									'/Views/Authority/AccountManage/Script/Account_Controller.js',
									'/Views/Authority/AccountManage/Script/Account_Service.js',
									'/Views/Authority/AccountManage/Script/AccountRole_Service.js',
									'/Views/Authority/AccountManage/Script/AccountTagPermissions_Service.js',
									'/Views/Authority/AccountManage/Script/AccountOperation_Service.js',
									'/Views/Authority/AccountManage/Script/AccountClassification_Service.js',
									'/Views/Authority/AccountManage/Script/AccountNotePermissions_Service.js',
									'/Views/Base/PluginInstanceManage/Script/PluginInstance_Service.js',
									'/Views/Base/PluginManage/Script/PluginClassificationPermission_Service.js',
									'/Views/Base/PluginManage/Script/Plugin_Controller.js',
									'/Views/DeptmentManage/Script/Deptment_Controller.js',
									'/Views/TagManage/Script/Tag_Controller.js',
									'/Views/TagManage/Script/Tag_Service.js',
									'/Views/DeptmentManage/Script/Deptment_Service.js',
									'/Views/CompanyManage/Script/Company_Service.js',
									'/Views/AppManage/Script/App_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.Account.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/Authority/AccountManage/AccountList.html',
				controller: "AccountListCtrl"
			})
			.state("GT.Account.Add", {
				url: '/Add',
				templateUrl: '/views/Authority/AccountManage/AccountOperate.html',
				controller: 'AccountOperateCtrl'
			})
			.state("GT.Account.Edit", {
				url: '/{Id}',
				templateUrl: '/views/Authority/AccountManage/AccountOperate.html',
				controller: 'AccountOperateCtrl'
			})
	});
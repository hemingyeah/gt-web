app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.PersonalAccount', {
				url: '/PersonalAccount',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load("ui.select").then(function() {
								return $ocLazyLoad.load([
									'/Views/RoleManage/Script/Role_Controller.js',
									'/Views/Authority/PersonalAccountManage/Script/PersonalAccount_Service.js',
									'/Views/Authority/PersonalAccountManage/Script/PersonalAccount_Controller.js',
									'/Views/Base/PluginInstanceManage/Script/PluginInstance_Service.js',
									'/Views/Authority/AccountManage/Script/Account_Service.js',
									'/Views/Base/PluginManage/Script/PluginClassificationPermission_Service.js',
									'/Views/Base/PluginManage/Script/Plugin_Controller.js',
									'/Views/Authority/AccountManage/Script/AccountClassification_Service.js',
									'/Views/Authority/AccountManage/Script/AccountNotePermissions_Service.js',
									'/Views/Authority/AccountManage/Script/AccountOperation_Service.js',
									'/Views/DeptmentManage/Script/Deptment_Service.js',
									'/Views/DeptmentManage/Script/Deptment_Controller.js',
									'/Views/RoleManage/Script/Role_Service.js',
									'/Views/TagManage/Script/Tag_Controller.js',
									'/Views/TagManage/Script/Tag_Service.js',
									'/Views/Authority/AccountManage/Script/AccountRole_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.PersonalAccount.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/Authority/PersonalAccountManage/PersonalAccountList.html',
				controller: "PersonalAccountListCtrl"
			})
			.state("GT.PersonalAccount.Add", {
				url: '/Add',
				templateUrl: '/views/Authority/PersonalAccountManage/PersonalAccountOperate.html',
				controller: 'PersonalAccountOperateCtrl'
			})
			.state("GT.PersonalAccount.Edit", {
				url: '/{Id}',
				templateUrl: '/views/Authority/PersonalAccountManage/PersonalAccountOperate.html',
				controller: 'PersonalAccountOperateCtrl'
			})
	});
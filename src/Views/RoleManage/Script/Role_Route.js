app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Role', {
				url: '/Role',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/RoleManage/Script/Role_Service.js',
								'/Views/RoleManage/Script/Role_Controller.js',
								'/Views/Authority/PersonalAccountManage/Script/PersonalAccount_Controller.js',
								'/Views/Authority/AccountManage/Script/Account_Controller.js',
								'/Views/Authority/AccountManage/Script/AccountTagPermissions_Service.js',
								'/Views/PowerManage/Script/Power_Service.js',
								'/Views/UserManage/Script/GroupUser_Service.js',
								'/Views/DeptmentManage/Script/Deptment_Service.js',
								'/Views/InfoTypeManage/Script/InfoType_Service.js',
								'/Views/Authority/AccountManage/Script/AccountOperation_Service.js',
								'/Views/Authority/AccountManage/Script/AccountNotePermissions_Service.js',
								'/Views/Authority/AccountManage/Script/Account_Service.js',
								'/Views/Authority/AccountManage/Script/Account_Controller.js',
								'/Views/DeptmentManage/Script/Deptment_Controller.js',
								'/Views/Base/PluginManage/Script/Plugin_Controller.js',
								'/Views/Base/PluginManage/Script/PluginClassificationPermission_Service.js',
								'/Views/Base/PluginInstanceManage/Script/PluginInstance_Service.js',
								'/Views/Authority/AccountManage/Script/AccountClassification_Service.js',
								'/Views/AppManage/Script/App_Service.js',
								'/Views/Authority/AccountManage/Script/AccountRole_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.Role.PersonList", {
				url: '/PersonList/{MenuType}',
				templateUrl: '/views/RoleManage/RoleList.html',
				controller: 'PersonRoleListCtrl'
			})
			.state("GT.Role.EnterPriseList", {
				url: '/EnterPriseList/{MenuType}',
				templateUrl: '/views/RoleManage/RoleList.html',
				controller: 'EnterPriseRoleListCtrl'
			})
	}]);
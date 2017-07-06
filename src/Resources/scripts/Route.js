;/*!/Views/AppManage/Script/App_Route.js*/
app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.App', {
				url: '/App',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/AppManage/Script/App_Service.js',
								'/Views/AppManage/Script/App_Controller.js',
								'/Views/RoleManage/Script/Role_Service.js',
								'/Views/DeptmentManage/Script/Deptment_Controller.js',
								'/Views/PluginInstanceManage/Script/PluginInstance_Controller.js',
								'/Views/PluginInstanceManage/Script/PluginInstance_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.App.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/AppManage/Applist.html',
				controller: "AppListCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/DeptmentManage/Script/Deptment_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.App.Add", {
				url: '/Add',
				templateUrl: '/views/AppManage/AppOperate.html',
				controller: 'AppOperateCtrl'
			})
			.state("GT.App.Edit", {
				url: '/{Id}',
				templateUrl: '/views/AppManage/AppOperate.html',
				controller: 'AppOperateCtrl'
			})
	});

;/*!/Views/RoleManage/Script/Role_Route.js*/
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
								'/Views/PowerManage/Script/Power_Service.js',
								'/Views/UserManage/Script/User_Service.js',
								'/Views/DeptmentManage/Script/Deptment_Service.js',
								'/Views/InfoTypeManage/Script/InfoType_Service.js',
								'/Views/AccountManage/Script/Account_Service.js',
								'/Views/AppManage/Script/App_Service.js'
							]);
						}
					]
				}
			}).state("GT.Role.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/RoleManage/RoleList.html',
				controller: 'RoleListCtrl'
			})
			.state("GT.Role.Add", {
				url: '/Add',
				templateUrl: '/views/RoleManage/RoleOperate.html',
				controller: 'RoleOperateCtrl'
			})
			.state("GT.Role.Edit", {
				url: '/{Id}',
				templateUrl: '/views/RoleManage/RoleOperate.html',
				controller: 'RoleOperateCtrl'
			})
	}]);
;/*!/Views/Menu/Script/Menu_Route.js*/
app.config(function($stateProvider, $urlRouterProvider) {});
;/*!/Views/Login/Script/Login_Route.js*/
app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state("Login", {
				url: '/Login',
				templateUrl: '/views/Login/Login.html',
				controller: 'LoginCtrl',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/Login/Script/Login_Controller.js',
								'/Views/Login/Script/Login_Service.js'
							]);
						}
					]
				}
			})
	}]);

;/*!/Views/PluginManage/Script/Plugin_Route.js*/
app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Plugin', {
				url: '/Plugin',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load("ui.select").then(function() {
								return $ocLazyLoad.load([
									'/Views/PluginManage/Script/Plugin_Service.js',
									'/Views/PluginManage/Script/Plugin_Controller.js',
									'/Views/PageManage/Script/Page_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.Plugin.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/PluginManage/PluginList.html',
				controller: 'PluginListCtrl'
			})
			.state("GT.Plugin.Add", {
				url: '/Add',
				templateUrl: '/views/PluginManage/PluginOperate.html',
				controller: 'PluginOperateCtrl'
			})
			.state("GT.Plugin.Edit", {
				url: '/{Id}',
				templateUrl: '/views/PluginManage/PluginOperate.html',
				controller: 'PluginOperateCtrl'
			})
	}]);

;/*!/Views/PluginInstanceManage/Script/PluginInstance_Route.js*/
app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.PluginInstance', {
				url: '/PluginInstance',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/PluginInstanceManage/Script/PluginInstance_Service.js',
								'/Views/PluginInstanceManage/Script/PluginInstance_Controller.js',
								'/Views/PluginManage/Script/Plugin_Service.js',
								'/Views/AppManage/Script/App_Service.js',
								'/Views/RoleManage/Script/Role_Service.js'
							]);
						}
					]
				}
			})
			.state('GT.PluginInstance.List', {
				url: '/List/{MenuType}',
				templateUrl: '/views/PluginInstanceManage/PluginInstanceList.html',
				controller: 'PluginInstanceListCtrl'
			})
			.state("GT.PluginInstance.Add", {
				url: '/Add',
				templateUrl: '/views/PluginInstanceManage/PluginInstanceOperate.html',
				controller: 'PluginInstanceOperateCtrl'
			})
			.state("GT.PluginInstance.Edit", {
				url: '/{Id}',
				templateUrl: '/views/PluginInstanceManage/PluginInstanceOperate.html',
				controller: 'PluginInstanceOperateCtrl'
			})
	}]);

;/*!/Views/PowerManage/Script/Power_Route.js*/
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
;/*!/Views/ButtonManage/Script/Button_Route.js*/
app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		
	}]);
;/*!/Views/PageManage/Script/Page_Route.js*/
'use strict';
angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Page', {
				url: '/Page',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/ButtonManage/Script/Button_Service.js', 
								'/Views/PageManage/Script/Page_Service.js', 
								'/Views/PageManage/Script/Page_Controller.js', 
								'/Views/RoleManage/Script/Role_Service.js'
								]);
						}
					]
				}
			})
			.state("GT.Page.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/PageManage/Pagelist.html',
				controller: "PageListCtrl"
			})
			.state("GT.Page.Add", {
				url: '/Add',
				templateUrl: '/views/PageManage/PageOperate.html',
				controller: 'PageOperateCtrl'
			})
			.state("GT.Page.Edit", {
				url: '/{Id}',
				templateUrl: '/views/PageManage/PageOperate.html',
				controller: 'PageOperateCtrl'
			})
	}]);

;/*!/Views/UserManage/Script/User_Route.js*/
app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.User', {
				url: '/User',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.select').then(function() {
								return $ocLazyLoad.load([
									'/Views/UserManage/Script/User_Service.js',
									'/Views/UserManage/Script/User_Controller.js',
									'/Views/DeptmentManage/Script/Deptment_Service.js'
								]);
							});
						}
					]
				}
			})
			.state('GT.GroupUser', {
				url: '/GroupUser',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.tree').then(function() {
								return $ocLazyLoad.load([
									'/Views/UserManage/Script/User_Service.js',
									'/Views/UserManage/Script/User_Controller.js',
									'/Views/AccountManage/Script/Account_Service.js',
									'/Views/DeptmentManage/Script/Deptment_Controller.js',
									'/Views/DeptmentManage/Script/Deptment_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.GroupUser.Operate", {
				url: '/Operate',
				templateUrl: '/views/UserManage/GroupUserOperate.html',
				controller: 'GroupUserOperateCtrl'
			})
			//标签管理
			.state("GT.GroupUser.Tag", {
				url: '/TagOperate',
				templateUrl: '/views/UserManage/TagOperate.html',
				controller: "TagOperateCtrl"
			})
	});

;/*!/Views/DeptmentManage/Script/Deptment_Route.js*/
app
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Deptment', {
				url: '/Deptment',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.select').then(function() {
								return $ocLazyLoad.load([
									'/Views/DeptmentManage/Script/Deptment_Service.js',
									'/Views/DeptmentManage/Script/Deptment_Controller.js',
									'/Views/UserManage/Script/User_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.Deptment.List", {
				url: '/List',
				templateUrl: '/views/DeptmentManage/DeptmentList.html',
				controller: 'DeptmentListCtrl'
			})
			.state("GT.Deptment.Add", {
				url: '/Add',
				templateUrl: '/views/DeptmentManage/OperateDept.html',
				controller: 'OperateDeptmentCtrl'
			})
			.state("GT.Deptment.Edit", {
				url: '/{Id}',
				templateUrl: '/views/DeptmentManage/OperateDept.html',
				controller: 'OperateDeptmentCtrl'
			})
	}]);
;/*!/Views/AccountManage/Script/Account_Route.js*/
app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Account', {
				url: '/Account',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/AccountManage/Script/Account_Service.js',
								'/Views/AccountManage/Script/Account_Controller.js',
								'/Views/InfoTypeManage/Script/InfoType_Service.js',
								'/Views/CompanyManage/Script/Company_Service.js',
								'/Views/AppManage/Script/App_Service.js',
								'/Views/DeptmentManage/Script/Deptment_Service.js',
								'/Views/PowerManage/Script/Power_Service.js',
								'/Views/RoleManage/Script/Role_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.Account.List", {
				url: '/List/{AccountType}/{MenuType}',
				templateUrl: '/views/AccountManage/AccountList.html',
				controller: "AccountListCtrl"
			})
			.state("GT.Account.Add", {
				url: '/{AccountType}/Add',
				templateUrl: '/views/AccountManage/AccountOperate.html',
				controller: 'AccountOperateCtrl'
			})
			.state("GT.Account.Edit", {
				url: '/{AccountType}/{Id}',
				templateUrl: '/views/AccountManage/AccountOperate.html',
				controller: 'AccountOperateCtrl'
			})
	});

;/*!/Views/DataDictionaryManage/Script/DataDictionary_Route.js*/
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
									'/Views/DataDictionaryManage/Script/DataDictionary_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionary_Controller.js',
									'/Views/AppManage/Script/App_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionaryRoot_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.DataDictionary.List", {
				url: '/List',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryList.html',
				controller: "DataDictionaryListCtrl"
			})
			.state("GT.DataDictionary.Add", {
				url: '/Add',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryOperate.html',
				controller: 'DataDictionaryOperateCtrl'
			})
			.state("GT.DataDictionary.Edit", {
				url: '/{Id}',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryOperate.html',
				controller: 'DataDictionaryOperateCtrl'
			})
			.state('GT.DataDictionaryRoot', {
				url: '/DataDictionaryRoot',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.tree').then(function() {
								return $ocLazyLoad.load([
									'/Views/DataDictionaryManage/Script/DataDictionaryRoot_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionary_Controller.js',
									'/Views/DataDictionaryManage/Script/DataDictionary_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionaryInstance_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.DataDictionaryRoot.List", {
				url: '/List',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryRootList.html',
				controller: "DataDictionaryRootListCtrl"
			})
			.state('GT.DataDictionaryInstance', {
				url: '/DataDictionaryInstance',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('ui.tree').then(function() {
								return $ocLazyLoad.load([
									'/Views/DataDictionaryManage/Script/DataDictionaryInstance_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionary_Controller.js',
									'/Views/AppManage/Script/App_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionary_Service.js',
									'/Views/DataDictionaryManage/Script/DataDictionaryRoot_Service.js',
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.DataDictionaryInstance.List", {
				url: '/List',
				templateUrl: '/views/DataDictionaryManage/DataDictionaryInstanceList.html',
				controller: "DataDictionaryInstanceListCtrl"
			})
	});

;/*!/Views/DataBaseManage/Script/DataBase_Route.js*/
app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.DataBase', {
				url: '/DataBase',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/DataBaseManage/Script/DataBase_Service.js',
								'/Views/DataBaseManage/Script/DataBase_Controller.js',
								'/Views/RoleManage/Script/Role_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.DataBase.List", {
				url: '/{MenuType}',
				templateUrl: '/views/DataBaseManage/DataBaselist.html',
				controller: "DataBaseListCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/DeptmentManage/Script/Deptment_Service.js'
							]);
						}
					]
				}
			})
			.state("GT.DataBase.Add", {
				url: '/{MenuType}/Add',
				templateUrl: '/views/DataBaseManage/DataBaseOperate.html',
				controller: 'DataBaseOperateCtrl'
			})
			.state("GT.DataBase.Edit", {
				url: '/{MenuType}/Edit/{Id}',
				templateUrl: '/views/DataBaseManage/DataBaseOperate.html',
				controller: 'DataBaseOperateCtrl'
			})
			.state("GT.DataBase.Search", {
				url: '/{MenuType}/Search/{Id}/{OrganID}',
				templateUrl: '/views/DataBaseManage/DataBaseSearch.html',
				controller: 'DataBaseSearchCtrl'
			})
			.state("GT.DataBase.Report", {
				url: '/Report/{Id}/{OrganID}',
				templateUrl: '/views/DataBaseManage/SearchDataView.html',
				controller: 'SearchDataViewCtrl'
			})
	});

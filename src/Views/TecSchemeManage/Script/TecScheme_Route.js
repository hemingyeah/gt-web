'use strict';
angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.TecScheme', {
				url: '/TecScheme',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load('angularFileUpload').then(function() {
								return $ocLazyLoad.load([
									'/Views/TecSchemeManage/Script/TecScheme_Service.js', 
									'/Views/Authority/AccountManage/Script/Account_Service.js', 
									'/Views/DataBaseManage/Script/DataBase_Controller.js',
									'/Views/TecSchemeManage/Script/TecScheme_Controller.js', 
									'/vendor/aliyun/sdk/aliyun-sdk.min.js', 
									'/vendor/aliyun/oss-js-upload.js', 
									'/Views/RoleManage/Script/Role_Service.js'
								]);
							});
						}
					]
				}
			})
			.state("GT.TecScheme.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/TecSchemeManage/TecSchemelist.html',
				controller: "TecSchemeListCtrl"
			})
			.state("GT.TecScheme.Add", {
				url: '/Add',
				templateUrl: '/views/TecSchemeManage/TecSchemeOperate.html',
				controller: 'TecSchemeOperateCtrl'
			})
			.state("GT.TecScheme.Edit", {
				url: '/{Id}',
				templateUrl: '/views/TecSchemeManage/TecSchemeOperate.html',
				controller: 'TecSchemeOperateCtrl'
			})
	}]);

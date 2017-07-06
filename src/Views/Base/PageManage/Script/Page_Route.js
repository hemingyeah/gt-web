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
								'/Views/Base/OperationManage/Script/Operation_Service.js', 
								'/Views/Base/OperationManage/Script/Operation_Controller.js', 
								'/Views/Base/PageManage/Script/Page_Service.js', 
								'/Views/Base/PageManage/Script/Page_Service.js', 
								'/Views/Base/PageManage/Script/Page_Controller.js', 
								'/Views/RoleManage/Script/Role_Service.js'
								]);
						}
					]
				}
			})
			.state("GT.Page.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/Base/PageManage/Pagelist.html',
				controller: "PageListCtrl"
			})
			.state("GT.Page.Add", {
				url: '/Add',
				templateUrl: 'http://192.168.4.14/importService/gaeaapi/Import/Get',
				controller: 'PageOperateCtrl'
			})
			.state("GT.Page.Edit", {
				url: '/{Id}',
				templateUrl: '/views/Base/PageManage/PageOperate.html',
				controller: 'PageOperateCtrl'
			})
	}]);

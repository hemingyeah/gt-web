'use strict';
angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Tag', {
				url: '/Tag',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/Base/OperationManage/Script/Operation_Service.js', 
								'/Views/Base/OperationManage/Script/Operation_Controller.js', 
								'/Views/TagManage/Script/Tag_Service.js', 
								'/Views/TagManage/Script/Tag_Controller.js', 
								'/Views/RoleManage/Script/Role_Service.js'
								]);
						}
					]
				}
			})
			.state("GT.Tag.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/TagManage/Taglist.html',
				controller: "TagListCtrl"
			})
			.state("GT.Tag.Add", {
				url: '/Add',
				templateUrl: '/views/TagManage/TagOperate.html',
				controller: 'TagOperateCtrl'
			})
			.state("GT.Tag.Edit", {
				url: '/{Id}',
				templateUrl: '/views/TagManage/TagOperate.html',
				controller: 'TagOperateCtrl'
			})
	}]);

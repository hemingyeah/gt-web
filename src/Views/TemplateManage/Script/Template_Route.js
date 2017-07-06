'use strict';
angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('GT.Template', {
				url: '/Template',
				templateUrl: '/views/Layout/Default.html',
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Views/TemplateManage/Script/Template_Service.js', 
								'/Views/TemplateManage/Script/Template_Controller.js', 
								'/Views/DeptmentManage/Script/Deptment_Controller.js', 
								'/Views/DeptmentManage/Script/Deptment_Service.js', 
								]);
						}
					]
				}
			})
			.state("GT.Template.List", {
				url: '/List/{MenuType}',
				templateUrl: '/views/TemplateManage/TemplateList.html',
				controller: "TemplateListCtrl"
			})
			.state("GT.Template.Add", {	
				url: '/Add',
				templateUrl: '/views/TemplateManage/TemplateOperate.html',
				controller: 'TemplateOperateCtrl'
			})
			.state("GT.Template.Import", {	
				url: '/Add',
				templateUrl: '/views/TemplateManage/TemplateImport.html',
				controller: 'TemplateImportCtrl'
			})
	}]); 

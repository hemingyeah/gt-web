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
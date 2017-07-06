app
	.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('GT.Report', {
                url: '/Report',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '/Views/ReportManage/Script/Report_Service.js',
                                '/Views/ReportManage/Script/Report_Controller.js',
                                '/Views/RoleManage/Script/Role_Service.js'
                            ]);
                        }
                    ]
                }
            })
            .state("GT.Report.Manage", {
                url: '/{MenuType}',
                templateUrl: '/views/ReportManage/ReportManage.html',
                controller: "ReportManageCtrl",
                resolve: {
                    deps: [
                        '$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '/Views/DeptmentManage/Script/Deptment_Service.js'
                            ]);
                        }
                    ]
                }
            })
    });

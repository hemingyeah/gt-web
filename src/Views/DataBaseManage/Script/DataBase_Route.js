app
	.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('GT.DataBase', {
                url: '/DataBase',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: [
                        '$ocLazyLoad',
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
            .state("GT.DataBase.Report", {
                url: '/Report/{Id}',
                templateUrl: '/views/DataBaseManage/SearchDataView.html',
                controller: 'SearchDataViewCtrl'
            })
    });

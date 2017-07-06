app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础教学资源
            .state('GT.BaseLearningResource', {
                url: '/BaseLearningResource',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/LearningResourceManage/Script/LearningResource_Controller.js',
                                    '/Views/DeptmentManage/Script/Deptment_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/LearningResourceManage/Script/LearningResource_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.BaseLearningResource.List", {
                url: '/List',
                templateUrl: '/Views/LearningResourceManage/BaseLearningResourceList.html',
                controller: 'BaseLearningResourceListCtrl'
            })
    });

app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.Knowledge', {
                url: '/Knowledge',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/KnowledgeManage/Script/Knowledge_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/KnowledgeManage/Script/Knowledge_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.Knowledge.List", {
                url: '/List',
                templateUrl: '/Views/KnowledgeManage/KnowledgeManage.html',
                controller: 'KnowledgeCtrl'
            })
    });

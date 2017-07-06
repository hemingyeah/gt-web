app
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        //基础通知
            .state('GT.KnowledgeItem', {
                url: '/KnowledgeItem',
                templateUrl: '/views/Layout/Default.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('richText').then(function() {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Controller.js',
                                    '/Views/KnowledgeManage/Script/KnowledgeItem_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Controller.js',
                                    '/Views/UserManage/Script/GroupManage_Service.js',
                                    '/Views/UserManage/Script/GroupUser_Controller.js',
                                    '/Views/UserManage/Script/GroupUser_Service.js',
                                    '/Views/RoleManage/Script/Role_Service.js',
                                    '/Views/KnowledgeManage/Script/KnowledgeItem_Service.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state("GT.KnowledgeItem.List", {
                url: '/List',
                templateUrl: '/Views/KnowledgeManage/KnowledgeItemManage.html',
                controller: 'KnowledgeItemCtrl'
            })
    });

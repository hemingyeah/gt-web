// 'use strict';
app
    .run(
        function($rootScope, $state, $stateParams, service) {
            ajaxCount = 0;
            // $rootScope.open = function($event) {
            //     $event.preventDefault();
            //     $event.stopPropagation();
            //     $rootScope.opened = true;
            // };
            // $rootScope.opened = false;
            // $rootScope.dateOptions = {
            //     formatYear: 'yy',
            //     startingDay: 1,
            //     class: 'datepicker'
            // };
            $rootScope.Page = {
                Index: 1,
                Count: 1
            }
            var RouteHead = "http://192.168.4.24/gaeaapi/Config/";
            service.http.asyncajax({
                url: RouteHead + "GetColumnConfig?appId=&groupRelationId=",
                type: "get",
                dataType: "json",
                success: function(data) {
                    GridColumnList = data;
                    $rootScope.GridColumnList = GridColumnList;
                }
            })
            service.http.asyncajax({
                type: "get",
                url: RouteHead + 'GetRoutConfig',
                success: function(data) {
                    Route = data;
                }
            });
        }
    )
    .config(
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('Web', {
                    abstract: true,
                    url: '/Web',
                    templateUrl: '/Web/Layout/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    '/Views/DataBaseManage/Script/DataBase_Service.js',
                                ]);
                            }
                        ]
                    },
                    controller: function($scope) {
                        $scope.GridColumnList = GridColumnList;
                    }
                })
                .state('GT', {
                    abstract: true,
                    url: '/GT',
                    templateUrl: '/Views/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load("ui.select").then(function() {
                                    return $ocLazyLoad.load([
                                        '/Views/PowerManage/Script/Power_Service.js',
                                        '/Views/AppManage/Script/App_Service.js',
                                        '/Views/DataBaseManage/Script/DataBase_Service.js'
                                    ]);
                                });
                            }
                        ]
                    },
                    controller: function($scope, $state, service, PowerService, UiConfigService, AppService) {
                        AppService.GetAppDetail($scope, {}, function(data) {
                            $scope.app.name = document.title = data ? data.AppName : "中国产业互联网";
                        })
                        if (!service.Cookie.Get("UserName")) {
                            $state.go("Login");
                        }
                        PowerService.LoadUserOperationPermissions($scope, {}, function(data) {
                            $scope.MenuList = data.Permissions;
                        });
                        $scope.GridColumnList = GridColumnList;
                    }
                })
                .state('GT.Main', {
                    url: '/Main',
                    template: '<div></div>'
                })
        }
    )

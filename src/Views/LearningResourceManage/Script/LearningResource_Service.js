app
    .factory('LearningResourceService', function($http, service, DataOperate) {
        var ret = {
            //添加教学资源
            Save: function($scope, data, fun) {
                if (data.DataState === state.Add) {
                    DataOperate.Add(Route.LearningResourceMain_Add, $.extend(data, {
                        PluginId: "",
                    }), function(data) {
                        if (fun) fun(data);
                    })
                } else {
                    DataOperate.Edit(Route.LearningResourceMain_Modify,
                        $.extend(data, {
                            AppId: data.AppID || service.Cookie.Get("AppID"),
                            AddUser: service.Cookie.Get("UserID"),
                            AddUserName: service.Cookie.Get("UserName") || "",
                            GroupRelationId: service.Cookie.Get("GroupRelationID"),
                            GroupRelationName: service.Cookie.Get("GroupRelationName") || ""
                        }),
                        function(data) {
                            if (fun) fun(data);
                        })
                }
            },
            //删除教学资源
            Delete: function($scope, data, fun) {
                var ids = [];
                if ($.isArray(data)) {
                    data.forEach(function(obj) {
                        ids.push(obj.Id);
                    });
                } else {
                    ids.push(data.Id);
                }
                DataOperate.Delete(Route.LearningResourceMain_Delete, {
                    IdGuids: ids,
                    OperUserGuid: service.Cookie.Get("UserID")
                }, function(data) {
                    if (fun) fun(data);
                });
            },
            LoadInfo: function($scope, data, fun) {
                if (data.ID) {
                    DataOperate.LoadData(Route.LearningResourceMain_Get, {
                        id: data.ID
                    }, function(data) {
                        if (fun) fun(data);
                    })
                } else {
                    if (fun) fun({});
                }
            },
            LoadPageData: function($scope, data, fun) {
                if ($scope.tree) {
                    var list = $scope.tree.getNodesByParam("ParentId", null);
                    var checkedList = $scope.tree.getCheckedNodes(true);
                    list.map(function(x) {
                        x.Items = [];
                        checkedList.forEach(function(obj) {
                            if (x.Id === obj.rId) {
                                x.Items.push(obj);
                            }
                        })
                    })
                    $scope.model = {
                        DatabaseId: $scope.Id,
                        parameters: list
                    }
                    $scope.UiConfigService.CreateReport($scope, $.extend($scope.model, {
                        PageIndex: $scope.Page.Index
                    }), function(data) {
                        if (typeof data == "string") {
                            data = JSON.parse(data)
                        };
                        if (fun) fun(data);
                    })
                } else {
                    return;
                }
            	// var list = $scope.tree.getNodesByParam("ParentId", null);
            	// var checkedList = $scope.tree.getCheckedNodes(true);
            	// list.map(function(x) {
            	//     x.Items = [];
            	//     checkedList.forEach(function(obj) {
            	//         if (x.Id === obj.rId) {
            	//             x.Items.push(obj);
            	//         }
            	//     })
            	// })
            	// $scope.model = {
            	//         DatabaseId: $scope.id,
            	//         parameters: []
            	//     }
            	// $scope.UiConfigService.CreateReport($scope, $.extend($scope.model, {
            	//     PageIndex: $scope.Page.Index
            	// }), function(data) {
            	//     if (typeof data == "string") {
            	//         data = JSON.parse(data)
            	//     };
            	//     $scope.data = data.List;
            	//     $scope.Page.Count = data.Num;
            	// })

                // DataOperate.LoadData(Route.ReportService_GetDatabaseList, {
                //     GroupRelationId: service.Cookie.Get("GroupRelationID") || "",
                //     PageIndex: data.PageIndex,
                //     PageSize: data.PageSize || service.PageSize,
                //     filter: ''
                // }, function(data) {
                //     if (fun) fun(data);
                // })
            }

        };
        return ret;
    });

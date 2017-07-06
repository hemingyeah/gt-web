app.factory('GitManageService', function ($http, service, DataOperate) {
    var ret = {
        //分页显示仓库
        LoadPageData: function ($scope, data, fun) {
            if ($scope.tree) {
                var dicConditions = {
                    pageIndex: data.PageIndex,
                    pageSize: data.PageSize,
                    userId: service.Cookie.Get("UserID"),
                    search: data.Param.filterModel && data.Param.filterModel.hasOwnProperty("Name") ? data.Param.filterModel["Name"].filter : "",
                    userGroupRelationId: service.Cookie.Get("GroupRelationID"),
                    sessionId: service.Cookie.Get("SessionID"),
                };
                var checkedList = $scope.tree.getCheckedNodes();
                if (checkedList && checkedList.length > 0) {
                    checkedList.forEach(function (obj) {
                        var parent = obj.getParentNode();
                        dicConditions[parent.DisplayName] = obj.FkDictionaryId;
                    })
                }

                DataOperate.LoadData(Route.GitRepositoryMain_GetPermissionRepositories, dicConditions, function (data) {
                    if (fun) fun(data);
                })
            } else {
                return;
            }




        },
        //显示单个仓库详情
        LoadInfo: function ($scope, data, fun) {
            //alert(data.ID);
            //console.log(data);
            if (data.ID) {
                DataOperate.LoadData(Route.GitRepositoryMain_GetById, {
                    id: data.ID,
                    userId: service.Cookie.Get("UserID"),
                    sessionId: service.Cookie.Get("SessionID")
                }, function (data) {
                    //console.log(data);
                    if (fun) fun(data);
                })
            } else {
                if (fun)
                    fun({});
            }
        },
        //增加和修改单个仓库
        Save: function ($scope, data, fun) {
            data.SessionId = service.Cookie.Get("SessionID");

            //console.log(data);
            if (data.DataState === state.Add) {
                DataOperate.Save(Route.GitRepositoryMain_PostRepository,
                                              data,
                                              function (data) {
                                                  var data = $.extend($scope.model, {
                                                      Id: data
                                                  });
                                                  if (fun) fun(data);
                                              }
                )
            } else {
                DataOperate.Save(Route.GitRepositoryMain_PutRepository,
                                               data,
                                                function (result) {
                                                    // alert(result); //true
                                                    if (fun && result) fun(data);
                                                }
               )
            }
        },
        //删除单个仓库
        Delete: function ($scope, data, fun) {
            DataOperate.Delete(Route.GitRepositoryMain_Delete, {
                id: data.Id,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName"),
                sessionId: service.Cookie.Get("SessionID")
            }, function (data) {
                if (fun) fun(data);
            })
        }


    }
    return ret;
});
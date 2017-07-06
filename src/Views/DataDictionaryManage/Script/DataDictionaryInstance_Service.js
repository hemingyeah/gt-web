app.factory('DataDictionaryInstanceService', function ($http, service, DataOperate) {
    var ret = {
        LoadData: function ($scope, data, fun) {
            DataOperate.LoadData(Route.DataDictionaryInstance_GetDictionaries, {
                parentId: "",
                beDeep: false,
                search: $scope.search
            }, function(data) {
                if (fun) fun(data);
            });
        },
        LoadChildData: function ($scope, data, fun) {
            DataOperate.LoadData(Route.DataDictionaryInstance_GetDictionaries, {
                parentId: data.Id,
                beDeep: false,
                search: $scope.search
            }, function(data) {
                if (fun) fun(data);
            });
        },
        //保存数据
        Save: function ($scope, data, fun) {
            if (data.DataState === state.Add) {
                DataOperate.Add(Route.DataDictionaryInstance_Add, data, function(data) {
                    if (fun) fun(data);
                });
            } else {
                DataOperate.Edit(Route.DataDictionaryInstance_Modify, data, function(data) {
                    if (fun) fun(data);
                });
            }
        },
        //删除数据
        Delete: function ($scope, data, fun) {

            var ids = [];
            if ($.isArray(data)) {
                data.forEach(function (obj) {
                    if (obj.RgtId - obj.LftId > 0) {
                        service.msg.alert("只有可以删除子节点！");
                        return;
                    }
                    ids.push(obj.Id);
                });
            } else {
                if (data.RgtId - data.LftId > 0) {
                    service.msg.alert("只有可以删除子节点！");
                    return;
                }
                ids.push(data.Id);
            }
            DataOperate.Delete(Route.DataDictionaryInstance_Delete, {
                AppId: service.Cookie.Get("AppID"),
                IdGuids: ids,
                OperUserGuid: service.Cookie.Get("UserID")
            }, function (data) {
                if (fun) fun(data);
            });
        },
        
        SearchDictionaries: function ($scope, data, fun) {
            DataOperate.LoadData(Route.DataDictionaryInstance_SearchDictionaries, {
                name: data.Name,
                pageIndex: data.PageIndex || 1,
                pageSize: data.PageSize || service.PageSize
            }, function (data) {
                if (fun) fun(data);
            })
        },
        LoadInfo: function ($scope, data, fun) {
            if (data.ID) {
                DataOperate.LoadData(Route.DataDictionaryInstance_Get, {
                    Id: data.ID
                }, function (data) {
                    if (fun) fun(data);
                })
            } else {
                if (fun) fun({});
            }
        }
    };
    return ret;
});
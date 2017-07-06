app.factory('UiConfigService', function ($http, service, DataOperate) {
    var ret = {
        //添加数据库地址
        Save: function ($scope, data, fun) {
            data.OrganId = $scope.model.Organ.Id;
            data.OrganName = $scope.model.Organ.DisplayName;
            DataOperate.Add(Route.UIConfigService_SaveUiConfig, data, function (data) {
                if (fun) fun(data);
            });
        },
        GetDictionaryListById: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetDictionaryListById, {
                parentId: data.ParentID
            }, function (data) {
                if (fun) fun(data);
            });
        },
        //删除数据库地址
        Delete: function ($scope, data, fun) {
            var ids = [];
            if ($.isArray(data)) {
                data.forEach(function (obj) {
                    ids.push(obj.Id);
                });
            } else {
                ids.push(data.Id);
            }
            DataOperate.Delete(Route.UIConfigService_DeleteUiConfig, {
                IdGuids: ids,
                OperUserGuid: service.Cookie.Get("UserID")
            }, function (data) {
                if (fun) fun(data);
            });
        },
        //获取字段
        GetColumnSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetColumnSettingList, {
                fkUiConfigId: data.UiConfigID
            }, function (data) {
                if (fun) fun(data);
            });
        },
        //编辑数据库地址
        LoadInfo: function ($scope, data, fun) {
            if (data.Id) {
                DataOperate.LoadData(Route.UIConfigService_GetUiConfigById, {
                    Id: data.Id
                }, function (data) {
                    if (fun) fun(data);
                });
            } else {
                if (fun) fun({
                    DataSource: 2,
                    TypeId: "",
                    PluginId: "",
                    AddUser: service.Cookie.Get("UserID"),
                    AddUserName: service.Cookie.Get("UserName"),
                    AppId: service.Cookie.Get("AppID"),
                    DataState: 0,
                    GroupRelationId: service.Cookie.Get("GroupRelationID"),
                    GroupRelationName: service.Cookie.Get("GroupRelationName"),
                    ModifyUser: service.Cookie.Get("UserID"),
                    ModifyUserName: service.Cookie.Get("UserName")
                });
            }
        },
        //获取数据库地址列表
        LoadPageData: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetUiConfigList, {
                GroupRelationId: service.Cookie.Get("GroupRelationID") || "",
                PageIndex: data.PageIndex,
                PageSize: data.PageSize || service.PageSize,
                filter: ''
            }, function(data) {
                if (fun) fun(data);
            });
        },
        //获取零件列表
        GetOrgans: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetOrgans, {
                filter: data.Filter || "",
                PageIndex: data.PageIndex,
                PageSize: data.PageSize || service.PageSize
            }, function (data) {
                if (fun) fun(data);
            });
        },
        GetDimensionalityTreeById: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetDimensionalityTreeById, {
                fkColumnId: data.FKDataSourceItemID,
            }, function (_data) {
                if (fun) fun(_data, data.Key);
            });
        },
        GetDataColumnValueSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetDataColumnValueSettingList, {
                fkDictionaryId: data.FKDictionaryID,
                fkDataSourceItemId: data.FKDataSourceItemID
            }, function (data) {
                if (fun) fun(data);
            });
        },
        //获取表集合
        GetTableList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetTableList, {
                fkUiConfigId: data.DataBaseID,
                pageIndex: data.PageIndex,
                pageSize: data.PageSize || service.PageSize,
                filter: data.Filter || ""
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取表
        GetTableSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetTableSettingList, {
                organId: data.organId,
                fkUiConfigId: data.fkUiConfigId
            }, function (data) {
                if (fun) fun(data);
            });
        },

        //保存配置
        SaveDataSourceSetting: function ($scope, data, fun) {
           DataOperate.Save(Route.UIConfigService_SaveDataSourceSetting, data, function (data) {
                if (fun) fun(data);
            });
        },
        GenerateWebPage:function($scope, data, fun) {
            DataOperate.Save(Route.UIConfigService_GenerateWebPage, data, function (data) {
                if (fun) fun(data);
            });
        },
        //保存表配置
        SaveDataTableSetting: function ($scope, data, fkUiConfigId, fun) {
            var url = Route.UIConfigService_SaveDataTableSetting.Url;
            try {
                Route.UIConfigService_SaveDataTableSetting.Url = url + "?fkUiConfigId=" + fkUiConfigId;
                DataOperate.Save(Route.UIConfigService_SaveDataTableSetting, data, function (data) {
                    if (fun) fun(data);
                });
                Route.UIConfigService_SaveDataTableSetting.Url = url;
            } catch (e) {
                Route.UIConfigService_SaveDataTableSetting.Url = url;
                throw e;
            }
        },
        //保存字段、维度配置
        SaveDataColumnSetting: function ($scope, data, fun) {
            DataOperate.Save(Route.UIConfigService_SaveDataColumnSetting, data, function (data) {
                if (fun) fun(data);
            });
        },
        //获取模板列
        GetColumnSettingListByTemplateId: function ($scope, data, fun) {
            DataOperate.LoadData(Route.UIConfigService_GetColumnSettingListByTemplateId, data, function (data) {
                if (fun) fun(data);
            });
        }
    };
    return ret;
});

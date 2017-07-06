app.factory('ReportService', function ($http, service, DataOperate) {
    var ret = {
        //添加数据库地址
        Save: function ($scope, data, fun) {
            data.OrganId = $scope.model.Organ.Id;
            data.OrganName = $scope.model.Organ.DisplayName;
            DataOperate.Add(Route.ReportService_SaveDatabase, data, function(data) {
                if (fun) fun(data);
            });
        },
        //测试数据库连接是否成功
        ConnectDatabaseTest: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_ConnectDatabaseTest, $scope.model, function (data) {
                service.msg.alert(data ? "连接成功！" : "连接失败！");
                if (fun) fun(data);
            })
        },
        //测试数据库连接是否成功
        GetDictionaryListById: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetDictionaryListById, {
                parentId: data.ParentID
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //根据配置条件获取报表数据
        CreateReport: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_CreateReport, $.extend(data, {
                PageSize: data.PageSize || service.PageSize
            }), function (data) {
                if (fun) fun(data);
            })
        },
        //删除数据库地址
        Delete: function ($scope, data, fun) {
            var ids = [];
            if ($.isArray(data)) {
                data.forEach(function(obj) {
                    ids.push(obj.Id);
                });
            } else {
                ids.push(data.Id);
            }
            DataOperate.Delete(Route.ReportService_DeleteDatabase, {
                IdGuids: ids,
                OperUserGuid: service.Cookie.Get("UserID")
            }, function(data) {
                if (fun) fun(data);
            });
        },
        //获取列集合
        GetColumnList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetColumnList, {
                tableId: data.TableID,
                isSetting: data.IsSetting,
                fkDataSourceId: data.ReportId,
                PageIndex: 1,
                PageSize: 99
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取字段
        GetColumnSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetColumnSettingList, {
                fkDatabaseId: data.ReportId,
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //编辑数据库地址
        LoadInfo: function ($scope, data, fun) {
            if (data.Id) {
                DataOperate.LoadData(Route.ReportService_GetDatabaseById, {
                    Id: data.Id
                }, function(data) {
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
            DataOperate.LoadData(Route.ReportService_GetDatabaseList, {
                GroupRelationId: service.Cookie.Get("GroupRelationID") || "",
                PageIndex: data.PageIndex,
                PageSize: data.PageSize || service.PageSize,
                filter: ''
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取维度
        GetDimensionalitySettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetDimensionalitySettingList, {
                tableId: data.TableID,
                fkDataSourceId: data.ReportId,
                PageIndex: 1,
                PageSize: 99
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取零件列表
        GetOrgans: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetOrgans, {
                filter: data.Filter || "",
                PageIndex: data.PageIndex,
                PageSize: data.PageSize || service.PageSize
            }, function (data) {
                if (fun) fun(data);
            })
        },
        GetDimensionalityTreeById: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetDimensionalityTreeById, {
                fkDataSourceItemId: data.FKDataSourceItemID,
            }, function (_data) {
                if (fun) fun(_data, data.Key);
            })
        },
        GetDataColumnValueSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetDataColumnValueSettingList, {
                fkDictionaryId: data.FKDictionaryID,
                fkDataSourceItemId: data.FKDataSourceItemID
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取表集合
        GetTableList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetTableList, {
                reportId: data.ReportId,
                pageIndex: data.PageIndex,
                pageSize: data.PageSize || service.PageSize,
                filter: data.Filter || ""
            }, function (data) {
                if (fun) fun(data);
            })
        },
        //获取表
        GetTableSettingList: function ($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetTableSettingList, {
                OrganId: data.OrganId,
                ReportId: data.ReportId
            }, function (data) {
                if (fun) fun(data);
            })
        },
  
        //保存配置
        SaveDataSourceSetting: function ($scope, data, fun) {
            DataOperate.Save(Route.ReportService_SaveDataSourceSetting, data, function (data) {
                if (fun) fun(data);
            })
        },
        //保存表配置
        SaveDataTableSetting: function ($scope, data, reportId, fun) {
            var url = Route.ReportService_SaveDataTableSetting.Url;
            try {
                Route.ReportService_SaveDataTableSetting.Url = url + "?reportId=" + reportId;
                DataOperate.Save(Route.ReportService_SaveDataTableSetting, data, function(data) {
                    if (fun) fun(data);
                });
                Route.ReportService_SaveDataTableSetting.Url = url;
            } catch (e) {
                Route.ReportService_SaveDataTableSetting.Url = url;
                throw e;
            }
        },
        //保存字段、维度配置
        SaveDataColumnSetting: function ($scope, data, reportId, fun) {
           
            var url = Route.ReportService_SaveDataColumnSetting.Url;
            try {
                Route.ReportService_SaveDataColumnSetting.Url = url + "?reportId=" + reportId;

                DataOperate.Save(Route.ReportService_SaveDataColumnSetting, data, function (data) {
                    if (fun) fun(data);
                });

                Route.ReportService_SaveDataColumnSetting.Url = url;
            } catch (e) {
                Route.ReportService_SaveDataColumnSetting.Url = url;
                throw e;
            }
        },
        //获取模板列
        GetColumnSettingListByTemplateId:function($scope, data, fun) {
            DataOperate.LoadData(Route.ReportService_GetColumnSettingListByTemplateId, data, function (data) {
                if (fun) fun(data);
            });
        }
    };
    return ret;
});

app.factory('importService', function ($http, service, DataOperate) {
    var ret = {
        DownLoadModel: function ($scope, data, fun) {

        },
        DownLoadDefault: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_GetDefaultDownLoad, data, function (data) {
                if (fun) fun(data);
            });
        },
        DownLoadDictionary: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_GetDicTemplate, data, function (data) {
                if (fun) fun(data);
            });
        },
        DownLoadGroupUser: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_GetGroupUserTemplate, data, function (data) {
                if (fun) fun(data);
            });
        },
        PostDic: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_PostDic, data, function (data) {
                if (fun) fun(data);
            });
        },
        PostGroupUser: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_PostGroupUser, data, function (data) {
                if (fun) fun(data);
            });
        },
        PostDefault: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_PostDefault, data, function (data) {
                if (fun) fun(data);
            });
        },
        LoadPageData: function ($scope, data, fun) {
            DataOperate.LoadData(Route.Import_GetImportList, {
                groupRelationId: service.Cookie.Get("GroupRelationID"),
                appId: service.Cookie.Get("AppID"),
                addUserId: service.Cookie.Get("UserID"),
                pageIndex: data.PageIndex || 1,
                pageSize : data.PageSize
            }, function (data) {
                if (fun) fun(data);
            });
        }
    };
    return ret;
});
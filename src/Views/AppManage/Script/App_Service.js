app
	.factory('AppService', function($http, service, DataOperate) {
		var ret = {
			LoadData: function($scope, data, fun) {
				DataOperate.LoadData(Route.AppInfo_GetAppList, {}, function(data) {
					if (fun) fun(data);
				})
			},
			LoadPageData: function($scope, data, fun) {
				DataOperate.LoadData(Route.AppInfo_GetPageList, {
					pageIndex:data.PageIndex,
					pageSize:data.PageSize||service.PageSize
				}, function(data) {
					if (fun) fun(data);
				})
			},
			SaveAppDeptment: function($scope, data, fun) {
				DataOperate.Save(Route.AppInfo_SaveAppNotePermissions, $scope.model, function(data) {
					if (fun) fun(data);
				})
			},
			GetAppNoteList: function($scope, data, fun) {
				DataOperate.LoadData(Route.AppInfo_GetAppNoteList, {
					appId: data.AppID || service.Cookie.Get("AppID")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetAppDetail: function($scope, data, fun) {
				DataOperate.LoadData(Route.AppInfo_GetAppDetail, {
					appId: data.AppID || service.Cookie.Get("AppID")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetAppLineBlockTagList: function($scope, data, fun) {
				DataOperate.LoadData(Route.AppInfo_GetAppLineBlockTagList, {
					appId: data.AppID || service.Cookie.Get("AppID"),
					name: data.UserName
				}, function(data) {
					if (fun) fun(data);
				})
			},
			SaveAppLineBlockTagPermissions: function($scope, data, fun) {
				DataOperate.Save(Route.AppInfo_SaveAppLineBlockTagPermissions, {
					AppID: data.AppID || service.Cookie.Get("AppID"),
					Permissions: data.Permissions
				}, function(data) {
					if (fun) fun(data);
				})
			}
		};
		return ret;
	});
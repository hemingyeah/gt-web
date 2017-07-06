app
	.factory('PluginService', function($http, service, DataOperate) {
		var ret = {
			Save: function($scope, data, fun) {
				DataOperate.Save(Route.Plugin_Save, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteInfo: function($scope, data, fun) {
				DataOperate.Delete(Route.Plugin_Delete, {
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			LoadData: function($scope, data, fun) {
				DataOperate.LoadData(Route.Plugin_GetList, null, function(data) {
					if (fun) fun(data);
				})
			},
			LoadPageData: function($scope, data, fun) {
				DataOperate.LoadData(Route.Plugin_GetPageList, {
					name: data.Name,
					pageIndex: data.PageIndex,
					pageSize: data.PageSize || service.PageSize
				}, function(data) {
					if (fun) fun(data);
				})
			},
			LoadInfo: function($scope, data, fun) {
				if (data.ID) {
				    DataOperate.LoadDataSync(Route.Plugin_GetDetails, {
						id: data.ID
					}, function(data) {
						if (fun) fun(data);
					})
				}
			},
			LoadPluginInstanceDetails: function($scope, data, fun) {
				DataOperate.LoadData(Route.Plugin_GetPluginInstanceDetails, {
					id: data
				}, function(data) {
					if (fun) fun(data);
				})
			},
			LoadTypeData: function($scope, data, fun) {
				if (fun) fun(
					[{
						Index: 0,
						Name: "系统插件"
					}, {
						Index: 1,
						Name: "基础插件"
					}, {
						Index: 2,
						Name: "业务插件"
					}]
				);
			}
		};
		return ret;
	});
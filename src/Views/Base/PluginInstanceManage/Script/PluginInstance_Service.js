app.factory('PluginInstanceService', function($http, service, DataOperate) {
	var ret = {
		Save: function($scope, data, fun) {
			DataOperate.Save(Route.PluginInstance_Save, data, function(data) {
				if (fun) fun(data);
			})
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.PluginInstance_Delete, {
				id: data.ID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadSelectedData: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginInstance_GetPermissions, {
				pluginInstanceId: data.PluginInstanceID,
				parentId: data.ParentID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetRootData2: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginInstance_GetClassifications, {
				OrderIndex: data.OrderIndex,
				parentId: data.ParentID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		SavePermissions: function($scope, data, fun) {
			DataOperate.Save(Route.PluginInstance_SavePermissions, data, function(data) {
				if (fun) fun(data);
			})
		},
		LoadPageData: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginInstance_GetPageList, {
				name: data.Name,
				PageIndex: data.PageIndex,
				PageSize: data.PageSize ? data.PageSize : service.PageSize,
				IsEnabled: data ? data.IsEnabled : "",
				AppId: data.AppID || service.Cookie.Get("AppID")
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if (data.ID) {
				DataOperate.LoadData(Route.PluginInstance_GetDetails, {
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				if (fun)
					fun({
						FkPluginId: null,
						Menus: []
					});
			}
		}
	};
	return ret;
});
app.factory('PluginClassificationPermissionService', function($http, service, DataOperate) {
	var ret = {
		GetDesigns: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginClassificationPermission_GetDesigns, {
				pluginId: data.PluginID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetDictionaryAttributes: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginClassificationPermission_GetDictionaryAttributes, {
				designId: data.DesignID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetPermissions: function($scope, data, fun) {
			DataOperate.LoadData(Route.PluginClassificationPermission_GetPermissions, {
				parentId: data.ParentID,
				appId: data.AppID || service.Cookie.Get("AppID"),
				pluginInstanceId: data.PluginInstanceID,
				pluginId: data.PluginID,
				designId: data.DesignID,
				designAttributeId: data.DesignAttributeID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		Save: function($scope, data, fun) {
			DataOperate.Save(Route.PluginClassificationPermission_Save, {
				AppId: data.AppID || service.Cookie.Get("AppID"),
				PluginInstanceId: data.PluginInstanceID,
				PluginId: data.PluginID,
				DesignId: data.DesignID,
				DesignAttributeId: data.DesignAttributeID,
				Permissions: data.Permissions
			}, function(data) {
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
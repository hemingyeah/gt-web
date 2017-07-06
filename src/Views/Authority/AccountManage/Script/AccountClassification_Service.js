app.factory('AccountClassificationService', function($http, service, DataOperate) {
	var ret = {
		GetList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountClassification_GetList, {
				queryType: data.QueryType,
				appId: data.AppID || service.Cookie.Get("AppID"),
				pluginInstanceId: data.PluginInstanceID,
				pluginId: data.PluginID,
				designId: data.DesignID,
				designAttributeId: data.DesignAttributeID,
				parentId: data.ParentID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		//获取插件标签
		GetPermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.LoadData(Route.AccountClassification_GetPersonalPermissions, {
					relationId: data.RelationID,
					relationType: data.RelationType,
					GroupRelationID: data.GroupRelationID,
					appId: data.AppID || service.Cookie.Get("AppID"),
					pluginInstanceId: data.PluginInstanceID,
					pluginId: data.PluginID,
					designId: data.DesignID,
					parentId:data.ParentID,
					designAttributeId: data.DesignAttributeID
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.LoadData(Route.AccountClassification_GetEnterprisePermissions, {
					relationId: data.RelationID,
					parentId:data.ParentID,
					relationType: data.RelationType,
					appId: data.AppID || service.Cookie.Get("AppID"),
					pluginInstanceId: data.PluginInstanceID,
					pluginId: data.PluginID,
					designId: data.DesignID,
					designAttributeId: data.DesignAttributeID
				}, function(data) {
					if (fun) fun(data);
				})
			}
		},
		//保存插件标签
		SavePermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.Save(Route.AccountClassification_SavePersonalPermissions, {
					Permissions: data.Permissions,
					RelationId: data.RelationID,
					RelationType: data.RelationType,
					AppId: data.AppID || service.Cookie.Get("AppID"),
					PluginInstanceId: data.PluginInstanceID,
					PluginId: data.PluginID,
					DesignId: data.DesignID,
					DesignAttributeId: data.DesignAttributeID,
					GroupRelationId: data.GroupRelationID
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.Save(Route.AccountClassification_SaveEnterprisePermissions, {
					Permissions: data.Permissions,
					RelationId: data.RelationID,
					RelationType: data.RelationType,
					AppId: data.AppID || service.Cookie.Get("AppID"),
					PluginInstanceId: data.PluginInstanceID,
					PluginId: data.PluginID,
					DesignId: data.DesignID,
					DesignAttributeId: data.DesignAttributeID,
					GroupRelationId: data.GroupRelationID
				}, function(data) {
					if (fun) fun(data);
				})
			}
		}
	};
	return ret;
});
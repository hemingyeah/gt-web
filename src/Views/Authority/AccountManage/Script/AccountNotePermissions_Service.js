app.factory('AccountNotePermissionsService', function($http, service, DataOperate) {
	var ret = {
		GetList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountNotePermissions_GetList, {
				queryType: data.QueryType,
				appId: data.AppID || service.Cookie.Get("AppID"),
				parentId: data.ParentID || ""
			}, function(data) {
				if (fun) fun(data);
			})
		},
		SavePermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.Save(Route.AccountNotePermissions_SavePersonalPermissions, {
					Permissions: data.Permissions,
					RelationId: data.RelationID,
					RelationType: data.RelationType,
					GroupRelationId: data.GroupRelationID,
					AppId: data.AppID || service.Cookie.Get("AppID"),
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.Save(Route.AccountNotePermissions_SaveEnterprisePermissions, {
					Permissions: data.Permissions,
					RelationId: data.RelationID,
					RelationType: data.RelationType,
					GroupRelationId: data.GroupRelationId || "",
					appId: data.AppID || service.Cookie.Get("AppID"),
				}, function(data) {
					if (fun) fun(data);
				})
			}
		},
		GetPermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.LoadData(Route.AccountNotePermissions_GetPersonalPermissions, {
					groupRelationId: data.GroupRelationID,
					appId: data.AppID || service.Cookie.Get("AppID"),
					relationId: data.RelationID,
					relationType: data.RelationType
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.LoadData(Route.AccountNotePermissions_GetEnterprisePermissions, {
					groupRelationId: data.GroupRelationID,
					appId: data.AppID || service.Cookie.Get("AppID"),
					relationId: data.RelationID,
					relationType: data.RelationType
				}, function(data) {
					if (fun) fun(data);
				})
			}
		}
	};
	return ret;
});
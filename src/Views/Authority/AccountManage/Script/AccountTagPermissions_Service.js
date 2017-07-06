app.factory('AccountTagPermissionsService', function($http, service, DataOperate) {
	var ret = {
		GetList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountTagPermissions_GetList, {
				appId: data.AppID || service.Cookie.Get("AppID"),
				name: data.Name
			}, function(data) {
				if (fun) fun(data);
			})
		},
		SaveEnterprisePermissions: function($scope, data, fun) {
			DataOperate.Save(Route.AccountTagPermissions_SaveEnterprisePermissions, data, function(data) {
				if (fun) fun(data);
			})
		},
		GetEnterprisePermissions: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountTagPermissions_GetEnterprisePermissions, {
				relationId: data.RelationID,
				relationType: data.RelationType
			}, function(_data) {
				if (fun) fun({
					RelationType: data.RelationType,
					RelationID: data.RelationID,
					Permissions: _data
				});
			})
		}
	};
	return ret;
});
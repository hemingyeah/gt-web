app.factory('PowerService', function($http, service, DataOperate) {
	var ret = {
		// LoadRoleFullInfo: function($scope, data, fun) {
		// 	DataOperate.LoadData(Route.Role_GetRoleFullInfo, {
		// 		roleId: $scope.Id
		// 	}, function(data) {
		// 		$scope.model = $.extend({
		// 			UserList: [],
		// 			PluginInstances: []
		// 		}, data);
		// 		if (fun) fun(data);
		// 	})
		// },
		LoadOperationPermissions: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetOperationPermissions, {
				relationId: data.RelationID,
				appId: data.AppID || service.Cookie.Get("AppID"),
				relationType: data.RelationType,
				groupRelationId: "",
				menuType: data.MenuType
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadUserOperationPermissions: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetUserOperationPermissions, {
				appId: data.AppID || service.Cookie.Get("AppID"),
				accountId: service.Cookie.Get("UserID"),
				accountType: service.Cookie.Get("AccountType"),
				menuType: service.Cookie.Get("MenuType")
			}, function(data) {
				if (fun) fun(data);
			})
			//DataOperate.LoadData(Route.UserPermissionWrapper_GetUserOperationPermissionsWrapper, {
			//	appId: data.AppID || service.Cookie.Get("AppID"),
			//	accountId: service.Cookie.Get("UserID"),
			//	accountType: service.Cookie.Get("AccountType"),
			//	menuType: service.Cookie.Get("MenuType")
			//}, function(data) {
			//	if (fun) fun(data);
			//})
		}
	};
	return ret;
});
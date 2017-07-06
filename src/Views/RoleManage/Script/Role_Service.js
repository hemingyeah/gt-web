app
	.factory('RoleService', function($http, service, DataOperate) {
		var ret = {
			Save: function($scope, data, fun) {
				data.AppID = data.AppID || service.Cookie.Get("AppID");
				if (data.Type === "Person") {
					DataOperate.Save(Route.Role_SavePersonal, data, function(data) {
						if (fun) fun(data);
					})
				} else if (data.Type === "Company") {
					DataOperate.Save(Route.Role_SaveEnterprise, data, function(data) {
						if (fun) fun(data);
					})
				} else {
					DataOperate.Save(Route.Role_Save, data, function(data) {
						if (fun) fun(data);
					})
				}
			},
			DeleteInfo: function($scope, data, fun) {
				if (data.Type === "Person") {
					DataOperate.Delete(Route.Role_DeletePersonal, {
						id: data.ID
					}, function(data) {
						if (fun) fun(data);
					})
				} else if (data.Type === "Company") {
					DataOperate.Delete(Route.Role_DeleteEnterprise, {
						id: data.ID
					}, function(data) {
						if (fun) fun(data);
					})
				}
			},
			LoadRole: function($scope, data, fun) {
				if (data) {
					DataOperate.LoadData(Route.UserPermissionWrapper_GetOperationsByMenu, {
						appId: service.Cookie.Get("AppID"),
						MenuId: data,
						menuType: 0,
						accountId: service.Cookie.Get("UserID"),
						accountType: service.Cookie.Get("AccountType")
					}, function(data) {
						for (eve in $scope.event) {
							var list = data.filter(function(x) {
								if ((x.Code === eve && x.Checked) || eve === "LoadData") return x;
							})
							if (list.length === 0) {
								$scope.event[eve] = false;
							}
						}
					})
				}
			},
			LoadInfo: function($scope, data, fun) {
				if (data.ID) {
					if (data.Type === "Person") {
						DataOperate.LoadData(Route.Role_GetPersonalDetails, {
							id: data.ID
						}, function(data) {
							if (fun) fun(data);
						})
					} else if (data.Type === "Company") {
						DataOperate.LoadData(Route.Role_GetEnterpriseDetails, {
							id: data.ID
						}, function(data) {
							if (fun) fun(data);
						})
					}
				} else {
					if (fun) fun({});
				}
			},
			LoadData: function($scope, data, fun) {
				if (data.Type === "Person") {
					DataOperate.LoadData(Route.Role_GetPersonalList, {
						appId: data.AppID || service.Cookie.Get("AppID"),
						isEnabled: data.IsEnabled
					}, function(data) {
						if (fun) fun(data);
					})
				} else if (data.Type === "Company") {
					DataOperate.LoadData(Route.Role_GetEnterpriseList, {
						appId: data.AppID || service.Cookie.Get("AppID"),
						isEnabled: data.IsEnabled
					}, function(data) {
						if (fun) fun(data);
					})
				}
			},
			LoadPageData: function($scope, data, fun) {
				if (data.Type === "Person") {
					DataOperate.LoadData(Route.Role_GetPersonalPageList, {
						appId: data.AppID || service.Cookie.Get("AppID"),
						isEnabled: data.IsEnabled,
						PageIndex: data.PageIndex,
						PageSize: data.PageSize || service.PageSize
					}, function(data) {
						if (fun) fun(data);
					})
				} else if (data.Type === "Company") {
					DataOperate.LoadData(Route.Role_GetEnterprisePageList, {
						appId: data.AppID || service.Cookie.Get("AppID"),
						isEnabled: data.IsEnabled,
						PageIndex: data.PageIndex,
						PageSize: data.PageSize || service.PageSize
					}, function(data) {
						if (fun) fun(data);
					})
				}
			},
		};
		return ret;
	});
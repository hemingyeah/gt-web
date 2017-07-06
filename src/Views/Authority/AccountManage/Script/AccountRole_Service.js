app.factory('AccountRoleService', function($http, service, DataOperate) {
	var ret = {
		SaveAccountRole: function($scope, data, fun) {
			if (data.Type === "Person") {
				DataOperate.Save(Route.AccountRole_SavePersonalAccountRoles, data, function(data) {
					if (fun) fun(data);
				})
			} else if (data.Type === "Company") {
				DataOperate.Save(Route.AccountRole_SaveEnterpriseAccountRoles, data, function(data) {
					if (fun) fun(data);
				})
			}
		},
		SaveRoleAccount: function($scope, data, fun) {
			if (data.Type === "Person") {
				DataOperate.Save(Route.AccountRole_SavePersonalRoleAccounts, data, function(data) {
					if (fun) fun(data);
				})
			} else if (data.Type === "Company") {
				DataOperate.Save(Route.AccountRole_SaveEnterpriseRoleAccounts, data, function(data) {
					if (fun) fun(data);
				})
			}
		},
		GetRoleByAccount: function($scope, data, fun) {
			if (data.Type === "Person") {
				DataOperate.LoadData(Route.AccountRole_GetPersonalRoleByAccountId, {
					accountId: data.AccountID,
					accountGroupRelationId: data.AccountGroupRelationID
				}, function(data) {
					if (fun) fun(data);
				})
			} else if (data.Type === "Company") {
				DataOperate.LoadData(Route.AccountRole_GetEnterpriseRoleByAccountId, {
					accountId: data.AccountID,
					accountGroupRelationId: data.AccountGroupRelationID
				}, function(data) {
					if (fun) fun(data);
				})

			}
		},
		GetAccountByRole: function($scope, data, fun) {
			if (data.Type === "Person") {
				DataOperate.LoadData(Route.AccountRole_GetPersonalAccountByRoleId, {
					roleId: data.RoleID,
					accountGroupRelationId: data.AccountGroupRelationID
				}, function(data) {
					if (fun) fun(data);
				})
			} else if (data.Type === "Company") {
				DataOperate.LoadData(Route.AccountRole_GetEnterpriseAccountByRoleId, {
					roleId: data.RoleID
				}, function(data) {
					if (fun) fun(data);
				})

			}
		}
	};
	return ret;
});
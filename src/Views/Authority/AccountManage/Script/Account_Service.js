app.factory('AccountService', function($http, service, DataOperate) {
	var ret = {
		GetCompanyAccounts: function($scope, data, fun) {
			DataOperate.LoadData(Route.Account_GetCompanyAccounts, {
				parentId: data.ParentID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		ResetCompanyPwd:function($scope,data,fun){
			DataOperate.ResetPassword(Route.Account_ResetCompanyPwd, {
				account: data.Account
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if (data.AccountID) {
				DataOperate.LoadData(Route.Account_GetCompanyAccount, {
					accountId: data.AccountID
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				if (fun) fun({});
			}
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.Account_DeleteCompanyAccount, {
				accountId: data.AccountID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetUserListByGroupId: function($scope, data, fun) {
			DataOperate.LoadData(Route.Account_GetUserListByGroupId, {
				name: data.Name,
				groupRelationId: data.GroupRelationID,
				pageIndex: data.PageIndex,
				pageSize: data.PageSize || service.PageSize
			}, function(data) {
				if (fun) fun(data);
			})
		},
		Save: function($scope, data, fun) {
			if (data.ID) {
				DataOperate.Edit(Route.Account_ModifyCompanyAccount, data, function(data) {
					if (fun) fun(data);
				})
			} else {
				DataOperate.Add(Route.Account_SaveCompanyAccount, data, function(data) {
					if (fun) fun(data);
				})
			}
		}
	};
	return ret;
});
app.factory('PersonalAccountService', function($http, service, DataOperate) {
	var ret = {
		GetAppList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountOperation_GetAppList, {
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
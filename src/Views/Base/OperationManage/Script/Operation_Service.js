app.factory('OperationService', function($http, service, DataOperate) {
	var ret = {
		Save: function($scope, data, fun) {
			DataOperate.Save(Route.Operation_Save, $.extend({
				AddUser: service.Cookie.Get("UserID"),
				ModifyUser: service.Cookie.Get("UserID")
			}, data), function(data) {
				if (fun) fun(data);
			})
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.Operation_Delete, {
				id: data.ID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadPageData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Operation_GetPageList, {
				pageIndex: data.PageIndex,
				pageSize: data.PageSize || service.PageSize
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if (data.ID) {
				DataOperate.LoadData(Route.Operation_GetDetails, {
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				if (fun) fun({
					Operations: []
				});
			}
		}
	};
	return ret;
});
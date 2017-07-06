app.factory('PageService', function($http, service, DataOperate) {
	var ret = {
		Save: function($scope,data, fun) {
			DataOperate.Save(Route.Menu_Save, data, function(data) {
				if (fun) fun(data);
			})
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.Menu_Delete, {
				id: data.ID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadPageData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Menu_GetPageList, {
				name:data.Name,
				PageIndex: data.PageIndex,
				PageSize: data.PageSize || service.PageSize
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Menu_GetList, {
				name:data.Name
				// IsEnabled: data
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if (data.ID) {
				DataOperate.LoadData(Route.Menu_GetDetails, {
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				if(fun)fun({
					Operations: []
				});
			}
		}
	};
	return ret;
});
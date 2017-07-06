app.factory('MenuService', function($http, service, DataOperate) {
	var ret = {
		GetChildData: function($scope, data, fun) {
			DataOperate.Save(Route.Menu_GetList, {}, function(data) {
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
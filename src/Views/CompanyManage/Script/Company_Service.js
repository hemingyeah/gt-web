app.factory('CompanyService', function($http, service, DataOperate) {
	var ret = {
		LoadData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Group_GetCompany, {}, function(data) {
				$scope.model = data;
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
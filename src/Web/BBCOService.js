app.factory('BBCOService', function($http, service, UrlRoute) {
	var ret = {
		GetAdvertisem: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetAdvertisement.Type,
					url: UrlRoute.IoIp_GetAdvertisement.Url
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetNotices: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetNotices.Type,
					url: UrlRoute.IoIp_GetNotices.Url,
					data: {
						pageIndex: 1,
						pageSize: 5,
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetNoticesById: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetNoticesById.Type,
					url: UrlRoute.IoIp_GetNoticesById.Url,
					data: {
						pageIndex: 1,
						pageSize: 5,
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetNews: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetNews.Type,
					url: UrlRoute.IoIp_GetNews.Url,
					data: {
						pageIndex: 1,
						pageSize: 3,
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetKnowledgeItemsForMainPage: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetKnowledgeItemsForMainPage.Type,
					url: UrlRoute.IoIp_GetKnowledgeItemsForMainPage.Url,
					data: {
						pageIndex: 1,
						pageSize: 5,
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetCompanys: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetCompanys.Type,
					url: UrlRoute.IoIp_GetCompanys.Url,
					data: {
						pageIndex: 1,
						pageSize: 6,
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetListData: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute[$scope.ListDataCode].Type,
					url: UrlRoute[$scope.ListDataCode].Url,
					data: {
						PageIndex: $scope.Page.Index,
						PageSize: $scope.Page.Size ? $scope.Page.Size : service.PageSize,
						itemId: $scope.TypeId ? $scope.TypeId : "",
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetTypeData: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute.IoIp_GetKnowledgeItems.Type,
					url: UrlRoute.IoIp_GetKnowledgeItems.Url,
					data: {
						pageIndex: 1,
						pageSize: 10000,
						groupRelationId: "",
						appId: "",
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		},
		GetInfoData: function($scope, data, fun) {
			service.http.ajax({
					type: UrlRoute[$scope.UrlCode].Type,
					url: UrlRoute[$scope.UrlCode].Url,
					data: {
						groupRelationId: "",
						appId: "",
						id: $scope.Id,
						name: ""
					}
				})
				.success(function(data) {
					service.http.DataHandle(data, function(data) {
						if (fun) fun(data);
					})
				});
		}
	};
	return ret;
});
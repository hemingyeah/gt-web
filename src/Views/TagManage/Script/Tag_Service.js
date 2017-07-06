app.factory('TagService', function($http, service, DataOperate) {
	var ret = {
		// 获取人组标签列表
		GetList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountLineBlockTagPermissions_GetList, {
				queryType: data.QueryType,
				appId: data.AppID || service.Cookie.Get("AppID"),
			}, function(data) {
				if (fun) fun(data);
			})
		},
		//获取人组标签
		GetPermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.LoadData(Route.AccountLineBlockTagPermissions_GetPersonalPermissions, {
					UserId: data.UserID || "",
					GroupRelationId: data.GroupRelationID || ""
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.LoadData(Route.AccountLineBlockTagPermissions_GetEnterprisePermissions, {
					RelationId: data.RelationID || "",
					RelationType: data.RelationType || ""
				}, function(data) {
					if (fun) fun(data);
				})
			}
		},
		SavePermissions: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.Save(Route.AccountLineBlockTagPermissions_SavePersonalPermissions, {
					UserId: data.UserID || "",
					GroupRelationId: data.GroupRelationID || "",
					Permissions: data.Operations
				}, function(data) {
					if (fun) fun(data);
				})
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.Save(Route.AccountLineBlockTagPermissions_SaveEnterprisePermissions, {
					RelationId: data.RelationID || "",
					RelationType: data.RelationType || "",
					Permissions: data.Operations
				}, function(data) {
					if (fun) fun(data);
				})
			}
		},
		SavePersonalPermissionsList: function($scope, data, fun) {
			//批量打个人帐号人族标签
			DataOperate.Save(Route.AccountLineBlockTagPermissions_SavePersonalPermissionsList, {
				Permissions: data.Operations,
				UserList: data.UserList
			}, function(data) {
				if (fun) fun(data);
			})
		},
		Save: function($scope, data, fun) {
			DataOperate.Save(Route.LineBlockTag_Save, $.extend($scope.model, {
				SelfBuilt: true
			}), function(data) {
				if (fun) fun(data);
			})
		},
		SaveList: function($scope, data, fun) {
			if ($scope.model.length === 0) {
				service.msg.alert("选项不能为空,请选择！")
			} else {
				DataOperate.Save(Route.LineBlockTag_SaveList, $scope.model, function(data) {
					if (fun) fun(data);
				})
			}
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.LineBlockTag_DeleteByTagId, {
				tagId: data.ID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadPageData: function($scope, data, fun) {
			DataOperate.LoadData(Route.LineBlockTag_GetPageList, {
				pageIndex: data.PageIndex,
				pageSize: data.PageSize || service.PageSize
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadData: function($scope, data, fun) {
			DataOperate.LoadData(Route.LineBlockTag_GetList, {

			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadTagData: function($scope, data, fun) {
			DataOperate.LoadData(Route.LineBlockTag_GetClassifications, {
				id: null
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if ($scope.Id) {
				DataOperate.LoadData(Route.Menu_GetDetails, {
					id: $scope.Id
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				$scope.model = {
					Operations: []
				}
			}
		}
	};
	return ret;
});
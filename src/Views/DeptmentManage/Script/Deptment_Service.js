app.factory('DeptmentService', function($http, service, DataOperate) {
	var ret = {
		GetChildData: function($scope, data, fun) {
			DataOperate.LoadData(Route.GroupRelationWrapper_GetGroupRelationsByParentGroupRelationId, {
				pageIndex: data.PageIndex,
				pageSize:  data.PageSize || service.PageSize,
				parentGroupRelationId: data.ID || "00000000-0000-0000-0000-000000000000",
				operUserId: service.Cookie.Get("UserID"),
				accountType: 5,
				appId: service.Cookie.Get("AppID"),
				depth: false
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetRootData: function($scope, data, fun) {
			DataOperate.LoadData(Route.GroupRelationWrapper_GetGroupRelationsByPermission, {
				operUserId: service.Cookie.Get("UserID"),
				accountType: 5,
				appId: service.Cookie.Get("AppID"),
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadInfo: function($scope, data, fun) {
			if (data.ID) {
				DataOperate.LoadData(Route.Group_GetGroupById, {
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			} else {
				fun({
					AddUser: service.Cookie.Get("UserID"),
					AppId: service.Cookie.Get("AppID"),
					ModifyUser: service.Cookie.Get("UserID"),
					GroupRelationId: service.Cookie.Get("GroupRelationID"),
					TbBaseGroupRelation: {
						AddUser: service.Cookie.Get("UserID"),
						ModifyUser: service.Cookie.Get("UserID"),
						FK_ParentGroupId: data.TbBaseGroupRelation.FK_GroupId,
						ParentId: data.TbBaseGroupRelation.Id
					}
				});
			}
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.Group_DeleteGroup, data, function(data) {
				if (fun) fun(data);
			})
		},
		Save: function($scope, data, fun) {
			if ($scope.Id) {
				DataOperate.Edit(Route.Group_ModifyGroup, $scope.model, function(data) {
					if (fun) fun(data);
				})
			} else {
				DataOperate.Add(Route.Group_AddGroup, $scope.model, function(data) {
					if (fun) fun(data);
				})
			}
		},
		Move: function($scope, data, fun) {
			DataOperate.Edit(Route.Group_ModifyGroupRelation, data, function(data) {
				if (fun) fun(data);
			})
		},
		GetRootData2: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetGroups, {
				parentId: data.ParentID,
				appId: data.AppID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadSelectedData: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetGroupPermissions, {
				relationId: data.RelationID,
				relationType: data.RelationType,
				appId: $scope.Sel_AppID
			}, function(data) {
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
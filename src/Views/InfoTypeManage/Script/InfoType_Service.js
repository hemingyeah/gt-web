app.factory('InfoTypeService', function($http, service, DataOperate) {
	var ret = {
		Save: function($scope, data, fun) {},
		LoadData: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetClassifications, {
				relationId: data.RelationID,
				parentId: data.ParentID,
				relationType: data.RelationType,
				groupRelationId: "",
				appId: data.AppID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadSelectedData: function($scope, data, fun) {
			DataOperate.LoadData(Route.UserPermission_GetClassificationPermissions, {
				relationId: data.RelationID,
				parentId: data.ParentID,
				relationType: data.RelationType,
				groupRelationId: "",
				appId: data.AppID
			}, function(data) {
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
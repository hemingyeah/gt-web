app.factory('templateService', function($http, service, DataOperate) {
	var ret = {
		Save: function($scope,data, fun) {
			data.model.AppId = service.Cookie.Get("AppID");
			data.model.GroupRelationId = service.Cookie.Get("GroupRelationID");
			data.model.AddUser = service.Cookie.Get("UserID");
			data.model.ModifyUser = service.Cookie.Get("UserID");
			data.model.TemplateDetails.forEach(function(item){
				item.AddUser = service.Cookie.Get("UserID");
				item.ModifyUser = service.Cookie.Get("UserID");
				item.AppId = service.Cookie.Get("AppID");
				item.GroupRelationId = service.Cookie.Get("GroupRelationID");
			});
			DataOperate.Save(Route.Template_SaveTemplate, data.model, function(data) {
				if (fun) fun(data);
			})
		},
		DeleteInfo: function($scope, data, fun) {
			DataOperate.Delete(Route.Template_DeleteTemplate,data, function(data) {
				if (fun) fun(data);
			})
		},
		LoadData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Template_Getemplates, {
				groupRelationId: service.Cookie.Get("GroupRelationID"),
				appId: service.Cookie.Get("AppID")
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadDataDetailsById: function($scope, data, fun) {
			DataOperate.LoadData(Route.Template_GeTemplateById, {
				templateId: data.TemplateID,
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadDefaultData: function($scope, data, fun) {
			DataOperate.LoadData(Route.Template_GetDefaultTemplate,{

			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadDataIdsByParent: function($scope, data, fun) {
			DataOperate.LoadData(Route.DataDictionaryInstance_GetIds,{
				parentId:data.ParentId,
				beDeep:data.BeDeep
			}, function(data) {
				if (fun) fun(data);
			})
		},
		LoadDicDataByDicId: function($scope, data, fun) {
			DataOperate.LoadData(Route.DataDictionaryInstance_Get,{
				id:data.Id,
			}, function(data) {
				if (fun) fun(data);
			})
		},
		DownLoadTemp: function($scope, data, fun) {
			DataOperate.LoadData(Route.Import_GetGroupUserTemplate,{
				index:data.Index,
				templateId:data.TemplateId,
				groupId:data.GroupId
			}, function(data) {
				if (fun) fun(data);
			})
		}
	};
	return ret;
});
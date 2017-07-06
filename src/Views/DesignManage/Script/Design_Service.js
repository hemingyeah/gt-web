app
	.factory('DesignService', function($http, service, DataOperate) {
		var ret = {
			AddKidModel: function($scope, data, fun) {
				DataOperate.Add(Route.KitModel_Add, data, function(data) {
					if (fun) fun(data);
				})
			},
			//添加聚合
			ModifyRelation: function($scope, data, fun) {
				DataOperate.Edit(Route.KitModel_ModifyRelation, {
					FkDesignId: data.DesignID,
					FkModelId: data.ModelID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyKidModel: function($scope, data, fun) {
				DataOperate.Edit(Route.KitModel_Modify, data, function(data) {
					if (fun) fun(data);
				})
			},
			//模型下拉
			GetModelList: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitModel_GetModelList, {
					pluginId: data.PluginId,
					search: null
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDesign: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDesign, {
					designId: data.Id
				}, function(data) {
					if (fun) fun(data);
				})
			},
			AddDesign: function($scope, data, fun) {
				DataOperate.Add(Route.KitDesign_AddDesign, data, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyDesign: function($scope, data, fun) {
				DataOperate.Edit(Route.KitDesign_ModifyDesign, data, function(data) {
					if (fun) fun(data);
				})
			},
			//从模型中移除表
			DeleteRelation: function($scope, data, fun) {
				DataOperate.Delete(Route.KitModel_DeleteRelation, {
					designId: data.DesignID,
					modelId: data.ModelID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//删除表
			DeleteDesign: function($scope, data, fun) {
				DataOperate.Delete(Route.KitDesign_DeleteDesign, {
					designId: data.DesignID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//建立模型和表的关系
			AddRelation: function($scope, data, fun) {
				DataOperate.Add(Route.KitModel_AddRelation, data, function(data) {
					if (fun) fun(data);
				})
			},
			//KitModel/GetDesigns---获取插件下模型的表
			GetDesigns: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitModel_GetDesigns, {
					modelId: data.Id
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//GetDesignsByPluginId---获取插件下的表
			GetDesignsByPluginId: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDesignsByPluginId, {
					pluginId: data.Id
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDesignAttributes: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDesignAttributes, {
					designId: data.DesignID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDictionaryAttributes: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDictionaryAttributes, {
					designId: data.DesignID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			AddDesignAttribute: function($scope, data, fun) {
				DataOperate.Add(Route.KitDesign_AddDesignAttribute, data, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyDesignAttribute: function($scope, data, fun) {
				DataOperate.Edit(Route.KitDesign_ModifyDesignAttribute, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteDesignAttribute: function($scope, data, fun) {
				DataOperate.Delete(Route.KitDesign_DeleteDesignAttribute, {
					designAttributeId: data.DesignAttributeID,
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetPlugins: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetPlugins, {}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDataTypes: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDataTypes, {}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDesignKeys: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDesignKeys, {
					designId: data.DesignID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			AddDesignKey: function($scope, data, fun) {
				DataOperate.Add(Route.KitDesign_AddDesignKey, data, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyDesignKey: function($scope, data, fun) {
				DataOperate.Edit(Route.KitDesign_ModifyDesignKey, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteDesignKey: function($scope, data, fun) {
				DataOperate.Delete(Route.KitDesign_DeleteDesignKey, {
					designKeyId: data.DesignKeyID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetDesignIndexes: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitDesign_GetDesignIndexes, {
					designId: data.DesignID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			AddDesignIndex: function($scope, data, fun) {
				DataOperate.Add(Route.KitDesign_AddDesignIndex, data, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyDesignIndex: function($scope, data, fun) {
				DataOperate.Edit(Route.KitDesign_ModifyDesignIndex, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteDesignIndex: function($scope, data, fun) {
				DataOperate.Delete(Route.KitDesign_DeleteDesignIndex, {
					designIndexId: data.DesignIndexID,
				}, function(data) {
					if (fun) fun(data);
				})
			},
			CreateSolution: function($scope, data, fun) {
				DataOperate.Add(Route.KitDesign_CreateSolution, {
					ProjectName: data.ProjectName,
					ModelIds: data.PostData,
					CreateUserId: service.Cookie.Get("UserID")
				}, function(data) {
					if (fun) fun(data);
				});
			}
		};
		return ret;
	});
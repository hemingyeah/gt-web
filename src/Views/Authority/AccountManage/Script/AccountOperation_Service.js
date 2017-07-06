app.factory('AccountOperationService', function($http, service, DataOperate) {
	var ret = {
		GetAppList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountOperation_GetAppList, {}, function(data) {
				if (fun) fun(data);
			})
		},
		GetList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountOperation_GetList, {
				appId: data.AppID || service.Cookie.Get("AppID"), //应用Id
				parentPermissionType: data.ParentPermissionType, //功能类型(0:插件、1:菜單、2:功能)
				menuType: data.MenuType, //0:Web，1:PC，2:安卓，3:IOS
				parentId: data.ParentID //父ID
			}, function(data) {
				if (fun) fun(data);
			})
		},
		GetOperation: function($scope, data, fun) {
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.LoadData(Route.AccountOperation_GetPersonal, {
					relationId: data.RelationID,
					relationType: data.RelationType,
					menuType: data.MenuType || 0,
					appId: data.AppID || service.Cookie.Get("AppID")
				}, function(data) {
					if (fun) fun(data);
				});
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.LoadData(Route.AccountOperation_GetEnterprise, {
					relationId: data.RelationID,
					relationType: data.RelationType,
					menuType: data.MenuType,
					appId: data.AppID || service.Cookie.Get("AppID")
				}, function(data) {
					if (fun) fun(data);
				});
			}
		},
		SaveOperation: function($scope, data, fun) {
			$.extend(data, {
				appId: data.AppID || service.Cookie.Get("AppID")
			});
			
			//个人帐号
			if (data.RelationType === 0 || data.RelationType === 3) {
				DataOperate.Save(Route.AccountOperation_SavePersonal, {
					AppId: data.AppID || service.Cookie.Get("AppID"),
					relationId: data.RelationID,
					relationType: data.RelationType,
					menuType: data.MenuType,
					Permissions: data.Permissions
				}, function(data) {
					if (fun) fun(data);
				});
			}
			//企业帐号
			else if (data.RelationType === 1 || data.RelationType === 2) {
				DataOperate.Save(Route.AccountOperation_SaveEnterprise, {
					AppId: data.AppID || service.Cookie.Get("AppID"),
					relationId: data.RelationID,
					relationType: data.RelationType,
					menuType: data.MenuType,
					Permissions: data.Permissions
				}, function(data) {
					if (fun) fun(data);
				});
			}
		},
		GetPluginInstanceList: function($scope, data, fun) {
			DataOperate.LoadData(Route.AccountOperation_GetPluginInstanceList, {
				appId: data.AppID || service.Cookie.Get("AppID")
			}, function(data) {
				if (fun) fun(data);
			});
		}
	};
	return ret;
});
app
	.factory('ZookeeperConfigService', function($http, service, DataOperate) {
		var ret = {
			GetConfigs: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitConfig_GetConfigs, {
					serverId: data.ServerID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetConfigsByParentId: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitConfig_GetConfigsByParentId, {
					parentId: data.ParentID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetConfigServers: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitConfig_GetConfigServers, {}, function(data) {
					if (fun) fun(data);
				})
			},
			CreateConfig: function($scope, data, fun) {
				DataOperate.Add(Route.KitConfig_CreateConfig, data, function(data) {
					if (fun) fun(data);
				})
			},
			CreateConfigServer: function($scope, data, fun) {
				DataOperate.Add(Route.KitConfig_CreateConfigServer, data, function(data) {
					if (fun) fun(data);
				})
			},
			SaveConfig: function($scope, data, fun) {
				DataOperate.Edit(Route.KitConfig_SaveConfig, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteConfig: function($scope, data, fun) {
				DataOperate.Delete(Route.KitConfig_DeleteConfig, {
					server: data.Server,
					path: data.Path,
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			CopyConfigToServer: function($scope, data, fun) {
				DataOperate.Add(Route.KitConfig_CopyConfigToServer, {
					serverId: data.ServerID,
					id: data.ID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			DownloadConfig: function($scope, data, fun) {
				DataOperate.Delete(Route.KitConfig_DownloadConfig, {
					configId: data.ConfigID,
				}, function(data) {
					if (fun) fun(data);
				})
			}
		};
		return ret;
	});
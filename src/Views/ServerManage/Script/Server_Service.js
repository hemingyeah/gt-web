app
	.factory('ServerService', function($http, service, DataOperate) {
		var ret = {
			GetServers: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitServer_GetServers, {
					typeId: data.TypeID
				}, function(data) {
					if (fun) fun(data);
				})
			},
			GetServerTypes: function($scope, data, fun) {
				DataOperate.LoadData(Route.KitServer_GetServerTypes, {}, function(data) {
					if (fun) fun(data);
				})
			},
			AddServer: function($scope, data, fun) {
				DataOperate.Add(Route.KitServer_AddServer, data, function(data) {
					if (fun) fun(data);
				})
			},
			ModifyServer: function($scope, data, fun) {
				DataOperate.Edit(Route.KitServer_ModifyServer, data, function(data) {
					if (fun) fun(data);
				})
			},
			DeleteServer: function($scope, data, fun) {
				DataOperate.Delete(Route.KitServer_DeleteServer, {
					serverId: data.ServerID
				}, function(data) {
					if (fun) fun(data);
				})
			}
		};
		return ret;
	});
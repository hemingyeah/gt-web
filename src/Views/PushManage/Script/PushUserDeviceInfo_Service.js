app
	.factory('PushUserDeviceInfoService', function($http, service, DataOperate) {
		var ret = {
			LoadPageData: function($scope, data, fun) {
			    if ($scope.tree) {
			        var list = $scope.tree.getNodesByParam("ParentId", null);
			        var checkedList = $scope.tree.getCheckedNodes(true);
			        list.map(function(x) {
			            x.Items = [];
			            checkedList.forEach(function(obj) {
			                if (x.Id === obj.rId) {
			                    x.Items.push(obj);
			                }
			            })
			        })
			        $scope.model = {
			            DatabaseId: $scope.Id,
			            parameters: list
			        }
			        $scope.UiConfigService.CreateReport($scope, $.extend($scope.model, {
			            PageIndex: $scope.Page.Index
			        }), function(data) {
			            if (typeof data == "string") {
			                data = JSON.parse(data)
			            };
			            if (fun) fun(data);
			        })
			    } else {
			    	return;
			    }

			},
			//保存数据
			Save: function ($scope, data, fun) {
			    if (data.DataState === state.Add) {
			        DataOperate.Add(Route.AppPushSetting_PostAppPushSetting, {
			        	AppPlatformId: data.AppPlatformId,
			        	AppPlatformType: data.AppPlatformType,
			        	Sk: data.Sk,
			        	Ak: data.Ak,
			        	Url: data.Url,
			        	AddUser: data.AddUser,
			        	ModifyUser: data.ModifyUser
			        }, function(data) {
			            if (fun) fun(data);
			        });
			    } else {
			        DataOperate.Edit(Route.AppPushSetting_PutAppPushSetting, {
			        	AppPlatformId: data.AppPlatformId,
			        	AppPlatformType: data.AppPlatformType,
			        	Sk: data.Sk,
			        	Ak: data.Ak,
			        	Url: data.Url,
			        	AddUser: data.AddUser,
			        	ModifyUser: data.ModifyUser
			        }, function(data) {
			            if (fun) fun(data);
			        });
			    }
			},
			//单个删除资讯
			Delete: function($scope, data, fun) {
				DataOperate.Delete(Route.AppPushSetting_DeleteByAppId, {
					appId: data.Id,
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//获取资讯
			GetNewssByUserId: function($scope, data, fun) {
				DataOperate.LoadData(Route.News_GetNewssByUserId, {
					userId: service.userId,
					pageIndex: data.PageIndex,
					pageSize: data.PageSize || service.PageSize
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//推送资讯
			PostPushNews: function($scope, data, fun) {
				DataOperate.LoadData(Route.News_PostPushNews, $.extend(data, {
					GroupRelationId: service.groupRelationId,
					GroupRelationName: service.groupRelationName || "",
					AppId: data.AppID || service.appId,
					OperUserId: service.userId
				}), function(data) {
					service.msg.popover(data ? "推送成功！" : "推送失败！");
					if (fun) fun(data);
				})
			},
			GetNewsLevel: function($scope, data, fun) {
				DataOperate.LoadData(Route.News_GetNewsLevel, {}, function(data) {
					if (fun) fun(data);
				})
			},
			//单个删除资讯
			DeleteNewsById: function($scope, data, fun) {
				DataOperate.Delete(Route.News_DeleteNewsById, {
					NewsId: data.Id,
					deleteUserId: service.userId,
					deleteUserName: service.userName
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//批量删除资讯
			DeleteNews: function($scope, data, fun) {
				DataOperate.Delete(Route.News_DeleteNewss, {
					NewsIds: data,
					deleteUserId: service.userId,
					deleteUserName: service.userName
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//修改资讯
			PutNews: function($scope, data, fun) {
				DataOperate.Edit(Route.News_PutNews,
					$.extend(data, {
						AppId: data.AppID || service.appId,
						AddUser: service.userId,
						AddUserName: service.userName || "",
						GroupRelationId: service.groupRelationId,
						GroupRelationName: service.groupRelationName || ""
					}),
					function(data) {
						if (fun) fun(data);
					})
			},
			//添加资讯
			PostNews: function($scope, data, fun) {
				DataOperate.Add(Route.News_PostNews, $.extend(data, {
					AppId: data.AppID || service.appId,
					AddUser: service.userId,
					AddUserName: service.addUserName || "",
					GroupRelationId: service.groupRelationId,
					GroupRelationName: service.groupRelationName || "",
					PluginInstanceId: ""
				}), function(data) {
					if (fun) fun(data);
				})
			},
			//获取资讯
			LoadInfo: function($scope, data, fun) {
				if (data.ID) {
					DataOperate.LoadData(Route.News_GetNewsById, {
						NewsId: data.ID
					}, function(data) {
						if (fun) fun(data);
					})
				} else {
					if (fun)
						fun({});
				}
			}
		};
		return ret;
	});
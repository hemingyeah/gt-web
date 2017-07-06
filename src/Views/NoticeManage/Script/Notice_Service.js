app
	.factory('NoticeService', function($http, service, DataOperate) {
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
			//单个删除通知
			Delete: function($scope, data, fun) {
				DataOperate.Delete(Route.Notice1_DeleteNoticeById, {
					noticeId: data.Id,
					deleteUserId: service.Cookie.Get("UserID"),
					deleteUserName: service.Cookie.Get("UserName")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//获取通知
			GetNoticesByUserId: function($scope, data, fun) {
				DataOperate.LoadData(Route.Notice1_GetNoticesByUserId, {
					userId: service.Cookie.Get("UserID"),
					pageIndex: data.PageIndex,
					pageSize: data.PageSize || service.PageSize
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//推送通知
			PostPushNotice: function($scope, data, fun) {
				DataOperate.LoadData(Route.Notice1_PostPushNotice, $.extend(data, {
					AppId: data.AppID || service.Cookie.Get("AppID"),
					OperUserId: service.Cookie.Get("UserID")
				}), function(data) {
					service.msg.popover(data ? "推送成功！" : "推送失败！");
					if (fun) fun(data);
				})
			},
			GetNoticeLevel: function($scope, data, fun) {
				DataOperate.LoadData(Route.Notice1_GetNoticeLevel, {}, function(data) {
					if (fun) fun(data);
				})
			},
			//单个删除通知
			DeleteNoticeById: function($scope, data, fun) {
				DataOperate.Delete(Route.Notice1_DeleteNoticeById, {
					noticeId: data.Id,
					deleteUserId: service.Cookie.Get("UserID"),
					deleteUserName: service.Cookie.Get("UserName")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//批量删除通知
			DeleteNotices: function($scope, data, fun) {
				DataOperate.Delete(Route.Notice1_DeleteNotices, {
					noticeIds: data,
					deleteUserId: service.Cookie.Get("UserID"),
					deleteUserName: service.Cookie.Get("UserName")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//修改通知
			PutNotice: function($scope, data, fun) {
				DataOperate.Edit(Route.Notice1_PutNotice,
					$.extend(data, {
						AppId: data.AppID || service.Cookie.Get("AppID"),
						AddUser: service.Cookie.Get("UserID"),
						AddUserName: service.Cookie.Get("UserName") || "",
						GroupRelationId: service.Cookie.Get("GroupRelationID"),
						GroupRelationName: service.Cookie.Get("GroupRelationName") || ""
					}),
					function(data) {
						if (fun) fun(data);
					})
			},
			//添加通知
			PostNotice: function($scope, data, fun) {
				DataOperate.Add(Route.Notice1_PostNotice, $.extend(data, {
					AppId: data.AppID || service.Cookie.Get("AppID"),
					AddUser: service.Cookie.Get("UserID"),
					AddUserName: service.Cookie.Get("AddUserName") || "",
					GroupRelationId: service.Cookie.Get("GroupRelationID"),
					GroupRelationName: service.Cookie.Get("GroupRelationName") || ""
				}), function(data) {
					var data = $.extend($scope.model, {Id:data});
					if (fun) fun(data);
				})
			},
			//获取通知
			LoadInfo: function($scope, data, fun) {
				if (data.ID) {
					DataOperate.LoadData(Route.Notice1_GetNoticeById, {
						noticeId: data.ID
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
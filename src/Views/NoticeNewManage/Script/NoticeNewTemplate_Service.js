app
	.factory('NoticeNewTemplateService', function($http, service, DataOperate) {
		var ret = {
			LoadPageData: function($scope, data, fun) {
				if ($scope.tree) {
				    var dicConditions = {};
				    var list = $scope.tree.getNodesByParam("ParentId", null);
				    var checkedList = $scope.tree.getCheckedNodes(true);
				    list.map(function(x) {
				        checkedList.forEach(function(obj) {
				            if (x.Id === obj.rId) {
				                dicConditions[x.TypeValue] = obj.FkDictionaryId
				            }
				        })
				    })
				    DataOperate.LoadData(Route.NoticeTemplate_GetNoticeTemplateList, {
				        pageIndex: $scope.Page.Index,
				        pageSize: 50,
				        appId: service.Cookie.Get("AppID"),
				        actionUserId: service.Cookie.Get("UserID"),
				        dicConditions: dicConditions
				    }, function(data) {
				        if (fun) fun(data);
				    })
				} else {
				    return;
				}

			},
			//单个删除通知模板
			Delete: function($scope, data, fun) {
				DataOperate.Delete(Route.NoticeTemplate_DeleteNoticeTemplate, {
					noticeTemplateId: data.Id,
					actionUserId: service.Cookie.Get("UserID"),
					actionUserName: service.Cookie.Get("UserName")
				}, function(data) {
					if (fun) fun(data);
				})
			},
			//修改通知模板
			PutNoticeTemplate: function($scope, data, fun) {
				DataOperate.Edit(Route.NoticeTemplate_PutNoticeTemplate,
					$.extend(data, {
						AppId: data.AppID || service.Cookie.Get("AppID"),
						ModifyUser: service.Cookie.Get("UserID"),
						AddUserName: service.Cookie.Get("AddUserName") || "",
						GroupRelationId: service.Cookie.Get("GroupRelationID"),
						GroupRelationName: service.Cookie.Get("GroupRelationName") || ""
					}),
					function(data) {
						if (fun) fun(data);
					})
			},
			//添加通知模板
			PostNoticeTemplate: function($scope, data, fun) {
				DataOperate.Add(Route.NoticeTemplate_PostNoticeTemplate, $.extend(data, {
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
			//获取通知模板
			LoadInfo: function($scope, data, fun) {
				if (data.ID) {
					DataOperate.LoadData(Route.NoticeTemplate_GetNoticeTemplateById, {
						id: data.ID
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
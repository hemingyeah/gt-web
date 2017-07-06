app.factory('NoticeNewService', function($http, service, DataOperate) {
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
                DataOperate.LoadData(Route.Notice_GetNoticeList, {
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
        GetNoticeDimensions: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_GetNoticeDimensions, {
                dimensionsType: data.DimensionsType
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //单个删除通知
        Delete: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNotice, {
                noticeId: data.Id,
                actionUserId: service.Cookie.Get("UserID"),
                actionUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //获取通知
        GetNoticesByUserId: function($scope, data, fun) {
            DataOperate.LoadData(Route.Notice_GetNoticesByUserId, {
                userId: service.Cookie.Get("UserID"),
                pageIndex: data.PageIndex,
                pageSize: data.PageSize || service.PageSize
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //获取模板集合
        GetNoticeTemplateList: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeTemplate_GetNoticeTemplateList, {
                appId: service.Cookie.Get("AppID"),
                actionUserId: service.Cookie.Get("UserID"),
                dicConditions: 　{},
                pageIndex: data.PageIndex,
                pageSize: data.PageSize || service.PageSize
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //推送公开通知
        PostNoticeReleaseByPublicly: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleaseByPublicly, data, function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            });
        },
        //推送标签通知
        PostNoticeReleasePublishByTag: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleasePublishByTag, $.extend(data, {
                AppId: data.AppID || service.Cookie.Get("AppID"),
                OperUserId: service.Cookie.Get("UserID")
            }), function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            });
        },
        //推送人员通知
        PostNoticeReleasePublishByUser: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleasePublishByUser, data, function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            })
        },
        //推送群组通知
        PostNoticeReleasePublishByGroup: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleasePublishByGroup, data, function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            })
        },
        GetNoticeLevel: function($scope, data, fun) {
            DataOperate.LoadData(Route.Notice_GetNoticeLevel, {}, function(data) {
                if (fun) fun(data);
            })
        },
        //单个删除通知
        DeleteNoticeById: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNoticeById, {
                noticeId: data.Id,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //批量删除通知
        DeleteNotices: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNotices, {
                noticeIds: data,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //修改通知
        PutNotice: function($scope, data, fun) {
            DataOperate.Edit(Route.Notice_PutNotice,
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
            DataOperate.Add(Route.Notice_PostNotice, $.extend(data, {
                AppId: data.AppID || service.Cookie.Get("AppID"),
                AddUser: service.Cookie.Get("UserID"),
                AddUserName: service.Cookie.Get("AddUserName") || "",
                GroupRelationId: service.Cookie.Get("GroupRelationID"),
                GroupRelationName: service.Cookie.Get("GroupRelationName") || ""
            }), function(data) {
                var data = $.extend($scope.model, {
                    Id: data
                });
                if (fun) fun(data);
            })
        },
        //获取通知
        LoadInfo: function($scope, data, fun) {
            if (data.ID) {
                DataOperate.LoadData(Route.Notice_GetNoticeById, {
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
app.factory('NoticeNewbehaviorService', function($http, service, DataOperate) {
    var ret = {
        LoadPageData: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_GetNoticeReleaseListByNoticeId, {
                pageIndex: $scope.Page.Index,
                pageSize: 50,
                noticeId: $scope.data.Id
            }, function(data) {
                if (fun) fun(data);
            });
        }
    };
    return ret;
});

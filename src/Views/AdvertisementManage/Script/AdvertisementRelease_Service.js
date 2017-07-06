app.factory('AdvertisementreleaseService', function($http, service, DataOperate) {
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
                DataOperate.LoadData(Route.NoticeRelease_GetNoticeReleaseListByActionUserId, {
                    pageIndex: $scope.Page.Index,
                    pageSize: 50,
                    appId: service.Cookie.Get("AppID"),
                    actionUserId: service.Cookie.Get("UserID"),
                    dicConditions: dicConditions,
                    isIncludeNum: true
                }, function(data) {
                    var ss = [{
                        DisplayName: "已点赞",
                        Code: 3,
                        Filed: "Praise"
                    }, {
                        DisplayName: "已打分",
                        Code: 4,
                        Filed: "Mark"
                    }, {
                        DisplayName: "已评论",
                        Code: 5,
                        Filed: "Comment"
                    }, {
                        DisplayName: "已分享",
                        Code: 6,
                        Filed: "Share"
                    }, {
                        DisplayName: "已收藏",
                        Code: 7,
                        Filed: "Collection"
                    }, {
                        DisplayName: "已发送",
                        Code: 8,
                        Filed: "Sent"
                    }, {
                        DisplayName: "已阅读",
                        Code: 9,
                        Filed: "Red"
                    }]
                    if (data.List) {
                        data.List.forEach(function(obj, index){
                            obj.NoitceNumberationList.forEach(function (obj1, index1){
                                var code = service.convert.getAttributeByOtherAttr(obj1.NumerationType, "Code", "Filed", ss);
                                obj[code] = {
                                   NumerationValue: obj1.NumerationValue,
                                   NumerationType: obj1.NumerationType
                                };
                            })
                        });
                    }
                    if (fun) fun(data);
                })
            } else {
                return;
            }

        },
        //单个撤销通知发布
        PutNoticeReleaseRevoke: function($scope, data, fun) {
            DataOperate.Common(Route.NoticeRelease_PutNoticeReleaseRevoke, {
                noticeReleaseId: data.Id,
                actionUserId: service.Cookie.Get("UserID"),
                actionUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //单个删除通知发布
        Delete: function($scope, data, fun) {
            DataOperate.Delete(Route.NoticeRelease_DeleteNoticeRelease, {
                noticeReleaseId: data.Id,
                actionUserId: service.Cookie.Get("UserID"),
                actionUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //获取通知发布
        GetNoticesByUserId: function($scope, data, fun) {
            DataOperate.LoadData(Route.Notice_GetNoticesByUserId, {
                userId: service.Cookie.Get("UserID"),
                pageIndex: data.PageIndex,
                pageSize: data.PageSize || service.PageSize
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //推送通知发布
        PostPushNotice: function($scope, data, fun) {
            DataOperate.LoadData(Route.Notice_PostPushNotice, $.extend(data, {
                AppId: data.AppID || service.Cookie.Get("AppID"),
                OperUserId: service.Cookie.Get("UserID")
            }), function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            })
        },
        GetNoticeLevel: function($scope, data, fun) {
            DataOperate.LoadData(Route.Notice_GetNoticeLevel, {}, function(data) {
                if (fun) fun(data);
            })
        },
        //单个删除通知发布
        DeleteNoticeById: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNoticeById, {
                noticeId: data.Id,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //批量删除通知发布
        DeleteNotices: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNotices, {
                noticeIds: data,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //修改通知发布
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
        //添加通知发布
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
        //获取通知发布
        LoadInfo: function($scope, data, fun) {
            if (data.ID) {
                DataOperate.LoadData(Route.Notice_GetNoticeById, {
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
app.factory('AdvertisementreleasebehaviorService', function($http, service, DataOperate) {
    var ret = {
        LoadPageData: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_GetNoticeReleaseListByNoticeId, {
                pageIndex: $scope.Page.Index,
                pageSize: 50,
                noticeId: $scope.data.FkNoticeId
            }, function(data) {
                if (fun) fun(data);
            });
        },
        LoadData: function ($scope, data, fun){
            DataOperate.LoadData(Route.NoticeRelease_GetActionListByActionType, {
                pageIndex: $scope.Page.Index,
                pageSize: 50,
                actionType: $scope.rationType,
                noticeReleaseId: data.Id
            }, function(data) {
                if (fun) fun(data);
            });
        }
    };
    return ret;
});

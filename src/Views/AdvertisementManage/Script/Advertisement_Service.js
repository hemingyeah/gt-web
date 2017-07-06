app.factory('AdvertisementService', function($http, service, DataOperate) {
    var ret = {
        LoadPageData: function($scope, data, fun) {
            if ($scope.tree) {
                var dicConditions = {};
                var list = $scope.tree.getNodesByParam("ParentId", null);
                var checkedList = $scope.tree.getCheckedNodes(true);
                // list.map(function(x) {
                //     checkedList.forEach(function(obj) {
                //         if (x.Id === obj.rId) {
                //             dicConditions[x.TypeValue] = obj.FkDictionaryId
                //         }
                //     })
                // })
                DataOperate.LoadData(Route.CrouselAd_GetCrouselAdList, {
                    pageIndex: $scope.Page.Index,
                    pageSize: 50,
                    appId: service.Cookie.Get("AppID"),
                    modifyUserId: service.Cookie.Get("UserID"),
                    // dicConditions: dicConditions
                    useTypeId: checkedList.length ? checkedList[0].Id : service.GuidNull
                }, function(data) {
                    if (fun) fun(data);
                })
            } else {
                return;
            }

        },
        //保存数据
        Save: function($scope, data, fun) {
            if (data.DataState === state.Add) {
                DataOperate.Add(Route.CrouselAd_PostCrouselAd, $.extend(data, {
                        Image: $scope.imgUrl.replace(new RegExp("http://image-gtintel.oss-cn-hangzhou.aliyuncs.com/", "gm"), ""),
                        TypeId: "",
                        UseTypeName: data.UseTypeIdName,
                    }), function(data) {
                        var data = $.extend($scope.model, {
                            Id: data
                        });
                        if (fun) fun(data);
                    })
                    // DataOperate.Add(Route.DataDictionaryInstance_Add, data, function(data) {
                    //     if (fun) fun(data);
                    // });
            } else {
                DataOperate.Common(Route.CrouselAd_PutCrouselAd, {
                    crouselAdId: data.Id
                }, function(data) {
                    if (fun) fun(data);
                },$.extend(data, {
                   UseTypeName: data.UseTypeIdName 
                }))
            }
        },
        //单个删除轮播广告
        Delete: function($scope, data, fun) {
            DataOperate.Delete(Route.CrouselAd_DeleteCrouselAd, {
                crouselAdId: data.Id,
                modifyUserId: service.Cookie.Get("UserID"),
                modifyUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        GetNoticeDimensions: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_GetNoticeDimensions, {
                dimensionsType: data.DimensionsType
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //获取轮播广告
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
        //推送公开轮播广告
        PostNoticeReleaseByPublicly: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleaseByPublicly, data, function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            });
        },
        //推送标签轮播广告
        PostNoticeReleasePublishByTag: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleasePublishByTag, $.extend(data, {
                AppId: data.AppID || service.Cookie.Get("AppID"),
                OperUserId: service.Cookie.Get("UserID")
            }), function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            });
        },
        //推送人员轮播广告
        PostNoticeReleasePublishByUser: function($scope, data, fun) {
            DataOperate.LoadData(Route.NoticeRelease_PostNoticeReleasePublishByUser, data, function(data) {
                service.msg.popover(data ? "推送成功！" : "推送失败！");
                if (fun) fun(data);
            })
        },
        //推送群组轮播广告
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
        //单个删除轮播广告
        DeleteNoticeById: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNoticeById, {
                noticeId: data.Id,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //批量删除轮播广告
        DeleteNotices: function($scope, data, fun) {
            DataOperate.Delete(Route.Notice_DeleteNotices, {
                noticeIds: data,
                deleteUserId: service.Cookie.Get("UserID"),
                deleteUserName: service.Cookie.Get("UserName")
            }, function(data) {
                if (fun) fun(data);
            })
        },
        //获取轮播广告
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
app.factory('AdvertisementbehaviorService', function($http, service, DataOperate) {
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

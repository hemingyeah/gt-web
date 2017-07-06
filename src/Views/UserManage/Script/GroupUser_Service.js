app
	.factory('userService', function ($http, service, DataOperate) {
	    var ret = {
	        DeleteInfo: function ($scope, data, fun) {
	            DataOperate.Delete(Route.User_DeleteUser, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        //导入历史
	        GetImportList: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.Import_GetImportList, {
	                adduserId: service.Cookie.Get("UserID"),
	                groupRelationId: service.GuidNull,
	                appId: service.Cookie.Get("AppID"),
	                pageIndex: data.PageIndex,
	                pageSize: data.PageSize || service.PageSize
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        PostGroupUserAllInfo: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PostGroupUserAllInfo, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        PostUserBaseInfo: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PostUserBaseInfo, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        Save: function ($scope, data, fun) {
	            if (data.DataState === state.Add) {
	                var checkedNodes = $scope.tree.getCheckedNodes();
	                if (checkedNodes.length === 0) {
	                    service.msg.alert("请选择组织节点！");
	                    return;
	                }
	                data.GroupRelationIds = [];
	                checkedNodes.forEach(function (obj) {
	                    data.GroupRelationIds.push(obj.Id);
	                });
	                DataOperate.Save(Route.GroupUser_PostGroupUserExt, data, function (data) {
	                    if (fun) fun(data);
	                });
	            } else {
	                DataOperate.Save(Route.GroupUser_PutGroupUserExt, data, function (data) {
	                    if (fun) fun(data);
	                });
	            }
	        },
	        // PutGroupUserTaggings: function ($scope, data, fun) {
	        //     DataOperate.Save(Route.GroupUser_PutGroupUserTaggings, data, function (data) {
	        //         if (fun) fun(data);
	        //     });
	        // },
	        PostGroupUserTagging: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PostGroupUserTagging, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        PostGroupUserExAttributes: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PostGroupUserExAttributes, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        PostGroupUserValidCodes: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PostGroupUserValidCodes, data, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        LoadData: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.GroupUser_GetUsersByGroupId, {
	                groupRelationId: $scope.S_TreeNode.FK_GroupRelationId
	            }, function (data) {
	                $scope.data = data;
	                if (fun) fun(data);
	            });
	        },
	        //根据人的id获取所在组的信息
	        GetGroupUsersByUserId: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.GroupUserWrapper_GetGroupUsersByUserId, {
	                userId: data.UserId,
	                operUserId: service.Cookie.Get("UserID"),
	                accountType: 5,
	                appId: service.Cookie.Get("AppID")
	            }, function (data) {
	                if (fun) fun(data);
	            })
	        },
	        //删除群组中的人员
	        Delete: function ($scope, data, fun) {
	            var ids = [];
	            if ($.isArray(data)) {
	                data.forEach(function (obj) {
	                    ids.push({ UserId: obj.User.Id, GroupRelationId: obj.GroupRelationId });
	                });
	            } else {
	                ids.push({ UserId: data.User.Id, GroupRelationId: data.GroupRelationId });
	            }
	            DataOperate.Delete(Route.GroupUser_DeleteGroupUser, {
	                AppId: service.Cookie.Get("AppID"),
	                IdGuids: ids,
	                OperUserGuid: service.Cookie.Get("UserID"),
	                AccountType: 5
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        //获取标签
	        GetGeneralTaggings: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.TaggingWrapper_GetGeneralTaggings, {
	                operUserId: service.Cookie.Get("UserID"),
	                appId: service.Cookie.Get("AppID"),
	                accountType: 5
	            }, function (data) {
	                if (fun) fun(data);
	            })
	        },
	        //加载组中人员
	        LoadPageData: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.GroupUser_GetGroupUsers, {
	                groupRelationId: data.Param.Id,
	                pageIndex: data.PageIndex || 1,
	                pageSize: data.PageSize,
	                name: data.Param.filterModel && data.Param.filterModel.hasOwnProperty("GroupUserName") ? data.Param.filterModel["GroupUserName"].filter : "",
	                phone: data.Param.filterModel && data.Param.filterModel.hasOwnProperty("Key") ? data.Param.filterModel["Key"].value : "",
	                groupUserTagIds: "",
	                operUserId: service.Cookie.Get("UserID"),
	                accountType: 5,
	                appId: service.Cookie.Get("AppID"),
	                bDeep: !$scope.viewCurrentNodeData
	            }, function (data) {
	                if (fun) fun(data);
	            })
	        },
	        LoadInfo: function ($scope, data, fun) {
	            if (data.item) { //编辑
	                DataOperate.LoadData(Route.User_GetUserInfo, {
	                    // userId: data.item.UserAttribute.FK_UserId
	                }, function (data) {
	                    if (fun) fun(data);
	                })
	            } else { //添加

	            }
	        },
	        PutGroupUserValidCodes: function ($scope, data, fun) {
	            DataOperate.Save(Route.GroupUser_PutGroupUserValidCodes, data, function (data) {
	                if (fun) fun(data);
	            });
	        }
	    };
	    return ret;
	});
app
	.factory('groupUserVipCodeService', function ($http, service, DataOperate) {
	    var ret = {
	        Save: function ($scope, data, fun) {

	            DataOperate.Save(Route.GroupUser_PutGroupUserValidCodes, data.data, function (data) {
	                if (fun) fun(data);
	            });
	        }
	    };
	    return ret;
	});
app
	.factory('groupUserBindService', function ($http, service, DataOperate) {
	    var ret = {
	        Save: function ($scope, data, fun) {
	            var checkedNodes = $scope.tree.getCheckedNodes();
	            if (checkedNodes.length === 0) {
	                service.msg.alert("请选择组织节点！");
	                return;
	            }
	            var currentData = [];
	            checkedNodes.forEach(function (obj) {
	                data.forEach(function (groupUser) {
	                    var tempObj = {};
	                    angular.copy(groupUser, tempObj);
	                    tempObj.GroupRelationId = obj.Id;
	                    currentData.push(tempObj);
	                });

	            });
	            DataOperate.Save(Route.GroupUser_PostGroupUser, currentData, function (data) {
	                if (fun) fun(data);
	            });
	        }
	    };
	    return ret;
	});
app
	.factory('groupUserTagService', function ($http, service, DataOperate) {
	    var ret = {
	        Save: function ($scope, data, fun) {
	            if (!data.Operations || data.Operations.length === 0) {
	                return service.msg.alert("请选择标签！");
	            }
	            var currentData = [];
	            data.Operations.forEach(function (obj) {
	                data.data.forEach(function (groupUser) {
	                    var tempObj = {};
	                    angular.copy(groupUser, tempObj);
	                    tempObj.TagId = obj.Id;
	                    currentData.push(tempObj);
	                });
	            });

	            DataOperate.Save(Route.GroupUser_PostGroupUserTagging, currentData, function (data) {
	                if (fun) fun(data);
	            });
	        }
	    };
	    return ret;
	});

app
    .factory('CurrentGroupUserEditService', function ($http, service, DataOperate) {
        var ret = {
            Save: function ($scope, data, fun) {

                var currentData = [];
                currentData.push(data);
                DataOperate.Save(Route.GroupUser_PostGroupUser, currentData, function (data) {
                    if (fun) fun(data);
                });
            }
        };
        return ret;
    });
app
	.factory('groupService', function ($http, service, DataOperate) {
	    var ret = {
	        //保存节点
	        Save: function ($scope, data, fun) {
	            if (data.DataState === state.Add) {
	                DataOperate.Save(Route.Group_PostGroupRelationBaseInfo, {
	                    DtoGroupRelation: data,
	                    VipCode: data.VipCode
	                }, function (data) {
	                    if (fun) fun(data);
	                });
	            } else {
	                DataOperate.Save(Route.Group_PutGroupRelationBaseInfo, data, function (data) {
	                    if (fun) fun(data);
	                });
	            }
	        },
	        //加载树数据
	        LoadData: function ($scope, data, fun) {

	            DataOperate.LoadData(Route.Group_GetGroupRelationsByPermission, {
	                operUserId: service.Cookie.Get("UserID"),
	                accountType: 5,
	                appId: service.Cookie.Get("AppID")
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        //加载树子数据
	        LoadChildData: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.Group_GetGroupRelationsByParentGroupRelationId, {
	                pageIndex: 1,
	                pageSize: 999,
	                operUserId: $scope.gridOptions.event.userId,
	                accountType: 5,
	                appId: $scope.gridOptions.event.appId,
	                parentGroupRelationId: data.Id,
	                depth: false
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        //删除组
	        Delete: function ($scope, data, fun) {
	            var ids = [];
	            if ($.isArray(data)) {
	                data.forEach(function (obj) {
	                    if (obj.RgtId - obj.LftId > 0) {
	                        service.msg.alert("只有可以删除子节点！");
	                        return;
	                    }
	                    ids.push(obj.Id);
	                });
	            } else {
	                if (data.RgtId - data.LftId > 0) {
	                    service.msg.alert("只有可以删除子节点！");
	                    return;
	                }
	                ids.push(data.Id);
	            }
	            DataOperate.Delete(Route.Group_DeleteGroupRelationBaseInfo, {
	                AppId: service.Cookie.Get("AppID"),
	                IdGuids: ids,
	                OperUserGuid: service.Cookie.Get("UserID")
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        },
	        //获取组Vip码
	        GetVipCode: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.Group_GetVipCode, {
	                appId: service.Cookie.Get("AppID"),
	                groupRelationId: data,
	                operUserId: service.Cookie.Get("UserID")
	            }, function (data) {
	                if (fun) fun(data);
	            });
	        }
	    };
	    return ret;
	});

app
	.factory('groupRelationService', function ($http, service, DataOperate) {
	    var ret = {
	        //保存节点
	        Save: function ($scope, data, fun) {
	            var checkNode = $scope.tree.getCheckedNodes(true);
	            if (!checkNode || checkNode.length === 0) {
	                service.msg.alert("请选择父节点！");
	                return;
	            }
	            var groupRelation = {
	                DtoGroupRelations: data,
	                GroupRelationId: checkNode[0].Id
	            };
	            DataOperate.Save(Route.Group_PutGroupRelationOnly, groupRelation, function (result) {
	                if (result.length > 0) {
	                    $scope.isClose = false;
	                    service.msg.alert("存在错误数据，请查看列表！");
	                    data.forEach(function(obj) {
	                        obj.IsSuccessful = true;
	                    });
	                    var dic = data.toDictionary();
	                    result.forEach(function (obj) {
	                        if (dic.hasOwnProperty(obj.DtoGroupRelation.Id)) {
	                            dic[obj.DtoGroupRelation.Id].MessageInfo = obj.MessageInfo;
	                            dic[obj.DtoGroupRelation.Id].IsSuccessful = false;
	                        }
	                    });
	                    $scope.gridOptions.api.onNewRows();
	                    return;
	                }
	                if (fun) fun(result);
	            });
	        }
	    };
	    return ret;
	});
//新通知列表
app.controller('NoticeNewCtrl', function($scope, $sce, $compile, Dialog, NoticeNewService, manageService, RoleService, service) {
    $scope.Page = {
        Index: 1,
        Count: 1
    };
    $scope.showTile = function(data, eventObj) {
        if (!data) return;
        data.DataState = state.Add;
        Dialog.Show("/views/NoticeNewManage/NoticeNewbehaviorManage.html", "NoticeNewbehaviorManageCtrl", "lg", {
                data: function() {
                    return data;
                }
            }, function(result) {
                if (result) {
                    $scope.event.Search();
                }
            })
            // eventObj.stopPropagation();
    }
    $scope.dataService = NoticeNewService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "通知标题",
            field: "Title",
            width: 300,
            filter: "text",
            filterParams: {
                apply: true
            },
            cellRenderer: function(params) {
                var div = "<a ng-model='data' ng-click='showTile(data, $event)'>" + params.data.Title + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "应用类型",
            field: "UseTypeName",
            width: 200
        }, {
            headerName: "推送次数",
            field: "ReleaseNum",
            width: 200
        }, {
            headerName: "添加时间",
            field: "AddTime",
            width: 200,
            cellRenderer: $scope.dateTimeToFormatFunc
        }, {
            headerName: '操作',
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.operCellRendererFunc
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);

    var manage = manageService.constructor($scope, $scope.gridOptions, "NoticeNewEditCtrl", "/views/NoticeNewManage/NoticeNewEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        GroupPush: function(data) {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
            if (seletedData.length === 0) {
                service.msg.alert("请选择通知！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送通知！");
            } else {
                Dialog.Show("/views/NoticeNewManage/NoticeNewGroupPush.html", "NoticeNewGroupPushCtrl", "lg", {
                    SeletedData: function() {
                        return seletedData;
                    },
                    row: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        $scope.gridOptions.event.LoadData();
                    }
                })
            }
        },
        PersonalPush: function(data) {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData)
            if (seletedData.length === 0) {
                service.msg.alert("请选择通知！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送通知！");
            } else {
                Dialog.Show("/views/NoticeNewManage/NoticeNewPersonalPush.html", "NoticeNewPersonalPushCtrl", "lg", {
                    SeletedData: function() {
                        return seletedData;
                    },
                    row: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        $scope.gridOptions.event.LoadData();
                    }
                })
            }
        },
        TagPush: function(data) {

        },
        PublicPush: function() {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData)
                // var selectedNodes = $scope.tree.getCheckedNodes(true);
            if (seletedData.length === 0) {
                service.msg.alert("请选择通知！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送通知！");
            } else {
                Dialog.Show("/views/NoticeNewManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

                }, function(result) {
                    if (result) {
                        var NoticeRelease = {};
                        (seletedData || []).map(function(obj, index) {
                            NoticeRelease = $.extend({}, {
                                FkNoticeId: obj.Id,
                                FkNoticeLevelId: result.FkDimensionsId,
                                AppId: service.Cookie.Get("AppID"),
                                AddUser: service.Cookie.Get("UserID"),
                                GroupRelationId: service.Cookie.Get("GroupRelationID"),
                                GroupRelationName: service.Cookie.Get("GroupRelationName"),
                                AddUserName: service.Cookie.Get("AddUserName") || "",
                                TypeId: "",
                                DataSource: 0
                            });
                            return NoticeRelease;
                        });
                        NoticeNewService.PostNoticeReleaseByPublicly($scope, NoticeRelease, function(data) {
                            $scope.data = data.List;
                            $scope.Page.Count = data.Num;
                            $scope.gridOptions.event.LoadData();
                        });
                    }
                })
            }
        }
    });
});
//新通知编辑
app.controller('NoticeNewEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, NoticeNewService, data) {
    $scope.model = data;
    $scope.event = {
        Save: function() {
            $scope.model.Context = $scope.editor.latestHtml;
            // var ImgList = $('.richtext .NoticeNew');
            // var ImgSrcList = [];
            // angular.forEach(ImgList, function(obj, index) {
            //     ImgSrcList.push(obj.currentSrc)
            // });
            // $scope.model.PhotoNames = ImgSrcList.join().replace(new RegExp("http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/", "gm"), "");
            if ($scope.model.Id) {
                NoticeNewService.PutNotice($scope, $scope.model, function(data) {
                    $modalInstance.close($scope.model);
                });
            } else {
                NoticeNewService.PostNotice($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    NoticeNewService.LoadInfo($scope, {
        ID: $scope.model.Id
    }, function(data) {
        if (data.Id) {
            $scope.editor.html('<p>' + data.Context + '</p>');
        }
        $scope.model = data;
    });
    //监控通知模板类别
    $scope.$watch("model.FkNoticeTemplateId", function(newval, oldval) {
        var selectedData;
        if (newval !== oldval) {
            selectedData = $scope.noticeTemplates.filter(function(obj) {
                return obj.Id === newval;
            });
            $scope.editor.html('<p>' + selectedData[0].Context + '</p>');
        };
    });
    //获取模板集合
    NoticeNewService.GetNoticeTemplateList($scope, {
        PageIndex: $scope.Page.Index,
        PageSize: 99
    }, function(data) {
        $scope.noticeTemplates = data.List;
    });
});
//个人通知
app.controller('NoticeNewPersonalPushCtrl', function($scope, $modal, $modalInstance, $sce, Dialog, NoticeNewService, service, RoleService, manageService, SeletedData) {
    $scope.SeletedData = SeletedData;
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        Push: function() {
            Dialog.Show("/views/NoticeNewManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

            }, function(result) {
                if (result) {
                    var selectedNodes = $scope.getCheckedData($scope.gridOptionsUser.rowData);
                    var GroupUserList = [];
                    var NoticeRelease = {};
                    ($scope.SeletedData || []).map(function(obj, index) {
                        NoticeRelease = $.extend({}, {
                            FkNoticeId: obj.Id,
                            FkNoticeLevelId: result.FkDimensionsId,
                            AppId: service.Cookie.Get("AppID"),
                            AddUser: service.Cookie.Get("UserID"),
                            GroupRelationId: service.Cookie.Get("GroupRelationID"),
                            GroupRelationName: service.Cookie.Get("GroupRelationName"),
                            AddUserName: service.Cookie.Get("AddUserName") || "",
                            TypeId: "",
                            DataSource: 0
                        });
                        return NoticeRelease;
                    })

                    selectedNodes.map(function(obj, index) {
                        GroupUserList.push({
                            FkUserId: obj.UserId,
                            UserName: obj.GroupUserName,
                            FkGroupRelationId: obj.GroupRelationId,
                            UserPhoto: obj.GroupUserPhoto || ""
                        })
                        return GroupUserList;
                    })
                    NoticeNewService.PostNoticeReleasePublishByUser($scope, {
                        NoticeRelease: NoticeRelease,
                        GroupUserList: GroupUserList
                    }, function(data) {
                        $scope.data = data.List;
                        $scope.Page.Count = data.Num;
                        $modalInstance.close(data)
                    });
                }
            })
        }
    };
    $scope.dataService = NoticeNewService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "主题",
            field: "Title",
            width: 300
        }]); //默认值eventName: "gridOptions.event"
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        rowData: $scope.SeletedData,
        onAfterFilterChanged: function() {
            var filterModel = $scope.gridOptions.api.getFilterModel();
            if (filterModel && Object.keys(filterModel).length > 0) {
                $scope.search = filterModel.DisplayName.filter;
            } else {
                $scope.search = "";
            }
            $scope.gridOptions.event.LoadTreeData();
        }
    }
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "GroupOperateCtrl", "/views/UserManage/GroupEdit.html");

    $scope.gridOptions.event = $.extend(manage, {
        Add: false,
        DeleteAllSelect: false
    });
});
//群组通知
app.controller('NoticeNewGroupPushCtrl', function($scope, service, $modal, $modalInstance, service, NoticeNewService, Dialog, RoleService, manageService, SeletedData) {
    $scope.SeletedData = SeletedData;
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        Push: function() {
            Dialog.Show("/views/NoticeNewManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

            }, function(result) {
                if (result) {
                    var selectedNodes = $scope.tree.getCheckedNodes(true);
                    var SourseIdList = [];
                    var NoticeRelease = {};
                    ($scope.SeletedData || []).map(function(obj, index) {
                        NoticeRelease = $.extend({}, {
                            FkNoticeId: obj.Id,
                            FkNoticeLevelId: result.FkDimensionsId,
                            AppId: service.Cookie.Get("AppID"),
                            AddUser: service.Cookie.Get("UserID"),
                            GroupRelationId: service.Cookie.Get("GroupRelationID"),
                            GroupRelationName: service.Cookie.Get("GroupRelationName"),
                            AddUserName: service.Cookie.Get("AddUserName") || "",
                            TypeId: "",
                            DataSource: 0
                        });
                        return NoticeRelease;
                    })

                    selectedNodes.map(function(obj, index) {
                        SourseIdList.push(obj.Id)
                        return SourseIdList;
                    })
                    NoticeNewService.PostNoticeReleasePublishByGroup($scope, {
                        NoticeRelease: NoticeRelease,
                        SourseIdList: SourseIdList
                    }, function(data) {
                        $scope.data = data.List;
                        $scope.Page.Count = data.Num;
                        $modalInstance.close(data)
                    });
                }
            })
        }
    };
    $scope.dataService = NoticeNewService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "主题",
            field: "Title",
            width: 300,
        }, {
            headerName: "来源",
            field: "Source",
            width: 200
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        rowData: $scope.SeletedData
    }
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "GroupOperateCtrl", "/views/UserManage/GroupEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        Add: false,
        DeleteAllSelect: false
    });
});
//标签通知
app.controller('NoticeNewTagCtrl', function($scope, NoticeNewService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            NoticeNewService.GetNoticeNewsByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            NoticeNewService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
});
//新通知行为列表
app.controller('NoticeNewbehaviorManageCtrl', function($scope, $sce, $modalInstance, $compile, Dialog, NoticeNewbehaviorService, manageService, RoleService, service, data) {
    $scope.dataService = NoticeNewbehaviorService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.data = data;
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "通知标题",
            field: "NoticeTitle",
            width: 300,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "发布时间",
            field: "ReleaseTime",
            width: 200,
            cellRenderer: $scope.dateTimeToFormatFunc
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);

    var manage = manageService.constructor($scope, $scope.gridOptions, "NoticeNewreleaseEditCtrl", "/views/NoticeNewManage/NoticeNewEdit.html");
    $scope.gridOptions.event = $.extend(manage, {});
    $scope.gridOptions.event.Add = false;
    delete $scope.gridOptions.event.EditInfo;//移除编辑功能
    $scope.gridOptions.event.DeleteAllSelect = false;
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        }
    }
})
app.controller('NoticeLevelCtrl', function($scope, $modal, $modalInstance, NoticeNewService) {
    $scope.model = {};
    $scope.event = {
        Save: function() {
            $modalInstance.close($scope.model);
        },
        Close: function() {
            $modalInstance.close();
        }
    };
    $scope.eventName = {
        Save: "确定"
    }
    NoticeNewService.GetNoticeDimensions($scope, {
        DimensionsType: 2
    }, function(data) {
        $scope.Dimensions = data.DimensionsChildren;
        // $scope.Page.Count = data.Num;
    });
});
app.controller('NoticeNewViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});

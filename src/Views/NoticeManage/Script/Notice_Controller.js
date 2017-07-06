//基础通知列表
app.controller('NoticeCtrl', function($scope, $sce, Dialog, NoticeService, manageService, RoleService, service) {
        $scope.dataService = NoticeService;
        $scope.roleSerivce = RoleService;

        manageService.dataGridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat(
            [{
                headerName: "主题",
                field: "Title",
                width: 300,
                filter: "text",
                filterParams: {
                    apply: true
                }
            }, {
                headerName: "来源",
                field: "Source",
                width: 200
            }, {
                headerName: "通知级别名称",
                field: "NoticeLevelName",
                suppressMenu: true
            }, {
                headerName: "评分总条数",
                field: "StarCount",
                suppressMenu: true
            }, {
                headerName: "评论总条数",
                field: "CommentCount",
                suppressMenu: true
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


        var manage = manageService.constructor($scope, $scope.gridOptions, "NoticeEditCtrl", "/views/NoticeManage/NoticeEdit.html");
        $scope.gridOptions.event = $.extend(manage, {
            GroupPush: function(data) {
                var seletedData = $scope.getCheckedData($scope.gridOptions.rowData)
                if (seletedData.length === 0) {
                    service.msg.alert("请选择通知！");
                } else if (seletedData.length !== 1){
                    service.msg.alert("请逐条推送通知！");
                }else{
                    Dialog.Show("/views/NoticeManage/NoticeGroupPush.html", "NoticeGroupPushCtrl", "lg", {
                        SeletedData: function() {
                            return seletedData;
                        },
                        row: function() {
                            return data;
                        }
                    }, function(result) {
                        if (result) {
                            $scope.event.Search();
                        }
                    })
                }
            },
            PersonalPush: function(data) {
                var seletedData = $scope.getCheckedData($scope.gridOptions.rowData)
                if (seletedData.length === 0) {
                    service.msg.alert("请选择通知！");
                } else if (seletedData.length !== 1){
                    service.msg.alert("请逐条推送通知！");
                }else{
                    Dialog.Show("/views/NoticeManage/NoticePersonalPush.html", "NoticePersonalPushCtrl", "lg", {
                        SeletedData: function() {
                            return seletedData;
                        },
                        row: function() {
                            return data;
                        }
                    }, function(result) {
                        if (result) {
                            $scope.event.Search();
                        }
                    })
                }
            },
            TagPush: function(data) {
                // Dialog.Show("/views/TecSchemeManage/DetailIndex.html", "DetailIndexCtrl", "lg", {
                //     Id: function() {
                //         return data.Id;
                //     },
                //     row: function() {
                //         return data;
                //     }
                // }, function(result) {
                //     if (result) {
                //         $scope.event.Search();
                //     }
                // })
            }
        });
    })
//基础通知编辑
app.controller('NoticeEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, NoticeService, data) {
    $scope.model = data;
    $scope.event = {
        Save: function() {
            $scope.model.Content = $scope.editor.latestHtml;
            var ImgList = $('.richtext .notice');
            var ImgSrcList = [];
            angular.forEach(ImgList, function(obj, index) {
                ImgSrcList.push(obj.currentSrc)
            });
            $scope.model.PhotoNames = ImgSrcList.join().replace(new RegExp("http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/", "gm"), "");
            if ($scope.model.Id) {
                NoticeService.PutNotice($scope, $.extend($scope.model, {
                    Id: $scope.Id
                }), function(data) {
                    $modalInstance.close(data);
                });
            } else {
                NoticeService.PostNotice($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    NoticeService.LoadInfo($scope, {
        ID: $scope.model.Id
    }, function(data) {
        if (data.Id) {
            $scope.editor.html('<p>' + data.Content + '</p>');
        }
        $scope.model = data;
    });
})
//个人通知
app.controller('NoticePersonalPushCtrl', function($scope,$modal, $modalInstance, $sce, Dialog, NoticeService, service, RoleService, manageService, SeletedData) {
    $scope.SeletedData = SeletedData;
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Save: function() {
            $modalInstance.close();
        },
        Close: function() {
            $modalInstance.close();
        },
        Push: function () {
            var selectedNodes = $scope.getCheckedData($scope.gridOptionsUser.rowData);
            var recievers = [];
            selectedNodes.map(function(obj, index) {
                recievers.push({
                    State: 0,
                    FkNoticeId: "",
                    RecieverName: obj.GroupUserName,
                    FkRecieverId: obj.Id,
                    Id: "",
                    AddUser: "",
                    ModifyUser: "",
                    AppId: "",
                    GroupRelationId: obj.GroupRelationId,
                    GroupRelationName: "",
                    AddUserName: "",
                    ModifyUserName: "",
                    AddTime: "",
                    ModifyTime: ""
                })
                return recievers;
            })
            NoticeService.PostPushNotice($scope, {
                NoticeId: $scope.SeletedData[0].Id,
                Recievers: recievers,
                PushType: 0
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = NoticeService;
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
})
//群组通知
app.controller('NoticeGroupPushCtrl', function($scope, $modal, $modalInstance, service, NoticeService, Dialog, RoleService, manageService, SeletedData) {
    $scope.SeletedData = SeletedData;
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Save: function() {
            $modalInstance.close();
        },
        Close: function() {
            $modalInstance.close();
        },
        Push: function () {
            var selectedNodes = $scope.tree.getCheckedNodes(true);
            var recievers = [];
            selectedNodes.map(function(obj, index) {
                recievers.push({
                    State: 0,
                    FkNoticeId: "",
                    RecieverName: obj.name,
                    FkRecieverId: obj.Id,
                    Id: "",
                    AddUser: "",
                    ModifyUser: "",
                    AppId: "",
                    GroupRelationId: obj.Id,
                    GroupRelationName: obj.name,
                    AddUserName: "",
                    ModifyUserName: "",
                    AddTime: "",
                    ModifyTime: ""
                })
                return recievers;
            })
            NoticeService.PostPushNotice($scope, {
                NoticeId: $scope.SeletedData[0].Id,
                Recievers: recievers,
                PushType: 1
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = NoticeService;
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
})
//标签通知
app.controller('NoticeTagCtrl', function($scope, NoticeService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            NoticeService.GetNoticesByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            NoticeService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
})
app.controller('NoticeViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});

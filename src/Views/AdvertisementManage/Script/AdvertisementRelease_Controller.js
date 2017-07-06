//基础通知列表
app.controller('AdvertisementreleaseCtrl', function($scope, $sce, $compile, Dialog, AdvertisementreleaseService, manageService, RoleService, service) {
    $scope.dataService = AdvertisementreleaseService;
    $scope.roleSerivce = RoleService;
    $scope.showTile = function(data, eventObj) {
        if (!data) return;
        window.open(data.Url);
    }
    $scope.ShowDetails = function(data, code, eventObj) {
        if (!data) return;
        data.DataState = state.Add;
        Dialog.Show("/views/AdvertisementManage/AdvertisementContextManage.html", "AdvertisementContextManageCtrl", "lg", {
            data: function() {
                return data;
            },
            rationType: function() {
                return code;
            }
        }, function(result) {
            if (result) {
                $scope.event.Search();
            }
        })
        eventObj.stopPropagation();
    }
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "标题",
            field: "NoticeTitle",
            width: 200,
            filter: "text",
            filterParams: {
                apply: true
            },
            cellRenderer: function(params) {
                var div = "<a ng-model='data' ng-click='showTile(data, $event)'>" + params.data.NoticeTitle + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "发布状态",
            field: "ReleaseState",
            suppressMenu: true,
            width: 100,
            cellRenderer: $scope.CodeToDisplayFunc
                // cellRenderer: $scope.dateTimeToFormatFunc
        }, {
            headerName: "应用类型",
            field: "NoticeUseTypeName",
            suppressMenu: true,
            width: 100
        }, {
            headerName: "紧急状态",
            field: "NoticeLevelName",
            suppressMenu: true,
            width: 100
        }, {
            headerName: "已点赞",
            field: "Praise",
            suppressMenu: true,
            width: 100,
            Code: "3",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已打分",
            field: "Mark",
            suppressMenu: true,
            width: 100,
            Code: "4",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已评论",
            field: "Comment",
            suppressMenu: true,
            width: 100,
            Code: "5",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已分享",
            field: "Share",
            suppressMenu: true,
            width: 100,
            Code: "6",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已收藏",
            field: "Collection",
            suppressMenu: true,
            width: 100,
            Code: "7",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已发送",
            field: "Sent",
            suppressMenu: true,
            width: 100,
            Code: "8",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "已阅读",
            field: "Red",
            suppressMenu: true,
            width: 100,
            Code: "9",
            cellRenderer: function(params) {
                var div = "<a ng-click='ShowDetails(data,\"" + params.colDef.Code + "\", $event)'>" + params.data[params.colDef.field].NumerationValue + "</a>";
                var content = $compile(div)($scope);
                return content[0];
            }
        }, {
            headerName: "发布时间",
            field: "ReleaseTime",
            suppressMenu: true,
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

    var manage = manageService.constructor($scope, $scope.gridOptions, "AdvertisementreleaseEditCtrl", "/views/AdvertisementreleaseManage/AdvertisementreleaseEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        RevokeInfo: function(data) {
            AdvertisementreleaseService.PutNoticeReleaseRevoke($scope, data, function(data) {
                $scope.gridOptions.event.LoadData();
            });
        }
    });
    //移除修改按钮
    delete $scope.gridOptions.event.EditInfo;
    delete $scope.gridOptions.event.Add;
});
//基础通知编辑
app.controller('AdvertisementreleaseEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, AdvertisementreleaseService, data) {
    $scope.model = data;
    $scope.event = {
        Save: function() {
            $scope.model.Content = $scope.editor.latestHtml;
            var ImgList = $('.richtext .Advertisementrelease');
            var ImgSrcList = [];
            angular.forEach(ImgList, function(obj, index) {
                ImgSrcList.push(obj.currentSrc)
            });
            $scope.model.PhotoNames = ImgSrcList.join().replace(new RegExp("http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/", "gm"), "");
            if ($scope.model.Id) {
                AdvertisementreleaseService.PutAdvertisementrelease($scope, $.extend($scope.model, {
                    Id: $scope.Id
                }), function(data) {
                    $modalInstance.close(data);
                });
            } else {
                AdvertisementreleaseService.PostAdvertisementrelease($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    AdvertisementreleaseService.LoadInfo($scope, {
        ID: $scope.model.Id
    }, function(data) {
        if (data.Id) {
            $scope.editor.html('<p>' + data.Content + '</p>');
        }
        $scope.model = data;
    });
});
//个人通知
app.controller('AdvertisementreleasePersonalPushCtrl', function($scope, $modal, $modalInstance, $sce, Dialog, AdvertisementreleaseService, service, RoleService, manageService, SeletedData) {
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
        Push: function() {
            var selectedNodes = $scope.getCheckedData($scope.gridOptionsUser.rowData);
            var recievers = [];
            selectedNodes.map(function(obj, index) {
                recievers.push({
                    State: 0,
                    FkAdvertisementreleaseId: "",
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
            AdvertisementreleaseService.PostPushAdvertisementrelease($scope, {
                AdvertisementreleaseId: $scope.SeletedData[0].Id,
                Recievers: recievers,
                PushType: 0
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = AdvertisementreleaseService;
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
app.controller('AdvertisementreleaseGroupPushCtrl', function($scope, $modal, $modalInstance, service, AdvertisementreleaseService, Dialog, RoleService, manageService, SeletedData) {
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
        Push: function() {
            var selectedNodes = $scope.tree.getCheckedNodes(true);
            var recievers = [];
            selectedNodes.map(function(obj, index) {
                recievers.push({
                    State: 0,
                    FkAdvertisementreleaseId: "",
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
            AdvertisementreleaseService.PostPushAdvertisementrelease($scope, {
                AdvertisementreleaseId: $scope.SeletedData[0].Id,
                Recievers: recievers,
                PushType: 1
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = AdvertisementreleaseService;
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
app.controller('AdvertisementreleaseTagCtrl', function($scope, AdvertisementreleaseService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            AdvertisementreleaseService.GetAdvertisementreleasesByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            AdvertisementreleaseService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
});
app.controller('AdvertisementreleaseViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});
//新通知细节列表
app.controller('AdvertisementContextManageCtrl', function($scope, $sce, $modalInstance, $compile, Dialog, AdvertisementreleasebehaviorService, manageService, RoleService, service, data, rationType) {
    $scope.data = data;
    $scope.rationType = rationType;
    $scope.dataService = AdvertisementreleasebehaviorService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    AdvertisementreleasebehaviorService.LoadData($scope, $scope.data, function(data) {
        $scope.gridOptions.api.setRowData(data.List);
    });
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "人员",
            field: "Id",
            width: 600,
            cellRenderer: function(params) {
                return params.data.NoticeReleaseReceiver.UserName;
            }
        }]); //默认值eventName: "gridOptions.event"
    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    };
    $.extend($scope.gridOptions, $scope.options);
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        }
    }
});

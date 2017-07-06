//新轮播广告列表
app.controller('AdvertisementCtrl', function($scope, $sce, $compile, Dialog, AdvertisementService, manageService, RoleService, service) {
    $scope.Page = {
        Index: 1,
        Count: 1
    };
    $scope.showTile = function(data, eventObj) {
        if (!data) return;
        data.DataState = state.Add;
        Dialog.Show("/views/AdvertisementManage/AdvertisementbehaviorManage.html", "AdvertisementbehaviorManageCtrl", "lg", {
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
    $scope.dataService = AdvertisementService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "Name",
            width: 300,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "应用类型",
            field: "UseTypeName",
            width: 200
        }, {
            headerName: "发布次数",
            field: "ReleaseNum",
            width: 200
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

    var manage = manageService.constructor($scope, $scope.gridOptions, "AdvertisementEditCtrl", "/views/AdvertisementManage/AdvertisementEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        GroupPush: function(data) {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
            if (seletedData.length === 0) {
                service.msg.alert("请选择轮播广告！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送轮播广告！");
            } else {
                Dialog.Show("/views/AdvertisementManage/AdvertisementGroupPush.html", "AdvertisementGroupPushCtrl", "lg", {
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
                service.msg.alert("请选择轮播广告！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送轮播广告！");
            } else {
                Dialog.Show("/views/AdvertisementManage/AdvertisementPersonalPush.html", "AdvertisementPersonalPushCtrl", "lg", {
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
                service.msg.alert("请选择轮播广告！");
            } else if (seletedData.length !== 1) {
                service.msg.alert("请逐条推送轮播广告！");
            } else {
                Dialog.Show("/views/AdvertisementManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

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
                        AdvertisementService.PostNoticeReleaseByPublicly($scope, NoticeRelease, function(data) {
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
//新轮播广告编辑
app.controller('AdvertisementEditCtrl', function($scope, $sce, $modalInstance, editService, service, Dialog, DataOperate, AdvertisementService, RoleService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = AdvertisementService;
    $scope.roleSerivce = RoleService;
    $scope.service = service;
    $scope.model = data;
    if (data.DataState === state.Add && parent) {
        debugger
        $scope.model.ParentName = parent.DisplayName;
        $scope.model.ParentId = parent.Id;
        // if ($scope.model.UserTypeTags) {
        //     var xii = [];
        //     for (item in model.UserTypeTags) {
        //         // statement
        //         xii.push(model.UserTypeTags[item].Name);
        //     }
        // };
    } else if ($scope.model.DataState === state.Modify) {
       
    }
    var e = editService.constructor($scope);
    $scope.event = $.extend(e, {
        fileChange: function(evt) {
            var fileObj = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload = function() {
                    var width = image.width;
                    var height = image.height;
                    if (height / width == 1 / 3 && width >= 640) {
                        $scope.ossUpload = service.FileUpload.BuildUploadObj();
                        //上传
                        var Upload = function(row) {
                            var GUID = service.FileUpload.BuildGUID();
                            //'Upload/Import/' + GUID 上传到一级目录
                            $scope.ossUpload.upload(service.FileUpload.BuildUploadSetting(row, GUID, function(res) {
                                $scope.tag = true;
                                $scope.$apply(function() {
                                    row.state = true;
                                    row.StateName = "已上传";
                                    row.Id = GUID;
                                    row.SavePath = '/';
                                    $scope.imgUrl = "http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + row.Id + row.name.substr(row.name.lastIndexOf('.'));
                                    // $modalInstance.close($scope.imgUrl)
                                });
                                // CreateImgDom(row);
                                service.msg.alert("上传成功!");
                            }, function(res) {
                                console.log("上传失败！");
                                row.state = false;
                                row.StateName = "上传失败"
                            }, function(res) {
                                // console.log((res.loaded / res.total) * 100 + '%');
                            }));
                        }
                        Upload(fileObj);

                    } else {
                        service.msg.alert("图片要求宽高比为3:1且宽度不小于640px!");
                    }
                };
                image.src = data;
            };
            reader.readAsDataURL(fileObj);
        }
    });
    RoleService.LoadRole($scope, "");
});
//个人轮播广告
app.controller('AdvertisementPersonalPushCtrl', function($scope, $modal, $modalInstance, $sce, Dialog, AdvertisementService, service, RoleService, manageService, SeletedData) {
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
            Dialog.Show("/views/AdvertisementManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

            }, function(result) {
                if (result) {
                    var selectedNodes = $scope.tree.getCheckedNodes(true);
                    var CrouselAdReleaseReceiverList = [];
                    var CrouselAdReleaseExtList = [];//广告位区域
                    var AdvertisementRelease = {};
                    ($scope.SeletedData || []).map(function(obj, index) {
                        AdvertisementRelease = $.extend({}, {
                            FkCrouselAdId: obj.Id,
                            CrouselAdReleaseExtList: result.CrouselAdReleaseExtList,
                            AppId: service.Cookie.Get("AppID"),
                            AddUser: service.Cookie.Get("UserID"),
                            GroupRelationId: service.Cookie.Get("GroupRelationID"),
                            GroupRelationName: service.Cookie.Get("GroupRelationName"),
                            AddUserName: service.Cookie.Get("AddUserName") || "",
                            TypeId: "",
                            DataSource: 0
                        });
                        return AdvertisementRelease;
                    })
                    selectedNodes.map(function(obj, index) {
                        CrouselAdReleaseReceiverList.push({
                            SrcId: obj.Id,
                            SrcType: 0,
                            SrcName: obj.GroupUserName
                        })
                        return CrouselAdReleaseReceiverList;
                    })
                    AdvertisementService.CrouselAdRelease_PostCrouselAdReleasePublish($scope, $.extend({},{
                        CrouselAdReleaseReceiverList: CrouselAdReleaseReceiverList,
                        CrouselAdReleaseExtList: CrouselAdReleaseExtList
                    }, AdvertisementRelease), function(data) {
                        $scope.data = data.List;
                        $scope.Page.Count = data.Num;
                        $modalInstance.close(data)
                    });
                }
            })
        }
    };
    $scope.dataService = AdvertisementService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "Name",
            width: 300,
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
//群组轮播广告
app.controller('AdvertisementGroupPushCtrl', function($scope, service, $modal, $modalInstance, service, AdvertisementService, Dialog, RoleService, manageService, SeletedData) {
    $scope.SeletedData = SeletedData;
    debugger
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        Push: function() {
            Dialog.Show("/views/AdvertisementManage/NoticeLevel.html", "NoticeLevelCtrl", "lg", {

            }, function(result) {
                if (result) {
                    var selectedNodes = $scope.tree.getCheckedNodes(true);
                    var CrouselAdReleaseReceiverList = [];
                    var CrouselAdReleaseExtList = [];//广告位区域
                    var AdvertisementRelease = {};
                    ($scope.SeletedData || []).map(function(obj, index) {
                        AdvertisementRelease = $.extend({}, {
                            FkCrouselAdId: obj.Id,
                            CrouselAdReleaseExtList: result.CrouselAdReleaseExtList,
                            AppId: service.Cookie.Get("AppID"),
                            AddUser: service.Cookie.Get("UserID"),
                            GroupRelationId: service.Cookie.Get("GroupRelationID"),
                            GroupRelationName: service.Cookie.Get("GroupRelationName"),
                            AddUserName: service.Cookie.Get("AddUserName") || "",
                            TypeId: "",
                            DataSource: 0
                        });
                        return AdvertisementRelease;
                    })
                    selectedNodes.map(function(obj, index) {
                        CrouselAdReleaseReceiverList.push({
                            SrcId: obj.Id,
                            SrcType: 1,
                            SrcName: obj.GroupUserName
                        })
                        return CrouselAdReleaseReceiverList;
                    })
                    AdvertisementService.CrouselAdRelease_PostCrouselAdReleasePublish($scope, $.extend({},{
                        CrouselAdReleaseReceiverList: CrouselAdReleaseReceiverList,
                        CrouselAdReleaseExtList: CrouselAdReleaseExtList
                    }, AdvertisementRelease), function(data) {
                        $scope.data = data.List;
                        $scope.Page.Count = data.Num;
                        $modalInstance.close(data)
                    });
                }
            })
        }
    };
    $scope.dataService = AdvertisementService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "Name",
            width: 300,
        }, {
            headerName: "应用类型",
            field: "UseTypeName",
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
//标签轮播广告
app.controller('AdvertisementTagCtrl', function($scope, AdvertisementService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            AdvertisementService.GetAdvertisementsByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            AdvertisementService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
});
//新轮播广告行为列表
app.controller('AdvertisementbehaviorManageCtrl', function($scope, $sce, $modalInstance, $compile, Dialog, AdvertisementbehaviorService, manageService, RoleService, service, data) {
    $scope.dataService = AdvertisementbehaviorService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.data = data;
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "轮播广告标题",
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

    var manage = manageService.constructor($scope, $scope.gridOptions, "AdvertisementreleaseEditCtrl", "/views/AdvertisementManage/AdvertisementEdit.html");
    $scope.gridOptions.event = $.extend(manage, {});
    $scope.gridOptions.event.Add = false;
    delete $scope.gridOptions.event.EditInfo; //移除编辑功能
    $scope.gridOptions.event.DeleteAllSelect = false;
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        }
    }
})
app.controller('NoticeLevelCtrl', function($scope, $modal, $modalInstance, AdvertisementService) {
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
    AdvertisementService.GetNoticeDimensions($scope, {
        DimensionsType: 2
    }, function(data) {
        $scope.Dimensions = data.DimensionsChildren;
        // $scope.Page.Count = data.Num;
    });
});
app.controller('AdvertisementViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});

//资讯列表
app.controller('PushUserDeviceInfoCtrl', function($scope, $sce, Dialog, PushUserDeviceInfoService, manageService, RoleService, service) {
    $scope.dataService = PushUserDeviceInfoService;
    $scope.roleSerivce = RoleService;

    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "Sk",
            field: "Sk",
            width: 200,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "Ak",
            field: "Ak",
            width: 200
        }, {
            headerName: "Url",
            field: "Url",
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


    var manage = manageService.constructor($scope, $scope.gridOptions, "PushUserDeviceInfoEditCtrl", "/views/PushManage/PushUserDeviceInfoEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        GroupPush: function(data) {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
            if (seletedData.length === 0) {
                service.msg.alert("请选择资讯！");
                return;
            }
            Dialog.Show("/views/PushUserDeviceInfoManage/PushUserDeviceInfoGroupPush.html", "PushUserDeviceInfoGroupPushCtrl", "lg", {
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
        },
        PersonalPush: function(data) {
            var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
            if (seletedData.length === 0) {
                service.msg.alert("请选择资讯！");
                return;
            }
            Dialog.Show("/views/PushUserDeviceInfoManage/PushUserDeviceInfoPersonalPush.html", "PushUserDeviceInfoPersonalPushCtrl", "lg", {
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
});
//资讯编辑
app.controller('PushUserDeviceInfoEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, PushUserDeviceInfoService, data, RoleService, editService) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = PushUserDeviceInfoService;
    $scope.roleSerivce = RoleService;
    $scope.model = data;
    var e = editService.constructor($scope);
    $scope.event = $.extend({}, e);
    RoleService.LoadRole($scope, "");
});
//个人资讯
app.controller('PushUserDeviceInfoPersonalPushCtrl', function($scope, $modal, $modalInstance, $sce, Dialog, PushUserDeviceInfoService, service, RoleService, manageService, SeletedData) {
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
            var PushUserDeviceInfoIds = [];
            selectedNodes.map(function(obj, index) {
                recievers.push(obj.Id)
                return recievers;
            })
            $scope.SeletedData.map(function(obj, index) {
                PushUserDeviceInfoIds.push(obj.Id)
                return PushUserDeviceInfoIds;
            })
            PushUserDeviceInfoService.PostPushPushUserDeviceInfo($scope, {
                PushUserDeviceInfoIds: PushUserDeviceInfoIds,
                Recievers: recievers,
                PushType: 0
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = PushUserDeviceInfoService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "主题",
            field: "Name",
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
//群组资讯
app.controller('PushUserDeviceInfoGroupPushCtrl', function($scope, $modal, $modalInstance, service, PushUserDeviceInfoService, Dialog, RoleService, manageService, SeletedData) {
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
            var PushUserDeviceInfoIds = [];
            selectedNodes.map(function(obj, index) {
                recievers.push(obj.Id)
                return recievers;
            })
            $scope.SeletedData.map(function(obj, index) {
                PushUserDeviceInfoIds.push(obj.Id)
                return PushUserDeviceInfoIds;
            })
            PushUserDeviceInfoService.PostPushPushUserDeviceInfo($scope, {
                PushUserDeviceInfoIds: PushUserDeviceInfoIds,
                Recievers: recievers,
                PushType: 1
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
            PushUserDeviceInfoService.PostPushPushUserDeviceInfo($scope, {
                PushUserDeviceInfoIds: PushUserDeviceInfoIds,
                Recievers: recievers,
                PushType: 1
            }, function(data) {
                $scope.data = data.List;
                $scope.Page.Count = data.Num;
                $modalInstance.close()
            });
        }
    };
    $scope.dataService = PushUserDeviceInfoService;
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
//标签资讯
app.controller('TagPushUserDeviceInfoCtrl', function($scope, PushUserDeviceInfoService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            PushUserDeviceInfoService.GetPushUserDeviceInfosByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            PushUserDeviceInfoService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
});
app.controller('PushUserDeviceInfoViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});
app.controller('ImgCropCtrl', function($scope, $modalInstance, File, service) {
    $scope.eventName = {
        Save: "预览"
    }
    $scope.file = File;
    $scope.fileChanged = function(file) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function(e) {
            $scope.imgSrc = this.result;
            $scope.$apply();
        };
    }
    $scope.fileChanged($scope.file)
    $scope.event = {
        Save: function() {
            $scope.initCrop = true;
            if ($scope.imageCropStep === 2) {
                $scope.initCrop = true;
                $scope.eventName.Save = "保存";
            } else if ($scope.imageCropStep === 3) {
                //base64 img转换成blob对象
                $scope.blob = service.convert.convertToBlob($scope.result, $scope.file.type);
                $.extend($scope.blob, {
                    name: $scope.file.name,
                    Extension: $scope.file.Extension
                });
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
                            $scope.imgUrl = "http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + row.Id + row.Extension;
                            $modalInstance.close($scope.imgUrl)
                        });
                        // CreateImgDom(row);
                        console.log("上传成功！");
                    }, function(res) {
                        console.log("上传失败！");
                        row.state = false;
                        row.StateName = "上传失败"
                    }, function(res) {
                        // console.log((res.loaded / res.total) * 100 + '%');
                    }));
                }
                Upload($scope.blob);
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
});

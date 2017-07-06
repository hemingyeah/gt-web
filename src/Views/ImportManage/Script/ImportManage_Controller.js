app.controller("ImportManageCtrl", function ($scope, $http, $state, $stateParams, $modal, manageService, importService, service) {
    $scope.$modalInstance = $modal;
    $scope.dataService = importService;
    manageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
    [
        {
            headerName: "文件名",
            field: "Name",
            width: 150,
            filter: "text",
            filterParams: {
                apply: true
            },
            cellRenderer: function (params) {
                return "<a href='" + params.data.Url + "' target='blank'>" + params.data.Name + "</a>";
            }
        }, {
            headerName: "状态",
            filter: "set",
            field: "DataStateInfo",
            width: 100,
            cellRenderer: function (params) {
                var color = "#333";
                if (params.data.DataState === 1) {
                    color = "#040C7D";
                } else if (params.data.DataState === 2) {
                    color = "#308A26";
                } else if (params.data.DataState === 3) {
                    color = "#E82C17";
                }
                else if (params.data.DataState === 4) {
                    color = "#E82C17";
                }
                return "<span style='color:" + color + ";font-weight: bold;'>" + params.data.DataStateInfo +
                "</span>";
            }
        }, {
            headerName: "总条数",
            field: "Count",
            width: 100,
            suppressMenu: true
        }, {
            headerName: "成功条数",
            field: "SuccessCount",
            width: 100,
            suppressMenu: true
        }, {
            headerName: "描述",
            field: "Description",
            suppressMenu: true
        }, {
            headerName: "添加时间",
            field: "AddTime",
            suppressMenu: true,
            width: 100,
            cellRenderer: $scope.dateTimeToFormatFunc
        }, {
            headerName: '操作者',
            field: "AddUserName",
            width: 100,
            suppressMenu: true
        }
    ]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "", "");
    $scope.gridOptions.event = $.extend(manage, {
        Add: false,
        EditInfo: false,
        DeleteSelect: false,
        DeleteAllSelect: false
    });
    $scope.gridOptions.event.LoadData();
});
/*
importType:0表示人组的模板
           1表示字典模板
           2表示普通模板
*/
app.controller('ImportEditCtrl', function ($scope, $modalInstance, importService, Dialog, service, selectedData, menuId, importType) {

    $scope.data = [];
    $scope.Attach = common.constructor(service, {});
    $scope.ossUpload = FileUpload.BuildUploadObj();
    $scope.event = {
        Close: function () {
            $modalInstance.close(true);
        },
        Delete: function (row) {
            if (!row.state) { //未上传,从列表里删除
                $("#files").val("");
                $scope.data.splice($.inArray(row, $scope.data), 1);
            } else { //上传,从数据库删除
                service.msg.alert("已上传,不能移除!");
            }
        },
        Upload: function (row) {
            var GUID = FileUpload.BuildGUID();
            if (!(row.Extension.toLowerCase() === ".xls" || row.Extension.toLowerCase() === ".xlsx")) {
                service.msg.alert("请上传Excel数据！");
                return;
            }
            $scope.ossUpload.upload(FileUpload.BuildUploadSetting(row, 'Upload/Import/' + GUID, function (res) {
                $scope.$apply(function () {
                    row.state = true;
                    row.StateName = "已上传";
                    row.Id = GUID;
                });
                $.extend($scope.Attach, {
                    FileId: GUID + row.Extension,
                    state: row.state,
                    FileName: row.name,
                    SavePath: 'Upload/Import/',
                    Size: row.size
                });
                if (importType === 0) {
                    importService.PostGroupUser($scope, $scope.Attach, function (data) { });
                } else if (importType === 1) {
                    importService.PostDic($scope, $scope.Attach, function (data) { });
                } else {
                    importService.PostDefault($scope, $scope.Attach, function (data) { });
                }
            }, function (res) {
                console.log("上传失败！");
                row.state = false;
                row.StateName = "上传失败";
            }));
        },
        UploadAll: function () {
            $scope.data.filter(function (obj) {
                return !obj.state;
            }).map(function (obj) {
                $scope.event.Upload(obj);
                return true;
            });
        },
        FileChange: function () {
        },
        DownLoad: function () {
            function downFile(data) {
                var url = Route.Import_GetFile.Url + "?fileId=" + data + "&fileName=[" + selectedData.Name + "]导入模板.xls";
                var f = document.createElement("a");
                f.setAttribute("href", url);
                document.body.appendChild(f);
                f.click();
            }

            if (importType < 2) {
                Dialog.Show('/Views/ImportManage/ImportLevel.html', 'ImportLevelCtrl', 'mg', {}, function (result) {
                    if (result) {
                        if (importType === 0) { //人员群组导入
                            importService.DownLoadGroupUser($scope, {
                                index: result,
                                templateId: menuId,
                                groupId: selectedData.Id
                            }, downFile);
                        } else if (importType === 1) { //字典导入
                            selectedData.Name = selectedData.DisplayName;
                            importService.DownLoadDictionary($scope, {
                                index: result,
                                rootId: selectedData.Id
                            }, downFile);
                        }
                    }
                });
            } else { //普通导入
                if (!selectedData) {
                    selectedData = {};
                }
                if (!selectedData.Name) {
                    selectedData.Name = "导入模板";
                }
                importService.DownLoadDefault($scope, {
                    templateId: menuId
                }, downFile);
            }
        }
    };
    $('body').delegate('#files', 'change', function (evt) {
        var fileTotal = evt.target.files;
        angular.forEach(fileTotal, function (obj, index) {
            obj.FileName = obj.name;
            obj.StateName = "未上传";
            obj.Extension = obj.name.substr(obj.name.lastIndexOf('.'));
            obj.Size = obj.size;
            $scope.$apply(function () {
                $scope.data.push(obj);
            });
        });
    });
});
app.controller("ImportLevelCtrl", function ($scope, $modalInstance, editService) {
    $scope.level = 1;
    $scope.$modalInstance = $modalInstance;
    var e = editService.constructor($scope);
    $scope.eventName = {
        Save: "确定"
    }
    $scope.event = angular.extend(e, {
        Save: function () {
            $modalInstance.close($scope.level);
        }
    });
});
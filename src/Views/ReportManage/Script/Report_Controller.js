app.controller('ReportManageCtrl', function ($scope, $modal, $state, $stateParams, ReportService, RoleService, Dialog, manageService) {

    $scope.dataService = ReportService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "Id",
            field: "Id",
            width: 300,
            suppressMenu: true
        }, {
            headerName: "名称",
            field: "Name",
            width: 200,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "零件名称",
            field: "OrganName",
            suppressMenu: true
        }, {
            headerName: "添加人",
            field: "AddUserName",
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
    var manage = manageService.constructor($scope, $scope.gridOptions, "ReportEditCtrl", "/views/ReportManage/ReportEdit.html");

    $scope.gridOptions.event = $.extend(manage, {
        Config: function (params) {
            if (!params && !cur.$scope.currentItem) {
                cur.service.msg.alert("请选择要配置的数据！");
                return;
            }
            params = params || cur.$scope.currentItem.data;
            ReportService.GetTableSettingList($scope, {
                OrganId: params.OrganId,
                ReportId: params.Id
            }, function (data) {
                $scope.serOldChecked(data);
                Dialog.Show("/views/ReportManage/ReportConfig.html", "ReportConfigCtrl", "lg", {
                    MenuType: function () {
                        return "1";
                    },
                    ReportId: function () {
                        return params.Id;
                    },
                    data: function () {
                        return data;
                    }
                }, function (result) { });
            });
        }
    });
    $scope.gridOptions.event.LoadData();
});
app.controller('ReportEditCtrl', function ($scope, $state, $modalInstance, ReportService, RoleService, editService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = ReportService;
    $scope.roleSerivce = RoleService;
    $scope.model = data;
    $scope.model.Organ = {
        Id: data.OrganId,
        DisplayName: data.OrganName
    };
    if ($scope.model.Organ) {
        $scope.organs = [];
        $scope.organs.push($scope.model.Organ);
    }
    var e = editService.constructor($scope);
    $scope.event = $.extend({
        TestLink: function () {
            ReportService.ConnectDatabaseTest($scope, null, function (data) {

            });
        },
        LoadOrgan: function (filter) {
            ReportService.GetOrgans($scope, {
                PageIndex: e.Page.PageIndex,
                PageSize: e.Page.PageSize,
                Filter: filter
            }, function (data) {
                $scope.organs = data.List;
                $scope.organs.Num = data.Num;
            });
        }
    }, e);
    RoleService.LoadRole($scope, "");
});
app.controller('ReportConfigCtrl', function ($scope, $modal, $modalInstance, $timeout, Dialog, DataOperate, manageService, ReportService, RoleService, MenuType, ReportId, data) {
    $scope.eventName = {
        Next: "保存并下一步"
    }
    $scope.rowsAlreadyGrouped = true;
    $scope.checkBox = false;
    manageService.dataGridInit($scope);
    $scope.innerCellRenderer = function (params) {
        var name = params.data.ChineseName;
        var position = 10;
        return "<span style='margin-left:" + position + "px'>" + name + "</span>";
    }

    var tableDefs = $scope.columnDefs.concat(
        [{
            field: "CheckBox",
            headerName: "选择",
            suppressMenu: true,
            gridOptionsName: "gridTableOptions",
            width: 40,
            maxWidth: 40
        }, {
            headerName: "名称",
            field: "Id",
            width: 400,
            suppressMenu: true,
            cellRenderer: {
                renderer: 'group',
                innerRenderer: $scope.innerCellRenderer
            }
        }, {
            headerName: "表名",
            suppressMenu: true,
            field: "DisplayName",
            width: 400
        }]);

    var columnDefs = $scope.columnDefs.concat(
        [{
            field: "CheckBox",
            headerName: "选择",
            suppressMenu: true,
            gridOptionsName: "gridColumnOptions",
            width: 40,
            maxWidth: 40
        }, {
            headerName: "名称",
            field: "Id",
            suppressMenu: true,
            width: 400,
            cellRenderer: {
                renderer: 'group',
                innerRenderer: $scope.innerCellRenderer
            }
        }, {
            headerName: "表名",
            suppressMenu: true,
            field: "DisplayName",
            width: 400
        }]);

    $scope.gridTableOptions = {
        columnDefs: tableDefs,
        rowData: data
    }
    $scope.gridColumnOptions = {
        columnDefs: columnDefs
    }
    $.extend($scope.gridTableOptions, $scope.options);
    $.extend($scope.gridColumnOptions, $scope.options);
    $scope.checkBox = true;

    $scope.event_1 = {
        Next: function () {
            var changeData = $scope.getChangedCheckedLeafData($scope.gridTableOptions.rowData);
            if (changeData.length !== 0 || !$scope.gridColumnOptions.rowData) {
                ReportService.SaveDataTableSetting($scope, changeData, ReportId, function (data) {
                    $scope.serOldChecked(changeData); //将保存成功的状态和原始状态进行同步
                    $scope.serOldChecked(data); //同步原始状态
                    $scope.gridColumnOptions.rowData = data;
                    $scope.gridColumnOptions.api.onNewRows();
                    $scope.steps.step2 = true;
                });
            } else {
                $scope.steps.step2 = true;
            }

        },
        Close: function () {
            $modalInstance.close();
        }
    }
    $scope.event_2 = {
        Prev: function () {
            $scope.steps.step1 = true;
        },
        Next: function () {
            var changeData = $scope.getChangedCheckedLeafData($scope.gridColumnOptions.rowData);
            if (changeData.length !== 0 || !$scope.ControlList || !$scope.VaildList) {
                ReportService.SaveDataColumnSetting($scope, changeData, ReportId, function (data) {
                    $scope.serOldChecked(changeData); //将保存成功的状态和原始状态进行同步
                    $scope.SetColumnTable = $scope.getCheckedLeafContainParentData($scope.gridColumnOptions.rowData);
                    $scope.modelStatistics = data;
                    var dataDic = {};
                    data.DtoReportServiceRowStatistics.forEach(function (obj) {
                        dataDic[obj.TableEnName + "_" + obj.ColumnEnName] = obj;
                        obj.DataState = 1;
                    });
                    angular.forEach($scope.SetColumnTable, function (obj, index, array) {
                        if (obj.group === true) {
                            angular.forEach(obj.children, function (objChild, index, array) {
                                if (objChild.group === false && objChild.data.IsChecked) {
                                    var key = obj.data.DisplayName + "_" + objChild.data.DisplayName;
                                    if (!dataDic.hasOwnProperty(key)) {
                                        $scope.modelStatistics.DtoReportServiceRowStatistics.push({
                                            FkDatabaseId: ReportId,
                                            FkTableId: obj.data.Id,
                                            TableEnName: obj.data.DisplayName,
                                            FkColumnId: objChild.data.Id,
                                            ColumnEnName: objChild.data.DisplayName,
                                            Formula: "",
                                            ParameterTag: "",
                                            DataState: 0
                                        });
                                    } else {
                                        dataDic[key].DataState = 0;
                                    }
                                }
                            });
                        }
                    });

                    if (data.DtoReportServiceColumnStatistics && data.DtoReportServiceColumnStatistics.length === 0) {
                        $scope.modelStatistics.DtoReportServiceColumnStatistics.push({
                            FkDatabaseId: ReportId,
                            Formula: "",
                            ParameterTag: ""
                        });
                    }
                    $scope.steps.step3 = true;
                });
            } else {
                $scope.steps.step3 = true;
            }
        },
        Close: function () {
            $modalInstance.close();
        }
    }
    $scope.event_3 = {
        Close: function () {
            $modalInstance.close();
        },
        Prev: function () {
            $scope.steps.step2 = true;
        },
        Save: function () {
           
            ReportService.SaveDataSourceSetting($scope, $scope.modelStatistics, function (data) {
                if (data) {
                    $modalInstance.close(data);
                }
            });
        }
    }
    $scope.event = {
        Close: function () {
            $modalInstance.close();
        }
    };
});

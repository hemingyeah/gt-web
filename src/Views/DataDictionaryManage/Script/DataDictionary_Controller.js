
app.controller('DataDictionaryOperateCtrl', function ($scope, $modalInstance, DataDictionaryInstanceService, RoleService, editService, service, parent, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = DataDictionaryInstanceService;
    $scope.roleSerivce = RoleService;
    $scope.service = service;
    $scope.model = data;
    $scope.showParent = true;
    if (data.DataState === state.Add && parent) {
        $scope.model.ParentName = parent.DisplayName;
        $scope.model.ParentId = parent.Id;
    }
   
    var e = editService.constructor($scope);
    $scope.event = $.extend({}, e);
    RoleService.LoadRole($scope, "");
});

app.controller('DataDictionaryRootListCtrl', function ($scope, $http, $state, $stateParams, $modal, Dialog, service, DataDictionaryInstanceService, RoleService, treeManageService) {
    $scope.dataService = DataDictionaryInstanceService;
    $scope.roleSerivce = RoleService;
    $scope.rowsAlreadyGrouped = true;
    treeManageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            tree: true,
            field: "DisplayName",
            width: 240,
            filter: "text",
            filterParams: {
                apply: true
            },
            cellRenderer: {
                renderer: 'group',
                innerRenderer: $scope.innerCellRenderer
            }
        }, {
            headerName: "Id",
            field: "Id",
            width: 240,
            suppressMenu: true
        }, {
            headerName: "编码",
            field: "Code",
            width: 200,
            suppressMenu: true
        }, {
            headerName: "字典值",
            field: "Value",
            width: 200,
            suppressMenu: true
        }, {
            headerName: "描述",
            field: "Description",
            suppressMenu: true
        }, {
            headerName: '操作',
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.operCellRendererFunc
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        onAfterFilterChanged: function () {
            var filterModel = $scope.gridOptions.api.getFilterModel();
            if (filterModel && Object.keys(filterModel).length > 0) {
                $scope.search = filterModel.DisplayName.filter;
            } else {
                $scope.search = "";
            }
            $scope.gridOptions.event.LoadData();
        }
    }

    $.extend($scope.gridOptions, $scope.options);


    var manage = treeManageService.constructor($scope, $scope.gridOptions, "DataDictionaryOperateCtrl", "/views/DataDictionaryManage/DataDictionaryOperate.html");

    $scope.gridOptions.event = angular.extend(manage, {
        Import: function () {
            if ($scope.currentItem) {
                Dialog.Show('/Views/ImportManage/ImportEdit.html', 'ImportEditCtrl', 'md', {
                    selectedData: function () {
                        return $scope.currentItem.data;
                    },
                    menuId: function () {
                        return "";
                    }, importType: function () {
                        return 1;
                    }
                }, function () { });
            } else {
                service.msg.alert("请选择一个导入节点！");
            }
        }
    });
    $scope.gridOptions.event.LoadData();
});
app.controller('SelectDataDictionaryCtrl', function ($scope, $state, $modalInstance, DataDictionaryService, DataDictionaryRootService, RoleService, parent, service) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.GridColumnList = GridColumnList;
    $scope.event = {
        Close: function () {
            $modalInstance.close();
        },
        OK: function () {
            var AddData = [];
            angular.forEach($scope.data, function (obj, i) {
                if (obj.Checked) {
                    var data = $.extend({
                        ParentId: parent,
                        FkDictionaryId: obj.Id
                    }, obj);
                    DataDictionaryRootService.AddInfo($scope, data, function (data) {
                        AddData.push({
                            name: $scope.params.DisplayName,
                            Id: data
                        })
                    })
                }
            })
            $modalInstance.close(AddData);
            service.msg.alert("添加成功!");
        },
        LoadData: function () {
            DataDictionaryService.LoadPageData($scope, null, function (data) {
                $scope.data = data.List;
                if ($scope.Page.Index === 1) {
                    $scope.Page.Count = data.Num;
                }
            });
        }
    };
    $scope.event.LoadData();
})
app.controller('SelectDataDictionaryRootCtrl', function ($scope, $state, $modalInstance, DataDictionaryService, DataDictionaryRootService, DataDictionaryInstanceService, RoleService, AppZtreeData, AppID) {
    $scope.AppZtreeData = AppZtreeData;
    $scope.AppID = AppID;
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        OK: function () {
            $modalInstance.close($scope.DictionaryTree.getCheckedNodes(true));
        },
        LoadData: function () {
            // DataDictionaryService.LoadPageData($scope, null, function(data) {
            //  $scope.data = data.List;
            //  if ($scope.Page.Index == 1) {
            //      $scope.Page.Count = data.Num;
            //  }
            // });
        }
    };
    $scope.event.LoadData();
})
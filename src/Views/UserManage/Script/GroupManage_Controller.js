app.controller('GroupManageCtrl', function ($scope, $http, $state, $stateParams, $modal, Dialog, treeManageService, RoleService, groupService, service, $compile) {
    $scope.dataService = groupService;
    $scope.roleSerivce = RoleService;
    $scope.rowsAlreadyGrouped = true;
    treeManageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
    [
        { headerName: "名称", tree: true, field: "DisplayName", width: 300, filter: "text", filterParams: { apply: true }, cellRenderer: { renderer: 'group', innerRenderer: $scope.innerCellRenderer } },
        { headerName: "排序号", field: "OrderIndex", width: 200, suppressMenu: true },
        { headerName: '操作', width: 100, suppressMenu: true, cellRenderer: $scope.operCellRendererFunc }
    ]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        onAfterFilterChanged: function () {
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
    var manage = treeManageService.constructor($scope, $scope.gridOptions, "GroupOperateCtrl", "/views/UserManage/GroupEdit.html");

    $scope.gridOptions.event = angular.extend(manage, {
        AddRoot: false,
        ModifyRelation: function () {
            var checkList = $scope.getCheckedData($scope.gridOptions.rowData);
            if (checkList.length === 0) {
                service.msg.alert("请勾选要设置的数据！");
                return;
            }
            Dialog.Show('/Views/UserManage/GroupEditParent.html', 'GroupRelationCtrl', 'lg', {
                data: function () {
                    return checkList;
                }
            }, function (result) {
                if (result) {
                    $scope.gridOptions.event.LoadData();
                }
            });
        }
    });
    $scope.gridOptions.event.LoadData();
});
app.controller('GroupOperateCtrl', function ($scope, $modal, $modalInstance, DataOperate, editService, groupService, RoleService, data, parent) {
    $scope.dataService = groupService;
    $scope.roleSerivce = RoleService;
    $scope.$modalInstance = $modalInstance;
    $scope.model = data;
    if (data.DataState === state.Modify) {
        //获取vipcode
        groupService.GetVipCode($scope, data.Id, function (data) {
            $scope.model.VipCode = data;
        });
    }

    if (data.DataState === state.Add && parent) {
        $scope.model.ParentName = parent.GroupName;
        $scope.model.ParentId = parent.Id;
    }

    var e = editService.constructor($scope);
    $scope.event = $.extend({}, e);
    RoleService.LoadRole($scope, "");
});
app.controller('GroupRelationCtrl', function ($scope, $modal, $timeout, $modalInstance, editService, manageService, groupRelationService, RoleService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = groupRelationService;
    $scope.model = [];
    angular.copy(data, $scope.model);

    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat([{
        headerName: "名称",
        field: "GroupName",
        suppressMenu: true,
        width: 200
    }, {
        headerName: "信息",
        field: "MessageInfo",
        suppressMenu: true,
        width: 210,
        cellRenderer: function (params) {
            if (params.data.IsSuccessful === true) {
                return "<span style='color:green'>修改成功</span>";
            }
            else if (params.data.IsSuccessful === false) {
                return "<span style='color:red'>" + params.data.MessageInfo + "</span>";
            } else {
                return "未保存";
            }
        }
    }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        rowData: $scope.model,
        onReady: function () {
            $timeout(function () {
                //$scope.gridOptions.api.sizeColumnsToFit();
            }, 500);
        }
    };
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "", "");

    $scope.gridOptions.event = manage;
    var e = editService.constructor($scope);
    $scope.event = e;
    $scope.asyncSuccess = function (event, treeId, treeNode, msg) {
        var objs = JSON.parse(msg);
        var dic = {};
        data.forEach(function (obj) {
            dic[obj.Id] = obj;
        });
        var treeObj = $scope.tree;
        var parent = null;
        if (objs.RtnData.length > 0) {
            parent = treeObj.getNodeByParam("Id", objs.RtnData[0].ParentId, null);
        }
        objs.RtnData.forEach(function (obj) {
            if (dic.hasOwnProperty(obj.Id)) {
                var node = treeObj.getNodeByParam("Id", obj.Id, parent);
                treeObj.removeNode(node);
            }
            if (obj.Children) {
                parent = treeObj.getNodeByParam("Id", obj.Id, parent);
                obj.Children.forEach(function (children) {
                    if (dic.hasOwnProperty(children.Id)) {
                        var node = treeObj.getNodeByParam("Id", children.Id, parent);
                        treeObj.removeNode(node);
                    }
                });
            }
        });
    };
});



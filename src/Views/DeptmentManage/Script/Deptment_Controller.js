//节点权限树
app.directive("deptmentpower", function() {
    return {
        restrict: "E",
        template: function(e, a) {
            return '<ul id="' + a.id + '" class="ztree"></ul>'
        },
        replace: true,
        controller: function($scope, service, $modal, AccountNotePermissionsService, DataOperate) {
            $scope.service = service;
            $scope.$modal = $modal;
            $scope.AccountNotePermissionsService = AccountNotePermissionsService;
            $scope.DataOperate = DataOperate;
        },
        link: function($scope, element, attr, ngModel) {
            $scope.tree = "";
            var setting = {
                check: {
                    enable: true,
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "pId",
                        enable: true
                    }
                },
                callback: {
                    beforeExpand: function(treeId, treeNode) {
                        if (!treeNode.children) {
                            $scope.AccountNotePermissionsService.GetList($scope, {
                                AppID: $scope.AppID,
                                QueryType: 2,
                                ParentID: treeNode.Id
                            }, function(data) {
                                $scope.DataOperate.BuildListChecked(data, $scope.SelectData, 'Id')
                                data.map(function(x) {
                                    if (treeNode.checked) x.checked = true;
                                    return x;
                                })
                                $scope.tree.addNodes(treeNode, data, true);
                            });
                        }
                    },
                    onClick: function(event, treeId, treeNode) {
                        $scope.$apply(function() {
                            // $scope.AccountService.LoadInfo($scope, {
                            // 	accountId: treeNode.Id
                            // }, function(data) {
                            // 	$scope.Sel_Account = data;
                            // })
                        })
                    }
                }
            };
            $scope.tree = $.fn.zTree.init($("#" + attr.id), setting, []);
        }
    }
})
app.controller('SetAccountDeptmentCtrl', function($scope, $modalInstance, AccountNotePermissionsService, AccountOperationService, GroupRelationId, RelationId, DeptmentService, RelationType, DataOperate, AppID) {
    $scope.AppID = AppID;
    $scope.event = {
        Save: function() {
            var Permissions = $scope.tree.getChangeCheckedNodes().map(function(x) {
                if (x.checked) {
                    x.DataState = 0;
                } else {
                    x.DataState = 1;
                };
                if (x.children) x.childrenCount = x.children.length;
                return x;
            });
            AccountNotePermissionsService.SavePermissions($scope, {
                RelationID: RelationId,
                RelationType: RelationType,
                Permissions: Permissions,
                GroupRelationID: GroupRelationId,
                AppID: AppID
            }, function(data) {
                $modalInstance.close(data);
            })
        },
        LoadData: function() {
            AccountNotePermissionsService.GetPermissions($scope, {
                GroupRelationID: GroupRelationId,
                RelationType: RelationType,
                RelationID: RelationId,
                AppID: AppID
            }, function(data) {
                $scope.SelectData = data; //已选中节点
                AccountNotePermissionsService.GetList($scope, {
                    QueryType: 2,
                    AppID: AppID,
                    ParentID: ""
                }, function(data) {
                    DataOperate.BuildListChecked(data, $scope.SelectData, 'Id');
                    $scope.tree.addNodes(null, data, true);
                });
            })
        },
        Close: function() {
            $modalInstance.close();
        }
    };
    $scope.event.LoadData();
})
app.controller('DeptmentOperateCtrl', function($scope, DeptmentService, $modalInstance, item, parent, UrlRoute) {
    $scope.Id = item ? item.Id : ""; //parent.Id;
    $scope.event = {
        Save: function() {
            DeptmentService.Save($scope, null, function(data) {
                if (!$scope.Id) {
                    $modalInstance.close(data);
                } else {
                    $modalInstance.close($scope.model);
                }
            })
        },
        Close: function() {
            $modalInstance.close();
        },
    }
    DeptmentService.LoadInfo($scope, parent, function(data) {
        $scope.model = data;
    });
})
app.controller('DeptmentSetCtrl', function($scope, DeptmentService, $modalInstance, UrlRoute) {
    $scope.event = {
        Save: function() {
            DeptmentService.Save($scope, null, function(data) {
                if (!$scope.Id) {
                    $modalInstance.close(data);
                } else {
                    $modalInstance.close($scope.model);
                }
            })
        },
        OK: function() {
            $modalInstance.close();
        },
    }
})
app.controller('SelectDeptmentCtrl', function($scope, DeptmentService, $modalInstance, UrlRoute) {
    $scope.TreeOperate = {

    }
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        OK: function() {}
    }
})

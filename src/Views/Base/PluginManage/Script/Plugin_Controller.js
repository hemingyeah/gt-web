app.directive("operationpower", function() {
    return {
        restrict: "E",
        template: function(e, a) {
            return '<ul id="' + a.id + '" class="ztree"></ul>'
        },
        replace: true,
        controller: function($scope, service, $modal, AccountOperationService, DataOperate) {
            $scope.service = service;
            $scope.$modal = $modal;
            $scope.AccountOperationService = AccountOperationService;
            $scope.DataOperate = DataOperate;
        },
        link: function($scope, element, attr, ngModel) {
            $scope.tree = "";
            var setting = {
                check: {
                    enable: true
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
                            $scope.AccountOperationService.GetList($scope, {
                                MenuType: treeNode.MenuType,
                                ParentPermissionType: treeNode.PermissionType,
                                ParentID: treeNode.Id
                            }, function(data) {
                                $scope.DataOperate.BuildListChecked(data, $scope.SelectOperate, 'Id')
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
app.directive("accountplugintag", function() {
    return {
        restrict: "E",
        template: function(e, a) {
            return '<ul id="' + a.id + '" class="ztree"></ul>'
        },
        replace: true,
        controller: function($scope, service, AccountClassificationService, DataOperate) {
            $scope.service = service;
            $scope.DataOperate = DataOperate;
            $scope.AccountClassificationService = AccountClassificationService;
        },
        link: function($scope, element, attr, ngModel) {
            $scope.tree = "";
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "ParentId",
                        enable: true
                    }
                },
                callback: {
                    beforeExpand: function(treeId, treeNode) {
                        if (!treeNode.children) {
                            $scope.AccountClassificationService.GetList($scope, {
                                AppID: $scope.AppId,
                                QueryType: 2,
                                PluginInstanceID: $scope.Sel_Plugin.Id,
                                PluginID: $scope.Sel_Plugin.FkPluginId,
                                DesignID: $scope.Sel_Design.Id,
                                DesignAttributeID: $scope.Sel_Attribute.Id,
                                ParentID: treeNode.Id
                            }, function(data) {
                                $scope.DataOperate.BuildListChecked(data, $scope.SelectNodes, 'Id');
                                data.map(function(x) {
                                    if (treeNode.checked && treeNode.IsEnabled) x.checked = true;
                                    return x;
                                })
                                $scope.tree.addNodes(treeNode, data);
                            })
                        }
                    }
                }
            };
            $scope.tree = $.fn.zTree.init($("#" + attr.id), setting, []);
        }
    }
})
app.controller('PluginListCtrl', function($scope, PluginService, $state, $stateParams, RoleService, Dialog) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        Add: function() {
            Dialog.Show("/views/Base/PluginManage/PluginOperate.html", "PluginOperateCtrl", "lg", {
                Id: null
            }, function(result) {
                if (result) {
                    ++$scope.Page.Count;
                    $scope.event.LoadData();
                }
            })
        },
        Edit: function(data) {
            Dialog.Show("/views/Base/PluginManage/PluginOperate.html", "PluginOperateCtrl", "lg", {
                Id: function() {
                    return data.Id;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData();
                }
            })
        },
        Delete: function(data) {
            PluginService.DeleteInfo($scope, {
                ID: data.Id
            }, function() {
                $scope.event.LoadData();
            })
        },
        Search: function() {
            this.LoadData();
        },
        LoadData: function() {
            PluginService.LoadPageData($scope, {
                Name: $scope.Search,
                PageIndex: $scope.Search ? 1 : $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
                if ($scope.Page.Index === 1 || $scope.Search) {
                    $scope.Page.Count = data.Num;
                }
            });
        }
    }
    RoleService.LoadRole($scope, $stateParams.MenuType);
    $scope.event.LoadData();
})
app.controller('PluginOperateCtrl', function($scope, $modalInstance, PluginService, PageService, Id, AccountService) {
    PluginService.LoadTypeData($scope, null, function(data) {
        $scope.PluginTypeList = data;
    });
    $scope.tagTransform = function(newTag) {
        var strlist = newTag.split('|');
        var item = {
            Name: strlist[0],
            email: strlist[1],
            age: strlist[2],
            country: strlist[3]
        };
        return item;
    };
    $scope.Id = Id;
    $scope.model = {
        Value: "",
        Menus: []
    };
    $scope.event = {
        Save: function() {
            PluginService.Save($scope, $scope.model, function(data) {
                $modalInstance.close(data);
            });
        },
        Close: function() {
            $modalInstance.close();
        },
        Clear: function() {

        },
        AddPage: function() {
            $scope.model.Menus.push({});
        },
        DeletePage: function(index) {
            $scope.model.Menus.splice(index, 1);
        }
    }
    PageService.LoadData($scope, {}, function(data) {
        $scope.MenuList = data;
        PluginService.LoadInfo($scope, {
            ID: Id
        }, function(data) {
            $scope.model = data;
            $scope.model.Menus = SelectSet($scope.model.Menus, $scope.MenuList);
        });
    });
})

app.controller('SetOperationPowerCtrl', function($scope, $modalInstance, DataOperate, MenuTypeList, RoleService, AccountOperationService, AccountService, RelationID, RelationType, App) {
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
            AccountOperationService.SaveOperation($scope, {
                RelationID: RelationID,
                RelationType: RelationType,
                MenuType: $scope.Sel_MenuType.PlatformId,
                Permissions: Permissions
            }, function(data) {
                $modalInstance.close(data);
            })
        },
        Close: function() {
            $modalInstance.close();
        },
        SelectMenuType: function(row) {
            $scope.Sel_MenuType = row;
            AccountOperationService.GetOperation($scope, {
                MenuType: $scope.Sel_MenuType.PlatformId,
                RelationType: RelationType,
                RelationID: RelationID
            }, function(data) {
                $scope.SelectOperate = data; //已选中节点
                AccountOperationService.GetList($scope, {
                    AppID: App.AppId,
                    MenuType: $scope.Sel_MenuType.PlatformId
                }, function(data) {
                    DataOperate.ClearTreeNode($scope.tree);
                    DataOperate.BuildListChecked(data, $scope.SelectOperate, 'Id');
                    $scope.tree.addNodes(null, data, true);
                });
            })
        }
    }
    $scope.MenuType = MenuTypeList;
});
app.controller('SetPluginTagCtrl', function($scope, DataOperate, $modalInstance, PluginInstanceService, AccountOperationService, PluginClassificationPermissionService, AccountClassificationService, GroupRelationID, App, RelationID, RelationType) {
    $scope.AppId = App.AppId;
    $scope.event = {
        SelectPlugin: function(row) {
            $scope.Sel_Plugin = row;
            $scope.Sel_Design = $scope.Sel_Attribute = {};
            if (!row.Designs) {
                PluginClassificationPermissionService.GetDesigns($scope, {
                    PluginID: row.FkPluginId
                }, function(data) {
                    row.Designs = data;
                })
            }
        },
        SelectDesign: function(row) {
            $scope.Sel_Design = row;
            $scope.Sel_Attribute = {};
            if (!row.Attributes) {
                PluginClassificationPermissionService.GetDictionaryAttributes($scope, {
                    DesignID: row.Id
                }, function(data) {
                    row.Attributes = data;
                })
            }
        },
        SelectAttribute: function(row) {
            $scope.Sel_Attribute = row;
            if (!row.Tags) {
                AccountClassificationService.GetList($scope, {
                    AppID: App.AppId,
                    QueryType: 2,
                    PluginInstanceID: $scope.Sel_Plugin.Id,
                    PluginID: $scope.Sel_Plugin.FkPluginId,
                    DesignID: $scope.Sel_Design.Id,
                    DesignAttributeID: $scope.Sel_Attribute.Id,
                    ParentID: $scope.Sel_Attribute.ClassificationId
                }, function(data) {
                    var _data = data;

                    DataOperate.ClearTreeNode($scope.tree);
                    AccountClassificationService.GetPermissions($scope, {
                        ParentID: $scope.Sel_Attribute.ClassificationId,
                        AppID: App.AppId,
                        GroupRelationID: GroupRelationID,
                        PluginInstanceID: $scope.Sel_Plugin.Id,
                        PluginID: $scope.Sel_Plugin.FkPluginId,
                        DesignID: $scope.Sel_Design.Id,
                        DesignAttributeID: $scope.Sel_Attribute.Id,
                        RelationID: RelationID,
                        RelationType: RelationType
                    }, function(data) {
                        $scope.SelectNodes = data;
                        DataOperate.BuildListChecked(_data, $scope.SelectNodes, 'Id');
                        $scope.tree.addNodes(null, _data);
                    })
                })
            }
        },
        LoadTree: function() {
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "ParentId",
                        enable: true
                    }
                },
                callback: {
                    beforeExpand: function(treeId, treeNode) {
                        if (!treeNode.children) {
                            AccountService.GetCompanyAccounts($scope, {
                                ParentID: treeNode.Id
                            }, function(data) {
                                $scope.tree.addNodes(treeNode, data, true);
                            });
                        }
                    }
                }
            };
            $scope.tree = $.fn.zTree.init($("#Tag"), setting, []);
        },
        Save: function() {
            var check_nodes = $scope.tree.getCheckedNodes(true).concat($scope.SelectNodes).map(function(x) {
                x.childrenCount = x.children && x.children.length || 0;
                return x;
            });
            AccountClassificationService.SavePermissions($scope, {
                RelationID: RelationID,
                RelationType: RelationType,
                GroupRelationID: GroupRelationID,
                AppID: App.AppId,
                PluginInstanceID: $scope.Sel_Plugin.Id,
                PluginID: $scope.Sel_Plugin.FkPluginId,
                DesignID: $scope.Sel_Design.Id,
                DesignAttributeID: $scope.Sel_Attribute.Id,
                Permissions: check_nodes
            }, function(data) {
                // $modalInstance.close(data);
            })
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    $scope.event.LoadTree();
    AccountOperationService.GetPluginInstanceList($scope, {
        AppID: App.AppId
    }, function(data) {
        $scope.AppPluginList = data;
    });
})

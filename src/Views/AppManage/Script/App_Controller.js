app.directive("appplugintag", function() {
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
                                QueryType: 1,
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
app.controller('AppListCtrl', function($scope, AppService, $modal, $state, $stateParams, RoleService, Dialog) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        //节点权限
        DeptmentBtn: function(row) {
            Dialog.Show('/Views/AppManage/SetAppDeptment.html', 'SetAppDeptmentCtrl', 'sm', {
                App: function() {
                    return row;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData();
                }
            })
        },
        PersonTagBtn: function(row) {
            AppService.GetAppLineBlockTagList($scope, {
                AppID: row.AppId,
                UserName: ""
            }, function(data) {
                Dialog.Show('/Views/TagManage/SelectPersonalTag.html', 'SelectPersonalTagCtrl', 'lg', {
                    SelectData: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        AppService.SaveAppLineBlockTagPermissions($scope, {
                            AppID: row.AppId,
                            Permissions: result
                        }, function(data) {});
                    }
                })
            })
        },
        PluginTagBtn: function(row) {
            Dialog.Show('/Views/AppManage/Control/SetAppPluginTag.html', 'SetAppPluginTagCtrl', 'lg', {
                App: function() {
                    return row;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData();
                }
            })
        },
        LoadData: function() {
            AppService.LoadPageData($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.List = data.List;
                $scope.Page.Count = data.Num;
            })
        }
    }
    /*人组标签，节点权限被孙明干掉*/
    $scope.event = $.extend($scope.event, {
        PersonTagBtn: false,
        DeptmentBtn: false
    });
    RoleService.LoadRole($scope, $stateParams.MenuType);
    $scope.event.LoadData();
})
app.controller('SetAppDeptmentCtrl', function($scope, $modalInstance, DataOperate, DeptmentService, AppService, AccountNotePermissionsService, App) {
    $scope.event = {
        LoadData: function() {
            var setting = {
                check: {
                    enable: true,
                    radioType: "all"
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "ParentId",
                        enable: true
                    }
                },
                callback: {
                    //加载子节点
                    beforeExpand: function(treeId, treeNode) {
                        if (!treeNode.children) {
                            AccountNotePermissionsService.GetList($scope, {
                                QueryType: 1,
                                ParentID: treeNode.Id
                            }, function(data) {
                                DataOperate.BuildListChecked(data, $scope.SelectNode, "Id");
                                data.map(function(x) {
                                    if (treeNode.checked) x.checked = true;
                                    return x;
                                })
                                $scope.ztree.addNodes(treeNode, data);
                            })
                        }
                    }
                }
            };
            AppService.GetAppNoteList($scope, {
                AppID: App.AppId,
            }, function(data) {
                $scope.SelectNode = data;
                AccountNotePermissionsService.GetList($scope, {
                    QueryType: 1,
                    ParentID: "00000000-0000-0000-0000-000000000000"
                }, function(data) {
                    DataOperate.BuildListChecked(data, $scope.SelectNode, "Id");
                    $scope.ztree = $.fn.zTree.init($("#SetAppDeptment"), setting, data);
                })
            })
        },
        Save: function() {
            var selectNode = $scope.ztree.getCheckedNodes(true);
            selectNode.forEach(function(obj, i) {
                $scope.SelectNode.push(obj);
            })
            $scope.SelectNode.map(function(x) {
                x.childrenCount = x.children ? x.children.length : 0;
                return x;
            })
            $scope.model = {
                AppId: App.AppId,
                Permissions: $scope.SelectNode
            }
            AppService.SaveAppDeptment($scope, null, function(data) {
                $modalInstance.close(data);
            })
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    $scope.event.LoadData();
})
app.controller('SetAppPluginTagCtrl', function($scope, DataOperate, $modalInstance, PluginInstanceService, PluginClassificationPermissionService, AccountClassificationService, App) {
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
                    QueryType: 1,
                    PluginInstanceID: $scope.Sel_Plugin.Id,
                    PluginID: $scope.Sel_Plugin.FkPluginId,
                    DesignID: $scope.Sel_Design.Id,
                    DesignAttributeID: $scope.Sel_Attribute.Id,
                    ParentID: $scope.Sel_Attribute.ClassificationId
                }, function(data) {
                    var _data = data;

                    DataOperate.ClearTreeNode($scope.tree);

                    PluginClassificationPermissionService.GetPermissions($scope, {
                        // parentId: $scope.Sel_Attribute.ClassificationId,
                        AppID: App.AppId,
                        PluginInstanceID: $scope.Sel_Plugin.Id,
                        PluginID: $scope.Sel_Plugin.FkPluginId,
                        DesignID: $scope.Sel_Design.Id,
                        DesignAttributeID: $scope.Sel_Attribute.Id
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
            PluginClassificationPermissionService.Save($scope, {
                AppID: App.AppId,
                PluginInstanceID: $scope.Sel_Plugin.Id,
                PluginID: $scope.Sel_Plugin.FkPluginId,
                DesignID: $scope.Sel_Design.Id,
                DesignAttributeID: $scope.Sel_Attribute.Id,
                Permissions: check_nodes
            }, function(data) {

            })
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    $scope.event.LoadTree();
    PluginInstanceService.LoadPageData($scope, {
        AppID: App.AppId,
        PageIndex: 1
    }, function(data) {
        $scope.AppPluginList = data.List;
    });
})
app.controller('SetAppPersonalTagCtrl', function($scope, $modalInstance, AppService, App, TagService) {
    $scope.GridColumnList = GridColumnList;
    $scope.Page = {
        Index: 1
    };
    $scope.model = {
        AppId: App.AppId,
        Permissions: []
    }
    $scope.event = {
        Save: function() {
            angular.forEach($scope.data, function(obj, index) {
                if (obj.Checked) {
                    $scope.model.Permissions.push(obj)
                }
            });
            AppService.SaveAppLineBlockTagPermissions($scope, $scope.model, function(data) {
                $modalInstance.close(data)
            });
        },
        Close: function(row) {
            $modalInstance.close();
        },
        LoadData: function(row) {
            TagService.LoadPageData($scope, null, function(data) {
                $scope.data = data.List;
                AppService.GetAppLineBlockTagList($scope, {
                    AppID: App.AppId,
                    UserName: ""
                }, function(data) {
                    angular.forEach($scope.data, function(obj, index) {
                        angular.forEach(data, function(obj1, index1) {
                            if (obj1.TagId === obj.TagId) {
                                obj.Checked = true;
                            }
                        });
                    });
                })
            });
        }
    }
    $scope.event.LoadData();

})

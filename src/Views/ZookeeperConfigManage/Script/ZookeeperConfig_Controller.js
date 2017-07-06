//主页列表
app.controller('ZookeeperConfigListCtrl', function($scope, $state, ZookeeperConfigService, Dialog, service) {
    //模型管理事件
    $scope.TreeEvent = {
            Add: function() {
                Dialog.Show("/views/Design/KitDesignOperate.html", "KitDesignOperateCtrl", "lg", {
                    Design: function() {
                        return null;
                    },
                    Plugins: function() {
                        return $scope.Plugins;
                    },
                    PluginId: function() {
                        return $scope.Sel_Plugin.Id;
                    }
                }, function(result) {
                    if (result) {
                        $scope.event.LoadData($scope.Sel_Plugin);
                    }
                });
            }
        }
        //自定义属性事件
    $scope.CustomEvent = {
        Add: function() {
            if (!$scope.Sel_Design) {
                service.msg.alert("请先创建模型");
                return;
            }
            Dialog.Show("/views/Design/KitDesignAttributeOperate.html", "KitDesignAttributeOperateCtrl", "lg", {
                Attr: function() {
                    return null;
                },
                Designs: function() {
                    return $scope.Sel_Plugin.Designs;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/Design/KitDesignAttributeOperate.html", "KitDesignAttributeOperateCtrl", "lg", {
                Attr: function() {
                    return row;
                },
                Designs: function() {
                    return $scope.Sel_Plugin.Designs;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Delete: function(row) {
            ZookeeperConfigService.DeleteDesignAttribute($scope, {
                DesignAttributeID: row.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Plugin);
            });
        }
    };
    //键事件
    $scope.KeyEvent = {
        Add: function() {
            if ($scope.Sel_Design.DesignCustomAttributes.length === 0) {
                service.msg.alert("请先创建自定义属性");
                return;
            }
            if ($scope.Sel_Design.HasKey) {
                service.msg.alert("单个模型只能含有一个主键");
                return;
            }
            Dialog.Show("/views/Design/KitDesignKeyOperate.html", "KitDesignKeyOperateCtrl", "lg", {
                Key: function() {
                    return null;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/Design/KitDesignKeyOperate.html", "KitDesignKeyOperateCtrl", "lg", {
                Key: function() {
                    return row;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Delete: function(row) {
            ZookeeperConfigService.DeleteDesignKey($scope, {
                DesignKeyID: row.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Plugin);
            });
        }
    };
    //索引事件
    $scope.IndexEvent = {
        Add: function() {
            if ($scope.Sel_Design.DesignCustomAttributes.length === 0) {
                service.msg.alert("请先创建自定义属性");
                return;
            }
            Dialog.Show("/views/Design/KitDesignIndexOperate.html", "KitDesignIndexOperateCtrl", "lg", {
                Index: function() {
                    return null;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/Design/KitDesignIndexOperate.html", "KitDesignIndexOperateCtrl", "lg", {
                Index: function() {
                    return row;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        Delete: function(row) {
            ZookeeperConfigService.DeleteDesignIndex($scope, {
                DesignID: row.Id
            }, function(data) {
                $scope.event.GetDesignRelatives($scope.Sel_Design);
            });
        }
    };
    $scope.event = {
        EditDesign: function(row) {
            Dialog.Show("/views/Design/KitDesignOperate.html", "KitDesignOperateCtrl", "lg", {
                Design: function() {
                    return row;
                },
                Plugins: function() {
                    return $scope.Plugins;
                },
                PluginId: function() {
                    return $scope.Sel_Plugin.Id;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Plugin);
                }
            });
        },
        DeleteDesign: function(row) {
            ZookeeperConfigService.DeleteDesign($scope, {
                DesignID: row.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Plugin);
            });
        },
        //获取插件相关的模型
        LoadData: function(row) {
            $scope.Sel_Plugin = row;
            $scope.Sel_Design = $scope.Sel_Attribute = {};
            ZookeeperConfigService.GetDesignsByPluginId($scope, {
                PluginID: row.Id
            }, function(data) {
                row.Designs = data;
            });
        },
        //获取插件列表
        GetPlugins: function() {
            ZookeeperConfigService.GetPlugins($scope, null, function(data) {
                $scope.Plugins = data;
            });
        },
        GetDesignRelatives: function(row) {
            $scope.Sel_Design = row;
            $scope.Sel_Attribute = {};
            $scope.Sel_Key = {};
            $scope.Sel_Index = {};
        },
        //创建解决方案
        CreateSolution: function() {
            Dialog.Show("/views/Design/KitSolutionOperate.html", "KitSolutionOperateCtrl", "lg", {
                Designs: function() {
                    return $scope.Sel_Plugin.Designs;
                }
            }, function(result) {
                if (result) {}
            });
        }
    };
    $scope.event.GetPlugins();
});
//模型编辑
app.controller('ZookeeperConfigOperateCtrl', function($scope, $modalInstance, ZookeeperConfigService, Design, Plugins, PluginId, service) {
    $scope.model = Design;
    $scope.Plugins = Plugins;
    $scope.event = {
        Save: function() {
            if ($scope.model.Id) {
                ZookeeperConfigService.ModifyDesign($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                ZookeeperConfigService.AddDesign($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        },
        LoadData: function() {
            if (!$scope.model) {
                $scope.model = {};
            }
            $scope.model.PluginId = PluginId;
        }
    };
    $scope.event.LoadData();
});
//属性编辑
app.controller('ZookeeperConfigServerOperateCtrl', function($scope, $modalInstance, ZookeeperConfigService, Attr, Designs, Design, service) {
    $scope.GridColumnList = GridColumnList;
    $scope.Designs = Designs;
    $scope.model = Attr;
    $scope.Design = Design;
    $scope.HasType = 0;
    $scope.Custom = false;
    $scope.OriginCategory = Attr && Attr.Category ? Attr.Category : 0;
    $scope.DropDownListData = {
            Categories: [{
                DisplayName: "自定义属性",
                Code: 0
            }, {
                DisplayName: "特征属性",
                Code: 1
            }],
            Types: [{
                DisplayName: "字典数据",
                Code: 0
            }, {
                DisplayName: "模型数据",
                Code: 1
            }, {
                DisplayName: "人员服务",
                Code: 2
            }, {
                DisplayName: "群组服务",
                Code: 3
            }],
            RelationTypes: [{
                DisplayName: "一对一",
                Code: 0
            }, {
                DisplayName: "一对多",
                Code: 1
            }, {
                DisplayName: "多对多",
                Code: 2
            }, {
                DisplayName: "多对一",
                Code: 3
            }]
        }
        //监控属性类别
    $scope.$watch("model.Category", function(newval, oldval) {
        if (newval === oldval) return;
        $scope.event.GetCategory();
    });
    //监控数据类型值
    $scope.$watch("model.TypeValue", function(newval, oldval) {
        if (newval === oldval) return;
        $scope.event.GetTypeLength();
    });
    //监控数据类型
    $scope.$watch("model.Type", function(newval, oldval) {
        if (newval === oldval) return;
        $scope.event.GetTypeValue();
    });
    //监控数据关系
    $scope.$watch("model.RelationType", function(newval, oldval) {
        if (newval === oldval) return;
        $scope.event.HasForeignKeyColumns();
    });
    $scope.event = {
        Save: function() {
            $scope.model.ForeignKeyAttributeIds = [];
            $scope.Design.DesignCustomAttributes.forEach(function(obj, i) {
                if (obj.Checked) {
                    $scope.model.ForeignKeyAttributeIds.push(obj.Id);
                }
            })
            if ($scope.model.Id) {
                ZookeeperConfigService.ModifyDesignAttribute($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                ZookeeperConfigService.AddDesignAttribute($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        },
        GetCategory: function() {
            switch ($scope.model.Category) {
                case 0:
                    $scope.TypeValues = $scope.event.GetDataTypes();
                    $scope.model.TypeValue = null;
                    $scope.model.Type = null;
                    $scope.model.RelationType = null;
                    $scope.Custom = false;
                    $scope.HasType = 0;
                    break;
                case 1:
                    $scope.model.Type = $scope.DropDownListData.Types[0];
                    $scope.TypeValues = $scope.Designs;
                    $scope.model.TypeValue = null;
                    $scope.Custom = true;
                    $scope.HasType = 1;
                    break;
                default:
            }
        },
        GetTypeLength: function() {
            if ($scope.model.TypeValue === "ccafb2a3-cf45-c0b2-36be-08d291789008") {
                $scope.Haslength = true;
            } else {
                $scope.Haslength = false;
                $scope.model.Length = 0;
            }
        },
        GetTypeValue: function() {
            $scope.TypeValues = null;
            switch ($scope.model.Type) {
                case 0:
                    $scope.model.TypeValue = null;
                    $scope.HasType = 1;
                    $scope.Custom = true;
                    break;
                case 1:
                    $scope.model.TypeValue = null;
                    $scope.TypeValues = $scope.Designs;
                    $scope.HasType = 2;
                    $scope.Custom = true;
                    break;
                case 2:
                case 3:
                    $scope.model.TypeValue = null;
                    $scope.HasType = 3;
                    break;
                default:
            }
        },
        GetDataTypes: function() {
            ZookeeperConfigService.GetDataTypes($scope, null, function(data) {
                $scope.TypeValues = data;
            })
        },
        HasForeignKeyColumns: function() {
            if ($scope.model.RelationType === 3) { //多对一
                $scope.HasColumn = true;
                if ($scope.OriginCategory === 0) {
                    $scope.Design.DesignCustomAttributes = $scope.Design.DesignCustomAttributes.filter(function(x) {
                        if (x.Id !== $scope.model.Id) return x;
                    });
                }
            } else
                $scope.HasColumn = false;
        },
        LoadData: function() {
            $scope.HasType = 0;
            $scope.Custom = false;
            if ($scope.model) {
                $scope.Design.DesignCustomAttributes.map(function(x) {
                    x.Checked = false;
                });
                for (var i = 0; i < $scope.Design.DesignCustomAttributes.length; i++) {
                    for (var j = 0; j < $scope.model.ForeignKeyDetails.length; j++) {
                        if ($scope.model.ForeignKeyDetails[j].FkAttributeId === $scope.Design.DesignCustomAttributes[i].Id) {
                            $scope.Design.DesignCustomAttributes[i].Checked = true;
                            continue;
                        }
                    }
                }
                if ($scope.model.Category === 0) {
                    $scope.HasType = 0;
                    $scope.Custom = false;
                    $scope.event.GetDataTypes();
                    if ($scope.model.TypeValue === "ccafb2a3-cf45-c0b2-36be-08d291789008") {
                        $scope.Haslength = true;
                    }
                }
                if ($scope.model.Category === 1 && $scope.model.Type === 0) {
                    $scope.Custom = true;
                    $scope.HasType = 1;
                }
                if ($scope.model.Category === 1 && $scope.model.Type === 1) {
                    $scope.TypeValues = $scope.Designs;
                    $scope.Custom = true;
                    $scope.HasType = 2;
                }
                if ($scope.model.Type === 1 && $scope.model.RelationType === 3) {
                    $scope.HasColumn = true;
                    $scope.Custom = true;
                    $scope.HasType = 2;
                }
            }
            if (!$scope.model) {
                $scope.model = {};
                $scope.model.Category = 0;
                $scope.model.Length =0;
                $scope.event.GetDataTypes();
            }
            $scope.model.FkDesignId = $scope.Design.Id;
            $scope.model.PluginId = $scope.Design.PluginId;
        }
    };
    $scope.event.LoadData();
});
app.filter('DataTypeFilter', function($sce) {
    return function(data) {
        if (data === 0) {
            return '字典数据';
        } else if (data === 1) {
            return '模型关系';
        } else if (data === 2) {
            return '人员数据';
        } else if (data === 3) {
            return '群组数据';
        } else if (data === 4) {
            return '模型数据';
        }
        return '';
    }
});
//格式化数据关系
app.filter('RelationTypeFilter', function($sce) {
    return function(data) {
        if (data === 0) {
            return '一对一';
        } else if (data === 1) {
            return '一对多';
        } else if (data === 2) {
            return '多对多';
        } else if (data === 3) {
            return '多对一';
        }
        return '';
    }
});
//
app.filter('ColumnListFilter', function($sce) {
    return function(data) {
        return data.map(function(x) {
            return x.AttributeName;
        }).join(",")
    }
});
app.filter('KeyTypeFilter', function($sce) {
    return function(data) {
        if (data === 0) {
            return '主键';
        }
        return '其他';
    }
});
//主页列表
app.controller('KitDesignListCtrl', function($scope, $state, DesignService, Dialog, service) {
    //模型管理事件
    $scope.eventName = {
        Add: "添加表",
        AddElse: "添加模型"
    }
    $scope.TreeEvent = {
        //添加表
        Add: function() {
            if ($scope.ModelList.length === 0) {
                service.msg.alert("请先创建模型！");
                return;
            }
            Dialog.Show("/views/DesignManage/KitDesignOperate.html", "KitDesignOperateCtrl", "lg", {
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
        },
        //添加模型
        AddElse: function() {
            Dialog.Show("/views/DesignManage/KitDesignModelOperate.html", "KitDesignModelOperateCtrl", "lg", {
                Design: function() {
                    return null;
                },
                Model: function() {
                    return null;
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
    };
    //自定义属性事件
    $scope.CustomEvent = {
        Add: function() {
            if (!$scope.Sel_Design) {
                service.msg.alert("请先创建模型");
                return;
            }
            Dialog.Show("/views/DesignManage/KitDesignAttributeOperate.html", "KitDesignAttributeOperateCtrl", "lg", {
                Attr: function() {
                    return null;
                },
                Designs: function() {
                    return $scope.Designs
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/DesignManage/KitDesignAttributeOperate.html", "KitDesignAttributeOperateCtrl", "lg", {
                Attr: function() {
                    return row;
                },
                Designs: function() {
                    return $scope.Designs
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Delete: function(row) {
            DesignService.DeleteDesignAttribute($scope, {
                DesignAttributeID: row.Id
            }, function(data) {
                $scope.event.GetDesignRelatives($scope.Sel_Design);
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
            Dialog.Show("/views/DesignManage/KitDesignKeyOperate.html", "KitDesignKeyOperateCtrl", "lg", {
                Key: function() {
                    return null;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/DesignManage/KitDesignKeyOperate.html", "KitDesignKeyOperateCtrl", "lg", {
                Key: function() {
                    return row;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Delete: function(row) {
            DesignService.DeleteDesignKey($scope, {
                DesignKeyID: row.Id
            }, function(data) {
                $scope.event.GetDesignRelatives($scope.Sel_Design);
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
            Dialog.Show("/views/DesignManage/KitDesignIndexOperate.html", "KitDesignIndexOperateCtrl", "lg", {
                Index: function() {
                    return null;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/DesignManage/KitDesignIndexOperate.html", "KitDesignIndexOperateCtrl", "lg", {
                Index: function() {
                    return row;
                },
                Design: function() {
                    return $scope.Sel_Design;
                }
            }, function(result) {
                if (result) {
                    $scope.event.GetDesignRelatives($scope.Sel_Design);
                }
            });
        },
        Delete: function(row) {
            DesignService.DeleteDesignIndex($scope, {
                DesignIndexID: row.Id
            }, function(data) {
                $scope.event.GetDesignRelatives($scope.Sel_Design);
            });
        }
    };
    $scope.event = {
        //选择聚合
        Record: function(model, event) {
            event.stopPropagation();
            Dialog.Show("/views/DesignManage/KitDesignSelectTables.html", "KitDesignRecordOperateCtrl", "lg", {
                Design: function() {
                    return null;
                },
                Model: function() {
                    return model;
                },
                PluginId: function() {
                    return $scope.Sel_Plugin.Id;
                }
            }, function(result) {
                if (result) {
                    DesignService.ModifyRelation($scope, {
                        DesignID: result[0].Id,
                        ModelID: model.Id
                    }, function(data) {
                        $scope.event.LoadData($scope.Sel_Plugin);
                    });
                }
            });
        },
        //修改模型
        EditElse: function(model, event) {
            event.stopPropagation();
            Dialog.Show("/views/DesignManage/KitDesignModelOperate.html", "KitDesignModelOperateCtrl", "lg", {
                Design: function() {
                    return null;
                },
                Model: function() {
                    return model;
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
        //选择表
        AddElse: function(model, event) {
            event.stopPropagation();
            Dialog.Show("/views/DesignManage/KitDesignSelectTables.html", "KitDesignSelectTablesCtrl", "lg", {
                Model: function() {
                    return model;
                }
            }, function(result) {
                var PostData = [];
                if (result) {
                    angular.forEach(result, function(obj, index) {
                        PostData.push({
                            FkModelId: model.Id,
                            FkDesignId: obj.Id
                        })
                    });
                    DesignService.AddRelation($scope, PostData, function(data) {
                        $scope.event.LoadData($scope.Sel_Plugin);
                    });
                }
            });
        },
        EditDesign: function(row, modelId, event) {
            row.Design.ModelId = modelId;
            event.stopPropagation();
            Dialog.Show("/views/DesignManage/KitDesignOperate.html", "KitDesignOperateCtrl", "lg", {
                Design: function() {
                    return row.Design;
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
        DeleteDesign: function(row, event) {
            event.stopPropagation();
            DesignService.DeleteDesign($scope, {
                DesignID: row.Design.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Plugin);
            });
        },
        DeleteRelation: function(row, event) {
            event.stopPropagation();
            DesignService.DeleteRelation($scope, {
                DesignID: row.Design.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Plugin);
            });
        },
        SelectedItem: function(row) {
            if (row === $scope.Sel_Plugin) {
                return;
            }
            $scope.Sel_Plugin = row;
            $scope.SelectedItem = undefined;
            $scope.event.LoadData($scope.Sel_Plugin);
            //获取插件下的表
            DesignService.GetDesignsByPluginId($scope, $scope.Sel_Plugin, function(data) {
                $scope.Designs = data;
            });
        },
        //获取插件相关的模型
        LoadData: function(row) {
            DesignService.GetModelList($scope, {
                PluginId: row.Id
            }, function(data) {
                if (data.length !== 0) {
                    angular.forEach(function(obj, index) {
                        angular.forEach(function(obj1, index1) {
                            obj1.Design.IsPrimary = obj1.IsPrimary;
                        });
                    });
                }
                $scope.ModelList = data;
            });
        },
        //获取插件列表
        GetPlugins: function() {
            DesignService.GetPlugins($scope, null, function(data) {
                $scope.Plugins = data;
            });
        },
        GetDesignRelatives: function(row, event) {
            if (row === $scope.SelectedItem) return;
            $scope.SelectedItem = row;
            $scope.Sel_Key = {};
            $scope.Sel_Index = {};
            DesignService.GetDesign($scope, row, function(data) {
                $scope.Design = data;
                $scope.Sel_Design = data;
            });
        },
        //创建解决方案
        CreateSolution: function() {
            Dialog.Show("/views/DesignManage/KitSolutionOperate.html", "KitSolutionOperateCtrl", "lg", {
                ModelList: function() {
                    return $scope.ModelList;
                }
            }, function(result) {
                if (result) {}
            });
        }
    };
    $scope.event.GetPlugins();
});
//选择聚合
app.controller('KitDesignRecordOperateCtrl', function($scope, DesignService, $modalInstance, Model, service) {
        $scope.model = Model;
        $scope.event = {
            Save: function() {
                var PostData = undefined;
                PostData = $scope.data.filter(function(obj) {
                    return obj.Checked;
                });
                if (PostData.length !== 1) {
                    service.msg.alert("只能选一个！")
                    return;
                }
                $modalInstance.close(PostData);
            },
            Close: function() {
                $modalInstance.close();
            },
            LoadData: function() {
                DesignService.GetDesigns($scope, $scope.model, function(data) {
                    $scope.data = data.filter(function(obj) {
                        return obj.IsChecked;
                    });
                    angular.forEach($scope.data, function(obj, index) {
                        angular.forEach($scope.model.ModelRelations, function(obj1, index1) {
                            if (obj1.IsPrimary && obj1.FkDesignId === obj.Id) {
                                obj.Checked = true;
                            }
                        });
                    });
                });
            }
        };
        $scope.event.LoadData();
    })
    //选择表
app.controller('KitDesignSelectTablesCtrl', function($scope, DesignService, $modalInstance, Model) {
        $scope.model = Model;
        $scope.event = {
            Save: function() {
                var PostData = undefined;
                PostData = $scope.data.filter(function(obj) {
                    return obj.Checked;
                });
                $modalInstance.close(PostData);
            },
            Close: function() {
                $modalInstance.close();
            },
            LoadData: function() {
                DesignService.GetDesigns($scope, $scope.model, function(data) {
                    data.map(function(obj) {
                        if (obj.IsChecked) {
                            obj.Checked = obj.IsChecked;
                        }
                        return obj;
                    })
                    $scope.data = data;
                });
            }
        };
        $scope.event.LoadData();
    })
    //模型编辑
app.controller('KitDesignModelOperateCtrl', function($scope, $modalInstance, DesignService, Design, PluginId, service, Model) {
    $scope.model = Model;
    $scope.event = {
        Save: function() {
            if ($scope.model.Id) {
                DesignService.ModifyKidModel($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                DesignService.AddKidModel($scope, $scope.model, function(data) {
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
//表编辑
app.controller('KitDesignOperateCtrl', function($scope, $modalInstance, DesignService, Design, PluginId, Plugins, service) {
    $scope.model = Design;
    $scope.Plugins = Plugins;
    $scope.event = {
        Save: function() {
            if ($scope.model.Id) {
                DesignService.ModifyDesign($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                DesignService.AddDesign($scope, $scope.model, function(data) {
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
        },
        //获取模型列表
        GetModelList: function() {
            $scope.TableType = [{
                TableName: "横表",
                TableCode: 0
            }, {
                TableName: "竖表",
                TableCode: 1
            }]
            DesignService.GetModelList($scope, {
                PluginId: PluginId
            }, function(data) {
                $scope.ModelList = data;
            });
        },
    };
    $scope.event.LoadData();
    $scope.event.GetModelList();
});
//解决方案模板创建
app.controller('KitSolutionOperateCtrl', function($scope, $modalInstance, DesignService, ModelList, service) {
    var AddUser = service.Cookie.Get("UserID");
    $scope.model = {
        PostData: []
    }
    $scope.ModelList = ModelList;
    $scope.event = {
        Save: function() {
            $scope.model.PostData = [];
            $scope.ModelList.filter(function(obj) {
                return obj.Checked;
            }).map(function(o) {
                $scope.model.PostData.push(o.Id)
                return true;
            })
            DesignService.CreateSolution($scope, $scope.model, function(data) {
                $modalInstance.close();
                var url = Route.KitDesign_GetFile.Url + "?fileName=" + data + '&addUser=' + AddUser;
                var f = document.createElement("a");
                f.setAttribute("href", url);
                document.body.appendChild(f);
                f.click();
                $modalInstance.close(data);
            });
        },
        Close: function() {
            $modalInstance.close();
        }
    };
});
//属性编辑
app.controller('KitDesignAttributeOperateCtrl', function($scope, $modalInstance, DesignService, Attr, Design, Designs, service) {
    $scope.model = Attr;
    $scope.Design = Design;
    $scope.Designs = Designs;
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
            DisplayName: "模型关系",
            Code: 1
        }, {
            DisplayName: "人员服务",
            Code: 2
        }, {
            DisplayName: "群组服务",
            Code: 3
        }, {
            DisplayName: "模型数据",
            Code: 4
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
    };
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
            ($scope.Design.DesignCustomAttributes || []).forEach(function(obj, i) {
                if (obj.Checked) {
                    $scope.model.ForeignKeyAttributeIds.push(obj.Id);
                }
            })
            if ($scope.model.Id) {
                DesignService.ModifyDesignAttribute($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                DesignService.AddDesignAttribute($scope, $scope.model, function(data) {
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
                case 4:
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
        //获取数据类型
        GetDataTypes: function() {
            DesignService.GetDataTypes($scope, null, function(data) {
                $scope.TypeValues = data;
            })
        },
        //如果包含外键
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
                if ($scope.model.Category === 1 && $scope.model.Type === 0 || ($scope.model.Type === 4)) {
                    $scope.Custom = true;
                    $scope.HasType = 1;
                }
                if ($scope.model.Category === 1 && ($scope.model.Type === 1)) {
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
                $scope.model.Length = 0;
                $scope.event.GetDataTypes();
            }
            $scope.model.FkDesignId = $scope.Design.Id;
            $scope.model.PluginId = $scope.Design.PluginId;
        }
    };
    $scope.event.LoadData();
    // DesignService.GetDesignsByPluginId($scope, $scope.SelectedPlugin, function(data) {
    //     $scope.Designs = data;
    // });
});
//键编辑
app.controller('KitDesignKeyOperateCtrl', function($scope, $modalInstance, DesignService, Key, Design, service) {
    $scope.GridColumnList = GridColumnList;
    $scope.model = Key;
    $scope.Design = Design;
    $scope.event = {
        Save: function() {
            $scope.model.DesignAttributes = [];
            $scope.Design.DesignCustomAttributes.forEach(function(obj, i) {
                if (obj.Checked) {
                    $scope.model.DesignAttributes.push(obj.Id);
                }
            });
            if ($scope.model.Id) {
                DesignService.ModifyDesignKey($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                DesignService.AddDesignKey($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        },
        LoadData: function() {
            $scope.Design.DesignCustomAttributes.filter(function(x) {
                x.Checked = false;
            });
            if ($scope.model) {
                for (var i = 0; i < $scope.Design.DesignCustomAttributes.length; i++) {
                    for (var j = 0; j < $scope.model.KeyDetails.length; j++) {
                        if ($scope.Design.DesignCustomAttributes[i].Id === $scope.model.KeyDetails[j].FkAttributeId) {
                            $scope.Design.DesignCustomAttributes[i].Checked = true;
                            continue;
                        }
                    };
                };
            }
            if (!$scope.model) {
                $scope.model = {};
            }
            $scope.model.FkDesignId = Design.Id;
            $scope.model.PluginId = $scope.Design.PluginId;
        }
    };
    $scope.event.LoadData();
});
//索引编辑
app.controller('KitDesignIndexOperateCtrl', function($scope, $modalInstance, DesignService, Index, Design, service) {
    $scope.GridColumnList = GridColumnList;
    $scope.model = Index;
    $scope.Design = Design;
    $scope.event = {
        Save: function() {
            $scope.model.DesignAttributes = [];
            $scope.Design.DesignCustomAttributes.forEach(function(obj, i) {
                if (obj.Checked) {
                    $scope.model.DesignAttributes.push(obj.Id);
                }
            })
            if ($scope.model.Id) {
                DesignService.ModifyDesignIndex($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                DesignService.AddDesignIndex($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        },
        LoadData: function() {
            $scope.Design.DesignCustomAttributes.filter(function(x) {
                x.Checked = false;
            });
            if ($scope.model) {
                for (var i = 0; i < $scope.Design.DesignCustomAttributes.length; i++) {
                    for (var j = 0; j < $scope.model.IndexDetails.length; j++) {
                        if ($scope.Design.DesignCustomAttributes[i].Id === $scope.model.IndexDetails[j].FkAttributeId) {
                            $scope.Design.DesignCustomAttributes[i].Checked = true;
                            continue;
                        }
                    };
                };
            }
            if (!$scope.model) {
                $scope.model = {};
            }
            $scope.model.FkDesignId = $scope.Design.Id;
            $scope.model.PluginId = $scope.Design.PluginId;
        }
    };
    $scope.event.LoadData();
});

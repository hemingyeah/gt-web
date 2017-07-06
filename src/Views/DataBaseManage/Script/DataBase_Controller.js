app.directive("dropdowntree", function () {
    return {
        restrict: "E",
        replace: true,
        template: function (e, a) {
            return '<ul id="' + a.id + '" class="ztree"></ul>'
        },
        controller: function ($scope, UiConfigService) {
            $scope.UiConfigService = UiConfigService;
        },
        link: function ($scope, element, attr, ngModel) {
            $scope.DictionaryTree = "";
            var setting = {
                check: {
                    enable: attr.check || attr.check == "",
                    chkStyle: attr.chkstyle
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "ParentId",
                        enable: true
                    }
                },
                callback: {
                    beforeExpand: function (treeId, treeNode) {
                        var RootDisTree = "";
                        if (!treeNode.children) {
                            $scope.UiConfigService.GetOrgans($scope, {
                                ParentID: treeNode.Id,
                                PageIndex: 1,
                                PageSize: 99,
                                Filter: ""
                            }, function (data) {
                                $scope.tree.addNodes(treeNode, data.map(function (x) {
                                    x.name = x.DisplayName;
                                    x.isParent = x.HasChild;
                                    return x;
                                }))
                            });
                        }
                    }
                }
            };
            $scope.tree = $.fn.zTree.init($("#" + attr.id), setting, []);
        }
    }
})

app.directive("datafilter", function () {
    return {
        restrict: "E",
        replace: true,
        template: function (e, a) {
            return '<ul class="ztree" id="' + a.id + '"></ul>';
        },
        link: function ($scope, e, a) {
            $scope.tree = "";
            var setting = {
                check: {
                    // enable: a.check || a.check == "",
                    // chkStyle: a.checkstyle || a.checkstyle == "",
                    // radioType: a.radiotype || a.radiotype == ""

                    enable: true,
                    chkStyle: "radio",
                    radioType: "level"
                },
                data: {
                    simpleData: {
                        idKey: "Id",
                        pIdKey: "ParentId",
                        enable: true
                    }
                },
                view: {
                    showLine: true,
                    showIcon: true
                },
                callback: {
                    beforeExpand: function (treeId, treeNode) {
                        if (!treeNode.children) {
                            $scope.UiConfigService.GetDimensionalityTreeById($scope, {
                                FKDataSourceItemID: treeNode.Id
                            }, function (data, key) {
                                data.map(function (x) {
                                    x.rId = treeNode.rId || treeNode.Id;
                                    return x;
                                })
                                $scope.tree.addNodes(treeNode, data.map(function (x) {
                                    x.name = x.DisplayName;
                                    return x;
                                }), true);
                            });
                        }
                    },
                    onClick: function (event, treeId, treeNode) {
                        $scope.$apply(function () {
                            treeNode.PersonalAccount = treeNode.name;
                            $scope.Sel_PersonalAccount = treeNode;
                        })
                    }, onCheck: function (event, treeId, treeNode) {
                        $scope.$apply(function () {
                            $scope.gridOptions.event.LoadData();
                        });
                    }
                }
            };
            $scope.tree = $.fn.zTree.init($("#" + a.id), setting, []);
        },
        controller: function ($scope, UiConfigService) {
            $scope.UiConfigService = UiConfigService;
        }
    };
});
app.directive("reportdata", function () {
    return {
        restrict: "E",
        replace: true,
        template: function (e, a) {
            var html = $('<div style="height:100%; min-height:500px;"/>');
            var datagrid = $('<datagrid  agGrid="gridOptions"></datagrid>');
            if (a.hidefilter) {
                datagrid.appendTo(html);
                // left_layout.attr({
                //     hideFilter: 'true'
                // });
            } else {
                var layout = $('<Layout/>').appendTo(html);
                var left_layout = $('<Item Label="报表筛选" width="sm" id="filter"></Item>').appendTo(layout);
                var right_layout = $('<Item Label="查询结果" BgColor="White" event="gridOptions.event"></Item>').appendTo(layout);
                // 左侧
                $("<DataFilter id='DataFilter'></DataFilter>").appendTo(left_layout);
                //右侧
                //$('<ButtonBar></ButtonBar>').appendTo(right_layout);
                datagrid.appendTo(right_layout);
            }
            return html[0].outerHTML;
        },
        controller: function ($scope, UiConfigService) {
            $scope.UiConfigService = UiConfigService;
        },
        link: function ($scope, e, a) {
            $scope.attr = a;
            $scope.Id = a.id;
            $scope.GridColumnList.TempColumns = [];
            $scope.Page = {
                Index: 1
            };
            $scope.event = $.extend($scope.event, {
                LoadData: function () {
                    $scope.UiConfigService.GetTableList($scope, {
                        IsSetting: true,
                        DataBaseID: a.id,
                        PageIndex: 1
                    }, function (data) {
                        if (!$scope.attr.hidefilter) {
                            var treedata = []
                            $scope.Filters = data.List.filter(function (x) {
                                x.Columns.filter(function (o) {
                                    if (o.AttributeType === 1) {
                                        treedata.push(o)
                                        $scope.tree.addNodes(null, {
                                            Id: o.Id,
                                            TypeValue: o.TypeValue,
                                            name: o.ChineseName,
                                            DisplayName: o.DisplayName,
                                            isParent: true,
                                            nocheck: true
                                        })
                                    }
                                })
                                return x;
                            });
                        };
                    });
                },
                Search: function () {
                    $scope.gridOptions.event.LoadData();
                }
            });
            $scope.event.LoadData();
        }
    }
});
app.controller('DataBaseListCtrl', function ($scope, $modal, $state, $stateParams, UiConfigService, RoleService, Dialog, manageService) {

    $scope.dataService = UiConfigService;
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
    var manage = manageService.constructor($scope, $scope.gridOptions, "DataBaseOperateCtrl", "/views/DataBaseManage/DataBaseOperate.html");

    $scope.gridOptions.event = $.extend(manage, {
        Config: function (params) {
            if (!params && !cur.$scope.currentItem) {
                cur.service.msg.alert("请选择要配置的数据！");
                return;
            }
            params = params || cur.$scope.currentItem.data;
            UiConfigService.GetTableSettingList($scope, {
                organId: params.OrganId,
                fkUiConfigId: params.Id
            }, function (data) {
                $scope.serOldChecked(data);
                Dialog.Show("/views/DataBaseManage/DataBaseSearch.html", "DataBaseSearchCtrl", "lg", {
                    MenuType: function () {
                        return "1";
                    },
                    fkUiConfigId: function () {
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
app.controller('DataBaseOperateCtrl', function ($scope, $state, $modalInstance, UiConfigService, RoleService, editService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = UiConfigService;
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
            UiConfigService.ConnectDatabaseTest($scope, null, function (data) {

            });
        },
        LoadOrgan: function (filter) {
            UiConfigService.GetOrgans($scope, {
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
app.controller('DataBaseSearchCtrl', function ($scope, $modal, $modalInstance, service, Dialog, DataOperate, manageService, UiConfigService, RoleService, MenuType, fkUiConfigId, data) {
    $scope.eventName = {
        Next: "保存并下一步"
    }
    $scope.checkBox = false;
    $scope.rowsAlreadyGrouped = true;
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
                UiConfigService.SaveDataTableSetting($scope, changeData, fkUiConfigId, function (data) {
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
            function setValues(obj) {
                obj.Attribute = "";
                obj.AttributeTags = {};
                obj.Values.forEach(function (item) {
                    obj.Attribute += item.DisplayName + ";";
                    obj.AttributeTags[item.FkDictionaryId] = item;
                });
            }
            var checks = $scope.getCheckedLeafContainParentData($scope.gridColumnOptions.rowData);

            $scope.currentColumns = [];
            angular.forEach(checks, function (obj) {
                if (obj.group === true) {
                    angular.forEach(obj.children, function (objChild) {
                        if (objChild.group === false && objChild.data.IsChecked) {
                            objChild.data.IsVeidoo = objChild.data.AttributeType === 1;
                            if (objChild.data.Values && objChild.data.Values.length > 0) {
                                setValues(objChild.data);
                            }
                            $scope.currentColumns.push(objChild.data);
                        }
                    });
                }
            });
            $scope.steps.step3 = true;
        },
        Close: function () {
            $modalInstance.close();
        }
    }
    $scope.event_3 = {
        Prev: function () {
            $scope.steps.step2 = true;
        },
        Next: function () {
            var changeData = $scope.getChangedCheckedLeafData($scope.gridColumnOptions.rowData);//
            if (changeData.length !== 0 || !$scope.ControlTypeDic) {
                UiConfigService.SaveDataColumnSetting($scope, changeData, function (data) {
                    $scope.serOldChecked(changeData); //将保存成功的状态和原始状态进行同步
                    $scope.ControlTypeDic = {};//将控件类型数组转化为字典
                    var controlList = data.ControlList.map(function (obj) {
                        $scope.ControlTypeDic[obj.Value] = obj.Id;
                        return {
                            "Id": obj.Id,
                            "Code": obj.DisplayName,
                            "Value": obj.Value
                        }
                    });
                    service.http.ajax({
                        type: "get",
                        url: "/Resources/config/webconfig.json"
                    }).success(function (data) {
                        $scope.ControlDic = {};
                        data.forEach(function (obj) {
                            $scope.ControlDic[obj.Code] = [{
                                "Code": "controlType",
                                "Description": "控件类型",
                                "DataType": "enum",
                                "DataState": 0,
                                "EnumValue": controlList,
                                "Select": function (option) {
                                    if ($scope.currentConfig.Attributes[0].Id) {
                                        var tempAttr = {};
                                        for (var item in $scope.ControlDic[option.Value]) {
                                            if ($scope.ControlDic[option.Value][item].Code) {
                                                tempAttr[$scope.ControlDic[option.Value][item].Code] = $scope.ControlDic[option.Value][item];
                                            }
                                        }

                                        for (var i = 0; i < $scope.currentConfig.Attributes.length; i++) {
                                            if (tempAttr.hasOwnProperty($scope.currentConfig.Attributes[i].Code)) {
                                                $scope.currentConfig.Attributes[i].DataState = 0;
                                                $scope.currentConfig.Attributes[i].IsDefine = false;
                                                $scope.currentConfig.Attributes[i].DataType = tempAttr[$scope.currentConfig.Attributes[i].Code].DataType;
                                                $scope.currentConfig.Attributes[i].EnumValue = tempAttr[$scope.currentConfig.Attributes[i].Code].EnumValue;
                                                delete tempAttr[$scope.currentConfig.Attributes[i].Code];
                                            } else {
                                                if ($scope.currentConfig.Attributes[i].Id) {
                                                    $scope.currentConfig.Attributes[i].DataState = 1;
                                                } else {
                                                    $scope.currentConfig.Attributes.remove($scope.currentConfig.Attributes[i]);
                                                    i--;
                                                }
                                            }
                                        }
                                        for (var item in tempAttr) {
                                            var o = {};
                                            angular.copy(tempAttr[item], o);
                                            $scope.currentConfig.Attributes.push(o);
                                        }
                                    } else {
                                        angular.copy($scope.ControlDic[option.Value], $scope.currentConfig.Attributes);
                                        $scope.currentConfig.Attributes[0].Value = option.Value;
                                        $scope.currentConfig.Attributes[1].Value = $scope.currentConfig.ChineseName;
                                        if ($scope.currentConfig.Attributes.length > 1) {
                                            $scope.currentConfig.Attributes[2].Value = "model." + $scope.currentConfig.DisplayName;
                                        }
                                    }
                                }
                            }, {
                                "Code": "fieldLabel",
                                "Description": "字段名称",
                                "DataState": 0,
                                "DataType": "string"
                            }];
                            obj.Attributes.forEach(function (attr) {
                                attr.DataState = 0;
                                $scope.ControlDic[obj.Code].push(attr);
                            });
                        });
                        $scope.event_3.SetControlList($scope.ControlDic);
                    });
                });
            } else {
                $scope.event_3.SetControlList($scope.ControlDic);
            }
        },
        Close: function () {
            $modalInstance.close();
        },
        SetControlList: function (dic) {

            function setAttribute(sourse, desn) {
                var sourseDic = {};
                if (!sourse.Attributes) {
                    sourse.Attributes = [];
                }
                sourse.Attributes.forEach(function (item) {
                    sourseDic[item.Code] = item;
                });
                var desnDic = {};
                desn.forEach(function (item) {
                    if (sourseDic.hasOwnProperty(item.Code)) {
                        sourseDic[item.Code].Description = item.Description;
                        sourseDic[item.Code].DataType = item.DataType;
                        sourseDic[item.Code].EnumValue = item.EnumValue;

                        if (item.DataType === "bool" && sourseDic[item.Code].Value && typeof (sourseDic[item.Code].Value) === "string") {
                            sourseDic[item.Code].Value = sourseDic[item.Code].Value.toLowerCase() === "true" ? true : false;
                        }
                        sourseDic[item.Code].Select = item.Select;
                    } else {
                        sourseDic[item.Code] = {}
                        angular.copy(item, sourseDic[item.Code]);
                        sourseDic[item.Code].DataState = 0;
                    }
                    desnDic[item.Code] = item.Code;
                });
                sourse.Attributes = [];

                for (var item in desnDic) {
                    if (sourseDic.hasOwnProperty(item)) {
                        sourse.Attributes.push(sourseDic[item]);
                    }
                }

                for (var item in sourseDic) {
                    if (!desnDic.hasOwnProperty(item)) {
                        sourseDic[item].IsDefine = true;
                        sourseDic[item].DataType = "string";
                        sourseDic[item].Delete = function (item) {
                            if (item.Id) {
                                item.DataState = 1;
                            } else {
                                $scope.currentConfig.Attributes.remove(item);
                            }
                        }
                        sourse.Attributes.push(sourseDic[item]);
                    }
                }
            }

            angular.forEach($scope.currentColumns, function (obj) {
                var dicAttr = {};
                if (obj.Attributes) {
                    obj.Attributes.forEach(function (attr) {
                        if (attr.Code === "controlType") {
                            dicAttr[attr.Code] = attr.Value;
                        }
                    });
                }
                if (obj.FormViewEnable === true) {

                    if (dicAttr.hasOwnProperty("controlType")) {
                        setAttribute(obj, dic[dicAttr["controlType"]]);
                    } else {
                        if (obj.TypeValueName.toLocaleLowerCase() === "int") {
                            setAttribute(obj, dic["Number"]);
                            if (!obj.Attributes[0].Value) {
                                obj.Attributes[0].Value = "Number";
                            }
                        } else if (obj.TypeValueName === "bool") {
                            setAttribute(obj, dic["Switch"]);
                            if (!obj.Attributes[0].Value) {
                                obj.Attributes[0].Value = "Switch";
                            }
                        } else if (obj.AttributeType === 1) {
                            setAttribute(obj, dic["SelectTree"]);
                            obj.IsVeidoo = true;
                            if (!obj.Attributes[0].Value) {
                                obj.Attributes[0].Value = "SelectTree";
                                obj.Attributes[7].Value = obj.TypeValueName; //父Id
                            }
                        } else if (obj.TypeValueName.toLocaleLowerCase() === "datetime") {
                            setAttribute(obj, dic["DateTimePicker"]);
                            if (!obj.Attributes[0].Value) {
                                obj.Attributes[0].Value = "DateTimePicker";
                            }
                        } else {
                            setAttribute(obj, dic["TextBox"]);
                            if (!obj.Attributes[0].Value) {
                                obj.Attributes[0].Value = "TextBox";
                            }
                        }
                    }

                }
                if (obj.Attributes && obj.Attributes.length > 2) {
                    if (!obj.Attributes[1].Value) {
                        obj.Attributes[1].Value = obj.ChineseName;
                    }
                    if (!obj.Attributes[2].Value) {
                        obj.Attributes[2].Value = "model." + obj.DisplayName;
                    }
                }
            });
            $scope.currentConfig = {};
            $scope.steps.step4 = true;

        }
    }
    $scope.event_4 = {
        Close: function () {
            $modalInstance.close();
        },
        Prev: function () {
            $scope.steps.step3 = true;
        },
        Save: function () {
            if (!$scope.FileName || $scope.FileName === "") {
                service.msg.alert("文件名称必填");
                return;
            }
            angular.forEach($scope.currentColumns, function (obj) {
                obj.FkUiConfigId = fkUiConfigId;
                if (obj.AttributeType === 1) {
                    var valueDic = {};
                    if (!obj.Values) {
                        obj.Values = [];
                    }
                    obj.Values.forEach(function (item) {//不在tags中的标记为删除
                        if (obj.AttributeTags.hasOwnProperty(item.FkDictionaryId)) {
                            item.DataState = 0;
                        } else {
                            item.DataState = 1;
                        }
                        valueDic[item.FkDictionaryId] = "";
                    });
                    for (var item in obj.AttributeTags) {
                        if (!valueDic.hasOwnProperty(item)) {
                            obj.Values.push({
                                "Code": obj.AttributeTags[item].Code,
                                "DisplayName": obj.AttributeTags[item].Name,
                                "FkColumnId": obj.Id,
                                "FkDictionaryId": obj.AttributeTags[item].Id,
                                "HasChild": obj.AttributeTags[item].Children !== null,
                                "Description": obj.AttributeTags[item].Description,
                                "ParentId ": obj.TypeValueName,
                                "Value": obj.AttributeTags[item].Value
                            });
                        }
                    }
                }
                if (!obj.Attributes) {
                    obj.Attributes = [];
                }
                obj.Attributes.forEach(function (item) {
                    item.FkColumnId = obj.Id;
                    item.FkUiControlTypeCode = item.Value;
                    item.FkUiControlTypeId = $scope.ControlTypeDic[item.Value];
                });
            });
            UiConfigService.SaveDataSourceSetting($scope, $scope.currentColumns, function (data) {
                if (data) {
                    UiConfigService.GenerateWebPage($scope, {
                        "Id": fkUiConfigId,
                        "AppId": service.Cookie.Get("AppID"),
                        "LayoutName": "WindowLayout",
                        "ChineseName": $scope.FileName,
                        "ConfigColumns": $scope.currentColumns
                    }, function (result) {
                        $modalInstance.close(result);
                    });
                }
            });
        }
    }

    $scope.selectChange = function (item) {
        if (item !== $scope.currentConfig && item.IsVeidoo === true && item.AttributeType === 0 && item.Attributes) {
            item.AttributeType = 1;
            item.Attribute = "";
            item.IsVeidoo = true;
            angular.copy($scope.ControlDic["SelectTree"], item.Attributes);
            item.Attributes[0].Value = "SelectTree";
            item.Attributes[7].Value = item.TypeValueName;//父Id
        }
        $scope.currentConfig = item;
    }
    $scope.definePorperty = function () {
        if ($scope.currentConfig) {
            $scope.currentConfig.Attributes.push({
                "Code": "ng-",
                "DataType": "string",
                "Value": "",
                "DataState": 0,
                "IsDefine": true,
                "Delete": function (item) {
                    if (item.Id) {
                        item.DataState = 1;
                    } else {
                        $scope.currentConfig.Attributes.remove(item);
                    }
                }
            });
        }
    }
});
app.controller('SelectDataTreeCtrl', function ($scope, $modal, $modalInstance, UiConfigService, DictionaryID, DataSourceItemId, SelectType, SelectData, DataOperate) {
    var _SelectData = SelectData.map(function (x) {
        return x;
    });
    $scope.event = {
        Save: function () {
            $modalInstance.close({
                Old: _SelectData,
                New: $scope.tree.getCheckedNodes(true)
            });
        },
        Close: function () {
            _SelectData.map(function (x) {
                SelectData.push(x);
            });
            $modalInstance.close({
                Old: _SelectData
            });
        },
        LoadData: function () {
            UiConfigService.GetDataColumnValueSettingList($scope, {
                FKDictionaryID: DictionaryID,
                FKDataSourceItemID: DataSourceItemId
            }, function (data) {
                var SelectData = data.filter(function (obj) {
                    return obj.Selected
                });
                var _data = DataOperate.BuildListChecked(data.map(function (x) {
                    x.name = x.DisplayName;
                    x.isParent = x.HasChild;
                    return x;
                }), SelectData, 'Id', false);
                $scope.tree.addNodes(null, _data, true);
            })
        }
    }
    $scope.event.LoadData();
});
app.controller('SearchDataViewCtrl', function ($scope, $modal, $stateParams, UiConfigService) {
    $scope.Id = $stateParams.Id;
});

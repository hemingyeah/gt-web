app.directive("selectuser", function () {
    return {
        restrict: "E",
        replace: false,
        transclude: true,
        template: function (e, a) {
            if (a.button) {
                return '<a class="btn btn-link" ng-click="event.SelectUser();">选择用户</a>';
            }
            //return '<Panel style="padding: 0;height:100%;">' +
            //        '<phead>选择人员<span ng-click="event.SelectUser();"><a class="btn-add">选择人员</a></span></phead>' +
            //        '<pbody style="padding: 0;height:90%;">' +
            //        '<datagrid agGrid="gridOptionsUser"></datagrid>' +
            //        '</pbody>' +
            //        '</Panel>';
            return '<Item Label="选择人员"><datagrid agGrid="gridOptionsUser"></datagrid></Item>';
        },
        controller: function ($scope, $modal, manageService) {
            $scope.$modal = $modal;
            $scope.gridOptionsUser = {
                columnDefs: [{
                    headerName: "#",
                    width: 40,
                    maxWidth: 40,
                    suppressSorting: true,
                    suppressMenu: true,
                    cellRenderer: function (params) {
                        return params.node.id + 1;
                    }
                }, {
                    field: "CheckBox",
                    headerName: "选择",
                    gridOptionsName: "gridOptionsUser",
                    suppressMenu: true,
                    width: 40
                }, {
                    headerName: "名称",
                    field: "GroupUserName",
                    filter: "set"
                }, {
                    headerName: "手机号码",
                    field: "Key",
                    filter: "set",
                    cellRenderer: function (params) {
                        return params.data.User.Key;
                    }
                }],
                rowData: $scope.userData ? $scope.userData : null,
                enableFilter: true
            }
            $.extend($scope.gridOptionsUser, $scope.options, { showToolPanel: false, onRowDoubleClicked: false, enableServerSideFilter: true });
            var manage = manageService.constructor($scope, $scope.gridOptionsUser, "GroupUserManageCtrl", "/views/UserManage/Control/SelectUser.html");

            $scope.gridOptionsUser.event = $.extend(manage, {
                SelectUser: function () {
                    $scope.$root.$modalInstance = $scope.$modal.open({
                        templateUrl: manage.url,
                        controller: manage.controller,
                        backdrop: "static",
                        size: "lg"
                    });
                    $scope.$root.$modalInstance.result.then(function (result) {
                        if (result) {
                            if (!$scope.gridOptionsUser.rowData) {
                                $scope.gridOptionsUser.rowData = [];
                            }
                            $scope.gridOptionsUser.rowData = $scope.gridOptionsUser.rowData.concat(result).distinctUser();
                            $scope.gridOptionsUser.api.onNewRows();
                            $scope.gridOptionsUser.api.sizeColumnsToFit();
                        }
                    });
                }, DeleteAllSelect: function () {
                    var checkedList = $scope.getCheckedData($scope.gridOptionsUser.rowData);
                    if (checkedList.length === 0) {
                        $scope.service.ret.msg("请选择要删除的数据！");
                    } else {
                        checkedList.forEach(function (obj) {
                            $scope.gridOptionsUser.rowData.remove(obj);
                        });
                        $scope.gridOptionsUser.api.onNewRows();
                    }
                }
            }, { Add: false }, { EditInfo: false }, { DeleteSelect: false });
        },
        link: function ($scope, e, a) {

        }
    }
});
//人组管理
app.controller('GroupUserManageCtrl', function ($scope, $modal, $stateParams, Dialog, userService, manageService, service) {
    $scope.viewCurrentNodeData = true;
    $scope.$modalInstance = $modal;
    $scope.dataService = userService;
    manageService.dataGridInit($scope);
    $scope.eventName = {
        PersonTagBtn: "基础标签",
        Bind: "绑定群组"
    };

    $scope.columnDefs = $scope.columnDefs.concat(
    [
        {
            headerName: "名称",
            field: "GroupUserName",
            width: 150,
            filter: "text",
            filterParams: { apply: true }
        }, {
            headerName: "手机号码",
            filter: PhoneFilter,
            field: "Key",
            cellRenderer: function (params) {
                return params.data.User.Key;
            }
        }, {
            headerName: "性别",
            field: "GroupUserGender",
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.sexCellRendererFunc
        }, {
            headerName: "排序号",
            field: "OrderIndex",
            suppressMenu: true,
            width: 100
        }, {
            headerName: "节点名称",
            field: "GroupName",
            suppressMenu: true,
            width: 150,
            cellRenderer: function (params) {
                if (params.data.GroupRelation) {
                    return params.data.GroupRelation.GroupName;
                }
                return "";
            }
        }, {
            headerName: '操作',
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.operCellRendererFunc
        }
    ]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true,
        angularCompileFilters: true

    };
    function PhoneFilter() {
    }

    PhoneFilter.prototype.init = function (params) {
        this.$scope = params.$scope;
        this.$scope.onFilterChanged = function () {
            params.filterChangedCallback();
        };
        this.valueGetter = params.valueGetter;
    };

    PhoneFilter.prototype.getGui = function () {
        return '<div style="width: 200px;padding: 10px 5px;">' +
            '<div style="line-height:30px;">请输入手机号</div>' +
            '<div><input type="text" maxlength=11  ng-model="filterText" placeholder="请输入11位手机号..."/></div>' +
            '<div style="padding:10px 0px;"><button ng-click="onFilterChanged()">筛选<button></div>' +
            '</div>';
    };

    PhoneFilter.prototype.doesFilterPass = function (params) {
        var filterText = this.$scope.filterText;
        if (!filterText) {
            return true;
        }
        // make sure each word passes separately, ie search for firstname, lastname
        var passed = true;
        var valueGetter = this.valueGetter;
        filterText.toLowerCase().split(" ").forEach(function (filterWord) {
            var value = valueGetter(params);
            if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                passed = false;
            }
        });

        return passed;
    };

    PhoneFilter.prototype.isFilterActive = function () {
        var value = this.$scope.filterText;
        return value !== null && value !== undefined && value !== '';
    };

    PhoneFilter.prototype.getApi = function () {
        var that = this;
        return {
            getModel: function () {
                var model = { value: that.$scope.filterText };
                return model;
            },
            setModel: function (model) {
                that.$scope.filterText = model.value;
            }
        }
    };
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "GroupUserEditCtrl", "/views/UserManage/GroupUserEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
        Import: function () {
            if ($scope.SelectNode) {
                Dialog.Show('/Views/ImportManage/ImportEdit.html', 'ImportEditCtrl', 'md', {
                    selectedData: function () {
                        return $scope.SelectNode;
                    },
                    menuId: function () {
                        return $stateParams.menuId;
                    },
                    importType: function () {
                        return 0;
                    }
                }, function () { });
            } else {
                service.msg.alert("请选择一个组织结构节点！");
            }
        },
        PersonTagBtn: function () {
            var checkList = $scope.getCheckedData($scope.gridOptions.rowData);
            if (checkList.length === 0) {
                service.msg.alert("请勾选要设置的数据！");
                return;
            }
            Dialog.Show('/Views/TagManage/AccountTagList.html', 'SetPersonTagCtrl', 'md', {
                data: function () {
                    return checkList;
                }
            }, function (result) { });
        },
        SetVip: function () {
            var checkList = $scope.getCheckedData($scope.gridOptions.rowData);
            if (checkList.length === 0) {
                service.msg.alert("请勾选要设置的数据！");
                return;
            }
            Dialog.Show('/Views/UserManage/GroupUserSetVip.html', 'SetVipCtrl', 'md', {
                data: function () {
                    return checkList;
                }
            }, function (result) {
                if (result) {

                }
            });
        },
        Bind: function () {
            var checkList = $scope.getCheckedData($scope.gridOptions.rowData);
            if (checkList.length === 0) {
                service.msg.alert("请勾选要设置的数据！");
                return;
            }
            Dialog.Show('/Views/UserManage/GroupUserBind.html', 'GroupUserBindCtrl', 'lg', {
                data: function () {
                    return checkList;
                }
            }, function (result) {
                if (result) {

                }
            });
        },
        CurrentGroupUserEdit: function () {
            var checkList = $scope.getCheckedData($scope.gridOptions.rowData);
            if (checkList.length === 0) {
                service.msg.alert("请勾选要设置的数据！");
                return;
            }
            Dialog.Show('/Views/UserManage/GroupUserBind.html', 'CurrentGroupUserEditCtrl', 'lg', {
                data: function () {
                    return checkList;
                }
            }, function (result) {
                if (result) {

                }
            });
        }
    });
    $scope.$watch("SelectNode", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.gridOptions.Param = $scope.SelectNode;
            $scope.gridOptions.event.LoadData();
        }
    });
});

//添加修改人员
app.controller('GroupUserEditCtrl', function ($scope, $modal, $modalInstance, userService, editService, service, data) {
    if (!data.GroupUserGender) {
        data.GroupUserGender = 1;
        data.OrderIndex = 999;
    }
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = userService;
    $scope.service = service;
    $scope.data = data;
    $scope.trees = [];
    $scope.model = $.extend({}, $scope.data);

    if (data.DataState === state.Modify && $scope.model.User) {
        $scope.model.Key = $scope.model.User.Key;
        $scope.class = "col-md-12";

    } else {
        $scope.class = "col-md-7";
    }
    $scope.SexType = [
         {
             GroupUserGender: 0,
             GroupUserGenderName: "女"
         }, {
             GroupUserGender: 1,
             GroupUserGenderName: "男"
         }, {
             GroupUserGender: -1,
             GroupUserGenderName: "保密"
         }
    ];

    var e = editService.constructor($scope);
    $scope.event = e;
});
app.controller('CurrentGroupUserEditCtrl', function ($scope, $modal, $modalInstance, userService, editService, service, data) {
    if (!data.GroupUserGender) {
        data.GroupUserGender = 1;
        data.OrderIndex = 999;
    }
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = userService;
    $scope.service = service;
    $scope.data = data;
    $scope.trees = [];
    $scope.model = $.extend({}, $scope.data);


    if (data.DataState === state.Modify && $scope.model.User) {
        $scope.model.Key = $scope.model.User.Key;
        $scope.class = "col-md-12";

    } else {
        $scope.class = "col-md-7";
    }
    $scope.SexType = [
         {
             GroupUserGender: 0,
             GroupUserGenderName: "女"
         }, {
             GroupUserGender: 1,
             GroupUserGenderName: "男"
         }, {
             GroupUserGender: -1,
             GroupUserGenderName: "保密"
         }
    ];

    var e = editService.constructor($scope);
    $scope.event = e;
});

//打标签
app.controller('SetPersonTagCtrl', function ($scope, $modal, $modalInstance, userService, manageService, editService, groupUserTagService, data) {
    $scope.dataService = groupUserTagService;
    $scope.$modalInstance = $modalInstance;
    $scope.model = {};
    $scope.model.data = data;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "GroupUserName",
            suppressMenu: true,
            width: 170
        }, {
            headerName: "手机号码",
            field: "Key",
            suppressMenu: true,
            width: 170,
            cellRenderer: function (params) {
                return params.data.User.Key;
            }
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        rowData: data
    };
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "", "");

    $scope.gridOptions.event = manage;
    var e = editService.constructor($scope);
    $scope.event = e;
    userService.GetGeneralTaggings($scope, null, function (data) {
        $scope.PersonalTag = data;
    });
})
//设置Vip
app.controller('SetVipCtrl', function ($scope, $modal, $modalInstance, $timeout, manageService, editService, service, groupUserVipCodeService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = groupUserVipCodeService;
    $scope.checkBox = false;
    $scope.model = {};
    $scope.model.data = data;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "GroupUserName",
            suppressMenu: true,
            width: 170
        }, {
            headerName: "手机号码",
            field: "Key",
            suppressMenu: true,
            width: 170,
            cellRenderer: function (params) {
                return params.data.User.Key;
            }
        }, {
            headerName: "Vip码",
            field: "ValidCode",
            width: 170,
            suppressMenu: true
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        rowData: data,
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
    $scope.$watch("model.ValidCode", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            data.forEach(function (obj) {
                obj.ValidCode = newVal;
            });
        }
        if (newVal !== undefined) {
            $scope.gridOptions.api.onNewRows();
        }
    });
});
//绑定人组关系
app.controller('GroupUserBindCtrl', function ($scope, $modal, $modalInstance, $timeout, $compile, manageService, editService, service, groupUserBindService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = groupUserBindService;
    $scope.model = [];
    angular.copy(data, $scope.model);
    $scope.eventName = {
        Save: "绑定"
    }
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "GroupUserName",
            suppressMenu: true,
            width: 135
        }, {
            headerName: "手机号码",
            field: "Key",
            suppressMenu: true,
            width: 170,
            cellRenderer: function (params) {
                return params.data.User.Key;
            }
        }, {
            headerName: "性别",
            field: "GroupUserGender",
            suppressMenu: true,
            width: 70,
            cellRenderer: $scope.sexCellRendererFunc
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
});

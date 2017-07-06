app.controller('TecSchemeListCtrl', function($scope, TecSchemeService, Dialog, $state, $stateParams, service, RoleService, manageService, $compile) {
    $scope.dataService = TecSchemeService;
    $scope.roleSerivce = RoleService;

    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "方案名称",
            field: "Name",
            width: 300,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "使用状态",
            field: "StuffStateName",
            width: 200
        }, {
            headerName: "类型",
            field: "StuffTypeName",
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
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);


    var manage = manageService.constructor($scope, $scope.gridOptions, "TecSchemeOperateCtrl", "/views/TecSchemeManage/TecSchemeOperate.html");
    $scope.gridOptions.event = $.extend(manage, {
        Config: function(data) {
            Dialog.Show("/views/TecSchemeManage/DetailIndex.html", "DetailIndexCtrl", "lg", {
                Id: function() {
                    return data.Id;
                },
                row: function() {
                    return data;
                }
            }, function(result) {
                if (result) {
                    $scope.event.Search();
                }
            })
        },
    });
    $scope.gridOptions.event.LoadData();
    $scope.Page = {
            Index: 1,
            Count: 1
        }
        /*$scope.event = {
            Add: function() {
                Dialog.Show("/views/TecSchemeManage/TecSchemeOperate.html", "TecSchemeOperateCtrl", "lg", {
                    Id: null
                }, function(result) {
                    if (result) {
                        $scope.event.Search();
                    }
                })
            },
            Edit: function(data) {
                Dialog.Show("/views/TecSchemeManage/TecSchemeOperate.html", "TecSchemeOperateCtrl", "lg", {
                    Id: function() {
                        return data.Id;
                    }
                }, function(result) {
                    if (result) {
                        $scope.event.Search();
                    }
                })
            },
            SearchView: function(data) {
                Dialog.Show("/views/TecSchemeManage/DetailIndex.html", "DetailIndexCtrl", "lg", {
                    Id: function() {
                        return data.Id;
                    },
                    row: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        $scope.event.Search();
                    }
                })
            },
            Delete: function(data) {
                TecSchemeService.DeleteInfo($scope, {
                    ID: data.Id
                }, function(data) {
                    $scope.event.Search();
                });
            }
        };*/
        // RoleService.LoadRole($scope, $stateParams.MenuType);
})
app.controller('TecSchemeOperateCtrl', function($scope, $modalInstance, TecSchemeService, data, AccountService) {
    $scope.model = data;
    $scope.event = {
        Save: function() {
            TecSchemeService.Save($scope, {
                data: $scope.model
            }, function(data) {
                $modalInstance.close(data);
            });
        },
        Close: function() {
            $modalInstance.close();
        }
    };
    // $scope.refreshUser = function(name){
    //责任人
    AccountService.GetUserListByGroupId($scope, {
            Name: name,
            PageIndex: 1,
            PageSize: 10
        }, function(data) {
            $scope.Person = data.List;
        })
        //事务类型
    TecSchemeService.LoadCategory($scope, {
            ParentID: "3E17FD39-B62F-C238-4FEB-08D2C8A462B7"
        }, function(data) {
            $scope.StuffTypeList = data;
        })
        //使用状态
    TecSchemeService.LoadCategory($scope, {
            ParentID: "46A13658-3F5C-C924-6287-08D2C8A77C67"
        }, function(data) {
            $scope.StuffStateList = data;
        })
        // }
    // TecSchemeService.LoadInfo($scope, null, function(data) {
    //     $scope.model = data;
    // });
})
app.controller('DetailIndexCtrl', function($scope, $modalInstance, TecSchemeService, Dialog, Id, row, AccountService) {
    $scope.Id = Id;
    $scope.model = row;
    $scope.GridColumnList = GridColumnList;
    $scope.event = {
        SearchView: function(data) {
            Dialog.Show("/views/TecSchemeManage/TecSchemeDetailView.html", "TecSchemeDetailViewCtrl", "lg", {
                Id: function() {
                    return $scope.Id;
                },
                DetailNum: function() {
                    return $scope.DetailNum;
                },
                row: function() {
                    return data;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData();
                }
            })
        },
        Edit: function() {
            Dialog.Show("/views/TecSchemeManage/TecSchemeDetailOperate.html", "TecSchemeDetailCtrl", "lg", {
                Id: function() {
                    return $scope.Id;
                },
                DetailNum: function() {
                    return $scope.DetailNum;
                },
                row: function() {
                    return $scope.model;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData();
                }
            })
        },
        AddDetail: function() {
            Dialog.Show("/views/TecSchemeManage/TecSchemeDetailOperate.html", "TecSchemeDetailCtrl", "lg", {
                Id: function() {
                    return $scope.Id;
                },
                DetailNum: function() {
                    return $scope.DetailNum;
                },
                row: function() {
                    return $scope.model;
                }
            }, function(result) {
                if (result) {
                    // $scope.event.LoadData();
                    $modalInstance.close(true);
                }
            })
        },
        Close: function() {
            $modalInstance.close(true);
        },
        //删除技术方案详情
        Delete: function() {
            TecSchemeService.DeleteDetail($scope, {
                ID: $scope.Id
            }, function(data) {
                $modalInstance.close(true);
            });
        },
        LoadData: function() {
            TecSchemeService.LoadStuffData($scope, null, function(data) {
                $scope.model = data;
                $scope.DetailNum = data.DetailNum;
                $scope.data = [];
                $scope.data.push(data);
                $scope.event.Init();
            });
        },
        //初始化操作按钮
        Init: function() {
            if ($scope.DetailNum === 0) {
                $scope.event.Edit = undefined;
                $scope.event.SearchView = undefined;
                $scope.event.Delete = undefined;
            } else {
                $scope.event.AddDetail = undefined;
            }
        }
    };
    $scope.event.LoadData();
    // $scope.refreshUser = function(name){
    AccountService.GetUserListByGroupId($scope, {
        Name: name,
        PageIndex: 1,
        PageSize: 10
    }, function(data) {
        $scope.Person = data.List;
    })

    //事务类型
    TecSchemeService.LoadCategory($scope, {
            ParentID: "3E17FD39-B62F-C238-4FEB-08D2C8A462B7"
        }, function(data) {
            $scope.StuffTypeList = data;
        })
        //使用状态
    TecSchemeService.LoadCategory($scope, {
        ParentID: "46A13658-3F5C-C924-6287-08D2C8A77C67"
    }, function(data) {
        $scope.StuffStateList = data;
    })
})
app.controller('TecSchemeDetailCtrl', function($scope, $modalInstance, TecSchemeService, Dialog, Id, AccountService, DetailNum) {
        $scope.Id = Id;
        $scope.Attach = {};
        $scope.DetailNum = DetailNum;
        $scope.CompanyAttach = [];
        $scope.GridColumnList = GridColumnList;
        $scope.Page = {
                Index: 1,
                Count: 1
            }
            // $scope.refreshUser = function(name){
        AccountService.GetUserListByGroupId($scope, {
                Name: name,
                PageIndex: 1,
                PageSize: 10
            }, function(data) {
                $scope.Person = data.List;
            })
            // };
        $scope.refreshCategory = function(name) {
            // TecSchemeService.LoadCategory($scope,{
            //  Name:name,
            //  PageIndex:1,
            //  PageSize:10
            // },function(data){
            //  $scope.Category = data;
            // })
        }
        $scope.event = {
            Save: function() {
                TecSchemeService.SaveStuffDetail($scope, null, function(data) {
                    $modalInstance.close(true);
                });
            },
            Close: function() {
                $modalInstance.close(true);
            },
            Delete: function(row) {
                if (!row.state) { //未上传,从列表里删除
                    $scope.CompanyAttach.splice($.inArray(row, $scope.CompanyAttach), 1);
                } else { //上传,从数据库删除
                    TecSchemeService.DeleteCompanyStuffAttach($scope, {
                        ID: row.Id
                    }, function(data) {
                        $scope.CompanyAttach.splice($.inArray(row, $scope.CompanyAttach), 1);
                    });
                }
            },
            LoadData: function() {
                TecSchemeService.LoadDetail($scope, null, function(data) {
                    if (data) {
                        angular.forEach(data.CompanyAttach, function(obj, index) {
                            obj.state = true;
                        });
                        $scope.model = data;
                        $scope.CompanyAttach = data.CompanyAttach;
                    } else {
                        $scope.model = {};
                    }
                });
            },
            Upload: function(row) {
                var GUID = FileUpload.BuildGUID();
                ossUpload.upload(FileUpload.BuildUploadSetting(row, 'Upload/TecSchemeAttach/' + GUID, function(res) {
                    $scope.$apply(function() {
                        row.state = true;
                        row.Id = GUID;
                    });
                    $.extend($scope.Attach, {
                        FKCompanyStuffId: $scope.Id,
                        Extension: row.Extension,
                        CategoryId: row.CategoryId,
                        Id: GUID,
                        state: row.state,
                        FileName: row.name,
                        SavePath: 'Upload/TecSchemeAttach/',
                        Size: row.size
                    });
                    TecSchemeService.SaveCompanyStuffAttach($scope, $scope.Attach, function(data) {

                    });
                }, function(res) {
                    console.log("上传失败！");
                    row.state = false;
                }, function(res) {
                    row.progress = Math.floor((res.loaded / res.total) * 100);
                    console.log(row.progress)
                }));
            }
        };
        // RoleService.LoadRole($scope, $stateParams.MenuType);
        $scope.event.LoadData();
        var ossUpload = FileUpload.BuildUploadObj();
        $("body").undelegate('#files', 'change');
        $('body').delegate('#files', 'change', function(evt) {
            Dialog.Show("/views/TecSchemeManage/TecSchemeAttachAdd.html", "TecSchemeAttachAddCtrl", "md", {
                Id: null
            }, function(result) {
                if (result) {
                    var fileTotal = evt.target.files;
                    angular.forEach(fileTotal, function(obj, index) {
                        obj.CategoryId = result.Id;
                        obj.FileName = obj.name;
                        obj.Extension = obj.name.substr(obj.name.lastIndexOf('.'));
                        obj.Size = obj.size;
                        $scope.CompanyAttach.push(obj);
                    });
                }
            })
        });
        /*日历参数设置*/
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        /*日历参数设置*/

    })
    //方案首页查询页面
app.controller('TecSchemeDetailViewCtrl', function($scope, $modalInstance, TecSchemeService, Dialog, Id, DetailNum, row) {
    $scope.ossUpload = FileUpload.BuildUploadObj();
    $scope.GridColumnList = GridColumnList;
    $scope.Id = Id;
    $scope.DetailNum = DetailNum;
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        LoadData: function() {
            TecSchemeService.LoadDetail($scope, null, function(data) {
                angular.forEach(data.CompanyAttach, function(obj, index) {
                    obj.state = true;
                });
                data.Name = row.Name;
                $scope.model = data;
                $scope.CompanyAttach = data.CompanyAttach;
            });
        },
        DownLoad: function (data) {
            var urlAddr = "http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + data.SavePath + data.Id + data.Extension;
            window.open("http://view.officeapps.live.com/op/view.aspx?src=" + urlAddr + "");
            //window.open("http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + data.SavePath + data.Id + data.Extension);
        }
    };
    // RoleService.LoadRole($scope, $stateParams.MenuType);
    $scope.event.LoadData();
})
app.controller('TecSchemeAttachAddCtrl', function($scope, $modalInstance, TecSchemeService, AccountService) {
    $scope.event = {
        Close: function() {
            $modalInstance.close();
        },
        Save: function() {
            $modalInstance.close($scope.model.Type);
        }
    };
    $scope.model = {};
    // $scope.refreshCategory = function(name){
    TecSchemeService.LoadCategory($scope, {
            ParentID: "ce4dc89e-c8cf-cd59-4953-08d2d0814931"
        }, function(data) {
            $scope.Category = data;
        })
        // }
        // AccountService.GetUserListByGroupId($scope,{
        //  Name:name,
        //  PageIndex:1,
        //  PageSize:10
        // },function(data){
        //  $scope.Person = data.List;
        // })
})

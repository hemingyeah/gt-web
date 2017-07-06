app.factory('TecSchemeService', function($http, service, DataOperate) {
    var ret = {
        Save: function($scope, data, fun) {
            angular.forEach($scope.Person, function(obj, index) {
                if (obj.Id == $scope.model.FKUserId) {
                    $.extend($scope.model, {
                        FKUserName: obj.AccountName
                    });

                }
            });
            angular.forEach($scope.StuffTypeList, function(obj, index) {
                if (obj.DisplayName === $scope.model.StuffTypeName) {
                    $.extend($scope.model, {
                        StuffType: obj.Id
                    });

                }
            });
            angular.forEach($scope.StuffStateList, function(obj, index) {
                if (obj.DisplayName === $scope.model.StuffStateName) {
                    $.extend($scope.model, {
                        StuffState: obj.Id
                    });

                }
            });
            $scope.model = $.extend(true, $scope.model, {
                groupRelationId: service.Cookie.Get("GroupRelationID"),
                appId: service.Cookie.Get("AppID"),
            });
            if (data.data.DataState === state.Add) {
            	DataOperate.Save(Route.CompanyStuff_AddCompanyStuff, $scope.model, function(data) {
            		var data = $.extend($scope.model, {Id:data});
            		
            	    if (fun) fun(data);
            	})
            } else {
            	DataOperate.Save(Route.CompanyStuff_ModifyCompanyStuff, $scope.model, function(data) {
            	    if (fun) fun(data);
            	})
            }
        },
        SaveStuffDetail: function($scope, data, fun) {
            angular.forEach($scope.Person, function(obj, index) {
                if (obj.Id == $scope.model.WriterId) {
                    $.extend($scope.model, {
                        WriterName: obj.AccountName
                    });

                }
            });
            $scope.model = $.extend(true, $scope.model, {
                groupRelationId: service.Cookie.Get("GroupRelationID"),
                appId: service.Cookie.Get("AppID"),
                Id: $scope.Id
            });
            if ($scope.DetailNum === 0) {
                DataOperate.Save(Route.CompanyStuff_AddCompanyStuffDetail, $scope.model, function(data) {
                    if (fun) fun(data);
                })
            } else {
                DataOperate.Save(Route.CompanyStuff_ModifyCompanyStuffDetail, $scope.model, function(data) {
                    if (fun) fun(data);
                })
            }
        },
        //保存附件
        SaveCompanyStuffAttach: function($scope, data, fun) {
            DataOperate.Save(Route.CompanyStuff_AddCompanyStuffAttach, data, function(data) {
                if (fun) fun(data);
            })
        },
        DeleteCompanyStuffAttach: function($scope, data, fun) {
            DataOperate.Delete(Route.CompanyStuff_DeleteCompanyStuffAttach, {
                id: data.ID
            }, function(data) {
                if (fun) fun(data);
            })
        },
        Delete: function($scope, data, fun) {
            DataOperate.Delete(Route.CompanyStuff_DeleteCompanyStuff, {
                id: data.Id
            }, function(data) {
                if (fun) fun(data);
            })
        },
        DeleteInfo: function($scope, data, fun) {
            DataOperate.Delete(Route.CompanyStuff_DeleteCompanyStuff, {
                id: data.ID
            }, function(data) {
                if (fun) fun(data);
            })
        },
        DeleteDetail: function($scope, data, fun) {
            DataOperate.Delete(Route.CompanyStuff_DeleteCompanyStuffDetail, {
                id: data.ID
            }, function(data) {
                if (fun) fun(data);
            })
        },
        LoadPageData: function($scope, data, fun) {
            if ($scope.tree) {
                var dicConditions = {};
                var list = $scope.tree.getNodesByParam("ParentId", null);
                var checkedList = $scope.tree.getCheckedNodes(true);
                list.map(function(x) {
                    checkedList.forEach(function(obj) {
                        if (x.Id === obj.rId) {
                            dicConditions[x.TypeValue] = obj.FkDictionaryId
                        }
                    })
                })
                DataOperate.LoadData(Route.CompanyStuff_GetCompanyStuffList, {
                    groupRelationId: service.Cookie.Get("GroupRelationID"),
                    appId: service.Cookie.Get("AppID"),
                    PageIndex: data.PageIndex,
                    PageSize: data.PageSize || service.PageSize
                }, function(data) {
                    if (fun) fun(data);
                })
            } else {
                return;
            }

        },
        LoadData: function($scope, data, fun) {
            DataOperate.LoadData(Route.CompanyStuff_GetCompanyStuffDetail, {
                IsEnabled: data
            }, function(data) {
                if (fun) fun(data);
            })
        },
        LoadStuffData: function($scope, data, fun) {
            DataOperate.LoadData(Route.CompanyStuff_GetCompanyStuff, {
                id: $scope.Id
            }, function(data) {
                if (fun) fun(data);
            })
        },
        LoadInfo: function($scope, data, fun) {
            if ($scope.Id) {
                DataOperate.LoadData(Route.CompanyStuff_GetCompanyStuff, {
                    id: $scope.Id
                }, function(data) {
                    if (fun) fun(data);
                })
            } else {
                $scope.model = {
                    Operations: []
                }
            }
        },
        LoadDetail: function($scope, data, fun) {
            if ($scope.DetailNum !== 0) {
                DataOperate.LoadData(Route.CompanyStuff_GetCompanyStuffDetail, {
                    id: $scope.Id
                }, function(data) {
                    if (fun) fun(data);
                })
            } else {
                $scope.model = {
                    Operations: []
                }
            }
        },
        LoadSearchPersonal: function($scope, data, fun) {
            DataOperate.LoadData(Route.CompanyStuff_GetUsers, {
                // name: data.Name,
                // PageIndex: data.PageIndex,
                // PageSize: data.PageSize,
                // groupRelationId: service.Cookie.Get("GroupRelationID"),
                groupRelationId: '9FC64DB5-07DD-C146-B346-08D24BB15FFC',
                appId: service.Cookie.Get("AppID"),
            }, function(data) {
                if (fun) fun(data);
            })
        },
        LoadCategory: function($scope, data, fun) {
            DataOperate.LoadData(Route.CompanyStuff_GetCategory, {
                parentId: data.ParentID
            }, function(data) {
                if (fun) fun(data);
            })
        }
    };
    return ret;
});

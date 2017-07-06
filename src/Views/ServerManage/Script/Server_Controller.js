//主页列表
app.controller('KitServerListCtrl', function($scope, $state, ServerService, Dialog, service) {
    $scope.event = {
        Add: function() {
            Dialog.Show("/views/ServerManage/KitServerOperate.html", "KitServerOperateCtrl", "lg", {
                Server: function() {
                    return null;
                },
                Types: function() {
                    return $scope.Types;
                },
                TypeId: function() {
                    return $scope.Sel_Type.Id;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Type);
                }
            });
        },
        Edit: function(row) {
            Dialog.Show("/views/ServerManage/KitServerOperate.html", "KitServerOperateCtrl", "lg", {
                Server: function() {
                    return row;
                },
                Types: function() {
                    return $scope.Types;
                },
                TypeId: function() {
                    return $scope.Sel_Type.Id;
                }
            }, function(result) {
                if (result) {
                    $scope.event.LoadData($scope.Sel_Type);
                }
            });
        },
        Delete: function(row) {
            ServerService.DeleteServer($scope, {
                ServerID: row.Id
            }, function(data) {
                $scope.event.LoadData($scope.Sel_Type);
            });
        },
        LoadData: function(row) {
            $scope.Sel_Type = row;
            $scope.Sel_Server = {};
            ServerService.GetServers($scope, {
                TypeID: row.Id
            }, function(data) {
                row.Servers = data;
            });
        },
        GetServerTypes: function() {
            ServerService.GetServerTypes($scope, null, function(data) {
                $scope.Types = data;
            })
        }

    };
    $scope.event.GetServerTypes();
});
//模型编辑
app.controller('KitServerOperateCtrl', function($scope, $modalInstance, ServerService, Server, Types, TypeId, service) {
    $scope.model = Server;
    $scope.Types = Types;
    $scope.event = {
        Save: function() {
            if ($scope.model.Id) {
                ServerService.ModifyServer($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                ServerService.AddServer($scope, $scope.model, function(data) {
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
            $scope.model.TypeId = TypeId;
        }
    };
    $scope.event.LoadData();
});
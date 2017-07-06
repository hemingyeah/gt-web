app.controller('PluginInstanceListCtrl', function($scope, PluginInstanceService, $state, $stateParams, RoleService, Dialog) {
	$scope.Page = {
		Index: 1,
		Count: 1
	};
	$scope.event = {
		Add: function() {
			Dialog.Show("/views/Base/PluginInstanceManage/PluginInstanceOperate.html", "PluginInstanceOperateCtrl", "lg", {
				Id: null
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Edit: function(data) {
			Dialog.Show("/views/Base/PluginInstanceManage/PluginInstanceOperate.html", "PluginInstanceOperateCtrl", "lg", {
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
			PluginInstanceService.DeleteInfo($scope, {
				ID: data.Id
			}, function(data) {
				$scope.event.LoadData();
			});
		},
		Search: function() {
			this.LoadData();
		},
		LoadData: function() {
			PluginInstanceService.LoadPageData($scope, {
				Name:$scope.Search,
				PageIndex: $scope.Page.Index
			}, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
			});
		}
	}
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.event.LoadData();
})
app.controller('PluginInstanceOperateCtrl', function($scope, $modalInstance, PluginInstanceService, PluginService, AppService, Id) {
	$scope.tagTransform = function(newTag) {
		var strlist = newTag.split('|');
		var item = {
			AppName: strlist[0],
			email: strlist[1],
			age: strlist[2],
			country: strlist[3]
		};
		return item;
	};
	$scope.event = {
		Save: function() {
			PluginInstanceService.Save($scope, $scope.model, function(data) {
				$modalInstance.close(data);
				// $state.go("GT.PluginInstance.List");
			})
		},
		Close: function() {
			$modalInstance.close();
		},
		AddOperation: function(row) {
			if (row.OperationInstances) {
				row.OperationInstances.push({});
			} else {
				row.OperationInstances = [{}];
			}
		},
		DeleteOperation: function(row, index) {
			row.OperationInstances.splice(index, 1);
		}
	}
	PluginService.LoadData($scope, true, function(data) {
		$scope.PluginList = data;
	})
	AppService.LoadData($scope, null, function(data) {
		$scope.AppList = data;
	})
	PluginInstanceService.LoadInfo($scope, {
		ID: Id
	}, function(data) {
		$scope.model = data;
		$scope.$watch("model.FkPluginId", function(newval, oldval) {
			// $scope.model.MenuInstances
			if (!newval || newval == oldval) return;
			PluginService.LoadPluginInstanceDetails($scope, newval, function(data) {
				$scope.model.MenuInstances = data.MenuInstances;
			})
		})
	})
})
app.controller('SelectPluginInstanceCtrl', function($scope, PluginInstanceService, PluginInstances, $modalInstance) {
	$scope.event = {
		RemoveNoChecked: function(obj, floor) {
			for (var i = obj.length - 1; i >= 0; i--) {
				if (!obj[i].Checked) {
					obj.splice(i, 1);
				} else {
					if (floor == 1) {
						$scope.event.RemoveNoChecked(obj[i].MenuInstances, floor + 1)
					} else if (floor == 2) {
						$scope.event.RemoveNoChecked(obj[i].OperationInstances, floor + 1)
					} else {

					}
					// $scope.event.RemoveNoChecked(obj.)
				}
			}
		},
		OK: function() {
			$modalInstance.close($scope.PluginInstanceList);
		},
		LoadData: function() {
			PluginInstanceService.LoadInfo($scope, null, function(data) {
				$scope.PluginInstanceList = data;
				angular.forEach($scope.PluginInstanceList, function(obj_i, i) {
					for (var new_i = 0; new_i < PluginInstances.length; new_i++) {
						if (obj_i.Id == PluginInstances[new_i].Id) {
							obj_i.Checked = true;

							angular.forEach(obj_i.MenuInstances, function(obj_j, i) {
								for (var new_j = 0; new_j < PluginInstances[new_i].MenuInstances.length; new_j++) {
									if (obj_j.Id == PluginInstances[new_i].MenuInstances[new_j].Id) {
										obj_j.Checked = true;

										angular.forEach(obj_j.OperationInstances, function(obj_k, i) {
											for (var new_k = 0; new_k < PluginInstances[new_i].MenuInstances[new_j].OperationInstances.length; new_k++) {
												if (obj_k.Id == PluginInstances[new_i].MenuInstances[new_j].OperationInstances[new_k].Id) {
													obj_k.Checked = true;
												}
											}
										});
									}
								}
							});
						}
					}
				});
			});
		}
	};
	$scope.event.LoadData();
})
app.controller('SetPluginInstanceCtrl', function($scope, $state, $stateParams, $modalInstance, AppPlugin, PluginInstanceService) {
	//插件信息分类权限分配
	$scope.AppPlugin = $.extend(AppPlugin, {
		IsEnabled: true
	});
	$scope.Page = {
		Index: 1,
		Count: 1
	};
	$scope.Id = $stateParams.Id;
	var InitSelectItem = function() {
		for (var i = $scope.SelectNode.length - 1; i >= 0; i--) {
			var item = $scope.ztree.getNodeByParam("Id", $scope.SelectNode[i].Id);
			if (item) {
				$scope.ztree.checkNode(item, true);
				$scope.SelectNode.splice(i, 1);
			}
		};
	}
	$scope.event = {
			Save: function() {
				var selectNode = $scope.ztree.getCheckedNodes(true);
				//追加未加载的节点
				angular.forEach($scope.SelectNode, function(obj, index) {
					selectNode.push(obj);
				});
				$scope.model = {
					RelationId: $scope.Sel_PluginInsID,
					Permissions: selectNode
				};
				PluginInstanceService.SavePermissions($scope, $scope.model, function() {
					$modalInstance.close(true);
				})
			},
			SelectPluginIns: function(row) {
				$scope.Sel_PluginInsID = row.Id;
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
						//加载子节点
						beforeExpand: function(treeId, treeNode) {
							if (!treeNode.children) {
								PluginInstanceService.GetRootData2($scope, {
									ParentID: treeNode.Id,
									OrderIndex: row.OrderIndex
								}, function(data) {
									$scope.ztree.addNodes(treeNode, data, true);
									InitSelectItem();
								});
							}
						}
					}
				};
				PluginInstanceService.LoadSelectedData($scope, {
					ParentID: '',
					PluginInstanceID: row.Id
				}, function(data) {
					$scope.SelectNode = data;
					PluginInstanceService.GetRootData2($scope, {
						ParentID: '',
						OrderIndex: row.OrderIndex
					}, function(data) {
						$scope.ztree = $.fn.zTree.init($("#" + row.Id), setting, data);
						//设置加载节点是否勾选
						InitSelectItem();
					})
				})
			}
		}
		// PluginInstanceService.LoadPageData($scope, $scope.AppPlugin, function(data) {
		// 	$scope.AppPluginList = data.List;
		// });
})
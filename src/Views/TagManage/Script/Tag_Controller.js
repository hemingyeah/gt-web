app.controller('TagListCtrl', function($scope, TagService, Dialog, $state, $stateParams, RoleService) {
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.event = {
		//自建标签
		Custom: function() {
			Dialog.Show("/views/TagManage/TagOperate.html", "TagOperateCtrl", "md", {
				Id: null
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Select: function() {
			Dialog.Show("/views/TagManage/TagSelected.html", "TagSelectedCtrl", "lg", {
				Id: null
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Delete: function(data) {
			TagService.DeleteInfo($scope, {
				ID: data.TagId
			}, function(data) {
				$scope.event.LoadData();
			});
		},
		LoadData: function() {
			TagService.LoadPageData($scope, {
				PageIndex: $scope.Page.Index
			}, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
			});
		}
	};
	/*从字典中选择标签功能被孙明干掉*/
	$scope.event = $.extend($scope.event, {
		Select: false
	});
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.event.LoadData();
});
app.controller('TagOperateCtrl', function($scope, $modalInstance, Dialog, TagService) {
	$scope.Id = undefined; //标签管理不能修改标签
	$scope.event = {
		Save: function() {
			TagService.Save($scope, null, function(data) {
				$modalInstance.close(data);
			});
		},
		Close: function() {
			$modalInstance.close();
		},
		SelectButton: function() {
			Dialog.Show('/Views/ButtonManage/SelectButton.html', 'SelectButtonCtrl', 'sm', {
				Operations: function() {
					return $scope.model.Operations;
				}
			}, function(result) {
				if (result) {
					$scope.model.Operations = result;
				}
			})
		}
	};
	TagService.LoadInfo($scope, null, function(data) {
		$scope.model = data;
	});
});
app.controller('TagSelectedCtrl', function($scope, $modalInstance, Dialog, TagService) {
		$scope.GridColumnList = GridColumnList;
		$scope.model = [];
		$scope.Id = undefined; //标签管理--不能修改标签
		$scope.event = {
			Save: function() {
				angular.forEach($scope.data, function(obj, index) {
					if (obj.Checked) {
						$scope.model.push(obj)
					}
				});
				TagService.SaveList($scope, null, function(data) {
					$modalInstance.close(data);
				});
			},
			Close: function() {
				$modalInstance.close();
			},
			SelectButton: function() {
				Dialog.Show('/Views/ButtonManage/SelectButton.html', 'SelectButtonCtrl', 'sm', {
					Operations: function() {
						return $scope.model.Operations;
					}
				}, function(result) {
					if (result) {
						$scope.model.Operations = result;
					}
				})
			},
			LoadData: function() {
				TagService.LoadTagData($scope, null, function(data) {
					$scope.data = data;
				});
			}
		};
		$scope.event.LoadData();
	})
	//个人账号人组标签列表
app.controller('SetPersonalAccountTagCtrl', function($scope, $state, $stateParams, $modalInstance, AccountService, RoleService, Dialog, TagService, RelationType, RelationId, UserId, GroupRelationId, DataOperate) {
		$scope.model = {
			RelationID: RelationId,
			RelationType: RelationType,
			UserID: UserId,
			GroupRelationID: GroupRelationId
		};
		$scope.event = {
			Save: function() {
				var item = [];
				if ($scope.model.Operations.length > $scope.SelectedTag.length) { //添加标签
					angular.forEach($scope.model.Operations, function(obj, index) {
						var flag = true;
						angular.forEach($scope.SelectedTag, function(obj1, index1) {
							if (obj1.TagId == obj.TagId) {
								flag = false;
							}
						});
						if (flag) {
							obj.State = 0;
							item.push(obj);
						}
					});
				} else { //删除已选标签
					angular.forEach($scope.SelectedTag, function(obj, index) {
						var flag = true;
						angular.forEach($scope.model.Operations, function(obj1, index1) {
							if (obj1.TagId == obj.TagId) {
								flag = false;
							}
						});
						if (flag) {
							obj.State = 2;
							item.push(obj)
						}
					});
				}
				$scope.model.Operations = item;
				TagService.SavePermissions($scope, $scope.model, function() {

				})
				$modalInstance.close();
			},
			Close: function(row) {
				$modalInstance.close();
			},
			LoadData: function(SelectData) {
				TagService.GetList($scope, {
					QueryType: 2
				}, function(data) {
					$scope.PersonalTag = data;
					$scope.SelectedTag = [];
					TagService.GetPermissions($scope, $scope.model, function(data) {
						$scope.SelectedTag = data;
						$scope.model.Operations = SelectSet($scope.SelectedTag, $scope.PersonalTag, "TagId");
					})
				});
			}
		}
		$scope.event.LoadData();
	})
	//批量打个人标签
app.controller('BatchPersonalAccountTagCtrl', function($scope, $state, $stateParams, $modalInstance, AccountService, RoleService, Dialog, TagService, RelationType, RelationId, UserId, GroupRelationId, DataOperate, UserList) {
	$scope.model = {
		UserList: UserList
	};
	$scope.event = {
		Save: function() {
			angular.forEach($scope.model.Operations, function(obj, index) {
				obj.State = 0;
			});
			TagService.SavePersonalPermissionsList($scope, $scope.model, function(data) {
				$modalInstance.close(data);
			})
		},
		Close: function(row) {
			$modalInstance.close();
		},
		LoadData: function(SelectData) {
			TagService.GetList($scope, {
				QueryType: 2
			}, function(data) {
				$scope.PersonalTag = data;
			})
		}
	}
	$scope.event.LoadData();
})

//企业账号人组标签列表
app.controller('SetAccountTagCtrl', function($scope, $state, $stateParams, $modalInstance, AccountService, RoleService, Dialog, TagService, RelationType, RelationId,App, UserId, GroupRelationId, DataOperate) {
	$scope.model = {
		RelationID: RelationId,
		RelationType: RelationType,
		UserID: UserId,
		GroupRelationID: GroupRelationId
	};
	$scope.event = {
		Save: function() {
			TagService.SavePermissions($scope, $scope.model, function() {

			})
			$modalInstance.close();
		},
		Close: function(row) {
			$modalInstance.close();
		},
		LoadData: function(SelectData) {
			TagService.GetList($scope, {
				AppID:App.AppId,
				QueryType: 2
			}, function(data) {
				$scope.PersonalTag = data;
				TagService.GetPermissions($scope, $scope.model, function(data) {
					$scope.SelectedTag = data;
					$scope.model.Operations = SelectSet($scope.SelectedTag, $scope.PersonalTag, "TagId");
				})
			});
		}
	}
	$scope.event.LoadData();
});
app.controller('SelectPersonalTagCtrl', function($scope, $modalInstance, DataOperate, AppService, TagService, SelectData) {
	$scope.GridColumnList = GridColumnList;
	$scope.Page = {
		Index: 1
	};
	$scope.event = {
		Save: function() {
			var ret = $scope.data.filter(function(x) {
				if (x.Checked) {
					return x;
				}
			})
			$modalInstance.close(ret);
		},
		Close: function(row) {
			$modalInstance.close();
		},
		LoadData: function(SelectData) {
			TagService.LoadPageData($scope, {
				PageIndex: $scope.Page.Index
			}, function(data) {
				$scope.data = data.List;
				DataOperate.BuildListChecked($scope.data, SelectData, 'TagId', true);
			});
		}
	}
	$scope.event.LoadData(SelectData);
});
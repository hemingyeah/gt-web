app.controller('EnterPriseRoleListCtrl', function($scope, $modal, RoleService, $state, $stateParams, AccountService, Dialog) {
	$scope.Title = "企业帐号角色管理";
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.ButtonBarEvent = {
		Add: function() {
			Dialog.Show("/views/RoleManage/RoleOperate.html", "RoleOperateCtrl", "lg", {
				Id: function() {
					return null
				},
				Type: function() {
					return "Company";
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		}
	}
	$scope.event = {
		Edit: function(data) {
			Dialog.Show("/views/RoleManage/RoleOperate.html", "RoleOperateCtrl", "lg", {
				Id: function() {
					return data.Id;
				},
				Type: function() {
					return "Company";
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Delete: function(data) {
			RoleService.DeleteInfo($scope, $.extend(true, {
				Type: "Company"
			}, data), function(data) {
				$scope.event.LoadData();
			});
		},
		//分配企业账号
		Role: function(row) {
			Dialog.Show('/Views/RoleManage/SetEnterpriseRoleAccounts.html', 'SetEnterpriseRoleAccountsCtrl', 'sm', {
				Role: function() {
					return row;
				},
				Type: function() {
					return "Company";
				}
			}, function(result) {})
		},
		CommonTag: function(row) {
			Dialog.Show("/Views/Authority/AccountManage/CommonTag.html", "CommonTagCtrl", "lg", {
				RelationID: function() {
					return row.Id;
				},
				RelationType: function() {
					return 2;
				}
			}, function(result) {

			})
		},
		//功能权限分配
		SetPower: function(row) {
			Dialog.Show('/Views/Base/PluginManage/SetOperation.html', 'SetOperationPowerCtrl', 'sm', {
				RelationType: function() {
					return 2;
				},
				RelationID: function() {
					return row.Id;
				},
				App: function() {
					return {
						AppId: row.AppId
					};
				}
			}, function(result) {})
		},
		//节点权限分配
		Deptment: function(row) {
			Dialog.Show('/Views/DeptmentManage/SetAccountDeptment.html', 'SetAccountDeptmentCtrl', 'sm', {
				RelationId: function() {
					return row.Id;
				},
				RelationType: function() {
					return 2;
				},
				GroupRelationId: function() {
					return "";
				},
				AppID: function() {
					return row.AppId;
				}
			}, function(result) {})
		},
		//插件标签
		PluginTag: function(row) {
			Dialog.Show('/Views/Base/PluginManage/Control/SetPluginTag.html', 'SetPluginTagCtrl', 'lg', {
				App: function() {
					return {
						AppId: row.AppId
					};
				},
				RelationID: function() {
					return row.Id;
				},
				RelationType: function() {
					return 2;
				},
				GroupRelationID: function() {
					return null;
				}
			}, function(result) {})
		},
		LoadData: function() {
			RoleService.LoadPageData($scope, {
				Type: 'Company',
				PageIndex: $scope.Page.Index
			}, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
			});
		}
	}
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.event.LoadData();
});
app.controller('SetEnterpriseRoleAccountsCtrl', function($scope, $modalInstance, AccountRoleService, Role, Type) {
	//Sel_Account
	$scope.event = {
		Save: function() {
			AccountRoleService.SaveRoleAccount($scope, $.extend(true, {
				Type: Type,
				RoleId: Role.Id,
				Accounts: $scope.tree.getCheckedNodes(true).concat($scope.SelectData)
			}, $scope.model), function(data) {
				$modalInstance.close(data);
			})
		},
		Close: function() {
			$modalInstance.close();
		}
	}
	AccountRoleService.GetAccountByRole($scope, {
		Type: Type,
		RoleID: Role.Id
	}, function(data) {
		$scope.SelectData = data;
		$scope.SelectData = $scope.SelectData.filter(function(x) {
			var node = $scope.tree.getNodeByParam('Id', x.Id)
			if (!node) {
				return x;
			} else {
				$scope.tree.checkNode(node, true, true);
			}
		});
	})
})
app.controller('PersonRoleListCtrl', function($scope, $modal, RoleService, $state, $stateParams, AccountService, Dialog) {
	$scope.Title = "个人帐号角色管理";
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.ButtonBarEvent = {
		Add: function() {
			Dialog.Show("/views/RoleManage/RoleOperate.html", "RoleOperateCtrl", "lg", {
				Id: function() {
					return null
				},
				Type: function() {
					return "Person";
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		}
	};
	$scope.event = {
		Edit: function(data) {
			Dialog.Show("/views/RoleManage/RoleOperate.html", "RoleOperateCtrl", "lg", {
				Id: function() {
					return data.Id;
				},
				Type: function() {
					return "Person";
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Delete: function(data) {
			RoleService.DeleteInfo($scope, $.extend(true, {
				Type: "Person"
			}, data), function(data) {
				$scope.event.LoadData();
			});
		},
		//功能权限分配
		SetPower: function(row) {
			Dialog.Show('/Views/Base/PluginManage/SetOperation.html', 'SetOperationPowerCtrl', 'sm', {
				RelationType: function() {
					return 3;
				},
				RelationID: function() {
					return row.Id;
				},
				App: function() {
					return {
						AppId: row.AppId
					};
				}
			}, function(result) {})
		},
		//节点权限分配
		Deptment: function(row) {
			Dialog.Show('/Views/DeptmentManage/SetAccountDeptment.html', 'SetAccountDeptmentCtrl', 'sm', {
				RelationId: function() {
					return row.Id;
				},
				RelationType: function() {
					return 3;
				},
				GroupRelationId: function() {
					return "";
				},
				AppID: function() {
					return row.AppId;
				}
			}, function(result) {})
		},
		//插件标签
		PluginTag: function(row) {
			Dialog.Show('/Views/Base/PluginManage/Control/SetPluginTag.html', 'SetPluginTagCtrl', 'lg', {
				App: function() {
					return {
						AppId: row.AppId
					};
				},
				RelationID: function() {
					return row.Id;
				},
				RelationType: function() {
					return 3;
				},
				GroupRelationID: function() {
					return null;
				}
			}, function(result) {})
		},
		Role: function(row) {
			Dialog.Show('/Views/Authority/PersonalAccountManage/SelectPersonalAccount.html', 'SelectPersonalAccountCtrl', 'lg', {
				Role: function() {
					return row;
				},
				Type: function() {
					return "Person";
				}
			}, function(result) {})
		},
		LoadData: function() {
			RoleService.LoadPageData($scope, {
				Type: 'Person',
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
app.controller('RoleOperateCtrl', function($scope, RoleService, $modalInstance, AppService, Id, Type) {
	$scope.event = {
		Save: function() {
			RoleService.Save($scope, $.extend(true, {
				Type: Type
			}, $scope.model), function(data) {
				$modalInstance.close(data);
			})
		},
		Close: function() {
			$modalInstance.close();
		},
	}
	RoleService.LoadInfo($scope, {
		ID: Id,
		Type: Type
	}, function(data) {
		$scope.model = data;
	});
	// AppService.LoadData($scope, null, function(data) {
	// 	$scope.AppList = data;
	// })
})
app.controller('SetRoleCtrl', function($scope, $state, $stateParams, $modalInstance, RoleService, AccountRoleService, Type, Account) {
	$scope.model = {};
	$scope.event = {
		OK: function() {
			AccountRoleService.SaveAccountRole($scope, {
				Type: Type,
				AccountID: Account.Id,
				Account: Account.Account,
				AccountName: Account.AccountName,
				AccountParentID: Account.ParentId,
				AccountGroupRelationID: Account.GroupRelationId,
				Roles: $scope.model.Roles
			}, function(data) {
				$modalInstance.close();
			})
		},
		Close: function() {
			$modalInstance.close();
		},
		LoadData: function() {
			RoleService.LoadData($scope, {
				Type: Type,
				IsEnabled: true
			}, function(data) {
				$scope.RoleList = data;
				AccountRoleService.GetRoleByAccount($scope, {
					Type: Type,
					AccountID: Account.Id,
					AccountGroupRelationID: Account.ParentId || Account.GroupRelationId
				}, function(data) {
					$scope.model.Roles = SelectSet(data, $scope.RoleList)
				})
			})
		}
	}
	$scope.event.LoadData();
})
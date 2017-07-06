app.directive("personalaccount", function() {
	return {
		restrict: "E",
		template: function(e, a) {
			return '<ul id="' + a.id + '" class="ztree"></ul>'
		},
		replace: true,
		controller: function($scope, service, $modal, AccountNotePermissionsService) {
			$scope.service = service;
			$scope.$modal = $modal;
			$scope.AccountNotePermissionsService = AccountNotePermissionsService;
		},
		link: function($scope, element, attr, ngModel) {
			$scope.tree = "";
			var setting = {
				edit: {
					enable: attr.edit,
					showRemoveBtn: true,
					showRenameBtn: true,
					removeTitle: "删除节点",
					renameTitle: "编辑节点",
					drag: {
						autoExpandTrigger: true,
						prev: false,
						inner: function(treeId, nodes, targetNode) {
							return targetNode.isParent && !targetNode.children ? false : true;
						},
						next: false
					}
				},
				check: {
					enable: attr.check || attr.check == ""
				},
				data: {
					simpleData: {
						idKey: "Id",
						pIdKey: "ParentId",
						enable: true
					}
				},
				callback: {
					beforeDrag: function(treeId, treeNodes) {
						return treeNodes[0].pId ? true : false;
					},
					beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
						if ($scope.service.msg.confirm("确定要保存【" + treeNodes[0].name + "】节点的更改？")) {
							treeNodes[0].TbBaseGroupRelation.FK_ParentGroupId = targetNode.TbBaseGroupRelation.FK_GroupId;
							treeNodes[0].TbBaseGroupRelation.ParentId = targetNode.TbBaseGroupRelation.Id;
							return $scope.AccountService.Move($scope, treeNodes[0], function(data) {})
						} else {
							return false;
						}
					},
					beforeExpand: function(treeId, treeNode) {
						if (!treeNode.children) {
							$scope.AccountNotePermissionsService.GetList($scope, {
								ParentID: treeNode.Id,
								QueryType: 2,
							}, function(data) {
								$scope.tree.addNodes(treeNode, data, true);
							});
						}
					},
					onClick: function(event, treeId, treeNode) {
						$scope.$apply(function() {
							treeNode.PersonalAccount = treeNode.name;
							$scope.Sel_PersonalAccount = treeNode;

						})
					},
					beforeEditName: function(treeId, treeNode) {
						var modal = $scope.$modal.open({
							templateUrl: '/views/DeptmentManage/DeptmentOperate.html',
							controller: "DeptmentOperateCtrl",
							backdrop: "static",
							resolve: {
								item: function() {
									return treeNode;
								},
								parent: {}
							}
						})
						modal.result.then(function(result) {
							if (result) {
								treeNode.name = result.DisplayName;
								$scope.tree.updateNode(treeNode);
							}
						})
						return false;
					},
					beforeRemove: function(treeId, treeNode) {
						if (treeNode.level == 0 || treeNode.isParent) {
							$scope.service.msg.alert("父节点不能被删除！");
						}
						$scope.AccountService.DeleteInfo($scope, treeNode, function(data) {
							$scope.tree.removeNode(treeNode);
						})
						return false;
					}
				}
			};
			$scope.tree = $.fn.zTree.init($("#" + attr.id), setting, []);
			$scope.AccountNotePermissionsService.GetList($scope, {
				QueryType: 2,
				ParentID: ""
			}, function(data) {
				/**
				 * [if 系统管理员下无个人账号 data=[]]
				 */
				if(data.length){
					$scope.tree.addNodes(null, data, true);
					$scope.Sel_PersonalAccount = data[0];
					if (!$scope.Sel_PersonalAccount) { //是否已选中一个节点，否则同时表示当前加载的是根节点
						$scope.tree.getNodes()[0].Account = $scope.tree.getNodes()[0].name;
						$scope.Sel_PersonalAccount = $scope.tree.getNodes()[0];
						$scope.tree.selectNode($scope.Sel_Account);
					}
				}else{
					return;
				}
			});
		}
	}
});
app.controller('PersonalAccountListCtrl', function($scope, $state, $stateParams, PersonalAccountService, AccountService, RoleService, Dialog) {
	$scope.GridColumnList = GridColumnList;
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.event = {
		//批量打标签
		BatchBtn: function() {
			Dialog.Show('/Views/TagManage/AccountTagList.html', 'BatchPersonalAccountTagCtrl', 'md', {
				RelationType: function() {
					return 0;
				},
				RelationId: function() {
					return "";
				},
				UserId: function() {
					return "";
				},
				GroupRelationId: function() {
					return "";
				},
				UserList: function() {
					return $scope.data.filter(function(obj) {
						return obj.Checked;
					});
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//功能权限
		SetPowerBtn: function(row) {
			Dialog.Show('/Views/Base/PluginManage/SetOperation.html', 'SetOperationPowerCtrl', 'sm', {
				RelationType: function() {
					return 0;
				},
				RelationID: function() {
					return row.Id;
				},
				App: function() {
					return {
						AppId: row.AppId
					}
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//人组标签
		PersonTagBtn: function(row) {
			Dialog.Show('/Views/TagManage/AccountTagList.html', 'SetPersonalAccountTagCtrl', 'md', {
				RelationType: function() {
					return 0;
				},
				RelationId: function() {
					return "";
				},
				UserId: function() {
					return row.Id;
				},
				GroupRelationId: function() {
					return row.GroupRelationId;
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//个人账号节点权限分配
		DeptmentBtn: function(row) {
			Dialog.Show('/Views/DeptmentManage/SetAccountDeptment.html', 'SetAccountDeptmentCtrl', 'sm', {
				GroupRelationId: function() {
					return row.GroupRelationId;
				},
				RelationId: function() {
					return row.Id;
				},
				RelationType: function() {
					return 0;
				},
				AppID: function() {
					return row.AppId;
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		//个人账号角色权限分配
		RoleBtn: function(row) {
			Dialog.Show('/Views/RoleManage/SetRole.html', 'SetRoleCtrl', 'lg', {
				Type: function() {
					return "Person";
				},
				Account: function() {
					return row;
				}
			}, function(result) {})
		},
		//插件标签
		PluginTagBtn: function(row) {
			Dialog.Show('/Views/Base/PluginManage/Control/SetPluginTag.html', 'SetPluginTagCtrl', 'lg', {
				App: function() {
					return {
						AppId: row.AppId
					};
				},
				RelationID: function() {
					return $scope.Sel_PersonalAccount.Id;
				},
				RelationType: function() {
					return 0;
				},
				GroupRelationID: function() {
					return null;
				}
			}, function(result) {})
		},
		LoadData: function() {
			AccountService.GetUserListByGroupId($scope, {
				PageIndex: $scope.Page.Index,
				GroupRelationID: $scope.Sel_PersonalAccount.Id
			}, function(data) {
				$scope.data = data.List;
				if ($scope.Page.Index != 1) return;
				$scope.Page.Count = data.Num;
			});
		}
	};
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.$watch("Sel_PersonalAccount", function(newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.event.LoadData();
		}
	})
});
//给个人账号打人组标签
app.controller('PersonalAccountTagListCtrl', function($scope, $state, $stateParams, PersonalAccountService, AccountService, RoleService, Dialog) {
	$scope.GridColumnList = GridColumnList;
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.event = {
		//人组标签
		PersonalTag: function(row) {
			Dialog.Show('/Views/TagManage/AccountTagList.html', 'SetPersonalAccountTagCtrl', 'md', {
				RelationType: function() {
					return 0;
				},
				RelationId: function() {
					return "";
				},
				UserId: function() {
					return row.Id;
				},
				GroupRelationId: function() {
					return row.GroupRelationId;
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//批量打标签
		Batch: function() {
			Dialog.Show('/Views/TagManage/AccountTagList.html', 'BatchPersonalAccountTagCtrl', 'md', {
				RelationType: function() {
					return 0;
				},
				RelationId: function() {
					return "";
				},
				UserId: function() {
					return "";
				},
				GroupRelationId: function() {
					return "";
				},
				UserList: function() {
					return $scope.data.filter(function(obj) {
						return obj.Checked;
					});
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		LoadData: function() {
			AccountService.GetUserListByGroupId($scope, {
				PageIndex: $scope.Page.Index,
				GroupRelationID: $scope.Sel_PersonalAccount.Id
			}, function(data) {
				$scope.data = data.List;
				if ($scope.Page.Index != 1) return;
				$scope.Page.Count = data.Num;
			});
		}
	};
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.$watch("Sel_PersonalAccount", function(newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.event.LoadData();
		}
	})
});
app.controller('SetPersonalTagCtrl', function($scope, $stateParams, $modalInstance, AccountOperationService, DataOperate, TagService, PersonalAccount) {
	$scope.GridColumnList = GridColumnList;
	$scope.model = {
		UserId: PersonalAccount.Id,
		GroupRelationId: PersonalAccount.GroupRelationId
	};
	$scope.Page = {
		Index: 1
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
				QueryType: 2
			}, function(data) {
				$scope.PersonalTag = data;
				// DataOperate.BuildListChecked($scope.data,SelectData,'TagId',true);
			});
		}
	}
	$scope.event.LoadData();
});
//个人账号功能权限分配
app.controller('SetPersonalPowerCtrl', function($scope, $stateParams, $modal, $modalInstance, AccountOperationService, PowerService, MenuTypeList, relationType, relationId, DataOperate) {
	$scope.MenuType = MenuTypeList;
	$scope.AccountType;
	$scope.event = {
		Save: function() {
			var Permissions = [];
			angular.forEach($scope.OperationPowerTree.getCheckedNodes(true), function(sel, i) {
				if (sel.children) {
					sel.childrenCount = sel.children.length;
				}
				Permissions.push(sel);

			});
			$scope.model = {
				relationId: relationId,
				relationType: 0,
				MenuType: $scope.Sel_MenuType.PlatformId,
				appId: "",
				Permissions: Permissions
			};
			AccountOperationService.SaveOperation($scope, $scope.model, function(data) {
				$modalInstance.close(true);
			})
		},
		SelectMenuType: function(row) {
			$scope.Sel_MenuType = row;
			AccountOperationService.GetOperation($scope, {
				MenuType: $scope.Sel_MenuType.PlatformId,
				RelationType: relationType,
				RelationID: relationId
			}, function(data) {
				$scope.SelectOperate = data
				$scope.OperationPowerTree.checkAllNodes(false);
				var AllNode = $scope.OperationPowerTree.transformToArray($scope.OperationPowerTree.getNodes());
				DataOperate.BuildListChecked(AllNode, $scope.SelectOperate, 'Id');
				AllNode.forEach(function(obj, i) {
					if (obj.checked) {
						$scope.OperationPowerTree.checkNode(obj, true, true);
					}
				})
			})
		},
		LoadData: function(fun) {
			AccountService.LoadPageData($scope, Account, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
				fun();
			});
		}
	};
	$scope.event.LoadData(function() {
		//加载已配置账号
		AccountService.GetRoleAccounts($scope, Account, function(data) {
			angular.forEach($scope.data, function(obj, index) {
				angular.forEach(data, function(obj1, index1) {
					if (obj1.AccountId == obj.Id) {
						obj.Checked = true;
					}
				});
			});
		})
	});
});
//个人账号功能权限分配
app.controller('SetPersonalPowerCtrl', function($scope, $stateParams, $modal, $modalInstance, AccountOperationService, PowerService, MenuTypeList, relationType, relationId, DataOperate) {
	$scope.MenuType = MenuTypeList;
	$scope.AccountType;
	$scope.event = {
		Save: function() {
			var Permissions = [];
			angular.forEach($scope.OperationPowerTree.getCheckedNodes(true), function(sel, i) {
				if (sel.children) {
					sel.childrenCount = sel.children.length;
				}
			})
		},
		Close: function() {
			$modalInstance.close();
		}
	};
});
//个人账号节点权限分配
app.controller('SetPersonalDeptmentCtrl', function($scope, $modalInstance, AccountNotePermissionsService, AccountOperationService, GroupRelationId, RelationId, DeptmentService, RelationType, DataOperate) {
	$scope.event = {
		Save: function() {
			AccountNotePermissionsService.SavePermissions($scope, {
				RelationID: RelationId,
				RelationType: RelationType,
				Permissions: $scope.tree.getCheckedNodes(true),
				GroupRelationID: GroupRelationId,
				AppID: $scope.Sel_App.AppId
			}, function(data) {
				$modalInstance.close(data);
			})
		},
		SelectApp: function(row) {
			$scope.Sel_App = row;
			AccountNotePermissionsService.GetPermissions($scope, {
				GroupRelationID: GroupRelationId,
				RelationType: RelationType,
				RelationID: RelationId,
				AppID: row.AppId
			}, function(data) {
				$scope.SelectOperate = data; //已选中节点
				AccountNotePermissionsService.GetList($scope, {
					QueryType: 2,
					AppID: row.AppId,
					ParentID: GroupRelationId
				}, function(data) {
					DataOperate.ClearTreeNode($scope.tree);
					DataOperate.BuildListChecked(data, $scope.SelectOperate, 'Id');
					$scope.tree.addNodes(null, data, true);
				});
			})
		},
		Close: function() {
			$modalInstance.close();
		}
	};
	AccountOperationService.GetAppList($scope, null, function(data) {
		$scope.AppList = data;
	});
});
//个人账号信息权限分配
app.controller('SetInfoTypeCtrl', function($scope, $modalInstance, Account, InfoTypeService, AccountService) {
	$scope.event = {
		LoadData: function(row) {
			var InitSelectItem = function() {
				for (var i = $scope.SelectNode.length - 1; i >= 0; i--) {
					var item = $scope.ztree.getNodeByParam("Id", $scope.SelectNode[i].Id);
					if (item) {
						$scope.ztree.checkNode(item, true);
						$scope.SelectNode.splice(i, 1);
					}
				};
			}
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
							InfoTypeService.LoadData($scope, {
								ParentID: treeNode.Id,
								RelationType: Account.AccountType || Account.RelationType,
								RelationID: Account.Id
							}, function(data) {
								$scope.ztree.addNodes(treeNode, data, true);
								InitSelectItem();
							});
						}
					}
				}
			};
			InfoTypeService.LoadSelectedData($scope, {
				ParentID: "",
				RelationType: Account.AccountType || Account.RelationType,
				RelationID: Account.Id
			}, function(data) {
				$scope.SelectNode = data;
				InfoTypeService.LoadData($scope, {
					ParentID: ""
				}, function(data) {
					$scope.ztree = $.fn.zTree.init($("#InfoTree"), setting, data);
					//设置加载节点是否勾选
					InitSelectItem();
				})
			})
		},
		Save: function() {
			var selectNode = $scope.ztree.getCheckedNodes(true);
			angular.forEach($scope.SelectNode, function(obj, index) {
				selectNode.push(obj);
			});
			$scope.model = {
				RelationType: Account.AccountType || Account.RelationType,
				RelationId: Account.Id,
				Permissions: selectNode
			};
			AccountService.SaveClassificationPermissions($scope, null, function() {
				$modalInstance.close(true);
			})
		}
	};
	$scope.event.LoadData();
});
app.controller('SelectPersonalAccountCtrl', function($scope, $stateParams, $modalInstance, DataOperate, AccountRoleService, AccountService, RoleService, Role, Type) {
	$scope.model = {};
	$scope.GridColumnList = GridColumnList;
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.event = {
		LoadData: function() {
			AccountRoleService.GetAccountByRole($scope, {
				RoleID: Role.Id,
				Type: Type
			}, function(data) {
				$scope.SelectData = data;
				AccountService.GetUserListByGroupId($scope, {
					PageIndex: $scope.Page.Index,
					GroupRelationId: $scope.Sel_PersonalAccount.Id
				}, function(data) {
					$scope.data = DataOperate.BuildListChecked(data.List, $scope.SelectData, "Id", true);
					if ($scope.Page.Index != 1) return;
					$scope.Page.Count = data.Num;
				});
			})
		},
		ChangeData: function(row) {
			if (row.Checked) {
				$scope.SelectData.push(row);
			} else {
				$scope.SelectData = $scope.SelectData.filter(function(x) {
					if (x.Id !== row.Id) {
						return x;
					}
				})
			}
		},
		OK: function() {
			AccountRoleService.SaveRoleAccount($scope, {
				Type: Type,
				RoleId: Role.Id,
				Accounts: $scope.SelectData
			}, function(data) {
				$modalInstance.close();
			})
		},
		Close: function() {
			$modalInstance.close();
		}
	};
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.$watch("Sel_PersonalAccount", function(newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.event.LoadData();
		}
	})
});
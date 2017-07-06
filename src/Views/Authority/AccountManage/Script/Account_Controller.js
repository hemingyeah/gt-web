app.directive("companyaccount", function() {
	return {
		restrict: "E",
		template: function(e, a) {
			return '<ul id="' + a.id + '" class="ztree"></ul>'
		},
		replace: true,
		controller: function($scope, service, $modal, AccountService, DataOperate) {
			$scope.service = service;
			$scope.$modal = $modal;
			$scope.AccountService = AccountService;
			$scope.DataOperate = DataOperate;
		},
		link: function($scope, element, attr, ngModel) {
			$scope.tree = "";
			$.extend($scope.event, {
				LoadData: function() {
					$scope.AccountService.LoadInfo($scope, {
						AccountID: $scope.SelectData.Id
					}, function(data) {
						$scope.SelectData = $.extend(true, $scope.tree.getSelectedNodes()[0], data);
					})
				}
			})
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
							$scope.AccountService.GetCompanyAccounts($scope, {
								ParentID: treeNode.Id
							}, function(data) {
								$scope.DataOperate.BuildListChecked(data, $scope.SelectData, 'Id')
									// data.map(function(x) {
									// 	if (treeNode.checked) x.checked = true;
									// 	return x;
									// })
								$scope.tree.addNodes(treeNode, data, true);
							});
						}
					},
					onClick: function(event, treeId, treeNode) {
						$scope.$apply(function() {
							$scope.SelectData = treeNode;
							$scope.event.LoadData();
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
			$scope.AccountService.GetCompanyAccounts($scope, {}, function(data) {
				$scope.DataOperate.BuildListChecked(data, $scope.SelectData || [], 'Id')
				$scope.tree.addNodes(null, data, true);
				if (!$scope.SelectData) { //是否已选中一个节点，否则同时表示当前加载的是根节点
					$scope.AccountService.LoadInfo($scope, {
						AccountID: $scope.tree.getNodes()[0].Id
					}, function(data) {
						$scope.tree.selectNode($scope.tree.getNodes()[0]);
						$scope.SelectData = $.extend(true, $scope.tree.getSelectedNodes()[0], data);
					})
				}
			});
		}
	}
})
app.controller('AccountListCtrl', function($scope, $state, $stateParams, AccountOperationService, AccountService, RoleService, Dialog) {
	var RelationType = 1;
	$scope.event = {
		//添加
		Add: function(row) {
			Dialog.Show("/views/Authority/AccountManage/AccountOperate.html", "AccountOperateCtrl", "lg", {
				Id: function() {
					return null
				},
				ParentID: function() {
					return $scope.SelectData.Id;
				}
			}, function(result) {
				if (!result) return;
				// var first_root = $scope.tree.getNodes()[0];
				//添加节点
				var addNode = function(parent, result) {
					result.name = result.Account;
					$scope.tree.addNodes(parent, [result]);
				}
				if ($scope.SelectData.isParent) {
					if ($scope.SelectData.children) {
						addNode($scope.SelectData, result);
					} else {
						addNode(null, result);
					}
				} else {
					addNode($scope.SelectData, result);
				}
			})
		},
		//修改
		EditInfo: function() {
			Dialog.Show("/views/Authority/AccountManage/AccountOperate.html", "AccountOperateCtrl", "lg", {
				Id: function() {
					return $scope.SelectData.Id
				},
				ParentID: function() {
					return null;
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		//删除
		DeleteSelect: function() {
			AccountService.DeleteInfo($scope, {
				AccountID: $scope.SelectData.Id
			}, function(data) {
				$scope.tree.removeNode($scope.SelectData);
			});
		},
		//功能权限
		SetPowerBtn: function() {
			Dialog.Show('/Views/Base/PluginManage/SetOperation.html', 'SetOperationPowerCtrl', 'sm', {
				RelationType: function() {
					return 1;
				},
				RelationID: function() {
					return $scope.SelectData.Id;
				},
				App: function() {
					return {
						AppId: $scope.SelectData.AppId
					};
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//插件标签
		PluginTagBtn: function() {
			Dialog.Show('/Views/Base/PluginManage/Control/SetPluginTag.html', 'SetPluginTagCtrl', 'lg', {
				App: function() {
					return {
						AppId: $scope.SelectData.AppId
					};
				},
				RelationID: function() {
					return $scope.SelectData.Id;
				},
				RelationType: function() {
					return 1;
				},
				GroupRelationID: function() {
					return null;
				}
			}, function(result) {})
		},
		CommonTag: function() {
			Dialog.Show("/Views/Authority/AccountManage/CommonTag.html", "CommonTagCtrl", "lg", {
				RelationID: function() {
					return $scope.SelectData.Id;
				},
				RelationType: function() {
					return RelationType;
				}
			}, function(result) {

			})
		},
		//节点权限
		DeptmentBtn: function(row) {
			Dialog.Show('/Views/DeptmentManage/SetAccountDeptment.html', 'SetAccountDeptmentCtrl', 'sm', {
				RelationId: function() {
					return $scope.SelectData.Id;
				},
				RelationType: function() {
					return RelationType;
				},
				GroupRelationId: function() {
					return "";
				},
				AppID: function() {
					return $scope.SelectData.AppId;
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		//人组标签
		PersonTagBtn: function() {
			Dialog.Show('/Views/TagManage/AccountTagList.html', 'SetAccountTagCtrl', 'md', {
				RelationType: function() {
					return 1;
				},
				RelationId: function() {
					return $scope.SelectData.Id;
				},
				GroupRelationId: function() {
					return "";
				},
				UserId: function() {
					return "";
				},
				App: function() {
					return {
						AppId: $scope.SelectData.AppId
					}
				}
			}, function(result) {})
		},
		RoleBtn: function(row) {
			Dialog.Show('/Views/RoleManage/SetRole.html', 'SetRoleCtrl', 'lg', {
				Account: function() {
					return $scope.SelectData;
				},
				Type: function() {
					return "Company";
				}
			}, function(result) {
				// if (result) {
				// 	$scope.event.LoadData();
				// }
			})
		},
		ResetPassword: function(data) {
			AccountService.ResetCompanyPwd($scope, $scope.SelectData, function() {})
		}
	};
	AccountOperationService.GetAppList($scope, null, function(data) {
		$scope.AppList = data;
	});
	// $scope.event.LoadData();
	RoleService.LoadRole($scope, $stateParams.MenuType);
});
app.controller('AccountOperateCtrl', function($scope, $state, $stateParams, $modal, $modalInstance, AccountService, AccountOperationService, CompanyService, Id, ParentID) {
	$scope.Id = Id;
	$scope.ParentID = ParentID;
	$scope.event = {
		Save: function() {
			$scope.model.GroupRelationId = $scope.model.GroupRelation.Id;
			$scope.model.GroupRelationName = $scope.model.GroupRelation.GroupName;
			$scope.model.ID = $scope.model.Id;
			AccountService.Save($scope, $scope.model, function(data) {
				if (data) {
					$modalInstance.close($.extend({
						Id: $scope.model.Id ? $scope.model.Id : data
					}, $scope.model));
				}
			});
		},
		Close: function() {
			$modalInstance.close();
		},
		SelectButton: function() {
			var modal = $modal.open({
				templateUrl: '/Views/ButtonManage/SelectButton.html',
				controller: "SelectButtonCtrl",
				backdrop: "static",
				resolve: {
					Operations: function() {
						return $scope.model.Operations;
					}
				}
			})
			modal.result.then(function(result) {
				if (result) {
					$scope.model.Operations = result;
				}
			})
		}
	};
	AccountOperationService.GetAppList($scope, null, function(data) {
		$scope.AppList = data;
		AccountService.LoadInfo($scope, {
			AccountID: Id
		}, function(data) {
			$scope.model = data;
			$scope.model.ParentId = $scope.ParentID;
			$scope.model.GroupRelation = {
				Id: $scope.model.GroupRelationId,
				GroupName: $scope.model.GroupRelationName
			}
		})
	})
})
app.controller('SetCompanyAccountCtrl', function($scope, $stateParams, $modal, $modalInstance, AccountService, Account) {
	$scope.Page = {
		Index: 1,
		Count: 1
	};
	$scope.event = {
		Save: function() {
			$scope.model = {
				RoleId: Account.Id,
				AccountType: Account.AccountType,
				Accounts: []
			};
			angular.forEach($scope.data, function(obj, index) {
				if (obj.Checked) {
					obj.AccountId = obj.Id;
					$scope.model.Accounts.push(obj);
				}
			});
			AccountService.SaveRoleAccounts($scope, null, function() {
				$modalInstance.close(true);
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
})
app.controller('SetPowerCtrl', function($scope, $stateParams, $modal, $modalInstance, Account, AppService, PowerService, AccountService) {
	$scope.AccountType;
	$scope.MenuType = [{
		PlatformName: "Web_",
		PlatformId: 0,
		TreeObj: "Web_zTree"
	}, {
		PlatformName: "PC_",
		PlatformId: 1,
		TreeObj: "PC_zTree"
	}, {
		PlatformName: "Andriod_",
		PlatformId: 2,
		TreeObj: "Andriod_zTree"
	}, {
		PlatformName: "IOS_",
		PlatformId: 3,
		TreeObj: "IOS_zTree"
	}];
	$scope.event = {
		Save: function() {
			var Permissions = [];
			angular.forEach($scope.MenuType, function(obj, index) {
				angular.forEach($scope[obj.TreeObj].getCheckedNodes(true), function(sel, i) {
					Permissions.push($.extend(sel, {
						type: obj.PlatformId
					}));
				});
			});
			$scope.model = {
				RelationType: Account.AccountType || Account.RelationType,
				AppId: $scope.Sel_AppID,
				RelationId: Account.Id,
				Permissions: Permissions
			};
			AccountService.SaveOperationPermissions($scope, null, function(data) {
				$modalInstance.close(true);
			})
		},
		LoadData: function() {
			PageService.LoadPageData($scope, $scope.Page, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
			});
		},
		SelectApp: function(row) {
			$scope.Sel_AppID = row.AppId;
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
				}
			};
			angular.forEach($scope.MenuType, function(obj, index) {
				PowerService.LoadOperationPermissions($scope, {
					ParentID: "",
					RelationType: Account.AccountType || Account.RelationType,
					AppID: row.AppId,
					RelationID: Account.Id,
					MenuType: obj.PlatformId
				}, function(data) {
					$scope[obj.TreeObj] = $.fn.zTree.init($("#" + obj.PlatformName + row.AppId), setting, data);
				});
			});
		}
	};
	AppService.LoadData($scope, null, function(data) {
		$scope.AppList = data;
	})
})
app.controller('SetDeptmentCtrl', function($scope, $modalInstance, Account, AccountService, DeptmentService) {
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
							DeptmentService.GetRootData2($scope, {
								ParentID: treeNode.Id,
							}, function(data) {
								$scope.ztree.addNodes(treeNode, data, true);
								if (treeNode.checked) {
									//设置加载的节点全部勾选
									angular.forEach(data, function(obj, i) {
										var item = $scope.ztree.getNodeByParam("Id", obj.Id);
										$scope.ztree.checkNode(item, true);
									})
								} else {
									//设置加载节点是否勾选
									InitSelectItem();
								}
							});
						}
					}
				}
			};
			DeptmentService.LoadSelectedData($scope, {
				RelationType: Account.AccountType || Account.RelationType,
				RelationID: Account.Id
			}, function(data) {
				$scope.SelectNode = data;
				DeptmentService.GetRootData2($scope, {
					ParentID: "",
				}, function(data) {
					$scope.ztree = $.fn.zTree.init($("#DepartmentTree"), setting, data);
					//设置加载节点是否勾选
					InitSelectItem();
				})
			})
		},
		Save: function() {
			var selectNode = $scope.ztree.getCheckedNodes(true);
			//删除冗余数据
			for (var i = selectNode.length - 1; i >= 0; i--) {
				var parent = $scope.ztree.getNodeByParam("Id", selectNode[i].ParentId);
				var item = $scope.ztree.getNodeByParam("Id", selectNode[i].Id);
				if (parent && parent.check_Child_State == 2) {
					selectNode.splice(i, 1);
				} else if (item.check_Child_State == 1) {
					selectNode.splice(i, 1);
				}
			};
			//追加未加载的节点
			angular.forEach($scope.SelectNode, function(obj, index) {
				selectNode.push(obj);
			});
			$scope.model = {
				RelationType: Account.AccountType || Account.RelationType,
				AppId: $scope.Sel_AppID,
				RelationId: Account.Id,
				Permissions: selectNode
			};
			AccountService.SaveGroupPermissions($scope, null, function() {
				$modalInstance.close(true);
			})
		}
	};
	$scope.event.LoadData();
})
app.controller('CommonTagCtrl', function($scope, $modalInstance, AccountTagPermissionsService, RelationID, RelationType) {
	$scope.event = {
		LoadData: function(row) {
			AccountTagPermissionsService.GetList($scope, {}, function(data) {
				$scope.PersonalTag = data;
				AccountTagPermissionsService.GetEnterprisePermissions($scope, {
					RelationID: RelationID,
					RelationType: RelationType
				}, function(data) {
					$scope.model = data;
					$scope.model.Permissions = SelectSet(data.Permissions, $scope.PersonalTag, "TagId");
				})
			})
		},
		Close: function() {
			$modalInstance.close();
		},
		Save: function() {
			$scope.model.RelationID = RelationID;
			$scope.model.RelationType = RelationType;
			AccountTagPermissionsService.SaveEnterprisePermissions($scope, $scope.model, function(data) {
				$modalInstance.close(true);
			})
		}
	};
	$scope.event.LoadData();
})
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
// app.controller('SetRoleCtrl', function($scope, $modalInstance, AppService, RoleService, Account, AccountService) {
// 	$scope.Page = {
// 		Index: 1,
// 		Count: 1
// 	}
// 	$scope.event = {
// 		Save: function() {
// 			$scope.model = {
// 				AccountId: Account.Id,
// 				Account: Account.Account,
// 				GroupRelationId: Account.GroupRelationId,
// 				GroupRelationName: Account.GroupRelationName,
// 				AccountName: Account.AccountName,
// 				AccountType: Account.AccountType,
// 				Roles: []
// 			};
// 			angular.forEach($scope.data, function(obj, index) {
// 				if (obj.Checked) {
// 					$scope.model.Roles.push(obj);
// 				}
// 			});
// 			AccountService.SaveAccountRoles($scope, null, function() {
// 				$modalInstance.close(true);
// 			});
// 		},
// 		LoadData: function(fun) {
// 			RoleService.LoadData($scope, {
// 				AccountType: Account.AccountType,
// 				AccountID: Account.Id,
// 				GroupRelationID: Account.GroupRelationId
// 			}, function(data) {
// 				$scope.data = data;
// 				fun();
// 			});
// 		}
// 	}
// 	$scope.event.LoadData(function() {
// 		//获取已配置的角色
// 		AccountService.GetAccountRoles($scope, Account, function(data) {
// 			angular.forEach($scope.data, function(obj, index) {
// 				angular.forEach(data, function(obj1, index1) {
// 					if (obj1.Id == obj.Id) {
// 						obj.Checked = true;
// 					}
// 				});
// 			});
// 		})
// 	});
// })
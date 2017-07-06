/*
-1:原始状态
0：新增状态
1：删除状态
转化过程：
0 => -1:加载数据时
0 => 1:直接从数据源中删除
1 => 0：不存在
1 =>-1：将已标记成删除的数据还原的初始状态
-1 => 0：不存在
-1 =>1：删除时产生
*/
app.controller('TemplateListCtrl', function($scope, TemplateService, Dialog, service) {
	$scope.Page = {
		Index: 1,
		Count: 1
	}
	$scope.event = {
		Add: function() {
			Dialog.Show("/views/TemplateManage/TemplateOperate.html", "TemplateOperateCtrl", "lg", {
				Id: null
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Edit: function(data) {
			Dialog.Show("/views/TemplateManage/TemplateOperate.html", "TemplateOperateCtrl", "lg", {
				Id: function() {
					return data.Id;
				}
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		DownLoad: function() {
			var selectTemplate = $scope.data.filter(function(x) {
				if (x.Checked) return x;
			})
			if (selectTemplate.length == 0) {
				service.msg.alert("请选择需要下载的模板")
				return;
			}
			if (selectTemplate.length > 1) {
				service.msg.alert("只能选择一个模板")
				return;
			}
			Dialog.Show("/views/TemplateManage/TemplateImport.html", "TemplateImportCtrl", "lg", {
				Template: function() {
					return selectTemplate[0];
				}
			}, function(result) {})
		},
		Delete: function(data) {
			TemplateService.DeleteInfo($scope, data, function(data) {
				$scope.event.LoadData();
			});
		},
		LoadData: function() {
			TemplateService.LoadData($scope, null, function(data) {
				$scope.data = data;
			});
		}
	};
	$scope.event.LoadData();
});
app.controller('TemplateOperateCtrl', function($scope, $modalInstance, Id, TemplateService, service) {
	$scope.GridColumnList = GridColumnList;
	$scope.event = {
		ChangeDropDown: function($item, $model, temp) {
			if ($item.Id == temp.FkDictionaryId) return; //说明选择的还是自己
			var orderIndex = 0;
			for (var i = $scope.model.TemplateDetails.length - 1; i >= 0; i--) {
				if ($scope.model.TemplateDetails[i].DataState == 0 || $scope.model.TemplateDetails[i].DataState == -1) {
					orderIndex++;
					if ($item.Id == $scope.model.TemplateDetails[i].FkDictionaryId) {
						service.msg.alert("已存在列：" + $model);
						temp.Name = "";
						temp.Description = "";
						temp.InfoType = 2;
						temp.FkDictionaryId = "";
						return;
					}
				}
				if ($item.Id == $scope.model.TemplateDetails[i].FkDictionaryId && $scope.model.TemplateDetails[i].DataState == 1) {
					$scope.model.TemplateDetails[i].DataState = -1
					var dix = $scope.model.TemplateDetails.indexOf(temp);
					$scope.model.TemplateDetails.splice(dix, 1);
				}
			};
			temp.Name = $item.DisplayName;
			temp.Description = $item.Description;
			temp.OrderIndex = orderIndex;
			temp.FkDictionaryId = $item.Id;
		},
		ValidData: function() {
			for (var i = $scope.model.TemplateDetails.length - 1; i >= 0; i--) {
				var item = $scope.model.TemplateDetails[i];
				if (item.FkDictionaryId == "") {
					if (item.DataState == 1) {
						$scope.model.TemplateDetails.splice(i, 1);
					}
					if (item.DataState == 0) {
						service.msg.alert("存在列名为空，请选择之后再试!");
						return false;
					}
				}
			};
			return true;
		},
		Save: function() {
			if ($scope.event.ValidData() == false) return;
			for (var i = $scope.model.TemplateDetails.length - 1; i >= 0; i--) {
				if ($scope.model.TemplateDetails[i].DataState == -1) { //说明这是源数据，不需要提交到后台
					$scope.model.TemplateDetails.splice(i, 1);
				}
			};

			TemplateService.Save($scope, {
				model: $scope.model
			}, function(data) {
				$modalInstance.close(data);
			});
		},
		Close: function() {
			$modalInstance.close();
		},
		AddRow: function() {
			var isAddOk = false;
			$scope.model.TemplateDetails.forEach(function(item) {
				if (item.FkDictionaryId == "") {
					item.DataState = 0;
					isAddOk = true;
					return;
				}
			})
			if (isAddOk == false) {
				$scope.model.TemplateDetails.push({
					Name: "",
					Description: "",
					InfoType: 2,
					DataState: 0,
					FkDictionaryId: ""
				});
			}
		},
		DelRow: function(item, index) {
			if (item.DataState === 0) { //表示是刚加上去的，数据库没有该数据 0 => -1
				$scope.model.TemplateDetails.splice(index, 1);
			} else if (item.DataState === -1) { //表示是元数据，数据库有该数据 -1 => 1
				item.DataState = 1;
			}
		},
		CheckRow: function(item) {
			item.InfoType = item.IsDicVal ? 1 : 2;
			item.DataState = 0;
		},
		LoadData: function() {
			if (!Id) {
				TemplateService.LoadDefaultData($scope, null, function(data) {
					data.TemplateDetails.forEach(function(x) {
						x.IsDicVal = x.InfoType === 1;
					})
					$scope.model = data;
				});
			} else {
				TemplateService.LoadDataDetailsById($scope, {
					TemplateID: Id
				}, function(data) {
					data.TemplateDetails.forEach(function(x) {
						x.DataState = -1; //0 => -1
						x.IsDicVal = x.InfoType === 1;
					});
					$scope.model = data;
				});
			}
		},
		LoadDropDownData: function() {
			$scope.DicDropDownList = [];
			TemplateService.LoadDataIdsByParent($scope, {
				ParentId: '9CB8546A-011A-C54B-1DA2-08D2EFE24809',
				BeDeep: 'false'
			}, function(data) {
				data.forEach(function(item) {
					TemplateService.LoadDicDataByDicId($scope, {
						Id: item
					}, function(data) {
						$scope.DicDropDownList.push(data);
					})
				})
			});
		}
	}
	$scope.event.LoadDropDownData();
	$scope.event.LoadData();
});
app.controller('TemplateImportCtrl', function($scope, $modalInstance, Template, TemplateService, Dialog) {
	$scope.Index = 0;
	$scope.Group = {};
	$scope.event = {
		Save: function() {
			TemplateService.DownLoadTemp($scope, {
				Index: $scope.Index,
				TemplateId: Template.Id,
				GroupId: $scope.Group.Id,
			}, function(data) {
				var url = Route.Import_GetFile.Url + "?fileId=" + data + "&fileName=" + Template.Name + ".xls";
				var f = document.createElement("a");
				f.setAttribute("href", url);
				document.body.appendChild(f);
				f.click();
				$modalInstance.close(data);
			})
		},
		Close: function() {
			$modalInstance.close();
		},
		SelectGroupNode: function() {
			Dialog.Show('/views/TemplateManage/TemplateSelectDept.html', 'TemplateSelectDeptCtrl', 'md', {}, function(result) {
				if (result) {
					$scope.Group = result;
				}
			})
		}
	}
	$scope.eventName = {
		Save: "下载"
	};
});
app.controller('TemplateSelectDeptCtrl', function($scope, $modalInstance) {
	$scope.event = {
		Save: function() {
			$modalInstance.close($scope.SelectNode);
		},
		Close: function() {
			$modalInstance.close();
		}
	}
	$scope.eventName = {
		Save: "确定"
	};
});
app.filter("reverse", function() {
	return function(input) {
		if (input) {
			return input.filter(function(x) {
				if (x.DataState === 0 || x.DataState === -1) return x;
			})
		}
		return [];
	};
});
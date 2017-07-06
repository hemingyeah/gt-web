app.controller('PageListCtrl', function($scope, $state, $modal, $stateParams, $ocLazyLoad, Dialog, PageService, RoleService) {
	$scope.Page = {
		Index: 1,
		Count: 1
	};
	$scope.event = {
		Add: function() {
			Dialog.Show("/views/Base/PageManage/PageOperate.html", "PageOperateCtrl", "lg", {
				Id: null
			}, function(result) {
				if (result) {
					$scope.event.LoadData();
				}
			})
		},
		Edit: function(data) {
			Dialog.Show("/views/Base/PageManage/PageOperate.html", "PageOperateCtrl", "lg", {
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
			PageService.DeleteInfo($scope, {
				ID: data.Id
			}, function(data) {
				$scope.event.LoadData();
			});
		},
		Search: function() {
			this.LoadData();
		},
		LoadData: function() {
			PageService.LoadPageData($scope, {
				Name: $scope.Search,
				PageIndex: $scope.Page.Index
			}, function(data) {
				$scope.data = data.List;
				$scope.Page.Count = data.Num;
			});
		}
	};
	RoleService.LoadRole($scope, $stateParams.MenuType);
	$scope.event.LoadData();
})
app.controller('PageOperateCtrl', function($scope, $modalInstance, Dialog, PageService, OperationService, Id) {
	$scope.event = {
		Save: function() {
			PageService.Save($scope, $scope.model, function(data) {
				$modalInstance.close(data);
			});
		},
		Close: function() {
			$modalInstance.close();
		},
		LoadData: function() {
			PageService.LoadData($scope, null, function(data) {
				$scope.data = data;
				// $modalInstance.close(data);
			});
		}
	};
	// $scope.event.LoadData();
	OperationService.LoadData($scope, {
		PageIndex: 1,
		PageSize: 99
	}, function(data) {
		$scope.ButtonList = data;
		PageService.LoadInfo($scope, {
			ID: Id
		}, function(data) {
			$scope.model = data;
		});
	});
})
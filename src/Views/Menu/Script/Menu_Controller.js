app
	.controller('MenuCtrl', function($scope, service, $location, $state) {
		$scope.Route = sessionStorage.getItem("Route");
		$scope.event = {
			SelectMenu: function(item) {
				$scope.MenuID = item.Id;
				sessionStorage.setItem("MenuID", item.Id);
				sessionStorage.setItem("MenuPath", item.MenuWeb.Href);
				// $state.go(item.MenuWeb.Href);
			}
		};
		service.http.ajax({
				type: "get",
				url: $scope.Route.GetUserPermission,
				data: {
					menuType: 0
				}
			})
			.success(function(data) {
				service.http.DataHandle(data, function(data) {
					$scope.MenuList = data;
					if (sessionStorage.getItem("User")) {
						$scope.MenuID = $scope.MenuList[0].MenuInstances[0].Id;
						$location.path($scope.MenuList[0].MenuInstances[0].MenuWeb.Href);

						sessionStorage.setItem("MenuID", $scope.MenuList[0].MenuInstances[0].Id);
						sessionStorage.setItem("MenuPath", $scope.MenuList[0].MenuInstances[0].MenuWeb.href);
					}
				})
			});
	})
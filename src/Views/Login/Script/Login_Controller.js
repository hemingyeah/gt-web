app
	.controller('LoginCtrl', function($scope, LoginService, $state, service) {
		$scope.app.name = document.title = "中国产业互联网";
		$scope.event = {
			Login: function() {
				LoginService.Login($scope, null, function(data) {
					if (data) {
						$state.go("GT.Main");
					}
				});
			}
		}
	})
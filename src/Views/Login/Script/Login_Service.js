app
	.factory('LoginService', function ($http, service, DataOperate) {
	    var ret = {
	        Login: function ($scope, data, fun) {
	            DataOperate.LoadData(Route.CompanyLogin_CompanyAccountLogin, {
	                Account: $scope.model.Name,
	                Pwd: $scope.model.password
	            }, function (data) {
	                service.Cookie.Set("UserName", $scope.app.UserName = data.AccountName);
	                service.Cookie.Set("UserID", data.Id);
	                service.Cookie.Set("SessionID", data.SessionId);
	                service.Cookie.Set("AppID", data.AppId || "");
	                service.Cookie.Set("MenuType", "0");
	                service.Cookie.Set("AccountType", 5);
	                service.Cookie.Set("GroupRelationID", '7B3AA5A5-A9C3-489B-A665-2D548780E285'); //暂时写死
	                service.Cookie.Set("GroupRelationName", data.AccountName || "");
	                service.userId = data.Id;
	                service.userName = data.AccountName;
	                service.appId = data.AppId;
	                service.groupRelationId = data.GroupRelationId || "";
	                service.groupRelationName = data.GroupRelationName || "";
	                if (fun) fun(data);
	            })
	        }
	    };
	    return ret;
	});
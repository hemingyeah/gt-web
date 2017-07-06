'use strict';

var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'agGrid',
    'ImageCropper'
]);

var state =
{
    Add: {
        Value: "Add",
        Name: "添加"
    },
    Modify: {
        Value: "Modify",
        Name: "修改"
    },
    Delete: {
        Value: "Delete",
        Name: "删除"
    }
}

var guid = { Empty: "00000000-0000-0000-0000-000000000000" };
var common = {
    getItemById: function (array, id) {
        for (var obj in array) {
            if (array[obj].Id === id) {
                return array[obj];
            }
        }
        return {};
    },
    constructor: function (service, data) {
        var userId = service.Cookie.Get("UserID");
        var userName = service.Cookie.Get("UserName");
        var appId = service.Cookie.Get("AppID");
        var groupRelationId = service.Cookie.Get("GroupRelationID");
        var groupRelationName = service.Cookie.Get("GroupRelationID");
        $.extend(data, {
            DataSource: 2,
            TypeId: "",
            PluginId: "",
            AddUser: userId,
            AddUserName: userName,
            AppId: appId,
            GroupRelationId: groupRelationId,
            GroupRelationName: groupRelationName,
            ModifyUser: userId,
            ModifyUserName: userName
        });
        return data;
    },
    buildGuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
}
angular.module('app')
	.run(
		['$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {
			    $rootScope.$state = $state;
			    $rootScope.$stateParams = $stateParams;
			}
		]
	)
	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
			    $urlRouterProvider
					.otherwise('/Login');
			}
		]
	);
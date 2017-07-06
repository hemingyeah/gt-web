app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('Web.Index', {
				url: '/Index',
				templateUrl: '/Web/Home.html',
				controller: "HomeCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Web/BBCOService.js',
								'/Views/DeptmentManage/Script/Deptment_Service.js'
							]);
						}
					]
				}
			})
			.state('Web.List', {
				url: '/List/{Type}',
				templateUrl: '/Web/ForumContent.html',
				controller: "ViewListCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Web/BBCOService.js',
							]);
						}
					]
				}
			})
			.state('Web.Content', {
				url: '/Content/{Type}/{Id}',
				templateUrl: '/Web/RecommendArticle.html',
				controller: "ViewContentCtrl",
				resolve: {
					deps: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'/Web/BBCOService.js',
							]);
						}
					]
				}
			})
	});
app
	.directive("messagebarmodel", function() {
		return {
			restrict: "E",
			templateUrl: '/Ctl_Resources/MessageBar/MessageBar.html',
			replace: true,
			controller: function($scope, $interval, BBCOService) {
				BBCOService.GetNotices($scope, null, function(data) {
					$scope.MsgList = data.List;
				})
				intervalList.push(setInterval(function() {
					if ((0 - parseInt($(".MsgList").css("top"))) >= parseInt($(".MsgList").innerHeight()) - 87) {
						$(".MsgList").css("top", 0);
					} else {
						$(".MsgList").css("top", parseInt($(".MsgList").css("top")) - 87);
					}
				}, 5000));
			}
		}
	})
	.directive("childsystemmodel", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: function(e, a) {
				switch (a.type) {
					case "1":
						return '/Ctl_Resources/ChildSystem/ChildSystem.html';
						break;
					default:
						return '/Ctl_Resources/ChildSystem/ChildSystem.html';
						break;
				}
			},
			controller: function($scope, BBCOService) {
				BBCOService.GetCompanys($scope, null, function(data) {
					$scope.kh = data;
				})
			}
		}
	})
	.directive("knowledgemodel", function() {
		return {
			restrict: "E",
			templateUrl: '/Ctl_Resources/Knowledge/Knowledge.html',
			replace: true,
			controller: function($scope, BBCOService) {
				BBCOService.GetKnowledgeItemsForMainPage($scope, null, function(data) {
					$scope.KnowlegeList = data;
					$scope.SetImageUrl(data[0].Childrens[0].ImageUrl);
				})
				$scope.SetImageUrl = function(url) {
					$scope.ImageUrl = url;
				}
				$scope.ChangeTab = function(index) {
					$scope.classIndex = index;
				}
			}
		}
	})
	.directive("grouptopmodel", function() {
		return {
			restrict: "E",
			replace: true,
			template: function(e, a) {
					var html = $('<div class="GT-GroupTop"></div>');
					var row = $('<div class="row"></div>').appendTo(html);
					var head = $('<div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 GT-Group-title">' + a.headtitle + '</div>').appendTo(row);
					var right = $('<div class="col-xs-3 col-sm-2 col-md-2 col-lg-2" style="text-align: right;"></div>').appendTo(row);
					right.append('<a href="' + a.url + '">更多 ></a>');
					html.append("<hr>");
					return html[0].outerHTML;
				}
				// link: function(scope, iElement, iAttrs) {
				// 	scope.HeadTitle = iAttrs.headtitle;
				// 	scope.HeadUrl = iAttrs.url + "?appId=" + Set.AppId + "&type=" + iAttrs.type;
				// }
		}
	})
	.directive("informationmodel", function() {
		return {
			restrict: "E",
			templateUrl: '/Ctl_Resources/Information/Information.html',
			replace: true,
			controller: function($scope, BBCOService) {
				BBCOService.GetNews($scope, null, function(data) {
					$scope.ThreeNews = data.List;
				})
			}
		}
	})
	.directive("footmodel", function() {
		return {
			restrict: "E",
			scope: true,
			templateUrl: '/Ctl_Resources/Foot/Foot.html',
			replace: true
		}
	})
app.filter('ParseHtml', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
})
app
	.controller('HomeCtrl', function($scope, BBCOService) {
		BBCOService.GetAdvertisem($scope, null, function(data) {
			$scope.ImageList = data;
		});
		$scope.app.name = document.title = "中国产业互联网";
	})
	.controller('ViewListCtrl', function($scope, $stateParams, BBCOService) {
		$scope.Page = {
			Index:1,
			Count:1
		}
		$scope.Type = $stateParams.Type;
		switch ($scope.Type) {
			case "Notice":
				$scope.ListDataCode = "IoIp_GetNotices";
				$scope.NavName = "通知";
				break;
			case "Info":
				$scope.ListDataCode = "IoIp_GetNews";
				$scope.NavName = "资讯";
				break;
			case "Knowledge":
				$scope.TypeDataCode = "IoIp_GetKnowledgeItems";
				$scope.ListDataCode = "IoIp_GetKnowledgesByItemId";
				$scope.NavName = "知识库";
				$scope.ChangeTab = function(argItemId) {
					$scope.TypeId = argItemId;
					$scope.event.LoadListData();
				}
				break;
			case "ChildSys":
				$scope.ListDataCode = "IoIp_GetCompanys";
				$scope.ViewType = "Image";
				$scope.NavName = "企业介绍";
				break;
		}
		$scope.event = {
			LoadListData: function() {
				BBCOService.GetListData($scope, null, function(data) {
					$scope.ListData = data.List;
					$scope.Page.Count = data.Num;
				})
			},
			LoadTypeData: function() {
				BBCOService.GetTypeData($scope, null, function(data) {
					$scope.GroupType = data.List;
					$scope.TypeId = data.List[0].Id
					BBCOService.GetListData($scope, null, function(data) {
						$scope.ListData = data.List;
						$scope.Page.Count = data.Num;
					})
				})
			}
		}
		if (!$scope.TypeDataCode) {
			if ($scope.Type == "ChildSys") {
				BBCOService.GetListData($scope, null, function(data) {
					$scope.ListData = data;
				})
			} else {
				$scope.event.LoadListData();
			}
		} else {
			$scope.event.LoadTypeData();
		}

	})
	.controller('ViewContentCtrl', function($scope, $stateParams, BBCOService) {
		$scope.Id = $stateParams.Id;
		$scope.Type = $stateParams.Type;
		switch ($scope.Type) {
			case "Notice":
				$scope.UrlCode = "IoIp_GetNoticesById";
				$scope.NavName = "通知";
				break;
			case "Info":
				$scope.UrlCode = "IoIp_GetNewsById";
				$scope.NavName = "资讯";
				break;
			case "Knowledge":
				$scope.UrlCode = "IoIp_GetKnowledgesById";
				$scope.NavName = "知识库";
				break;
			case "ChildSys":
				$scope.UrlCode = "IoIp_GetCompanys";
				$scope.ViewType = "Image";
				$scope.NavName = "企业介绍";
				break;
		}
		BBCOService.GetInfoData($scope, null, function(data) {
			$scope.data = data;
		})

	})
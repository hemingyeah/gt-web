//主页列表
app.controller('LogListCtrl', function($scope, $state, DesignService, Dialog, service) {
    $scope.$on("AddLog", function(event, data) {
        $scope.$apply(function() {
            $scope.Sel_Server.LogList.MessageList.push(data)
        })
    })
    $scope.MessageList = [];
    $scope.event = {
        Download: function(row) {
            var url = "http://" + $scope.Sel_Server.DisplayName + ":" + $scope.portAjax + "/log?name=" + row.Name;
            var f = document.createElement("a");
            f.setAttribute("href", url);
            document.body.appendChild(f);
            f.click();
        },
        LoadData: function(row) {
            $scope.Sel_Plugin = row;
            $scope.portAjax = "8011";
            row.ServerTypes = [{
                DisplayName: "开发服务器",
                Code: 0,
                Servers: [{
                    DisplayName: "192.168.1.133",
                    Code: 0
                }, {
                    DisplayName: "192.168.1.132",
                    Code: 1
                }]
            }, {
                DisplayName: "测试服务器",
                Code: 1,
                Servers: [{
                    DisplayName: "192.168.1.134",
                    Code: 2
                }]
            }, {
                DisplayName: "正式服务器",
                Code: 2,
                Servers: [{
                    DisplayName: "192.168.1.132",
                    Code: 1
                }]
            }];
        },
        GetPlugins: function() {
            DesignService.GetPlugins($scope, null, function(data) {
                $scope.Plugins = data;
            });
        },
        GetRelativeLogs: function(row) {
            $scope.Sel_Server = row;
            $scope.Sel_Server.LogList = new LogSocket($scope, row.DisplayName, $scope.portAjax);
        }
    }
    $scope.event.GetPlugins();
});
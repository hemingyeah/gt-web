//Git管理-列表
app.controller('GitManageListCtrl', function ($scope, Dialog, GitManageService, manageService,RoleService, service) {
    //$scope.$modalInstance = $modal;
    $scope.dataService = GitManageService;
    $scope.roleSerivce = RoleService;
    manageService.dataGridInit($scope);

    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "Name",
            filter: "text",
            filterParams: { apply: true },
            suppressMenu: false,
            width: 200
        }, {
            headerName: "描述",
            suppressMenu: true,
            field: "Description",
            width: 200
        },{
            headerName: '操作',
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.operCellRendererFunc
     }
        ]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);


    /*    */
    var manage = manageService.constructor($scope, $scope.gridOptions, "GitManageEditCtrl", "/views/GitManage/GitManagEdit.html");
    $scope.gridOptions.event = $.extend(manage, {
    });

})
//Git管理-编辑
app.controller('GitManageEditCtrl', function ($scope, $modalInstance, GitManageService, editService, service, data) {


    $scope.$modalInstance = $modalInstance;
    $scope.dataService = GitManageService;
    $scope.service = service;
    $scope.data = data;
    $scope.trees = [];
    $scope.model = $.extend({}, $scope.data);



    var e = editService.constructor($scope);
    $scope.event = e

});


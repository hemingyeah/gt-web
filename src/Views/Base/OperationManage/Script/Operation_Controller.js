app.controller('OperationManageCtrl', function ($scope, service, $modal, UrlRoute, manageService, OperationService, Dialog) {
    $scope.viewCurrentNodeData = true;
    $scope.$modalInstance = $modal;
    $scope.dataService = OperationService;
    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
    [
        {
            headerName: "操作名称",
            field: "Name",
            suppressMenu: true,
            width: 150
        }, {
            headerName: "操作编码",
            suppressMenu: true,
            field: "Code"
        }, {
            headerName: "添加时间",
            field: "AddTime",
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.dateTimeToFormatFunc
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
    };
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "OperationEditCtrl", "/views/Base/OperationManage/OperationEdit.html");
    $scope.gridOptions.event = $.extend(manage, {});
    $scope.gridOptions.event.LoadData();
})
app.controller('OperationEditCtrl', function ($scope, $modalInstance, service, UrlRoute,editService, OperationService, data) {
    
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = OperationService;
    $scope.service = service;
    $scope.data = data;
    $scope.model = $.extend({}, $scope.data);

    var e = editService.constructor($scope);
    $scope.event = e;
});
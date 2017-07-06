//基础教学资源列表
// app.controller('BaseLearningResourceListCtrl', function($scope, $sce, Dialog, LearningResourceService) {
//         $scope.event = {
//             Add: function() {
//                 Dialog.Show("/views/LearningResourceManage/BaseLearningResourceOperate.html", "BaseLearningResourceOperateCtrl", "lg", {
//                     Id: function() {
//                         return null
//                     },
//                     LearningResourceLevels: function() {
//                         return $scope.LearningResourceLevels;
//                     }
//                 }, function(result) {
//                     if (result) {
//                         $scope.event.Search();
//                     }
//                 })
//             },
//             Edit: function(row) {
//                 Dialog.Show("/views/LearningResourceManage/BaseLearningResourceOperate.html", "BaseLearningResourceOperateCtrl", "lg", {
//                     Id: function() {
//                         return row.Id
//                     },
//                     LearningResourceLevels: function() {
//                         return $scope.LearningResourceLevels;
//                     }
//                 }, function(result) {
//                     if (result) {
//                         $scope.event.Search();
//                     }
//                 })
//             },
//             Delete: function(row) {
//                 LearningResourceService.DeleteLearningResourceMain($scope, row, function(data) {
//                     $scope.event.Search();
//                 });
//             },
//             View: function() {
//                 $scope.preview = $sce.trustAsHtml($('#textarea').val());
//             }
//         }
//     })
//     //基础教学资源编辑
// app.controller('BaseLearningResourceOperateCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, LearningResourceService, Id) {
//     $scope.Page = {
//         Index: 1,
//         Count: 1
//     }
//     $scope.Id = Id;
//     $scope.model = {};
//     $scope.event = {
//         Save: function() {
//             if (!$scope.Id) {
//                 LearningResourceService.AddLearningResourceMain($scope, $.extend($scope.model, {
//                     Id: $scope.Id
//                 }), function(data) {
//                     $modalInstance.close(data);
//                 });
//             } else {
//                 LearningResourceService.ModifyLearningResourceMain($scope, $scope.model, function(data) {
//                     $modalInstance.close(data);
//                 });
//             }
//         },
//         Close: function() {
//             $modalInstance.close();
//         }
//     }
//     LearningResourceService.LoadInfo($scope, {
//         ID: $scope.Id
//     }, function(data) {
//         if (data && data.Id) {
//             $scope.model = data;
//         }
//         $scope.model = data;
//     });
// })


app.controller('BaseLearningResourceListCtrl', function($scope, $modal, $state, $stateParams, service, LearningResourceService, Dialog, manageService, $compile) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.dataService = LearningResourceService;
    $scope.service = service;
    $scope.dialog = Dialog;
    $scope.$compile = $compile;
    manageService.dataGridInit($scope);
    //获取列
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "资源名称",
            field: "Name",
            width: 200,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "是否公开",
            field: "IsPublic",
            width: 200,
            filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "资源类型名称",
            field: "ResourceTypeName",
            suppressMenu: true
        }, {
            headerName: "学科名称",
            field: "SubjectTypeName",
            suppressMenu: true
        }, {
            headerName: "学段名称",
            field: "LearningStageTypeName",
            suppressMenu: true
        }, {
            headerName: '操作',
            width: 100,
            suppressMenu: true,
            cellRenderer: $scope.operCellRendererFunc
        }]); //默认值eventName: "gridOptions.event"

    $scope.gridOptions = {
        columnDefs: $scope.columnDefs,
        virtualPaging: true
    }
    $.extend($scope.gridOptions, $scope.options);
    var manage = manageService.constructor($scope, $scope.gridOptions, "BaseLearningResourceOperateCtrl", "/views/LearningResourceManage/BaseLearningResourceOperate.html");

    $scope.gridOptions.event = manage;

    // $scope.gridOptions.event.LoadData();
});
app.controller('BaseLearningResourceOperateCtrl', function($scope, $state, $modalInstance, LearningResourceService, editService, data) {
    $scope.$modalInstance = $modalInstance;
    $scope.dataService = LearningResourceService;
    $scope.model = data;

    var e = editService.constructor($scope);
    $scope.event = e;
});

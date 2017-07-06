//通知模板列表
app.controller('NoticeNewTemplateCtrl', function($scope, $sce, Dialog, NoticeNewTemplateService, manageService, RoleService, service) {
    $scope.dataService = NoticeNewTemplateService;
    $scope.roleSerivce = RoleService;

    manageService.dataGridInit($scope);
    $scope.columnDefs = $scope.columnDefs.concat(
        [{
            headerName: "名称",
            field: "Name",
            width: 200,
            // filter: "text",
            filterParams: {
                apply: true
            }
        }, {
            headerName: "描述",
            field: "Description",
            suppressMenu: true
        }, {
            headerName: "应用类型",
            field: "UseTypeName",
            suppressMenu: true
        }, {
            headerName: "使用次数",
            field: "UseNum",
            suppressMenu: true
        }, {
            headerName: "添加时间",
            field: "AddTime",
            cellRenderer: $scope.dateTimeToFormatFunc
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


    var manage = manageService.constructor($scope, $scope.gridOptions, "NoticeNewTemplateEditCtrl", "/views/NoticeNewManage/NoticeNewTemplateEdit.html");
    $scope.gridOptions.event = $.extend(manage, {

    });
});
//通知模板编辑
app.controller('NoticeNewTemplateEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, NoticeNewTemplateService, data) {
    $scope.model = data;
    $scope.event = {
        Save: function() {
            $scope.model.Context = $scope.editor.latestHtml;
            // var ImgList = $('.richtext .NoticeNewTemplate');
            // var ImgSrcList = [];
            // angular.forEach(ImgList, function(obj, index) {
            //     ImgSrcList.push(obj.currentSrc)
            // });
            // $scope.model.PhotoNames = ImgSrcList.join().replace(new RegExp("http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/", "gm"), "");
            if ($scope.model.Id) {
                NoticeNewTemplateService.PutNoticeTemplate($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            } else {
                NoticeNewTemplateService.PostNoticeTemplate($scope, $scope.model, function(data) {
                    $modalInstance.close(data);
                });
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
    NoticeNewTemplateService.LoadInfo($scope, {
        ID: $scope.model.Id
    }, function(data) {
        if (data.Id) {
            $scope.editor.html('<p>' + data.Context + '</p>');
        }
        $scope.model = data;
    });
});

//资讯列表
app.controller('NewsCommentCtrl', function($scope, $sce, Dialog, NewsCommentService, manageService, RoleService, service) {
        $scope.dataService = NewsCommentService;
        $scope.roleSerivce = RoleService;

        manageService.dataGridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat(
            [{
                headerName: "主题",
                field: "Name",
                width: 300,
                filter: "text",
                filterParams: {
                    apply: true
                }
            }, {
                headerName: "来源",
                field: "Source",
                width: 200
            }, {
                headerName: "评分总条数",
                field: "StarCount",
                suppressMenu: true
            }, {
                headerName: "评论总条数",
                field: "CommentCount",
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


        var manage = manageService.constructor($scope, $scope.gridOptions, "NewsCommentEditCtrl", "/views/NewsCommentManage/NewsCommentEdit.html");
        $scope.gridOptions.event = $.extend(manage, {
            GroupPush: function(data) {
                var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
                if (seletedData.length === 0){
                    service.msg.alert("请选择资讯！");
                    return;
                }
                Dialog.Show("/views/NewsCommentManage/NewsCommentGroupPush.html", "NewsCommentGroupPushCtrl", "lg", {
                    SeletedData: function() {
                        return seletedData;
                    },
                    row: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        $scope.event.Search();
                    }
                })
            },
            PersonalPush: function(data) {
                var seletedData = $scope.getCheckedData($scope.gridOptions.rowData);
                if (seletedData.length === 0){
                    service.msg.alert("请选择资讯！");
                    return;
                }
                Dialog.Show("/views/NewsCommentManage/NewsCommentPersonalPush.html", "NewsCommentPersonalPushCtrl", "lg", {
                    SeletedData: function() {
                        return seletedData;
                    },
                    row: function() {
                        return data;
                    }
                }, function(result) {
                    if (result) {
                        $scope.event.Search();
                    }
                })
            },
            TagPush: function(data) {
                // Dialog.Show("/views/TecSchemeManage/DetailIndex.html", "DetailIndexCtrl", "lg", {
                //     Id: function() {
                //         return data.Id;
                //     },
                //     row: function() {
                //         return data;
                //     }
                // }, function(result) {
                //     if (result) {
                //         $scope.event.Search();
                //     }
                // })
            }
        });
    })
    //资讯编辑
app.controller('NewsCommentEditCtrl', function($scope, $sce, $modalInstance, Dialog, DataOperate, NewsCommentService, data) {
        $scope.model = data;
        $scope.event = {
            Save: function() {
                $scope.model.Content = $scope.editor.latestHtml;
                // var ImgList = $('.richtext .notice');
                var ImgSrcList = [];
                ImgSrcList.push($scope.imgSrc);
                // angular.forEach(ImgList, function(obj, index) {
                //     ImgSrcList.push(obj.currentSrc);
                // });
                $scope.model.Images = ImgSrcList.join().replace(new RegExp("http://image-gtintel.oss-cn-hangzhou.aliyuncs.com/", "gm"), "");;
                // $scope.model.NewsCommentLevelName = DataOperate.GetListName($scope.model.FkNewsCommentLevelId, $scope.NewsCommentLevels, "Id", "DisplayName");
                if ($scope.model.Id) {
                    NewsCommentService.PutNewsComment($scope, $.extend($scope.model, {
                        Id: $scope.Id
                    }), function(data) {
                        $modalInstance.close(data);
                    });
                } else {
                    NewsCommentService.PostNewsComment($scope, $scope.model, function(data) {
                        $modalInstance.close(data);
                    });
                }
            },
            Close: function() {
                $modalInstance.close();
            },
            fileChange: function(evt) {
                file = evt.target.files[0];
                file.Extension = file.name.substr(file.name.lastIndexOf('.'));
                $scope.imageDataURI = file;
                Dialog.Show("/views/NewsCommentManage/ImgCrop.html", "ImgCropCtrl", "lg", {
                    File: function() {
                        return $scope.imageDataURI
                    }
                }, function(result) {
                    if (result) {
                        $scope.imgSrc = result;
                    }
                })
            }
        }
        NewsCommentService.LoadInfo($scope, {
            ID: $scope.model.Id
        }, function(data) {
            if (data.Id) {
                $scope.editor.html('<p>' + data.Content + '</p>');
            }
            $scope.model = data;
        });
        // $scope.model = data;
        // $scope.event = {
        //     Save: function() {
        //         $scope.model.Content = $scope.editor.latestHtml;
        //         var ImgList = $('.richtext .NewsComment');
        //         var ImgSrcList = [];
        //         angular.forEach(ImgList, function(obj, index) {
        //             ImgSrcList.push(obj.currentSrc)
        //         });
        //         $scope.model.PhotoNames = ImgSrcList.join().replace(new RegExp("http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/", "gm"), "");
        //         if ($scope.model.Id) {
        //             NewsCommentService.PutNewsComment($scope, $.extend($scope.model, {
        //                 Id: $scope.Id
        //             }), function(data) {
        //                 $modalInstance.close(data);
        //             });
        //         } else {
        //             NewsCommentService.PostNewsComment($scope, $scope.model, function(data) {
        //                 $modalInstance.close(data);
        //             });
        //         }
        //     },
        //     Close: function() {
        //         $modalInstance.close();
        //     }
        // }
        // NewsCommentService.LoadInfo($scope, {
        //     ID: $scope.model.Id
        // }, function(data) {
        //     if (data.Id) {
        //         $scope.editor.html('<p>' + data.Content + '</p>');
        //     }
        //     $scope.model = data;
        // });
    })
    //个人资讯
app.controller('NewsCommentPersonalPushCtrl', function($scope, $modal, $modalInstance, $sce, Dialog, NewsCommentService, service, RoleService, manageService, SeletedData) {
        $scope.SeletedData = SeletedData;
        $scope.Page = {
            Index: 1,
            Count: 1
        }
        $scope.event = {
            Save: function() {
                $modalInstance.close();
            },
            Close: function() {
                $modalInstance.close();
            },
            Push: function() {
                var selectedNodes = $scope.getCheckedData($scope.gridOptionsUser.rowData);
                var recievers = [];
                var newsCommentIds = [];
                selectedNodes.map(function(obj, index) {
                    recievers.push(obj.Id)
                    return recievers;
                })
                $scope.SeletedData.map(function(obj, index) {
                    newsCommentIds.push(obj.Id)
                    return newsCommentIds;
                })
                NewsCommentService.PostPushNewsComment($scope, {
                    NewsCommentIds: newsCommentIds,
                    Recievers: recievers,
                    PushType: 0
                }, function(data) {
                    $scope.data = data.List;
                    $scope.Page.Count = data.Num;
                    $modalInstance.close()
                });
            }
        };
        $scope.dataService = NewsCommentService;
        $scope.roleSerivce = RoleService;
        manageService.dataGridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat(
            [{
                headerName: "主题",
                field: "Name",
                width: 300
            }]); //默认值eventName: "gridOptions.event"
        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            rowData: $scope.SeletedData,
            onAfterFilterChanged: function() {
                var filterModel = $scope.gridOptions.api.getFilterModel();
                if (filterModel && Object.keys(filterModel).length > 0) {
                    $scope.search = filterModel.DisplayName.filter;
                } else {
                    $scope.search = "";
                }
                $scope.gridOptions.event.LoadTreeData();
            }
        }
        $.extend($scope.gridOptions, $scope.options);
        var manage = manageService.constructor($scope, $scope.gridOptions, "GroupOperateCtrl", "/views/UserManage/GroupEdit.html");

        $scope.gridOptions.event = $.extend(manage, {
            Add: false,
            DeleteAllSelect: false
        });
    })
    //群组资讯
app.controller('NewsCommentGroupPushCtrl', function($scope, $modal, $modalInstance, service, NewsCommentService, Dialog, RoleService, manageService, SeletedData) {
        $scope.SeletedData = SeletedData;
        $scope.Page = {
            Index: 1,
            Count: 1
        }
        $scope.event = {
            Save: function() {
                $modalInstance.close();
            },
            Close: function() {
                $modalInstance.close();
            },
            Push: function() {
                var selectedNodes = $scope.tree.getCheckedNodes(true);
                var recievers = [];
                var newsCommentIds = [];
                selectedNodes.map(function(obj, index) {
                    recievers.push(obj.Id)
                    return recievers;
                })
                $scope.SeletedData.map(function(obj, index) {
                    newsCommentIds.push(obj.Id)
                    return newsCommentIds;
                })
                NewsCommentService.PostPushNewsComment($scope, {
                    NewsCommentIds: newsCommentIds,
                    Recievers: recievers,
                    PushType: 1
                }, function(data) {
                    $scope.data = data.List;
                    $scope.Page.Count = data.Num;
                    $modalInstance.close()
                });
                NewsCommentService.PostPushNewsComment($scope, {
                    NewsCommentIds: newsCommentIds,
                    Recievers: recievers,
                    PushType: 1
                }, function(data) {
                    $scope.data = data.List;
                    $scope.Page.Count = data.Num;
                    $modalInstance.close()
                });
            }
        };
        $scope.dataService = NewsCommentService;
        $scope.roleSerivce = RoleService;
        manageService.dataGridInit($scope);
        $scope.columnDefs = $scope.columnDefs.concat(
            [{
                headerName: "主题",
                field: "Title",
                width: 300,
            }, {
                headerName: "来源",
                field: "Source",
                width: 200
            }]); //默认值eventName: "gridOptions.event"

        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            rowData: $scope.SeletedData
        }
        $.extend($scope.gridOptions, $scope.options);
        var manage = manageService.constructor($scope, $scope.gridOptions, "GroupOperateCtrl", "/views/UserManage/GroupEdit.html");
        $scope.gridOptions.event = $.extend(manage, {
            Add: false,
            DeleteAllSelect: false
        });
    })
    //标签资讯
app.controller('TagNewsCommentCtrl', function($scope, NewsCommentService) {
    $scope.Page = {
        Index: 1,
        Count: 1
    }
    $scope.event = {
        LoadData: function() {
            NewsCommentService.GetNewsCommentsByUserId($scope, {
                PageIndex: $scope.Page.Index
            }, function(data) {
                $scope.data = data.List;
            });
        },
        Delete: function(data) {
            NewsCommentService.DeleteInfo($scope, data, function(data) {
                $scope.event.LoadData();
            })
        }
    };
    $scope.event.LoadData();
})
app.controller('NewsCommentViewCtrl', function($scope, preview) {
    $scope.preview = preview;
});
app.controller('ImgCropCtrl', function($scope, $modalInstance, File, service) {
    $scope.eventName = {
        Save: "预览"
    }
    $scope.file = File;
    $scope.fileChanged = function(file) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function(e) {
            $scope.imgSrc = this.result;
            $scope.$apply();
        };
    }
    $scope.fileChanged($scope.file)
    $scope.event = {
        Save: function() {
            $scope.initCrop = true;
            if ($scope.imageCropStep === 2) {
                $scope.initCrop = true;
                $scope.eventName.Save = "保存";
            } else if ($scope.imageCropStep === 3) {
                //base64 img转换成blob对象
                $scope.blob = service.convert.convertToBlob($scope.result, $scope.file.type);
                $.extend($scope.blob, {
                    name: $scope.file.name,
                    Extension: $scope.file.Extension
                });
                $scope.ossUpload = service.FileUpload.BuildUploadObj();
                //上传
                var Upload = function(row) {
                    var GUID = service.FileUpload.BuildGUID();
                    //'Upload/Import/' + GUID 上传到一级目录
                    $scope.ossUpload.upload(service.FileUpload.BuildUploadSetting(row, GUID, function(res) {
                        $scope.tag = true;
                        $scope.$apply(function() {
                            row.state = true;
                            row.StateName = "已上传";
                            row.Id = GUID;
                            row.SavePath = '/';
                            $scope.imgUrl = "http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + row.Id + row.Extension;
                            $modalInstance.close($scope.imgUrl)
                        });
                        // CreateImgDom(row);
                        console.log("上传成功！");
                    }, function(res) {
                        console.log("上传失败！");
                        row.state = false;
                        row.StateName = "上传失败"
                    }, function(res) {
                        // console.log((res.loaded / res.total) * 100 + '%');
                    }));
                }
                Upload($scope.blob);
            }
        },
        Close: function() {
            $modalInstance.close();
        }
    }
})

// var app = angular.module('PublicApp', ["UrlConfig"]);
app.run(function () {
    //获取菜单数据
    // var id = Request("id") ? Request("id").substr(0, (Request("id") + "#").indexOf('#')) : 1; //获取页面请求参数:id

    // less.modifyVars({
    //  '@public-color': Set.ThemeColor ? Set.ThemeColor : "#478cd0",
    //  '@body-bgColor': Set.bodybgColor ? Set.bodybgColor : "white"
    // });
});
//-------------------------------------指令@表单控件------------------------------------
//富文本(wangEditor)
app
    .directive("richtextbox", function () {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: function (e, a) {
                var html;
                html = $('<div class="richtext"></div>');
                var textarea = $('<textarea id=' + (a.richtextid || 'textarea') + '></textarea>').appendTo(html);
                if (a.style) {
                    textarea.attr("style", a.style);
                }
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        textarea.attr(item, a[item]);
                    }
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, service) {
                $scope.onchange = function (text) {
                    console.log(text)
                }
                $scope.service = service;
                $scope.ossUpload = service.FileUpload.BuildUploadObj();

                //生成imgDom
                function CreateImgDom(file) {
                    var windowURL = window.URL || window.webkitURL;
                    var $img = $('<img src="" alt="" class="notice">');
                    $img.css({
                        'width': '70%',
                        'margin': '5px'
                    });
                    var Url = "http://" + $scope.ossUpload._config.bucket + "." + $scope.ossUpload._config.endpoint.host + "/" + file.Id + file.Extension;
                    $img[0].src = Url;
                    $scope.editor.hideModal();
                    $scope.editor.append($img);
                }

                //上传
                var Upload = function (row) {
                    var GUID = service.FileUpload.BuildGUID();
                    //'Upload/Import/' + GUID 上传到一级目录
                    $scope.ossUpload.upload(service.FileUpload.BuildUploadSetting(row, GUID, function (res) {
                        $scope.tag = true;
                        $scope.$apply(function () {
                            row.state = true;
                            row.StateName = "已上传";
                            row.Id = GUID;
                            row.SavePath = 'Upload/Import/';
                        });
                        CreateImgDom(row);
                        console.log("上传成功！");
                    }, function (res) {
                        console.log("上传失败！");
                        row.state = false;
                        row.StateName = "上传失败"
                    }, function (res) {
                        $scope.$apply(function () {
                            row.progress = Math.floor((res.loaded / res.total) * 100);
                        })
                    }));
                }
                $('body').delegate('#files', 'change', function (evt) {
                    var file = evt.target.files[0];
                    $scope.data = [];
                    $scope.data.push(file)
                    file.Extension = file.name.substr(file.name.lastIndexOf('.'));
                    Upload(file)
                });
            },
            link: function ($scope, element, attr, ngModel) {

                var $uploadContainer = $('#upload');
                $scope.editor = $('#' + (attr.richtextid || 'textarea')).wangEditor({
                    uploadImgComponent: $uploadContainer,
                    menuConfig: [
                        // ['viewSourceCode'],
                        ['bold', 'underline', 'italic', 'foreColor', 'backgroundColor', 'strikethrough'],
                        ['blockquote', 'fontFamily', 'fontSize', 'setHead', 'justify'],
                        ['createLink', 'insertTable', 'insertExpression'],
                        ['insertImage'],
                        // ['insertImage', 'insertLocation'],
                        ['undo', 'redo']
                    ],
                    onchange: $scope.onchange,
                    'expressions': $scope.service.expression.getExpressionList()
                });
                // $scope.editor.html('<p style="text-align: center;"><h1><ol><li><span style="line-height: 1.42857;"><b><font color="#880000">fdasgfad</font></b></span></li></ol></h1></p><img src="http://doc-gtintel.oss-cn-hangzhou.aliyuncs.com/Upload/Import/27811adc-9cd7-4c7d-8ec4-bb2c526da9f8.jpg" alt="" style="width: 70%; margin: 5px;">')
                element.css({
                    'margin-top': '10px',
                    'height': '500px'
                });
            }
        }
    })
    .directive("fileinput", function () {
        return {
            restrict: "E",
            replace: true,
            // require:"ngModel",
            template: function (e, a) {
                var html;
                html = $('<div class="checkbox"></div>');
                var label = $('<Label class="i-checks i-checks-sm"></Label>').appendTo(html);
                label.text(a.value ? a.value : "");
                $("<i></i>").prependTo(label);
                var input = $('<input type="checkbox" ng-model="' + a.ngmodel + '" />').prependTo(label);
                if (a.ngchange) {
                    input.attr("ng-click", a.ngchange);
                }
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        input.attr(item, a[item]);
                    }
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, service) { },
            link: function ($scope, element, attr, ngModel) { }
        }
    })
    .directive("checkbox", function () {
        return {
            restrict: "E",
            replace: true,
            // require:"ngModel",
            template: function (e, a) {
                var className = 'checkbox';
                if (a.ngclass) {
                    className = a.ngclass;
                }
                var html = $('<div class="' + className + '"></div>');
                var label = $('<Label class="i-checks i-checks-sm"></Label>').appendTo(html);
                label.text(a.label ? a.label : "");
                $("<i></i>").prependTo(label);
                var input = $('<input type="checkbox" ng-model="' + a.ngmodel + '" />').prependTo(label);
                input.attr({
                    "ng-click": a.ngchange || "",
                    "ng-disabled": a.ngdisabled || ""
                });
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        input.attr(item, a[item]);
                    }
                }
                html.append(e.context.innerHTML);
                return html[0].outerHTML;
            },
            controller: function ($scope, service) { },
            link: function ($scope, element, attr, ngModel) { }
        }
    })
    .directive("radio", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div class="radio"></div>');
                var label = $('<Label class="i-checks i-checks-sm"></Label>').appendTo(html);
                label.text(a.value ? a.value : "");
                var input = $('<input type="radio" ng-model="' + a.ngmodel + '">').appendTo(label);
                input.attr({
                    "ng-click": a.ngchange || "",
                    "ng-disabled": a.ngdisabled || ""
                });
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        input.attr(item, a[item]);
                    }
                }
                $("<i></i>").appendTo(label);
                return html[0].outerHTML;
            }
        }
    })
    .directive("switch", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<label class="i-switch bg-info m-t-xs"></label>');
                html.addClass(a.class || "");
                var input = $('<input type="checkbox"/>').appendTo(html);
                input.attr("ng-model", a.ngmodel);
                $("<i></i>").appendTo(html);
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        input.attr(item, a[item]);
                    }
                }
                return html[0].outerHTML;
            }
        }
    })
    .directive("number", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var num = $('<input ui-jq="TouchSpin" type="text" value="0" class="form-control" ng-model=' + a.ngmodel + '>');

                num.attr({
                    "data-step": a.step || "1",
                    "data-decimals": a.decimals || "0",
                    "data-min": a.rangemin || "0",
                    "data-max": a.rangemax || "100"
                });
                if (a.buttonstyle === 'top') {
                    num.attr({
                        "data-verticalbuttons": true,
                        "data-verticalupclass": "fa fa-caret-up",
                        "data-verticaldownclass": "fa fa-caret-down"
                    });
                }
                if (a.typename) {
                    if (a.type === "l") {
                        num.attr("data-prefix", a.typename);
                    } else if (a.type === "r") {
                        num.attr("data-postfix", a.typename);
                    }
                }
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        num.attr(item, a[item]);
                    }
                }
                return num[0].outerHTML;
            }
        }
    })
    .directive("file", function () {
        return {
            restrict: "E",
            template: function (e, a) {
                return '<input ui-jq="filestyle" type="file" data-icon="false" data-classButton="btn btn-default" data-classInput="form-control inline v-middle input-s">';
            }
        }
    })
    .directive('dropdown', function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div></div>');
                var dropdown = $('<ui-select theme="bootstrap" />').appendTo(html);
                dropdown.attr({
                    'ng-disabled': a.ngdisabled || "",
                    'on-select': a.onselect || "",
                    'ng-model': a.ngmodel,
                    'search-enabled': a.search
                });
                if (a.multiple || a.multiple === '') {
                    dropdown[0].attributes.setNamedItem(document.createAttribute('multiple'));
                }
                var match = $('<ui-select-match/>').appendTo(dropdown);
                match.attr({
                    'placeholder': a.placeholder
                }).html(a.display);

                var choices = $('<ui-select-choices/>').appendTo(dropdown);
                choices.attr('repeat', a.repeat);
                if (a.filter) {
                    var filterList = a.filter.split(',').map(function (x) {
                        return "'" + x + "': $select.search";
                    }).join(',');
                    var filter = ' | filter:{' + filterList + "}";
                    choices.attr('repeat', a.repeat + filter);
                }
                choices.html(e.context.innerHTML);

                if (a.tagging) {
                    dropdown.attr({
                        "tagging": a.tagging,
                        "tagging-label": "(自定义)",
                        "tagging-tokens": ",|/"
                    });
                    choices.prepend("<div ng-if=\"option.isTag\" ng-bind-html=\"option." + a.taggingValue + " + ' ' + $select.taggingLabel | highlight: $select.search\"></div>");
                }
                if (a.onselect) {
                    dropdown.attr({
                        "on-select": a.onselect
                    });
                }
                if (a.refresh) {
                    choices.attr({
                        'refresh': a.refresh,
                        'refresh-delay': 1000
                    })
                }
                return html[0].outerHTML;
            }
        }
    })
    .directive('dropdownlist', function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div></div>');
                var dropdown = $('<ui-select theme="bootstrap" />').appendTo(html);
                dropdown.attr({
                    'ng-disabled': a.ngdisabled || "",
                    'on-select': a.onselect || "",
                    'ng-model': a.ngmodel,
                    'search-enabled': a.search
                });
                if (a.multiple || a.multiple === '') {
                    dropdown[0].attributes.setNamedItem(document.createAttribute('multiple'));
                }
                var match = $('<ui-select-match/>').appendTo(dropdown);
                match.attr({
                    'placeholder': a.placeholder
                }).html(a.display);

                var choices = $('<ui-select-choices/>').appendTo(dropdown);
                choices.attr('repeat', a.repeat);
                if (a.filter) {
                    var filterList = a.filter.split(',').map(function (x) {
                        return "'" + x + "': $select.search";
                    }).join(',');
                    var filter = ' | filter:{' + filterList + "}";
                    choices.attr('repeat', a.repeat + filter);
                }
                choices.html(e.context.innerHTML);

                if (a.tagging) {
                    dropdown.attr({
                        "tagging": a.tagging,
                        "tagging-label": "(自定义)",
                        "tagging-tokens": ",|/"
                    });
                    choices.prepend("<div ng-if=\"option.isTag\" ng-bind-html=\"option." + a.taggingValue + " + ' ' + $select.taggingLabel | highlight: $select.search\"></div>");
                }
                if (a.refresh) {
                    choices.attr({
                        'refresh': a.refresh,
                        'refresh-delay': 1000
                    });
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, UiConfigService) {
                $scope.UiConfigService = UiConfigService;
            },
            link: function ($scope, e, a) {
                if (a.parentid) {
                    $scope.UiConfigService.GetDimensionalityTreeById($scope, {
                        FKDataSourceItemID: a.parentid,
                        Key: a.repeat
                    }, function (data, Key) {
                        $scope[Key.split('in')[1].substr(1)] = data;
                    })
                }
            }
        }
    })
    .directive('progressmodel', function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var div = $('<div></div>');
                if (a.multiple || a.multiple == '') {
                    var progress = $('<progress></progress>').appendTo(div);
                    var bar = $('<bar></bar>').appendTo(progress);
                    bar.append('<span ng-hide="bar.value < 5">{{bar.value}}%</span>');
                    bar.attr({
                        'ng-repeat': 'bar in stacked track by $index',
                        'value': 'bar.value',
                        'type': '{{bar.type}}'
                    });
                    if (a.classname) {
                        progress.attr({
                            'class': a.classname
                        });
                    }
                } else {
                    var progressbar = $('<progressbar></progressbar>').appendTo(div);
                    progressbar.append(e[0].innerHTML);
                    progressbar.attr({
                        'value': a.value ? a.value : '',
                        'class': a.classname ? a.classname : '',
                        'type': a.styletype ? a.styletype : ''
                    });
                }
                return div[0].outerHTML;
            }
        }
    })
    .directive('sliderbar', function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var slider = $('<slider></slider>');
                var div = $('<div></div>');
                if (a.type == 'multiple') {
                    slider.attr('ng-model-range', a.rangemax);
                } else if (a.type == 'format') {
                    slider.attr('translate-fn', a.translatefn);
                }
                slider.attr({
                    'ng-model': a.rangemin,
                    'floor': a.floor,
                    'ceiling': a.ceiling
                });
                slider.appendTo(div);
                return div[0].outerHTML;
            }
        }
    })
    .directive('datetimepicker', function () {
        return {
            restrict: "E",
            scope: {
                ngmodel: '='
            },
            replace: true,
            template: function (e, a) {
                var html = $('<div class="input-group"></div>');
                var input = $('<input type="text" class="form-control" />').appendTo(html);
                input.attr({
                    'datepicker-popup': "yyyy-MM-dd",
                    'ng-model': "ngmodel",
                    'is-open': "opened",
                    'min-date': a.mindate || "",
                    'max-date': a.maxdate || "",
                    'datepicker-options': "dateOptions",
                    'date-disabled': "disabled(date, mode)",
                    'ng-required': "true",
                    'close-text': "关闭"
                });
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button></span>');
                return html[0].outerHTML;
            },
            controller: function ($scope) {
                $scope.today = function () {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                };

                // Disable weekend selection
                //$scope.disabled = function (date, mode) {
                //    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
                //};

                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = !$scope.opened;
                };

                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    class: 'datepicker'
                };

                $scope.initDate = new Date();
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
            }
        }
    })
    .directive("textbox", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div/>");
                var textbox = $('<input type="text" class="form-control"/>').appendTo(html);
                a.maxlength = a.maxlength || 100;
                if (angular.isDefined(a.required)) {
                    textbox[0].attributes.setNamedItem(document.createAttribute('Required'));
                    // html.append('<span style="right:14px; color:green;" class="glyphicon glyphicon-ok form-control-feedback" ng-show="form.' + a.ngmodel.replace('.', '_') + '.$dirty && form.' + a.ngmodel.replace('.', '_') + '.$valid"></span>')
                }
                if (a.type) {
                    textbox.attr("type", a.type);
                }
                if (a.placeholder) {
                    textbox.attr("placeholder", a.placeholder);
                }
                if (a.ngmodel) {
                    textbox.attr({
                        "ng-model": a.ngmodel,
                        "name": a.ngmodel.replace('.', '_')
                    });
                }
                if (a.validtype) {
                    var pattern = "";
                    switch (a.validtype) {
                        case "Phone":
                            pattern = '/^[1][0-9]{10}$/';
                            break;
                        case "EnglishAndNum":
                            pattern = '/^[a-zA-Z0-9]$/';
                            break;
                        case "EnglishAndNumAndUnderline":
                            pattern = '/^[a-zA-Z0-9_]$/';
                            break;
                        case "EnglishAndChineseAndNumAndUnderline":
                            pattern = '/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/';
                            break;
                        case "English":
                            pattern = '/^[a-zA-Z]$/';
                            break;
                        case "IdCardNo":
                            pattern = '/^(\d{18,18}|\d{15,15}|\d{17,17}x)$/';
                            break;
                        case "IpNo":
                            pattern = '/^((([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))\.){3}(([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))$/';
                            break;
                        case "Telephone":
                            pattern = '/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/';
                            break;
                        case "Chinese":
                            pattern = '/^[\u4e00-\u9fa5]*$/';
                            break;
                        case "Number":
                            pattern = '/^[0-9]*$/';
                            break;
                    }
                    if (pattern) {
                        textbox.attr("ng-pattern", pattern);
                    }
                }
                if (a.validtype || angular.isDefined(a.required)) {
                    html.attr("ng-class", '{"has-error":!form.' + a.ngmodel.replace('.', '_') + '.$valid}')
                }
                if (a.ngdisabled) {
                    textbox.attr("ng-disabled", a.ngdisabled);
                } else if (a.disabled === "") {
                    textbox.attr("ng-disabled", a.ngdisabled);
                }
                if (a.maxlength) {
                    textbox.attr("maxlength", a.maxlength);
                }
                if (a.minlength) {
                    textbox.attr("minlength", a.minlength);
                }
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        textbox.attr(item, a[item]);
                    }
                }
                return html[0].outerHTML;
            },
            controller: function ($scope) { }
        }
    })
    .directive("dropdowntextbox", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div/>");
                var textbox = $('<TextBox class="form-control"/>').appendTo(html);
                if (angular.isDefined(a.required)) {
                    textbox[0].attributes.setNamedItem(document.createAttribute('Required'));
                    // html.append('<span style="right:14px; color:green;" class="glyphicon glyphicon-ok form-control-feedback" ng-show="form.' + a.ngmodel.replace('.', '_') + '.$dirty && form.' + a.ngmodel.replace('.', '_') + '.$valid"></span>')
                }
                if (a.type) {
                    textbox.attr("type", a.type);
                }
                if (a.placeholder) {
                    textbox.attr("placeholder", a.placeholder);
                }
                if (a.ngmodel) {
                    textbox.attr("ngmodel", a.ngmodel);
                }
                if (a.validtype) {
                    textbox.attr("validtype", validtype);
                }
                if (a.ngdisabled) {
                    textbox.attr("ngdisabled", a.ngdisabled);
                }
                return html[0].outerHTML;
            },
            controller: function ($scope) { }
        }
    })
    .directive("search", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div class='input-group'/>");
                var text = $('<TextBox></TextBox>').appendTo(html);
                if (a.placeholder) {
                    text.attr("placeholder", a.placeholder);
                }
                if (a.ngmodel) {
                    text.attr("ngmodel", a.ngmodel);
                }
                $('<span class="input-group-addon input-sm"><i class="fa fa-search"></i></span>').appendTo(html);
                return html[0].outerHTML;
            },
            controller: function ($scope) { }
        }
    })
    .directive("dropdowntreelist", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                configtree: '&',
                model: '='
            },
            template: function (e, a) {
                var html = $('<div class="input-group"></div>');
                var input = $('<input type="text" class="form-control" name="' + a.displaymodel.replace('.', '_') + '" ng-model="' + a.displaymodel + '" ng-disabled="true" />').appendTo(html);
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="' + a.displaymodel + '=null;"><i class="glyphicon glyphicon-trash"></i></button></span>')
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="event.ConfigTree(' + a.ngmodel + ')"><i class="icon-align-justify"></i></button></span>')
                if (angular.isDefined(a.required)) {
                    // hidden.attr("required", "true");
                    input.attr("required", "true");
                    html.attr("ng-class", '{"has-error":!form.' + a.displaymodel.replace('.', '_') + '.$valid}');
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, Dialog) {
                $scope.Dialog = Dialog;
                $scope.event = {};
                $scope.event.ConfigTree = function (param) {
                    $scope.Dialog.Show("/Views/DataBaseManage/SelectDictionaryTree.html", "SelectDictionaryTreeCtrl", "sm", {
                        ParentID: function () {
                            return $scope.attr.parentid;
                        },
                        SelectType: function () {
                            return $scope.attr.type || "radio";
                        },
                        SelectData: function () {
                            return param || [];
                        }
                    }, function (result) {
                        if (result) {
                            var fun = function (key, value) {
                                var list = key.split(".");
                                $scope.model[list[1]] = value;
                            }
                            fun($scope.attr.ngmodel, result.map(function (x) {
                                return x.FkDictionaryId;
                            }).join(","));
                            fun($scope.attr.displaymodel, result.map(function (x) {
                                return x.name;
                            }).join(","));
                        }
                    })
                }
            },
            link: function ($scope, e, a) {
                $scope.attr = a;
            }
        }
    })
    .directive("datagrid", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var div = $('<div style="height: 100%" class="ag-fresh" ="gridOptions">');
                var html = $('<div style="height: 100%; overflow-y: auto; color: #333;">' +
                    '</div>');
                if (a.aggrid) {
                    div.attr("ag-grid", a.aggrid);
                }
                html.append(div);
                if (a.page === "true") {
                    div.css("padding-bottom", "25px");
                    html.append('<div style="height: 25px; position:absolute; bottom: 3px; right: 150px">共[{{gridOptions.event.Page.Count}}]条数据</div>');
                }

                return html[0].outerHTML;
            },
            link: function ($scope, el, attr) {
                if (attr.no === "false") {
                    var col1 = $scope[attr.aggrid].columnApi.getColumn("No");
                    if (col1) {
                        $scope.gridOptions.columnApi.setColumnVisible(col1, false);
                    }
                }
                if (attr.check === "false") {
                    var col2 = $scope[attr.aggrid].columnApi.getColumn("CheckBox");
                    if (col2) {
                        $scope[attr.aggrid].columnApi.setColumnVisible(col2, false);
                    }
                }
                if (attr.mode === "select") {
                    $scope[attr.aggrid].selectMode = true;
                    $scope[attr.aggrid].selectData = [];
                    $scope.event = {
                        Save: function () {
                            var selectNodes = [];
                            $scope[attr.aggrid].rowData.forEach(function (obj) {
                                if (obj.IsChecked === true) {
                                    selectNodes.push(obj);
                                }
                            });
                            if (selectNodes.length === 0) {
                                return;
                            }
                            $scope.$root.$modalInstance.close(selectNodes);
                        },
                        Close: function () {
                            $scope.$root.$modalInstance.close();
                        }
                    };
                }
                if (attr.mode === "single") {
                    $scope[attr.aggrid].selectSingle = true;
                }
                if (attr.rowbtn === "false") {
                    $scope.gridOptions.columnApi.setColumnVisible($scope.gridOptions.api.columnController.allColumns[$scope.columnDefs.length - 1], false);
                }
                if (attr.showtoolpanel === "false") {
                    $scope[attr.aggrid].api.showToolPanel(false);
                }
                if (attr.enableserverfilter === "true") {
                    $scope.enableServerFilter = true;
                } else {
                    $scope.enableServerFilter = false;
                }
            },
            controller: function ($scope, $element) {

            }
        }
    })
    .directive("selecttree", function () {
        return {
            restrict: "E",
            replace: false,
            transclude: true,
            template: function (e, a) {
                a.ngmodel = a.ngmodel || "";
                a.cp = a.cp === "true" ? "p" : "";
                a.cc = a.cc === "true" ? "s" : "";
                a.multiselect = a.multiselect || "true";
                a.globalsingle = a.globalsingle || "true";
                a.selectmode = a.selectmode || "true";
                a.displayname = a.displayname || a.ngmodel + "Name";
                if (!a.tree) {
                    return "<div style='color:red'>tree Attributes can not be empty</div>";
                }
                var name = "Deptment";
                if (a.type === "dic") {
                    name = "Dictionary";
                }
                var html = $('<div style="width: 100%;">' +
                    '<div class="input-group" style="width: 100%;">' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control" readonly=true ng-model="' + a.displayname + '" placeholder="请选择" ' + (a.required ? "Required" : "") + '>' +
                    '<input type="hidden" class="form-control" readonly=true ng-model="' + a.ngmodel + '">' +
                   '<span class="input-group-btn">' +
                    '<button ng-click="' + a.tree + '.show()" class="btn btn-default" type="button"><span class="caret"></span></button>' +
                    '</span>' +
                    '</div>' +
                    '<div ng-show="' + a.tree + '.isShow" style="position: absolute; display: block; width: 100%;z-index:9999; background-color: white;">' +
                    '<div style="border: 1px solid #cfdadd; border-top-width: 0px;height:200px;overflow: auto;">' +
                    '<' + name + ' tree="' + a.tree + '" parent="' + a.parent + '" cp="' + a.cp + '"  cc="' + a.cc + '" multiselect="' + a.multiselect + '" globalsingle="' + a.globalsingle + '" selectmode="' + a.selectmode + '"></' + name + '>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                return html[0].innerHTML;
            },
            controller: function ($scope) {

            },
            link: function ($scope, element, attr, ngModel) {
                if (!$scope.trees) {
                    $scope.trees = [];
                }
                $scope[attr.tree].checkFun = function (treeNode) {
                    if (attr.iscol === "true") { //竖表维度
                        var index = parseInt(attr.tree.replace("item", ""));
                        if (!$scope.ColumnTags[index].Tags) {
                            $scope.ColumnTags[index].Tags = {};
                        }
                        if ($scope[attr.tree].setting.check.chkStyle === "radio") { //单选默认
                            $scope.ColumnTags[index].Tags = {};
                            if (treeNode.IsChecked === true) {
                                $scope.ColumnTags[index].Tags[treeNode.Id] = treeNode;
                                $scope.ColumnTags[index].Value = treeNode.Name + ";";
                            } else {
                                $scope.ColumnTags[index].Value = "";
                            }
                        } else { //多选模式
                            if (treeNode.IsChecked === true) {
                                $scope.ColumnTags[index].Tags[treeNode.Id] = treeNode;
                                $scope.ColumnTags[index].Value += treeNode.Name + ";";
                            } else {
                                delete $scope.ColumnTags[index].Tags[treeNode.Id];
                                $scope.ColumnTags[index].Value = $scope.ColumnTags[index].Value.replace(treeNode.Name + ";", "");
                            }
                        }
                    } else { //主表维度
                        if (!$scope[attr.tree].Tags) {
                            $scope[attr.tree].Tags = {};
                        }
                        var key = attr.ngmodel.split(".")[1];
                        var model = attr.ngmodel.split(".")[0];
                        var displayname = attr.displayname.split(".")[1];
                        if (!$scope[model][key]) {
                            $scope[model][key] = "";
                            $scope[model][key + "Tags"] = {};
                        }
                        if ($scope[attr.tree].setting.check.chkStyle === "radio") { //单选默认
                            $scope[model][key + "Tags"] = {};
                            if (treeNode.IsChecked === true) {
                                $scope[model][key + "Tags"][treeNode.Id] = treeNode;
                                $scope[model][displayname] = treeNode.Name;//Name
                                $scope[model][key] = treeNode.Id;//Id
                                $scope[attr.tree].isShow = false;
                            } else {
                                $scope[model][key] = "";
                                $scope[model][displayname] = "";//Name
                            }
                        } else { //多选模式
                            if (!$scope[model][displayname]) {
                                $scope[model][displayname] = "";
                            }
                            if (treeNode.IsChecked === true) {
                                $scope[model][key + "Tags"][treeNode.Id] = treeNode;
                                $scope[model][displayname] += treeNode.Name + ";";
                                $scope[model][key] += treeNode.Id + ";";
                            } else {
                                delete $scope[model][key + "Tags"][treeNode.Id];
                                $scope[model][displayname] = $scope[model][displayname].replace(treeNode.Name + ";", "");
                                $scope[model][key] = $scope[model][key].replace(treeNode.Id + ";", "");

                            }
                        }
                    }
                }
                $scope[attr.tree].createNode = function (treeNode) {
                    if (attr.iscol === "true") { //竖表维度
                        var index = parseInt(attr.tree.replace("item", ""));
                        if ($scope.ColumnTags[index].Tags !== undefined) {
                            if ($scope.ColumnTags[index].Tags.hasOwnProperty(treeNode.Id)) {
                                treeNode.IsChecked = true;
                                $scope[attr.tree].updateNode(treeNode);
                            }
                        }
                    } else {
                        var model = attr.ngmodel.split(".")[0];
                        var keyId = attr.ngmodel.split(".")[1];
                        var key = keyId + "Tags";
                        var displayname = attr.displayname.split(".")[1];
                        if (!$scope[model][displayname]) {
                            $scope[model][displayname] = "";
                        }
                        if ($scope[attr.tree].setting.check.chkStyle === "radio") {//单选
                            if ($scope[model][keyId] !== undefined) {
                                if ($scope[model][keyId] === treeNode.Id) {
                                    treeNode.IsChecked = true;
                                    $scope[model][displayname] = treeNode.Name;
                                    $scope[attr.tree].updateNode(treeNode);
                                }
                            }
                        } else {//多选
                            if ($scope[model][key] !== undefined) {
                                if ($scope[model][key].hasOwnProperty(treeNode.Id)) {
                                    treeNode.IsChecked = true;
                                    $scope[model][displayname] += treeNode.Name + ";";
                                    $scope[attr.tree].updateNode(treeNode);
                                }
                            }
                        }

                    }
                }
                $scope.trees.push($scope[attr.tree]);
                $scope[attr.tree].show = function () {
                    $scope.trees.forEach(function (obj) {
                        if (obj !== $scope[attr.tree]) {
                            obj.isShow = false;
                        }
                    });
                    $scope[attr.tree].isShow = !$scope[attr.tree].isShow;
                    if ($scope[attr.tree].isShow === true)
                        $("body").bind("mousedown", {
                            scope: $scope,
                            tree: $scope[attr.tree]
                        }, onBodyDown);
                }

                function onBodyDown(event) {
                    if (event.target.className !== "btn btn-default ng-click-active" && event.target.className !== "caret" && !event.target.id.startsWith(event.data.tree.setting.treeId)) {
                        event.data.tree.isShow = false;
                        $("body").unbind("mousedown", onBodyDown);
                    }
                }
            }
        }
    })
    .directive("deptment", function (ztreeSettingService) {
        return {
            restrict: "E",
            template: function (e, a) {
                return '<ul  class="ztree"></ul>';
            },
            replace: true,
            controller: function ($scope, service, $modal, groupService) {
                $scope.service = service;
                $scope.$modal = $modal;
                $scope.dataService = groupService;
            },
            link: function ($scope, element, attr, ngModel) {
                function getAsyncUrl(treeId, treeNode) {
                    var groupId = "";
                    if (treeNode) {
                        groupId = treeNode.Id;
                    }
                    return Route.Group_GetGroupRelationsByParentId.Url + "?operUserId=" + $scope.service.Cookie.Get("UserID") + "&appId=" + $scope.service.Cookie.Get("AppID") + "&parentId=" + groupId;
                };

                var setting = ztreeSettingService.constructor($scope, attr, getAsyncUrl);
                element[0].id = setting.treeId;
                if (attr.tree) {
                    $scope[attr.tree] = $.fn.zTree.init($("#" + setting.treeId), setting);
                } else {
                    $scope.tree = $.fn.zTree.init($("#" + setting.treeId), setting);;
                }
            }
        }
    })
    .directive("dictionary", function (ztreeSettingService) {
        return {
            restrict: "E",
            template: function (e, a) {
                return '<ul  class="ztree"></ul>';
            },
            replace: true,
            controller: function ($scope) { },
            link: function ($scope, element, attr, ngModel) {
                function getAsyncUrl(treeId, treeNode) {
                    var parentId = "";
                    if (treeNode) {
                        parentId = treeNode.Id;
                    } else {
                        parentId = attr.parent || "";
                    }
                    return Route.DataDictionaryInstance_GetDictionariesByParentId.Url + "?parentId=" + parentId;
                };

                var setting = ztreeSettingService.constructor($scope, attr, getAsyncUrl);
                element[0].id = setting.treeId;
                $scope[attr.tree] = $.fn.zTree.init($("#" + setting.treeId), setting);
            }
        }
    })
    .directive("dataTemplate", function () {
        return {
            restrict: "E",
            scope: {
                title: '=',
                image: '=',
                url: '=',
                content: '='
            },
            replace: true,
            template: function (e, a) {

                var html = $('<div class="row">' +
                    '<div class="col-sm-6 col-md-4">' +
                    '<div class="thumbnail">' +
                    '<img ng-src="url" alt="title">' +
                    '<div class="caption">' +
                    '<h3>{{title}}</h3>' +
                        '<p>{{content}}<a ng-href="url" class="btn btn-link" >详细</a> </p>' +
                        '</div>' +
                        '</div>' +
                    '</div>' +
                    '</div>');

                return html[0].outerHTML;
            },
            controller: function ($scope) { },
            link: function ($scope, element, attr, ngModel) { }
        }
    });
//------------------------------------指令@布局控件---------------------------
app
    .directive("gtform", function () {
        return {
            restrict: "A",
            replace: true,
            scope: false,
            link: function ($scope, e, a, model) {
                e.addClass("GT-Form form-horizontal");
            }
        }
    })
    .directive("panel", function () {
        return {
            restrict: "E",
            replace: true,
            scope: false,
            template: function (e, a) {
                var html = $('<div class="panel panel-default"></div>');
                if (e.attr('style')) {
                    html.attr('style', e.attr('style'));
                }
                if (a.add || a.Edit) {
                    html.css("margin-right", 5);
                }

                if ($("phead", e).length > 0) {
                    var head = $('<div class="panel-heading font-bold"><span>' + $("phead:eq(0)", e).html() + '</span></div>').appendTo(html);
                    if (a.dialog === "") {
                        $('<div style="float:right;cursor:pointer;" ng-click="event.Close()"><i class="icon-gt-delete"></i></div>').appendTo(head);
                    }
                    //是否聚合按钮
                    if (a.record === "") {
                        $('<div style="float:right;cursor:pointer;" ng-click="event.Record(Model, $event)"><i class="icon-gt-record" style="color:#929292;"></i></div>').appendTo(head);
                    }
                    if (a.edit) {
                        var editName = a.edit === "" ? "EditElse" : a.edit;
                        $('<div style="float:right;cursor:pointer;" ng-click="event.' + editName + '(Model, $event)"><i class="Btn btn-edit" style="color:#929292;">编辑</i></div>').appendTo(head);
                    }
                    if (a.add) {
                        var addName = a.add === "" ? "AddElse" : a.add;
                        $('<div style="float:right;cursor:pointer;" ng-click="event.' + addName + '(Model, $event)"><a class="btn-link"><span class="btn-add"></span>保存</a></div>').appendTo(head);
                    }
                    if (a.expand === "") {
                        head.attr("ng-click", "PanelEvent.ToggleBody()").css("cursor", "pointer");
                    }
                    if (a.selectuser) {
                        $('<div style="float:right;cursor:pointer;" ng-transclude> <selectuser button="true"></selectuser></div>').appendTo(head);
                    }
                }
                if ($("pbody", e).length > 0) {
                    var body = $('<div class="panel-body"></div>').appendTo(html);
                    if (a.expand === "") {
                        $(body).attr("ng-hide", "HideBody");
                    }
                    body.html($("pbody", e).html());
                    if ($("pbody", e).attr("style")) {
                        body.attr("style", $("pbody", e).attr("style"));
                    }
                }
                if ($("pfoot", e).length > 0) {
                    html.append('<div class="panel-footer">' + $("pfoot", e).html() + '</div>');
                }
                return html[0].outerHTML;
            },
            link: function ($scope, element, attr, ngModel) {
                $scope.HideBody = false;
                if (attr.hidebody === "") {
                    $scope.HideBody = true;
                }
                $scope.PanelEvent = {
                    ToggleBody: function () {
                        $scope.HideBody = !$scope.HideBody;
                    }
                }
            }
        }
    })
    .directive("formrow", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                a.colspan = a.colspan ? a.colspan : 2;
                var html = $('<div class="form-group"></div>');
                var label = $('<label class="control-label"></label>').appendTo(html);
                label.addClass('col-sm-' + a.colspan);
                if (a.required || a.required == '') {
                    label.addClass("GT-Must").addClass('col-sm-' + a.colspan);
                }
                var content = $('<div></div>').appendTo(html);
                content.html($(e.context).html());
                content.addClass('col-sm-' + (a.colspan === '12' ? a.colspan : (12 - parseInt(a.colspan))));
                if (a.label) {
                    label.text(a.label);
                } else {
                    content.addClass('col-sm-offset-' + a.colspan);
                }
                for (var item in a) {
                    if (item.startsWith("ng-")) {
                        html.attr(item, a[item]);
                    }
                }
                return html[0].outerHTML;
            },
            replace: true,
            controller: function ($scope, service) { },
            link: function ($scope, element, attr, ngModel) { }
        }
    })
    .directive("formRow", function () {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: function (e, a) {
                var html = $('<div class="form-group"></div>');
                if (a.padding) {
                    html.css("padding", a.padding)
                }
                var label = $('<label class="control-label"></label>').appendTo(html);
                if (a.margin) {
                    label.css("margin", a.margin)
                }
                if (a.required || a.required == '') {
                    label.addClass("GT-Must").addClass('col-sm-' + a.colspan);
                }
                var content = $('<div ng-transclude></div>').appendTo(html);
                if (a.label) {
                    label.text(a.label);
                } else {
                    content.addClass('col-sm-offset-' + a.colspan);
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, service) { },
            link: function ($scope, element, attr, ngModel) { }
        }
    })
    .directive("layout", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div class="hbox hbox-auto-xs bg-light"></div>');
                angular.forEach(e[0].children, function (obj, i) {
                    var $item = $('<div class="col lter b-r"><div class="vbox"></div></div>').appendTo(html);
                    var $width = $(obj).attr("width");
                    if ($(obj).attr("hidefilter")) {
                        $item.attr("ng-hide", "true");
                    };
                    if ($(obj).attr("label")) {
                        var title = $('<div class="wrapper b-b" style="height:50px;"><div class="font-thin h4" style="float:left;">' + $(obj).attr("label") + '</div></div>').appendTo($(".vbox", $item));
                        if ($(obj).attr("event")) {
                            title.append('<ButtonBar event="' + $(obj).attr("event") + '" style="float:right;"></ButtonBar>');
                        }
                    }
                    var content = $('<div class="row-row"><div class="cell scroll"><div class="cell-inner" ' + (obj.attributes.bgcolor ? 'style="background-color:' + obj.attributes.bgcolor.value + '"' : "") + '></div></div></div>').appendTo($(".vbox", $item));
                    $(".cell-inner", content).html($(obj).html());
                    if ($width) {
                        if ($width === 'sm') {
                            $item.addClass('w');
                        } else {
                            $item.width($width);
                        }
                    } else {
                        $(".cell-inner", content).css("padding", "10px 10px 10px 6px");
                    }
                })
                return html[0].outerHTML;
            }
        }
    })
    .directive("buttonbar", function () {
        return {
            restrict: "E",
            scope: false,
            template: function (e, a) {
                if (a.row === "tree") { //treebuttonbar
                    var html = $('<ul class="TreeBar"/>');
                    html.append('<li><a ng-click="TreeEvent.AddRoot()" ng-if="TreeEvent.AddRoot">根节点</a></li>');
                    html.append('<li><a ng-click="TreeEvent.Add()" ng-if="TreeEvent.Add">添加</a></li>');
                    html.append('<li><a ng-click="TreeEvent.Edit()" ng-if="TreeEvent.Edit">编辑</a></li>');
                    html.append('<li><a ng-click="TreeEvent.Delete()" ng-if="TreeEvent.Delete">删除</a></li>');
                    return html[0].outerHTML;
                }
                if (a.row || a.row === "") { //rowbuttonbar
                    var html = $('<div class="ButtonBar"></div>');
                    html.append('<i class="icon icon-gt-resetPassword" ng-if="' + (a.event || 'event') + '.ResetPassword" ng-click="' + (a.event || 'event') + '.ResetPassword(row)" title="重置密码"></i>');
                    html.append('<i class="icon icon-gt-pluginTag" ng-if="' + (a.event || 'event') + '.PluginTag" ng-click="' + (a.event || 'event') + '.PluginTag(row)" title="插件标签"></i>');
                    html.append('<i class="icon icon-gt-personalGroupTag" ng-if="' + (a.event || 'event') + '.PersonalTag" ng-click="' + (a.event || 'event') + '.PersonalTag(row)" title="人组标签"></i>');
                    html.append('<i class="icon icon-gt-commonTag" ng-if="' + (a.event || 'event') + '.CommonTag" ng-click="' + (a.event || 'event') + '.CommonTag(row)" title="普通标签"></i>');
                    html.append('<i class="icon icon-gt-funcPowers" ng-if="' + (a.event || 'event') + '.SetPower" ng-click="' + (a.event || 'event') + '.SetPower(row)" title="功能权限"></i>');
                    html.append('<i class="icon icon-gt-nodePowers" ng-if="' + (a.event || 'event') + '.Deptment" ng-click="' + (a.event || 'event') + '.Deptment(row)" title="节点权限"></i>');
                    html.append('<i class="icon icon-gt-pluginTag" ng-if="' + (a.event || 'event') + '.PluginTagBtn" ng-click="' + (a.event || 'event') + '.PluginTagBtn(row)" title="插件标签"></i>');
                    html.append('<i class="icon fa fa-comment" ng-if="' + (a.event || 'event') + '.InfoType" ng-click="' + (a.event || 'event') + '.InfoType(row)" title="信息分类"></i>');
                    html.append('<i class="icon icon-gt-rolePowers" ng-if="' + (a.event || 'event') + '.Role" ng-click="' + (a.event || 'event') + '.Role(row)" title="角色分配"></i>');
                    html.append('<i class="icon fa fa-university" ng-if="' + (a.event || 'event') + '.Company" ng-click="' + (a.event || 'event') + '.Company(row)" title="企业账号"></i>');
                    html.append('<i class="icon glyphicon glyphicon-user" ng-if="' + (a.event || 'event') + '.Person" ng-click="' + (a.event || 'event') + '.Person(row)" title="个人账号"></i>');
                    html.append('<i class="icon icon-gt-add" ng-if="' + (a.event || 'event') + '.AddDetail" ng-click="' + (a.event || 'event') + '.AddDetail(row)" title="添加详情"></i>');
                    html.append('<i class="icon icon-gt-edit" ng-if="' + (a.event || 'event') + '.Edit" ng-click="' + (a.event || 'event') + '.Edit(row)" title="编辑"></i>');
                    html.append('<i class="icon icon-gt-download" ng-if="' + (a.event || 'event') + '.Download" ng-click="' + (a.event || 'event') + '.Download(row)" title="下载"></i>');
                    html.append('<i class="icon icon-gt-upload" ng-if="' + (a.event || 'event') + '.Upload" ng-click="' + (a.event || 'event') + '.Upload(row)" title="上传"></i>');
                    html.append('<i class="icon icon-gt-deleterow" ng-if="' + (a.event || 'event') + '.Delete" ng-click="' + (a.event || 'event') + '.Delete(row)" title="删除"></i>');
                    html.append('<i class="icon icon-gt-search" ng-if="' + (a.event || 'event') + '.SearchView" ng-click="' + (a.event || 'event') + '.SearchView(row)" title="查询"></i>');
                    return html[0].outerHTML;
                } else { //buttonbar
                    var html = $('<div class="ButtonBar" style="box-sizing:border-box; text-align:right;min-height:40px;"/>');
                    var count = 0;
                    if (a.checkbox) {
                        html.append('<div style="width:160px;float:left;"><checkbox ngmodel="isClose"  label="保存成功后关闭窗体"></checkbox></div>');
                    }
                    /**
                     * [BuildButton description]
                     * @param {[type]} Name [按钮组名称]
                     * @param {[type]} Type [按钮组颜色类型]
                     * @param {[type]} arr  [按钮组数组]
                     */
                    var buildButton = function (arr) {
                        var ngif = arr.map(function (x) {
                            return (a.event || 'event') + '.' + x.Code;
                        }).join('||');
                        var btn = $('<div class="optbtn"  ng-if="' + ngif + '"/>').appendTo(html);
                        var btnList = $('<ul class="nav nav-pills"/>').appendTo(btn);
                        var manay = {};
                        arr.forEach(function (obj) {
                            if (obj.Group === true) {
                                if (!obj.GroupName) {
                                    obj.GroupName = "更多";
                                }
                                if (manay.hasOwnProperty(obj.GroupName)) {
                                    manay[obj.GroupName].push(obj);
                                } else {
                                    manay[obj.GroupName] = [];
                                    manay[obj.GroupName].push(obj);
                                }
                            } else
                                btnList.append('<li ng-click="' + (a.event || 'event') + '.' + obj.Code + '();" ng-if="' + (a.event || 'event') + '.' + obj.Code + '"><a class="btnlink">' + (obj.Ico ? "<i class='Btn " + obj.Ico + "'></i>" : "") + '{{eventName.' + obj.Code + '||"' + obj.Name + '"}}</a></li>')
                        });

                        for (var item in manay) {
                            var ngmany = manay[item].map(function (x) {
                                return (a.event || 'event') + '.' + x.Code;
                            }).join('||');
                            var dropdown = $('<li  ng-if="' + ngmany + '" role="presentation" data-toggle="dropdown" dropdown><a dropdown-toggle data-toggle="dropdown" class="btnlink"  role="button" aria-haspopup="true" aria-expanded="false">' + item + '<span class="icon-gt-more"></span></a></li>');
                            var dropdownContent = $('<ul class="dropdown-menu"></ul>');
                            manay[item].forEach(function (obj) {
                                dropdownContent.append('<li ng-click="' + (a.event || 'event') + '.' + obj.Code + '();" ng-if="' + (a.event || 'event') + '.' + obj.Code + '"><a>' + (obj.Ico ? "<i class='Btn " + obj.Ico + "'></i>" : "") + '{{eventName.' + obj.Code + '||"' + obj.Name + '"}}</a></li>');
                            });
                            dropdown.append(dropdownContent);
                            btnList.append(dropdown);
                        }


                    }
                    var arr = [];
                    arr = arr.concat(ButtonList.OperateList).concat(ButtonList.TagList).concat(ButtonList.PowerList).concat(ButtonList.OtherButtons);

                    buildButton(arr);
                    ButtonList.BaseButtons.forEach(function (obj) {
                        var button = $('<button class="btn m-b-xs" style="min-width:90px;"></button>').appendTo(html);
                        button.attr({
                            "ng-click": (a.event || 'event') + '.' + obj.Code + '()',
                            "ng-if": (a.event || 'event') + '.' + obj.Code
                        }).text('{{eventName.' + obj.Code + '||"' + obj.Name + '"}}')
                        if (obj.Type === "Submit" || obj.Code === "Next") {
                            button.addClass("btn-primary").attr({
                                "type": "submit",
                                "ng-disabled": (a.valid || 'form') + ".$invalid"
                            });
                        } else if (obj.Type === "Prev") {

                        } else {
                            button.addClass("btn-info");
                        }
                    });
                    return html[0].outerHTML;
                }
            },
            replace: true,
            controller: function ($scope) { },
            link: function (scope, e, a, model) {
                if (a.padding) {
                    e.css("padding", "10px 15px;")
                } else {
                    e.css("padding", "0 15px");
                }
                if (a.float) {
                    e.css("text-align", a.float);
                }
            }
        }
    })
    .directive("pagerbar", function () {
        return {
            restrict: "E",
            scope: false,
            replace: true,
            priority: 1,
            template: function (e, a) {
                var html = $("<div></div>");
                var pager = $('<Pagination  rotate="false"></Pagination>').appendTo(html);
                if (a.ngmodel) { //数据源
                    pager.attr("ng-model", a.source + '.' + a.ngmodel);
                }
                if (a.ngchange) { //页码变更事件
                    pager.attr("ng-change", a.ngchange);
                }
                if (a.disabled) { //是否可编辑
                    pager.attr("ng-disabled", a.disabled)
                }
                if (a.totalitems) { //绑定数据总条数
                    pager.attr("total-items", a.source + '.' + a.totalitems);
                }
                if (a.pagesize) { //每页数据条数
                    var val = a.source + '.' + a.pagesize;
                    pager.attr("items-per-page", val + "?" + val + ":10");
                }
                if (!(a.showlr || a.showlr == "")) {
                    pager.attr("direction-links", "false")
                }
                if (a.showlast || a.showlast == "") {
                    pager.attr("boundary-links", "true");
                }
                pager.attr({
                    "max-size": 10,
                    "previous-text": a.ltext ? a.ltext : "上一页",
                    "next-text": a.rtext ? a.rtext : "下一页",
                    "first-text": a.firsttext ? a.firsttext : "首页",
                    "last-text": a.lasttext ? a.lasttext : "尾页"
                });
                return html[0].outerHTML;
            }
        }
    })
    .directive("gtgrid", function () {
        return {
            restrict: "E",
            template: function (e, a) {
                var html = $('<div class="GT-Table"></div>');
                var table = $('<table></table>').appendTo(html);
                var thead = $('<thead></thead>').appendTo(table);
                var tbody = $('<tbody></tbody>').appendTo(table);

                var headtr = $("<tr></tr>").appendTo(thead);
                var bodytr = $('<tr ng-repeat="row in ' + a.listcode + ' track by $index" bg-class="$index%2?\'ever\':\'\'" ></tr>').appendTo(tbody);
                var DefaultColumnLength = 0;
                var reslut = "return javascript:void(0);";
                if (a.select || a.select == "") {
                    DefaultColumnLength++;
                    var td = $('<td></td>').appendTo(bodytr);
                    var th = $('<th style="width:50px;"></th>').appendTo(headtr);
                    if (a.selecttype == "only") {
                        var checkbox = $('<Radio ngmodel="row.Checked" Group="GridRadio"></Radio>').appendTo(td);
                        if (a.ngchecked) {
                            checkbox.attr("ngchange", a.ngchecked)
                        }
                    } else {
                        var checkbox = $('<Checkbox ngmodel="row.Checked"></Checkbox>').appendTo(td);
                        $('<Checkbox ngmodel="sel_all"></Checkbox>').appendTo(th);
                        if (a.ngchecked) {
                            checkbox.attr("ngchange", a.ngchecked + "(row)")
                        }
                    }
                }
                if (a.index || a.index == "") {
                    DefaultColumnLength++;
                    $('<td ng-bind="$index+1"></td>').appendTo(bodytr);
                    $('<th style="width:50px;">序号</th>').appendTo(headtr);
                }
                /*-----ngrepeat_column-----*/
                $('<th ng-repeat="column in GridColumnList.' + a.columncode + '" ng-bind="column.HeaderText"></th>').appendTo(headtr);
                $('<td ng-repeat="column in GridColumnList.' + a.columncode + '" ng-click="row.Checked=!row.Checked;' + (a.ngchecked ? a.ngchecked + "(row)" : "") + '" ><div  style="width:100%; overflow:hidden" ng-bind="row.{{column.FieldName}}"></div></td>').appendTo(bodytr);

                if (a.edit || a.edit == "") {
                    DefaultColumnLength++;
                    $('<td><ButtonBar row event="' + (a.event || 'event') + '"></ButtonBar></td>').appendTo(bodytr);
                    $('<th style="width:200px;">操作</th>').appendTo(headtr);
                }
                // $('<tfoot><tr ng-if="' + a.listcode + '.length==0||!' + a.listcode + '"><td colspan="{{GridColumnList.' + a.columncode + '.length+' + DefaultColumnLength + '}}">暂无数据</td></tr></tfoot>').appendTo(tbody);
                $('<tfoot><tr ng-if="' + a.listcode + '.length==0||!' + a.listcode + '"><td colspan="{{GridColumnList.' + a.columncode + '.length+' + DefaultColumnLength + '}}">暂无数据</td></tr></tfoot>').appendTo(table);
                if (a.pagedata || a.pagedata == "") {
                    var pager = $("<PagerBar ShowLR ShowLast></PagerBar>").appendTo(html);
                    pager.attr("source", a.pagedata)
                    pager.attr("ngmodel", "Index")
                    pager.attr("totalitems", "Count")
                    pager.attr("PageSize", "Size");
                    pager.attr("ngchange", a.pagechange);
                }
                return html[0].outerHTML;
            },
            replace: true,
            controller: "GridCtrl",
            link: function ($scope, element, attr, ngModel) {
                $scope.ListCode = attr.listcode;
                $scope.$watch("sel_all", function (newval, oldval, scope) {
                    if (newval != oldval) {
                        angular.forEach(scope.$eval(scope.ListCode), function (obj, index) {
                            obj.Checked = newval;
                            if (attr.ngchecked) {
                                eval('$scope.' + attr.ngchecked + "(obj)");
                            }
                        })
                    }
                })
            }
        }
    })
    .directive("warningbarmodel", function () {
        return {
            restrict: "AE",
            scope: true,
            priority: 1,
            templateUrl: '/Ctl_Resources/WarningBar/WarningBar.html',
            replace: true
        }
    })
    //<input type="fiel" onchange="event.fileChange()"/>按钮
    .directive("fileinputbtn", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div></div>");
                var item = $('<button class="btn btn-info GT-file" style="float: none; margin-top: 10px;">').appendTo(html);
                item.html(a.value || "选择文件")
                var input = $('<input type="file" id="fileInput" multiple="true" onchange="angular.element(this).scope().event.fileChange(event)">').appendTo(item);
                return html[0].outerHTML;
            }
        }
    })
    .directive("gtlist", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div></div>");
                var item = $("<div class='GT-Item-List'></div>").appendTo(html);
                item.append(e[0].innerHTML);
                // item.append('<div class="ItemButton"><i class="fa fa-edit">编辑</i><i class="fa fa-times">删除</i></div>')
                item.children(1).attr("ng-repeat", a.itemcode + " in " + a.listcode + " track by $index");
                if (a.pageshow) {
                    html.append("<PagerBar></PagerBar>");
                };
                return html[0].outerHTML;
            }
        }
    })
    .directive("gttree", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div ui-tree id="' + a.id + '" data-drag-enabled="false" ></div>');
                var ol = $('<ol ui-tree-nodes ng-model="' + a.ngmodel + '" class="angular-ui-tree-nodes"></ol>').appendTo(html);
                var li = $('<li ng-repeat="children in ' + a.ngmodel + '" class="angular-ui-tree-node" ui-tree-node ng-include="\'nodes_renderer.html\'"></li>').appendTo(ol);
                return html[0].outerHTML;
            },
            controller: function () {

            },
            link: function (scope, e, a, treeControl) {
                // scope[a.ngmodel].fun = {

                // };
                //  if(treeControl.addchildren){
                //      if(treeControl.AddChildren())
                //      {
                //          scope.selectNode.add
                //      }
                //  }

            }

        }
    })
    .directive("tabpanel", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div></div>");
                var tabpanel = $('<TabSet class="tab-container"></TabSet>').appendTo(html);
                angular.forEach($("Tab", e), function (obj, index) {
                    var tab = $("<Tab></Tab>").appendTo(tabpanel);
                    tab.attr("heading", $(obj).attr("label"));
                    if ($(obj).attr('style')) tab.attr('style', $(obj.attr('style')));
                    tab.html($(obj).html());
                })
                return html[0].outerHTML;
            }
        }
    })
    .directive("dialog", function () {
        return {
            restrict: "A",
            replace: true,
            link: function (scope, e, a) {
                e.css("margin-bottom", 0);
                e.css("padding-bottom", 0);
            }
        }
    })
    .directive("rowtextbox", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $("<div/>");
                a.maxlength = a.maxlength || 100;

                var row = $((a.morerow ? "<Form-Row/>" : "<FormRow/>")).appendTo(html);
                if (a.padding) row.attr("padding", a.padding);
                if (a.margin) row.attr("margin", a.margin);
                if (a.colspan) row.attr("colspan", a.colspan);
                if (a.label) row.attr("Label", a.label);
                var text = $("<TextBox maxlength=" + a.maxlength + "></TextBox>").appendTo(row);
                if (a.required || a.required == '') {
                    text[0].attributes.setNamedItem(document.createAttribute('Required'));
                    row[0].attributes.setNamedItem(document.createAttribute('Required'));
                }
                if (a.type) text.attr("type", a.type);
                if (a.placeholder) text.attr("placeholder", a.placeholder);
                if (a.ngmodel) text.attr("ngmodel", a.ngmodel);
                if (a.ngdisabled || a.disabled == "") text.attr("ngdisabled", a.ngdisabled);

                return html[0].outerHTML;
            },
            controller: function ($scope) { }
        }
    })
    .directive("report", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div style="height:100%;"/>');
                var layout = $('<Layout/>').appendTo(html);
                var left_layout = $('<Item Label="选择表格数据" width="sm"></Item>').appendTo(layout);
                var right_layout = $('<Item Label="报表筛选" BgColor="White"></Item>').appendTo(layout);
                // 左侧
                var tableList = $('<div ng-repeat="table in tables" style="padding:20px 0 0 20px;"/>').appendTo(left_layout);
                var tableTitle = $('<div style="color:silver; padding-bottom:6px; font-size:12px;" ng-bind="table.ChineseName"/>').appendTo(tableList);
                var table_column = $('<div><CheckBox ngmodel="param.Checked" ng-show="param.AttributeType==0" ng-repeat="param in table.Items" value="{{param.ChineseName}}"></CheckBox></div>').appendTo(tableList);
                //右侧
                var tableFilter = $('<div class="FormRow"/>').appendTo(right_layout);
                var tableList2 = $('<div ng-repeat="table in tables"/>').appendTo(tableFilter);
                var table2Column = $('<div ng-repeat="param in table.Items" ng-if="param.AttributeType==1">').appendTo(tableList2);
                $('<div class="_cell">{{param.ChineseName}}</div>').appendTo(table2Column);
                $('<div class="_cell"><RadioList ListCode="param.Items" ItemCode="page" bind="page.Description" ngmodel="param.SelectedItem" AllText="全部"></RadioList></div>').appendTo(table2Column);
                $('<hr>').appendTo(right_layout);
                $('<ButtonBar></ButtonBar>').appendTo(right_layout);
                $('<GTGrid ItemCode="row" ColumnCode="TempColumns" PageChange="event.Search()" ListCode="data" PageData="Page" index select ' + (a.edit ? "edit" : "") + '></GTGrid>').appendTo(right_layout);
                return html[0].outerHTML;
            },
            controller: function ($scope, UiConfigService) {
                $scope.UiConfigService = UiConfigService;
            },
            link: function ($scope, e, a) {
                $scope.Id = a.id;
                $scope.GridColumnList.TempColumns = [];
                $scope.Page = {
                    Index: 1
                };
                $scope.event = $.extend(true, $scope.event, {
                    LoadData: function () {
                        $scope.UiConfigService.GetTableList($scope, {
                            isSetting: true,
                            DataBaseID: a.id,
                            PageIndex: 1
                        }, function (data) {
                            $scope.tables = data.List.map(function (x) {
                                x.Items.map(function (o) {
                                    if (o.AttributeType === 0) {
                                        o.Checked = true;
                                    }
                                    return o;
                                });
                                return x;
                            });
                            $scope.event.Search();
                        });
                    },
                    Search: function () {
                        $scope.model = {
                            DatabaseId: a.id,
                            TableList: []
                        }
                        $scope.GridColumnList.TempColumns = [];
                        $scope.model.TableList = $scope.tables.filter(function (obj) {
                            var _obj = $.extend(true, {}, obj);
                            _obj.Items = obj.Items.filter(function (o) {
                                if (o.AttributeType == 0 && o.Checked) {
                                    $scope.GridColumnList.TempColumns.push({
                                        FieldName: o.DisplayName,
                                        HeaderText: o.ChineseName
                                    });
                                    return o;
                                } else if (o.AttributeType == 1 && o.SelectedItem) {
                                    return o;
                                }
                            })
                            return _obj;
                        })
                        $scope.model.TableList = $scope.model.TableList.filter(function (x) {
                            if (x.Items.length != 0) return x;
                        })
                        $scope.UiConfigService.CreateReport($scope, $.extend($scope.model, {
                            PageIndex: $scope.Page.Index
                        }), function (data) {
                            $scope.data = data.List;
                            $scope.Page.Count = data.Num;
                        })
                    }
                });
                $scope.event.LoadData();
            }
        }
    })
    .directive("operationTable", function () {
        return {
            restrict: "E",
            replace: true,
            link: function (scope, e, a) {

            }
        };
    })
    .directive("treecontrol", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                return '<ul id="' + a.id + '" class="ztree"></ul>';
            },
            controller: function ($scope, zTreeOption) {
                $scope.zTreeOption = zTreeOption;
            },
            link: function ($scope, e, a) {
                $scope.tree = $.fn.zTree.init($("#" + a.id), $scope.zTreeOption.BuildConfig($scope.treeSetting), []);
            }
        };
    })
    .directive("gridbutton", function () {
        return {
            restrict: "E",
            scope: false,
            template: function (e, a) {
                var html = $('<div></div>');
                ButtonList.GridButton.forEach(function (obj) {
                    var button = $('<a class="btn btn-link" ng-model="data" style="padding:6px;"></a>').appendTo(html);
                    button.attr({
                        "ng-click": (a.event || 'event') + '.' + obj.Code + '()',
                        "ng-if": (a.event || 'event') + '.' + obj.Code,

                    }).text('{{eventName.' + obj.Code + '||"' + obj.Name + '"}}');
                });
                return html[0].outerHTML;
            },
            replace: true,
            controller: function ($scope) { },
            link: function (scope, e, a, model) {

            }
        }
    });
//------------------------------------指令@业务组件---------------------------
app
    .directive("selectgrouptextbox", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div class="input-group"></div>');
                var input = $('<input type="text" class="form-control" name="' + a.displaymodel.replace('.', '_') + '" ng-model="' + a.displaymodel + '" ng-disabled="true" />').appendTo(html);
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="' + a.displaymodel + '=null;"><i class="glyphicon glyphicon-trash"></i></button></span>')
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="event.ConfigTree(' + a.ngmodel + ')"><i class="fa fa-list"></i></button></span>')
                if (a.required || a.required === "") {
                    // hidden.attr("required", "true");
                    input.attr("required", "true");
                    html.attr("ng-class", '{"has-error":!form.' + a.displaymodel.replace('.', '_') + '.$valid}');
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, Dialog) {
                $scope.Dialog = Dialog;
            },
            link: function ($scope, e, a) {
                var attr = a;
                $.extend($scope.event, {
                    ConfigTree: function (param) {
                        $scope.Dialog.Show("/Views/DeptmentManage/Control/SelectDeptment.html", "SelectDeptmentCtrl", "sm", {
                            SelectType: function () {
                                return a.type || "radio";
                            },
                            SelectData: function () {
                                return param || [];
                            }
                        }, function (result) {
                            if (result) {
                                var fun = function (key, value) {
                                    var list = key.split(".");
                                    $scope.model[list[1]] = value;
                                }
                                fun(attr.ngmodel, result.map(function (x) {
                                    return x.Id;
                                }).join(","));
                                fun(attr.displaymodel, result.map(function (x) {
                                    return x.name;
                                }).join(","));
                            }
                        })
                    }
                });
            }
        }
    })
    .directive("selectusertextbox", function () {
        return {
            restrict: "E",
            replace: true,
            template: function (e, a) {
                var html = $('<div class="input-group"></div>');
                var input = $('<input type="text" class="form-control" name="' + a.displaymodel.replace('.', '_') + '" ng-model="' + a.displaymodel + '" ng-disabled="true" />').appendTo(html);
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="' + a.displaymodel + '=null;"><i class="glyphicon glyphicon-trash"></i></button></span>')
                html.append('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="event.ConfigTree(' + a.ngmodel + ')"><i class="fa fa-list"></i></button></span>')
                if (a.required || a.required === "") {
                    input.attr("required", "true");
                    html.attr("ng-class", '{"has-error":!form.' + a.displaymodel.replace('.', '_') + '.$valid}');
                }
                return html[0].outerHTML;
            },
            controller: function ($scope, Dialog) {
                $scope.Dialog = Dialog;
            },
            link: function ($scope, e, a) {
                var attr = a;
                $.extend($scope.event, {
                    ConfigTree: function (param) {
                        $scope.Dialog.Show("/Views/UserManage/Control/SelectUser.html", "SelectUserCtrl", "lg", {
                            SelectType: function () {
                                return a.type || "radio";
                            },
                            SelectData: function () {
                                var list = [];
                                if (param) {
                                    $scope.model[a.displaymodel.split('.')[1]].split(",").map(function (x) {
                                        list.push({
                                            GroupUserName: x
                                        });
                                    });
                                    param.split(",").forEach(function (x, i) {
                                        list[i].Id = x;
                                    })
                                }
                                return list;
                            }
                        }, function (result) {
                            if (result) {
                                var fun = function (key, value) {
                                    var list = key.split(".");
                                    $scope.model[list[1]] = value;
                                }
                                fun(attr.ngmodel, result.map(function (x) {
                                    return x.Id;
                                }).join(","));
                                fun(attr.displaymodel, result.map(function (x) {
                                    return x.GroupUserName;
                                }).join(","));
                            }
                        })
                    }
                });
            }
        }
    });
//------------------------------------过滤器-----------------------------------
app
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    })
    .filter('SelectAll', function ($sce) {
        return function (data) {
            var Sel_Count = 0;
            angular.forEach(data, function (obj, i) {
                if (obj.Checked) Sel_Count++;
            })
            if (!data) return false;
            return Sel_Count == data.length;
        }
    })
    .filter('ReturnListColumn', function ($sce) {
        return function (List, ColumnName) {
            if (List) {
                return List.map(function (x) {
                    return x[ColumnName];
                }).join('、');
            } else {
                return "";
            }
        }
    })

//-------------------------------------服务-------------------------------------
app
    .service('MenuTypeList', function () {
        return [{
            PlatformName: "Web",
            PlatformId: 0,
            TreeObj: "Web_zTree"
        }, {
            PlatformName: "PC",
            PlatformId: 1,
            TreeObj: "PC_zTree"
        }, {
            PlatformName: "Andriod",
            PlatformId: 2,
            TreeObj: "Andriod_zTree"
        }, {
            PlatformName: "IOS",
            PlatformId: 3,
            TreeObj: "IOS_zTree"
        }];
    })
    .factory('DataOperate', function ($http, service, $modal) {
        var ret = {
            //调试临时用
            Common: function (route, param, fun, data) {
                var s = {
                    contentType: "application/json",
                    dataType: "json",
                    type: "get",
                    async: true,
                    url: false,
                    data: false,
                    loadEle: false
                }
                $(".loading").css("display", "block");
                ajaxCount++;
                $http({
                    method: route.Type,
                    url: route.Url,
                    headers: {
                        SessionId: sessionStorage.getItem("SessionID")
                    },
                    params: param,
                    data: data
                }).success(function (data) {
                    if (fun) fun(data.RtnData);
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".loading").css("display", "none");
                    }
                }).error(function (data) {
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".loading").css("display", "none");
                    }
                });
            },
            Add: function (route, param, fun) {
                service.http.ajax({
                    type: route.Type,
                    url: route.Url,
                    data: param
                })
                    .success(function (data) {
                        service.http.DataHandle(data, function (data) {
                            service.msg.popover(data ? "添加成功！" : "添加失败！");
                            if (fun) fun(data);
                        })
                    });
            },
            Edit: function (route, param, fun) {
                service.http.ajax({
                    type: route.Type,
                    url: route.Url,
                    data: param
                })
                    .success(function (data) {
                        service.http.DataHandle(data, function (data) {
                            service.msg.popover(data ? "修改成功！" : "修改失败！");
                            if (fun) fun(data);
                        })
                    });
            },
            Save: function (route, param, fun) {
                service.http.ajax({
                    type: route.Type,
                    url: route.Url,
                    data: param
                })
                    .success(function (data) {
                        service.http.DataHandle(data, function (data) {
                            service.msg.popover(data ? "保存成功！" : "保存失败！");
                            if (fun) fun(data);
                        })
                    });
            },
            Delete: function (route, param, fun) {
                var msg = "确定需要删除吗？";
                if (param.IdGuids && param.IdGuids.length > 1) {
                    msg = "确定要删除勾选的" + param.IdGuids.length + "条数据吗?";
                }
                service.msg.confirm(msg, function () {
                    service.http.ajax({
                        type: route.Type,
                        url: route.Url,
                        data: param
                    })
                        .success(function (data) {
                            service.http.DataHandle(data, function (data) {
                                if (data === 0) {
                                    service.msg.popover(data === 0 ? "删除成功！" : "删除失败！");
                                }
                                if (fun) fun(data);
                            })
                        });
                }, $.noop)
            },
            ResetPassword: function (route, param, fun) {
                service.msg.confirm("确定需要重置密码吗", function () {
                    service.http.ajax({
                        type: route.Type,
                        url: route.Url,
                        data: param
                    })
                        .success(function (data) {
                            service.http.DataHandle(data, function (data) {
                                service.msg.popover(data ? "重置成功！" : "重置失败！");
                                if (fun) fun(data);
                            })
                        });
                }, $.noop)
            },
            LoadData: function (route, param, fun) {
                service.http.ajax({
                    type: route.Type,
                    url: route.Url,
                    data: param
                })
                    .success(function (data) {
                        service.http.DataHandle(data, function (data) {
                            if (fun) fun(data);
                        })
                    });
            },
            //同步请求
            LoadDataSync: function (route, param, fun) {
                service.http.asyncajax({
                    type: route.Type,
                    url: route.Url,
                    data: param,
                    success: function (data) {
                        if (fun) fun(data);
                    }
                })
            },
            ListDeff: function (List) {
                return List.filter(function (obj) {
                    if (obj.Checked) {
                        obj.Items = obj.Items.filter(function (o) {
                            if (o.Checked) {
                                o.DataState = 0;
                                return o;
                            } else {
                                if (o.OldCheck) {
                                    o.DataState = 1;
                                    return o;
                                }
                            }
                        })
                        return obj;
                    } else {
                        if (obj.OldCheck) {
                            obj.DataState = 1;
                            return obj;
                        }
                    }
                });
            },
            BuildListChecked: function (List, SelectList, filters, DotDelete) {
                if (!SelectList) {
                    return List;
                }
                return List = List.map(function (x) {
                    for (var i = 0; i < SelectList.length; i++) {
                        if (SelectList[i][filters] === x[filters] && SelectList[i].DataState !== 1) {
                            $.extend(x, {
                                checked: true,
                                Checked: true,
                                IsEnabled: SelectList[i].IsEnabled
                            });
                            if (!DotDelete) SelectList.splice(i, 1);
                            break;
                        }
                    }
                    return x;
                })
            },
            //根据ID获取数组中匹配项的DisplayName
            GetListName: function (ID, List, keyCode, valueCode) {
                return List.filter(function (x) {
                    return ID === x[keyCode];
                })[0][valueCode];
            },
            ClearTreeNode: function (tree) {
                //清空树所有的节点
                var list = tree.transformToArray(tree.getNodes());
                for (var i = 0; i < list.length; i++) {
                    tree.removeNode(list[i]);
                }
            }
        };
        return ret;
    })
    .factory('TreeOperate', function ($http, service, $modal) {
        var ret = {
            removeNode: function (TreeData, node) {
                ret.eachNode(TreeData, node, "remove");
            },
            addNodes: function (TreeData, parentNode, newNodes) {
                for (var i = 0; i < newNodes.length; i++) {
                    if (parentNode) {
                        parentNode.Childrens.push(newNodes[i]);
                    } else {
                        TreeData.push(newNodes[i]);
                    }
                }
            },
            getNodes: function (TreeData) {
                return ret.eachNode(TreeData, null, "get");
            },
            eachNode: function (List, Node, type) {
                var all = [];
                for (var i = 0; i < List.length; i++) {
                    if (type == "get") {
                        all.push(List[i]);
                        if (List[i].Childrens) {
                            var children = ret.eachNode(List[i].Childrens, Node, type);
                            for (var j = 0; j < children.length; j++) {
                                all.push(children[j]);
                            };
                        }
                    } else {
                        if (Node === List[i]) {
                            if (type == "remove") {
                                List.splice(i, 1);
                            }
                            return true;
                        }
                        if (List[i].Childrens && ret.eachNode(List[i].Childrens, Node, type)) {
                            return false;
                        }
                    }
                }
                return all;
            }
        };
        return ret;
    })
    .factory('Dialog', function ($http, service, $modal) {
        var ret = {
            Show: function (url, controller, size, param, fun) {
                var modal = $modal.open({
                    templateUrl: url,
                    controller: controller,
                    backdrop: "static",
                    size: size,
                    resolve: param
                });
                modal.result.then(function (result) {
                    if (fun) fun(result);
                });
            }
        };
        return ret;
    })
    .factory('ListOperate', function ($http, service, $modal) {
        var ret = {
            Show: function (url, controller, size, param, fun) {
                var modal = $modal.open({
                    templateUrl: url,
                    controller: controller,
                    backdrop: "static",
                    size: size,
                    resolve: param
                })
                modal.result.then(function (result) {
                    if (fun) fun(result);
                })
            }
        };
        return ret;
    })
    .factory("zTreeOption", function () {
        var ret = {
            BuildConfig: function (config) {
                return $.extend(true, {
                    check: {
                        enable: true,
                        chkStyle: "checkbox"
                    },
                    data: {
                        simpleData: {
                            idKey: "Id",
                            pIdKey: "ParentId",
                            enable: true
                        }
                    }
                }, config);
            }
        }
        return ret;
    })
    .factory('manageService', function (service, Dialog, $compile, $timeout, $filter) {
        return {
            constructor: function ($scope, gridOptions, controller, url) {
                var o = {};
                o.Page = {
                    PageIndex: 1,
                    PageSize: 50,
                    Count: 0
                };
                o.service = service; //$scope.service;
                o.$scope = $scope;
                o.gridOptions = gridOptions;
                o.dataService = $scope.dataService;
                o.dialog = Dialog; //$scope.dialog;
                o.controller = controller;
                o.url = url;
                o.userId = o.service.Cookie.Get("UserID");
                o.userName = o.service.Cookie.Get("UserName");
                o.appId = o.service.Cookie.Get("AppID");
                o.groupRelationId = o.service.Cookie.Get("GroupRelationID");
                o.groupRelationName = o.service.Cookie.Get("GroupRelationName");
                o.Add = function () {
                    var cur = this;
                    var data = {
                        DataState: state.Add,
                        DataSource: 2,
                        TypeId: "",
                        PluginId: "",
                        AddUser: cur.userId,
                        AddUserName: cur.userName,
                        AppId: cur.appId,
                        GroupRelationId: cur.groupRelationId,
                        GroupRelationName: cur.groupRelationName,
                        ModifyUser: cur.userId,
                        ModifyUserName: cur.userName
                    };
                    cur.dialog.Show(cur.url, cur.controller, "lg", {
                        data: function () {
                            return data;
                        }
                    }, function (result) {
                        if (result) {
                            if (cur.gridOptions.rowData.length > 0) {
                                cur.gridOptions.api.setFocusedCell(0, 0);
                            }
                            var curData = [];
                            curData.push(result);
                            if (cur.gridOptions.rowData.length >= cur.Page.PageSize) {
                                var data = cur.gridOptions.rowData.slice(0, cur.Page.PageSize - 1);
                                cur.gridOptions.rowData = curData.concat(data);
                            } else {
                                cur.gridOptions.rowData = curData.concat(cur.gridOptions.rowData);
                            }
                            cur.Page.PageIndex = 1;
                            cur.Page.Count++;
                            cur.gridOptions.api.onNewDatasource();

                        }
                    });
                };
                o.EditInfo = function (params) {
                    var cur = this;
                    if (!params && !cur.$scope.currentItem) {
                        cur.service.msg.alert("请选择要编辑的数据！");
                        return;
                    }
                    params = params || cur.$scope.currentItem.data;

                    var data = $.extend(params, {
                        DataState: state.Modify,
                        ModifyUser: cur.userId,
                        ModifyUserName: cur.userName
                    });
                    cur.dialog.Show(cur.url, cur.controller, "lg", {
                        data: function () {
                            return data;
                        }
                    }, function (result) {
                        if (result) {
                            $.extend(data, result);
                            var changeRows = [];
                            changeRows.push(data);
                            cur.gridOptions.api.rowDataChanged(changeRows);
                        }
                    });
                };
                o.DeleteSelect = function (params) {
                    var cur = this;
                    if (!params && !cur.$scope.currentItem) {
                        cur.service.msg.alert("请选择要删除的数据！");
                        return;
                    }
                    params = params || cur.$scope.currentItem.data;
                    cur.dataService.Delete(cur.$scope, params, function (data) {
                        if (data) {
                            if (cur.gridOptions.rowData.length < cur.Page.PageSize) {
                                cur.Page.PageIndex = 1;
                                cur.Page.Count = cur.Page.Count - 1;
                                cur.gridOptions.rowData.remove(params);
                                cur.gridOptions.api.setDatasource(cur.DataSource());
                            } else {
                                cur.Page.PageIndex = 1;
                                cur.gridOptions.rowData = undefined;
                                cur.gridOptions.api.setDatasource(cur.DataSource());
                            }
                            cur.$scope.currentItem = null;
                        }
                    });
                };
                o.DeleteAllSelect = function () {
                    var cur = this;
                    var checkedList = cur.$scope.getCheckedData(cur.gridOptions.rowData);
                    if (checkedList.length === 0) {
                        cur.service.msg.alert("请勾选要删除的数据");
                        return;
                    }
                    this.dataService.Delete(cur.$scope, checkedList, function (data) {
                        if (data > 0) {
                            cur.service.msg.alert("共有[" + data + "]条数据删除失败！");
                            if (data === checkedList.length) {
                                throw "";
                            }
                            return;
                        } else {
                            if (cur.gridOptions.rowData.length < cur.Page.PageSize) {
                                cur.Page.PageIndex = 1;
                                cur.Page.Count = cur.Page.Count - checkedList.length;
                                checkedList.forEach(function (obj) {
                                    cur.gridOptions.rowData.remove(obj);
                                });
                                cur.gridOptions.api.setDatasource(cur.DataSource());
                            } else {
                                cur.Page.PageIndex = 1;
                                cur.gridOptions.rowData = undefined;
                                cur.gridOptions.api.setDatasource(cur.DataSource());
                            }
                            cur.$scope.currentItem = null;
                        }
                    });
                };
                o.LoadData = function () {
                    var cur = this;
                    $timeout(function () {
                        cur.gridOptions.api.setDatasource(cur.DataSource());
                    }, 200);
                };
                o.DataSource = function () {
                    var cur = this;
                    return {
                        rowCount: null, // behave as infinite scroll
                        pageSize: cur.Page.PageSize,
                        overflowSize: 1,
                        maxConcurrentRequests: 1,
                        maxPagesInCache: 100,
                        getRows: function (params) {
                            if (!cur.gridOptions.Param) {
                                cur.gridOptions.Param = {};
                            }
                            cur.gridOptions.Param.filterModel = params.filterModel;

                            if (cur.gridOptions.enableServerSideFilter !== true && params.filterModel && Object.keys(params.filterModel).length > 0) {
                                var currentData = cur.gridOptions.api.gridOptionsWrapper.getRowData();
                                var resultDat = cur.Filter(params.filterModel, currentData, cur);
                                params.successCallback(resultDat, resultDat.length);
                            } else {
                                cur.Page.PageIndex = (params.startRow / cur.Page.PageSize) + 1;
                                cur.dataService.LoadPageData(cur.$scope, {
                                    PageIndex: cur.Page.PageIndex,
                                    PageSize: cur.Page.PageSize,
                                    Param: cur.gridOptions.Param
                                }, function (data) {
                                    //选择模式
                                    if (cur.gridOptions.selectMode === true && cur.gridOptions.selectData.length > 0) {
                                        var dic = cur.gridOptions.selectData.toDictionary();
                                        for (var i = 0; i < data.List.length; i++) {
                                            if (dic.hasOwnProperty(data.List[i].Id)) {
                                                data.List[i] = dic[data.List[i].Id];
                                            }
                                        }
                                    }
                                    if (cur.Page.PageIndex === 1) {
                                        cur.gridOptions.rowData = data.List;
                                        cur.Page.Count = data.Num;
                                    } else {
                                        cur.gridOptions.rowData = cur.gridOptions.rowData.concat(data.List);
                                    }
                                    var rowCount = -1; //计算是否到最后一行
                                    if (cur.gridOptions.rowData.length >= cur.Page.Count) {
                                        rowCount = cur.gridOptions.rowData.length;
                                    }
                                    params.successCallback(data.List, rowCount);
                                    if (cur.Page.PageIndex === 1) {
                                        cur.gridOptions.api.sizeColumnsToFit();
                                    }
                                });
                            }
                        }
                    }
                };
                o.Filter = function filterData(filterModel, data, cur) {
                    if (!data) {
                        return [];
                    }
                    var filterPresent = filterModel && Object.keys(filterModel).length > 0;
                    if (!filterPresent) {
                        return data;
                    }

                    var resultOfFilter = data;

                    for (var filter in filterModel) {
                        data = resultOfFilter;
                        for (var i = 0; i < data.length; i++) {
                            if (i === 0) {
                                resultOfFilter = [];
                            }
                            var item = data[i];
                            //字符串的
                            if (filterModel[filter].type && typeof (filterModel[filter].filter) === "string") {
                                if (filterModel[filter].type === 1) {
                                    if (item[filter].indexOf(filterModel[filter].filter) < 0) {
                                        continue;
                                    }
                                } else if (filterModel[filter].type === 2) {
                                    if (item[filter] !== filterModel[filter].filter) {
                                        continue;
                                    }
                                } else if (filterModel[filter].type === 3) {
                                    if (!item[filter].startsWith(filterModel[filter].filter)) {
                                        continue;
                                    }
                                } else {
                                    if (!item[filter].endsWith(filterModel[filter].filter)) {
                                        continue;
                                    }
                                }
                            }
                                //数组的
                            else if ($.isArray(filterModel[filter])) {
                                if (filterModel[filter].indexOf(item[filter]) < 0) {
                                    continue;
                                }
                            }
                                //数字
                                // EQUALS = 1;
                                // LESS_THAN = 2;
                                // GREATER_THAN = 3;
                            else if (typeof (filterModel[filter].filter) === "number") {
                                if (filterModel[filter] === 1) {
                                    if (item[filter] !== filterModel[filter].filter) {
                                        continue;
                                    }
                                } else if (filterModel[filter] === 2) {
                                    if (item[filter] >= filterModel[filter].filter) {
                                        continue;
                                    }
                                } else {
                                    if (item[filter] <= filterModel[filter].filter) {
                                        continue;
                                    }
                                }
                            }
                            resultOfFilter.push(item);
                        }
                    }
                    return resultOfFilter;
                }
                return o;
            },
            dataGridInit: function ($scope) {
                $scope.no = $scope.no !== undefined ? $scope.no : true;
                $scope.checkBox = $scope.checkBox !== undefined ? $scope.checkBox : true;
                $scope.rowsAlreadyGrouped = $scope.rowsAlreadyGrouped !== undefined ? $scope.rowsAlreadyGrouped : false;
                $scope.enableColResize = $scope.enableColResize !== undefined ? $scope.enableColResize : true;
                $scope.enableSorting = $scope.enableSorting !== undefined ? $scope.enableSorting : false;
                $scope.rowHeight = $scope.rowHeight !== undefined ? $scope.rowHeight : 36;
                $scope.headerHeight = $scope.headerHeight !== undefined ? $scope.headerHeight : 36;
                $scope.angularCompileRows = $scope.angularCompileRows !== undefined ? $scope.angularCompileRows : true;
                $scope.groupSelectsChildren = $scope.groupSelectsChildren !== undefined ? $scope.groupSelectsChildren : true;
                $scope.showToolPanel = $scope.showToolPanel !== undefined ? $scope.showToolPanel : false;
                $scope.toolPanelSuppressPivot = $scope.toolPanelSuppressPivot !== undefined ? $scope.toolPanelSuppressPivot : true;
                $scope.cascadeChildren = $scope.cascadeChildren !== undefined ? $scope.cascadeChildren : true;
                $scope.enableServerSideFilter = $scope.enableServerSideFilter !== undefined ? $scope.enableServerSideFilter : true;
                $scope.columnDefs = [];
                if ($scope.no) {
                    $scope.columnDefs.push({
                        field: "No",
                        headerName: "#",
                        width: 40,
                        maxWidth: 40,
                        minWidth: 40,
                        suppressSorting: true,
                        suppressMenu: true,
                        suppressSizeToFit: false,
                        cellRenderer: function (params) {
                            return params.node.id + 1;
                        }
                    });
                }
                if ($scope.checkBox) {
                    $scope.columnDefs.push({
                        field: "CheckBox",
                        headerName: "选择",
                        gridOptionsName: "gridOptions",
                        suppressMenu: true,
                        width: 40,
                        maxWidth: 40,
                        minWidth: 40,
                        suppressSizeToFit: false,
                        suppressSorting: true
                    });
                }
                $scope.cellClicked = function (params) {
                    if (params.colDef.tree && params.node.expanded && !params.node.children) {
                        params.api.gridOptionsWrapper.gridOptions.event.LoadChildData(params.data, function (data) {
                            params.node.children = data;
                            if (params.data.IsChecked)
                                $scope.recursionData(params.node.children, params.data.IsChecked);
                            params.api.onNewRows();
                            params.api.sizeColumnsToFit();
                        });
                    } else if (params.colDef.field === "CheckBox") {
                        if (params.node.children && $scope.cascadeChildren) {
                            $scope.recursionData(params.node.children, !params.data.IsChecked);
                        }
                        if (params.api.gridOptionsWrapper.gridOptions.selectMode === true) {
                            if (!params.data.IsChecked) {
                                params.api.gridOptionsWrapper.gridOptions.selectData.push(params.data);
                            } else {
                                params.api.gridOptionsWrapper.gridOptions.selectData.remove(params.data);
                            }
                        }
                    }
                    $scope.currentItem = params;
                    $scope.currentGridOptions = params.api.gridOptionsWrapper.gridOptions;
                }
                $scope.rowClicked = function (params) {
                    if ($scope.preClass) {
                        $scope.preClass.classList.remove("ag-row-selected1");
                    }
                    params.eventSource.classList.add('ag-row-selected1');
                    $scope.preClass = params.eventSource;
                }
                $scope.groupExpanded = function () {
                    return '<img src="/Resources/images/ICON/minus.png" style="width: 16px;cursor: pointer;" />';
                }
                $scope.groupContracted = function () {
                    return '<img src="/Resources/images/ICON/plus.png" style="width: 16px;cursor: pointer;" />';
                }
                $scope.innerCellRenderer = function (params) {
                    var name = params.data.DisplayName || params.data.Name || params.data.GroupName;
                    var position = 10;
                    //    (params.node.level + 1) * 10;
                    //if (params.node.level === 0 && !params.node.group) {
                    //    position += 15;
                    //}
                    return "<span style='margin-left:" + position + "px'>" + name + "</span>";
                }
                $scope.headerCellRendererFunc = function (params) {
                    if (params.colDef.field === "CheckBox") {
                        params.colDef.cellStyle = {
                            'text-align': 'center'
                        };
                        params.colDef.width = 40;
                        params.colDef.maxWidth = 40;
                        params.colDef.suppressSorting = true;
                        params.colDef.suppressMenu = true;
                        params.colDef.checkboxSelection = true;
                        params.colDef.headerName = "选择";
                        params.colDef.suppressMenu = true;

                        var div =
                            "<CheckBox ngmodel='" + params.colDef.gridOptionsName + ".cascadeType' ngclass='headCheckbox' ngchange='headCheckChange(" + params.colDef.gridOptionsName + ")'></CheckBox>";
                        var content = $compile(div)($scope);
                        return content[0];
                    } else {
                        return params.colDef.headerName;
                    }
                }
                $scope.headCheckChange = function (gridOptions) {
                    var selectNodes = gridOptions.api.gridOptionsWrapper.getRowData();
                    $scope.recursionData(selectNodes, gridOptions.cascadeType);
                    if (gridOptions.selectMode === true) {
                        selectNodes.forEach(function (obj) {
                            if (gridOptions.cascadeType) {
                                gridOptions.selectData.push(obj);
                            } else {
                                gridOptions.selectData.remove(obj);
                            }
                        });
                    }
                }
                $scope.recursionData = function (data, isChecked) {
                    if (data)
                        angular.forEach(data, function (obj, index, array) {
                            if (obj.data) {
                                obj.data.IsChecked = isChecked;
                            } else {
                                obj.IsChecked = isChecked;
                            }
                            if (obj.children) {
                                $scope.recursionData(obj.children, isChecked);
                            }
                        });
                }
                $scope.operCellRendererFunc = function (params) {
                    var html = $('<div style="text-align:center;"></div>');
                    var btn = $('<div class="btn-group dropdown" dropdown />').appendTo(html);
                    btn.append('<button class="btn" dropdown-toggle style="border:0; background-color:transparent;">操作<span class="caret"></span></button>');
                    var btnList = $('<ul class="dropdown-menu"/>').appendTo(btn);
                    var isChild = false;
                    params.colDef.cellStyle = {
                        overflow: "visible",
                        padding: 0
                    };
                    ButtonList.GridButton.forEach(function (obj) {
                        if (params.api.gridOptionsWrapper.gridOptions.event.hasOwnProperty(obj.Code)) {
                            var event = (params.colDef.eventName || "gridOptions.event") + "." + obj.Code + "(data)";
                            btnList.append('<li ng-model="data" ng-click=' + event + ' title="' + (obj.Tip || obj.Name) + '"><a>' + (obj.Ico ? "<i class='Btn " + obj.Ico + "'></i>" : "") + '{{eventName.' + obj.Code + '||"' + obj.Name + '"}}</a></li>');
                            isChild = true;
                        }
                    });
                    return isChild ? html[0].outerHTML : "无操作";
                }
                $scope.serOldChecked = function (data) {
                    if (data)
                        angular.forEach(data, function (obj, index, array) {
                            if (obj.data) {
                                obj.data.OldChecked = obj.data.IsChecked;
                            } else {
                                obj.OldChecked = obj.IsChecked;
                            }
                            if (obj.children) {
                                $scope.serOldChecked(obj.children);
                            }
                        });
                }
                $scope.rowDoubleClicked = function (params) {
                    if (params.api.gridOptionsWrapper.gridOptions.event && params.api.gridOptionsWrapper.gridOptions.event.hasOwnProperty("EditInfo"))
                        params.api.gridOptionsWrapper.gridOptions.event.EditInfo(params.data);
                }
                $scope.sexCellRendererFunc = function (params) {
                    if (params.data.GroupUserGender === 0) {
                        return "女";
                    } else if (params.data.GroupUserGender === 1) {
                        return "男";
                    } else {
                        return "保密";
                    }
                };
                $scope.dateTimeToFormatFunc = function (params) {
                    return $filter('date')(params.data[params.colDef.field], 'yyyy-MM-dd HH:mm:ss');;
                };
                //
                $scope.CodeToDisplayFunc = function (params) {
                    var displayName;
                    switch (params.data[params.colDef.field]) {
                        case 0:
                            displayName = "已发布"
                            break;
                        case 1:
                            displayName = "已撤销"
                            break;
                        default:
                            displayName = "其他"
                            break;
                    }
                    return displayName;
                };

                function getChecked(data, result) {
                    angular.forEach(data, function (obj, index, array) {
                        if (obj.data && obj.data.IsChecked !== undefined && obj.data.IsChecked === true) {
                            result.push(obj.data);
                        } else if (obj.IsChecked !== undefined && obj.IsChecked === true) {
                            result.push(obj);
                        }
                        if (obj.children) {
                            getChecked(obj.children, result);
                        }
                    });
                }

                $scope.getCheckedData = function (data) {
                    var result = [];

                    if ($scope.checkBox) {
                        getChecked(data, result);
                    }
                    return result;
                }

                function getCheckedLeaf(data, result) {
                    if (data)
                        angular.forEach(data, function (obj, index, array) {
                            if (obj.children) {
                                angular.forEach(obj.children, function (o) {
                                    if (o.data.IsChecked && o.group === false) {
                                        result.push(o.data);
                                    }
                                });
                                getCheckedLeaf(obj.children, result);
                            } else {
                                if (obj.data.IsChecked && obj.group === false) {
                                    result.push(obj.data);
                                }
                            }
                        });
                }

                function getAllLeaf(data, result) {
                    if (data)
                        angular.forEach(data, function (obj, index, array) {
                            if (obj.children) {
                                angular.forEach(obj.children, function (o) {
                                    if (o.group === false) {
                                        result.push(o.data);
                                    }
                                });
                                getAllLeaf(obj.children, result);
                            }
                        });
                }

                $scope.getAllLeafData = function (data) {
                    var result = [];
                    if ($scope.checkBox) {
                        getAllLeaf(data, result);
                    }
                    return result;
                }
                $scope.getCheckedLeafData = function (data) {
                    var result = [];
                    if ($scope.checkBox) {
                        getCheckedLeaf(data, result);
                    }
                    return result;
                }

                function getCheckedLeafContainParent(data, result) {
                    if (data)
                        angular.forEach(data, function (obj, index, array) {
                            if (obj.children) {
                                var children = [];
                                angular.forEach(obj.children, function (o) {
                                    if (o.data.IsChecked) {
                                        children.push(o.data);
                                    }
                                });
                                if (children.length > 0) {
                                    result.push(obj);
                                }
                                getCheckedLeafContainParent(obj.children, result);
                            }
                        });
                }

                $scope.getCheckedLeafContainParentData = function (data) {
                    var result = [];
                    if ($scope.checkBox) {
                        getCheckedLeafContainParent(data, result);
                    }
                    return result;
                }

                $scope.getChangedCheckedLeafData = function (data) {
                    var result = $scope.getAllLeafData(data);
                    var changeReslut = [];
                    angular.forEach(result, function (obj, index, array) {
                        if (obj.IsChecked !== obj.OldChecked) {
                            if (obj.IsChecked === false) {
                                obj.DataState = 1;
                            } else {
                                obj.DataState = 0;
                            }
                            changeReslut.push(obj);
                        }
                    });
                    return changeReslut;
                }

                $scope.options = {
                    rowSelection: 'single',
                    rowsAlreadyGrouped: $scope.rowsAlreadyGrouped,
                    enableColResize: $scope.enableColResize,
                    enableSorting: $scope.enableSorting,
                    rowHeight: $scope.rowHeight,
                    headerHeight: $scope.headerHeight,
                    onCellClicked: $scope.cellClicked,
                    onRowClicked: $scope.rowClicked,
                    onRowDoubleClicked: $scope.rowDoubleClicked,
                    angularCompileRows: $scope.angularCompileRows,
                    groupSelectsChildren: $scope.groupSelectsChildren,
                    showToolPanel: $scope.showToolPanel,
                    toolPanelSuppressPivot: $scope.toolPanelSuppressPivot,
                    headerCellRenderer: $scope.headerCellRendererFunc,
                    enableServerSideFilter: $scope.enableServerSideFilter,
                    suppressMenuHide: true,
                    suppressLoadingOverlay: true,
                    rowBuffer: 0,
                    icons: {
                        groupExpanded: $scope.groupExpanded,
                        groupContracted: $scope.groupContracted
                    },
                    localeText: {
                        page: 'daPage',
                        more: 'daMore',
                        to: 'daTo',
                        of: 'daOf',
                        next: 'daNexten',
                        last: 'daLasten',
                        first: 'daFirsten',
                        previous: 'daPreviousen',
                        loadingOoo: '正在加载...',
                        // for set filter
                        selectAll: '选择所有',
                        searchOoo: '选择...',
                        blanks: '空',
                        // for number filter
                        equals: '等于',
                        lessThan: 'daLessThan',
                        greaterThan: 'daGreaterThan',
                        applyFilter: '<a class="btn btnlink" style="padding:0px 8px;">筛选</a>',
                        filterOoo: '请输入...',
                        // for text filter
                        contains: '包含',
                        startsWith: '从..开始',
                        endsWith: '以..结束',
                        // the header of the default group column
                        group: 'laGroup',
                        // tool panel
                        columns: '列名称',
                        pivotedColumns: 'laPivot Cols',
                        pivotedColumnsEmptyMessage: 'la please drag cols to here',
                        valueColumns: 'laValue Cols',
                        valueColumnsEmptyMessage: 'la please drag cols to here'
                    }
                };
            }
        }
    })
    .factory('editService', function (service) {
        return {
            constructor: function ($scope) {
                this.Page = {
                    PageIndex: 1,
                    PageSize: 50,
                    Count: 0
                };
                this.service = service;
                this.$scope = $scope;
                this.dataService = $scope.dataService;
                this.$modalInstance = $scope.$modalInstance;
                this.$scope.isClose = true;
                return this;
            },
            Save: function () {
                var cur = this;
                this.dataService.Save(cur.$scope, cur.$scope.model, function (data) {
                    if (data) {
                        if (cur.$scope.isClose === true) {
                            cur.$modalInstance.close(data);
                        } else { //重复添加时不关闭弹出框
                            cur.$scope.model = $.extend({}, cur.$scope.data);
                        }
                    }
                });
            },
            Close: function () {
                this.$modalInstance.close();
            }
        };
    })
    .factory('treeManageService', function (service, Dialog, manageService) {
        return {
            constructor: function ($scope, gridOptions, controller, url) {
                var o = {};
                o.Page = {
                    PageIndex: 1,
                    PageSize: 50,
                    Count: 0
                };
                o.service = service;
                o.$scope = $scope;
                o.gridOptions = gridOptions;
                o.dataService = $scope.dataService;
                o.dialog = Dialog;
                o.controller = controller;
                o.url = url;
                o.userId = o.service.Cookie.Get("UserID");
                o.userName = o.service.Cookie.Get("UserName");
                o.appId = o.service.Cookie.Get("AppID");
                o.groupRelationId = o.service.Cookie.Get("GroupRelationID");
                o.groupRelationName = o.service.Cookie.Get("GroupRelationID");
                o.AddRoot = function () {
                    var cur = this;
                    var data = {
                        DataState: state.Add,
                        DataSource: 2,
                        TypeId: "",
                        PluginId: "",
                        AddUser: cur.userId,
                        AddUserName: cur.userName,
                        AppId: cur.appId,
                        GroupRelationId: cur.groupRelationId,
                        GroupRelationName: cur.groupRelationName,
                        ModifyUser: cur.userId,
                        ModifyUserName: cur.userName
                    };
                    cur.dialog.Show(cur.url, cur.controller, "lg", {
                        data: function () {
                            return data;
                        },
                        parent: function () {
                            return null;
                        }
                    }, function (result) {
                        if (result) {
                            cur.gridOptions.rowData.push({
                                data: result,
                                group: false,
                                children: []
                            });
                            cur.gridOptions.api.onNewRows();
                        }
                    });
                };
                o.AddChild = function (params) {
                    var cur = this;
                    var data = {
                        DataState: state.Add,
                        DataSource: 2,
                        TypeId: "",
                        PluginId: "",
                        AddUser: cur.userId,
                        AddUserName: cur.userName,
                        AppId: cur.appId,
                        GroupRelationId: cur.groupRelationId,
                        GroupRelationName: cur.groupRelationName,
                        ModifyUser: cur.userId,
                        ModifyUserName: cur.userName
                    };
                    cur.dialog.Show(cur.url, cur.controller, "lg", {
                        data: function () {
                            return data;
                        },
                        parent: function () {
                            return params || cur.$scope.currentItem.data;
                        }
                    }, function (result) {
                        if (result) {
                            if (!$scope.currentItem.node.children && $scope.currentItem.node.group) {
                                return;
                            }
                            if (!$scope.currentItem.node.children) {
                                $scope.currentItem.node.children = [];
                            }
                            $scope.currentItem.node.group = true;
                            if ($scope.currentItem.node.data.RgtId) {
                                $scope.currentItem.node.data.RgtId++;
                            }
                            $scope.currentItem.node.children.push({
                                data: result,
                                group: false,
                                children: []
                            });
                            cur.gridOptions.api.onNewRows();

                        }
                    });
                };
                o.EditInfo = function (params) {
                    var cur = this;
                    if (!params && !cur.$scope.currentItem) {
                        cur.service.msg.alert("请选择要编辑的数据！");
                        return;
                    }
                    params = params || cur.$scope.currentItem.data;

                    var data = $.extend(params, {
                        DataState: state.Modify,
                        ModifyUser: cur.userId,
                        ModifyUserName: cur.userName
                    });
                    cur.dialog.Show(cur.url, cur.controller, "lg", {
                        data: function () {
                            return data;
                        },
                        parent: function () {
                            //if (params || (params.Id === cur.$scope.currentItem.data.Id)) {
                            //    return cur.$scope.currentItem.node.parent;
                            //}
                            return {};
                        }
                    }, function (result) {
                        if (result) {
                            $.extend($scope.currentItem.data, result);
                            $scope.gridOptions.api.onNewRows();
                        }
                    });
                };
                o.DeleteSelect = function (params) {
                    var cur = this;
                    if (!params && !cur.$scope.currentItem) {
                        cur.service.msg.alert("请选择要删除的数据！");
                        return;
                    }
                    params = params || cur.$scope.currentItem.data;
                    cur.dataService.Delete(cur.$scope, params, function (data) {
                        if ($scope.currentItem.node.parent) {
                            $scope.currentItem.node.parent.children.remove($scope.currentItem.node);
                            if ($scope.currentItem.node.parent.children.length === 0) {
                                $scope.currentItem.node.parent.group = false;
                            }
                        } else {
                            $scope.gridOptions.rowData.remove($scope.currentItem.node);
                        }
                        $scope.gridOptions.api.onNewRows();
                        $scope.currentItem = null;
                    });
                };
                o.DeleteAllSelect = function () {
                    var cur = this;
                    var checkedList = cur.$scope.getCheckedLeafData(cur.gridOptions.rowData);
                    if (checkedList.length === 0) {
                        cur.service.msg.alert("请注意父节点不可直接删除，请勾选要删除的子节点数据");
                        return;
                    }
                    this.dataService.Delete(cur.$scope, checkedList, function (data) {
                        if (data > 0) {
                            cur.service.msg.alert("共有[" + data + "]条数据删除失败！");
                        }
                        cur.LoadData();
                    });
                };
                o.LoadData = function (params) {
                    var cur = this;
                    this.dataService.LoadData(this.$scope, params, function (data) {
                        cur.gridOptions.rowData = data;
                        cur.gridOptions.api.onNewRows();
                        cur.gridOptions.api.sizeColumnsToFit();
                        cur.currentItem = null;
                    });
                };
                o.LoadChildData = function (params, fun) {
                    this.dataService.LoadChildData($scope, params, fun);
                }
                return o;
            },
            dataGridInit: function ($scope) {
                manageService.dataGridInit($scope);
            }
        }
    })
    .factory('ztreeSettingService', function () {
        return {
            constructor: function ($scope, attr, getAsyncUrl) {
                var p = (attr.cp || "") + (attr.cc || "");
                var id = common.buildGuid();
                attr.multiselect = attr.multiselect || "true";
                attr.globalsingle = attr.globalsingle || "true";
                attr.selectmode = attr.selectmode || "true";
                var chkStyle = attr.multiselect === "true" ? "checkbox" : "radio";
                var radioType = attr.globalsingle === "true" ? "all" : "level";
                var setting = {
                    treeId: id,
                    async: {
                        contentType: "application/json",
                        enable: true,
                        type: "GET",
                        url: getAsyncUrl
                    },
                    edit: {
                        enable: attr.edit
                    },
                    check: {
                        enable: attr.selectmode === "true",
                        chkboxType: {
                            "Y": p,
                            "N": p
                        },
                        chkStyle: chkStyle,
                        radioType: radioType
                    },
                    data: {
                        simpleData: {
                            idKey: "Id",
                            pIdKey: "ParentId",
                            enable: true
                        },
                        key: {
                            name: "Name",
                            checked: "IsChecked",
                            isParent: "IsParent",
                            open: "IsOpen",
                            children: "Children"
                        }
                    },
                    view: {
                        showLine: false
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            $scope.$apply(function () {
                                if (attr.tree) {
                                    $scope[attr.tree].SelectNode = treeNode;
                                } else {
                                    $scope.SelectNode = treeNode;
                                }
                            });
                        },
                        onCheck: function (event, treeId, treeNode) {
                            $scope.$apply(function () {
                                if (attr.tree && $scope[attr.tree].checkFun) {
                                    $scope[attr.tree].checkFun(treeNode);
                                }
                            });
                        },
                        onNodeCreated: function (event, treeId, treeNode) {
                            $scope.$apply(function () {
                                if (attr.tree && $scope[attr.tree].createNode) {
                                    $scope[attr.tree].createNode(treeNode);
                                }
                            });
                        },
                        onAsyncSuccess: $scope.asyncSuccess
                    }
                };
                return setting;
            }
        }
    });

//------------------------------------控制器---------------------------------------

app
    .controller('SelectDictionaryTreeCtrl', function ($scope, $modalInstance, UiConfigService, ParentID, SelectType, SelectData) {
        $scope.SelectData = SelectData;
        $scope.treeSetting = {
            check: {
                chkStyle: SelectType
            }
        };
        $scope.event = {
            OK: function () {
                $modalInstance.close($scope.tree.getCheckedNodes(true));
            },
            Close: function () {
                $modalInstance.close();
            }
        }
        UiConfigService.GetDimensionalityTreeById($scope, {
            FKDataSourceItemID: ParentID
        }, function (data) {
            $scope.tree.addNodes(null, data.map(function (x) {
                if ($scope.SelectData && $scope.SelectData.indexOf(x.FkDictionaryId) > -1) x.checked = true;
                x.name = x.DisplayName;
                return x;
            }));
        })
    })
    .controller('SelectDeptmentCtrl', function ($scope, $modalInstance, DeptmentService, SelectType, SelectData) {
        $scope.SelectData = SelectData;
        $scope.treeSetting = {
            check: {
                chkStyle: SelectType
            },
            callback: {
                beforeExpand: function (treeId, treeNode) {
                    if (!treeNode.children) {
                        DeptmentService.GetChildData($scope, {
                            ID: treeNode.Id,
                            PageIndex: 1,
                            PageSize: 999
                        }, function (data) {
                            $scope.tree.addNodes(treeNode, data.List.map(function (x) {
                                if ($scope.SelectData.indexOf(x.Id) > -1) x.checked = true;
                                x.isParent = x.RgtId - x.LftId > 0;
                                x.name = x.GroupName;
                                return x;
                            }), true);
                        });
                    }
                }
            }
        };
        $scope.event = {
            OK: function () {
                $modalInstance.close($scope.tree.getCheckedNodes(true));
            },
            Close: function () {
                $modalInstance.close();
            }
        }
        DeptmentService.GetRootData($scope, {
            PageIndex: 1,
            PageSize: 99
        }, function (data) {
            $scope.tree.addNodes(null, data.map(function (x) {
                if ($scope.SelectData.indexOf(x.Id) > -1) x.checked = true;
                x.isParent = x.RgtId - x.LftId > 0
                x.name = x.GroupName;
                return x;
            }), true);
        })
    })
    .controller('GridCtrl', function ($scope, service) { })
    .controller('PublicDataCtrl', function ($scope, service) {
        //获取页面数据
        service.http.ajax({
            type: "get",
            url: "Menu/GetMenus"
        })
            .success(function (data) {
                service.http.DataHandle(data, function (data) {
                    $scope.PublicData.MenuList = data;
                })
            });
    })
    .controller('ListPageCtrl', function ($scope, service) {
        $scope.type = Request("type");
        $scope.GroupType = false;
        $scope.SetData = {
            ListDataCode: "",
            TypeDataCode: "",
            RequestParams: {},
            TypeId: "",
            ViewType: ""
        }
        switch ($scope.type) {
            case "Notice":
                $scope.SetData.ListDataCode = "GTLS_2";
                $scope.NavName = "通知";
                break;
            case "Info":
                $scope.SetData.ListDataCode = "GTLS_8";
                $scope.NavName = "资讯";
                break;
            case "Knowledge":
                $scope.SetData.TypeDataCode = "GTLS_3";
                $scope.NavName = "知识库";
                $scope.SetData.RequestParams = {
                    pluginId: "e0979e55-1bca-4d22-b4e3-8772d82c73bd"
                };
                $scope.SetData.ListDataCode = "GTLS_9";
                $scope.ChangeTab = function (argItemId) {
                    $scope.SetData.TypeId = argItemId;
                    $scope.event.LoadListData();
                }
                break;
            case "ChildSys":
                $scope.SetData.ViewType = "Image";
                $scope.SetData.ListDataCode = "GTLS_6";
                $scope.NavName = "企业介绍";
                break;
        }
        $scope.event = {
            LoadListData: function () {
                service.http.json("get", $scope.SetData.ListDataCode, {
                    PageIndex: $scope.pageData.Index,
                    PageSize: $scope.pageData.Size,
                    itemId: $scope.SetData.TypeId
                }).success(function (data) {
                    service.http.DataHandle(data, function (data) {
                        $scope.ListData = data.List;
                    });
                });
            },
            LoadTypeData: function () {
                service.http.json("get", $scope.SetData.TypeDataCode, $scope.SetData.RequestParams).success(function (data) {
                    $scope.GroupType = data.data;
                    $scope.SetData.TypeId = data.data[0].Id

                    service.http.json("get", $scope.SetData.ListDataCode, {
                        PageIndex: $scope.pageData.Index,
                        PageSize: $scope.pageData.Size,
                        itemId: $scope.SetData.TypeId
                    }).success(function (data) {
                        service.http.DataHandle(data, function (data) {
                            $scope.ListData = data.List;
                        });
                    });
                })
            }
        }
        if ($scope.SetData.TypeDataCode == "") {
            if ($scope.type == "ChildSys") {
                service.http.json("get", $scope.SetData.ListDataCode, {
                    PageIndex: $scope.pageData.Index,
                    PageSize: $scope.pageData.Size,
                    itemId: $scope.SetData.TypeId
                }).success(function (data) {
                    $scope.ListData = data.data;
                });
            } else {
                $scope.event.LoadListData();
            }
        } else {
            $scope.event.LoadTypeData();
        }
    })
    .controller('NotceContentCtrl', function ($scope, service) {
        var urlId = Request("id");
        $scope.type = Request("type");
        $scope.SetData = {
            ListDataCode: "",
            RequestParams: {},
            TypeId: "",
            ViewType: ""
        }
        switch ($scope.type) {
            case "Notice":
                $scope.SetData.ListDataCode = "GTLS_12";
                $scope.SetData.RequestParams = {
                    NoticeId: urlId
                };
                break;
            case "Info":
                $scope.SetData.ListDataCode = "GTLS_11";
                $scope.SetData.RequestParams = {
                    newsId: urlId
                };
                break;
            case "Knowledge":
                $scope.SetData.ListDataCode = "GTLS_13";
                $scope.SetData.RequestParams = {
                    knowledgeId: urlId
                };
                break;
            case "ChildSys":
                $scope.SetData.ViewType = "Image";
                $scope.SetData.ListDataCode = "GTLS_10";
                $scope.SetData.RequestParams = {
                    id: urlId
                };
                break;
        }
        service.http.json("get", $scope.SetData.ListDataCode, $scope.SetData.RequestParams).success(function (data) {
            if ($scope.type == "ChildSys") {
                $scope.data = data;
            } else {
                $scope.data = data.RtnData;
            }
        });
    });

// ReSharper disable once NativeTypePrototypeExtending
Array.prototype.remove = function (b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
};
// ReSharper disable once NativeTypePrototypeExtending
Array.prototype.distinct = function () {
    var desnArray = {};
    this.forEach(function (obj) {
        desnArray[obj.Id] = obj;
    });
    var result = [];
    for (var item in desnArray) {
        if (desnArray.hasOwnProperty(item)) {
            result.push(desnArray[item]);
        }
    }
    return result;
}
// ReSharper disable once NativeTypePrototypeExtending
Array.prototype.distinctUser = function () {
    var desnArray = {};
    this.forEach(function (obj) {
        desnArray[obj.User.Id] = obj;
    });
    var result = [];
    for (var item in desnArray) {
        if (desnArray.hasOwnProperty(item)) {
            result.push(desnArray[item]);
        }
    }
    return result;
}
// ReSharper disable once NativeTypePrototypeExtending 转化字典
Array.prototype.toDictionary = function () {
    var dicArray = {};
    this.forEach(function (obj) {
        dicArray[obj.Id] = obj;
    });
    return dicArray;
}

var SelectSet = function (val, List, key) {
    var temp_menus = $.extend(true, {}, val);
    val = [];
    var temp_val = [];
    angular.forEach(temp_menus, function (obj, i) {
        for (var j = 0; j < List.length; j++) {
            if (obj[key || 'Id'] === List[j][key || 'Id']) {
                temp_val.push(List[j]);
            }
        }
    })
    return temp_val;
}

var Request = function (strName) {
    var strHref = location.href;
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var arrTmp = strRight.split("&");
    for (var i = 0; i < arrTmp.length; i++) {
        var arrTemp = arrTmp[i].split("=");
        if (arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];
    }
    return "";
}
var ButtonList = {
    GridButton: [{
        "Code": "AddChild",
        "Ico": "icon-gt-add",
        "Name": "添加子",
        "Tip": "添加子节点"
    }, {
        "Code": "EditInfo",
        "Ico": "icon-gt-edit",
        "Name": "修改",
        "Tip": "修改当前行数据"
    }, {
        "Code": "RevokeInfo",
        "Ico": "icon-gt-revoke",
        "Name": "撤销",
        "Tip": "撤销当前行数据"
    }, {
        "Code": "DeleteSelect",
        "Ico": "icon-gt-deleterow",
        "Name": "删除",
        "Tip": "删除当前行数据"
    }, {
        "Code": "Config",
        "Ico": "icon-gt-setting",
        "Name": "配置",
        "Tip": "配置当前数据"
    }],
    OperateList: [{
        "Code": "Add",
        // "Ico": "btn-add",
        "Ico": "icon-gt-add",
        "Name": "添加"
    }, {
        "Code": "AddElse",
        "Ico": "icon-gt-add",
        "Name": "添加"
    }, {
        "Code": "AddRoot",
        "Ico": "icon-gt-add",
        "Name": "添加根"
    }, {
        "Code": "SelectUser",
        "Name": "选择人员",
        "Ico": "btn-add"
    }, {
        "Code": "ModifyRelation",
        "Ico": "icon-gt-edit",
        "Name": "修改父"
    }, {
        "Code": "PersonalPush",
        "Ico": "icon-gt-personalPush",
        "Name": "个人推送",
        "GroupName": "推送",
        "Group": true
    }, {
        "Code": "GroupPush",
        "Ico": "icon-gt-groupPush",
        "GroupName": "推送",
        "Name": "群组推送",
        "Group": true
    }, {
        "Code": "TagPush",
        "Ico": "icon-gt-tagPush",
        "GroupName": "推送",
        "Name": "标签推送",
        "Group": true
    }, {
        "Code": "PublicPush",
        "Ico": "icon-gt-publicPush",
        "GroupName": "推送",
        "Name": "公开推送",
        "Group": true
    }
    , {
        "Code": "PersonalPermissionConfig",
        "Ico": "icon-gt-personalPush",
        "GroupName": "权限配置",
        "Name": "个人权限",
        "Group": true
    }, {
        "Code": "GroupPermissionConfig",
        "Ico": "icon-gt-groupPush",
        "GroupName": "权限配置",
        "Name": "团队权限",
        "Group": true
    }
    , {
        "Code": "DeleteAllSelect",
        "Ico": "icon-gt-delete",
        "Name": "删除"
    }],
    TagList: [{
        "Code": "PluginTagBtn",
        "Ico": "icon-gt-commonTag",
        "Name": "插件标签",
        "Group": true
    }, {
        "Ico": "icon-gt-commonTag",
        "Code": "PersonTagBtn",
        "Name": "人组标签",
        "Group": true
    }, {
        "Ico": "icon-gt-commonTag",
        "Code": "BatchBtn",
        "Name": "批量打标签",
        "Group": true
    }, {
        "Ico": "icon-gt-commonTag",
        "Code": "CommonTag",
        "Name": "普通标签",
        "Group": true
    }],
    PowerList: [{
        "Code": "SetPowerBtn",
        "Name": "功能权限",
        "Ico": "icon-gt-funcPowers"
    }, {
        "Code": "DeptmentBtn",
        "Name": "节点权限",
        "Ico": "icon-gt-nodePowers"
    }, {
        "Code": "RoleBtn",
        "Name": "角色分配",
        "Ico": "icon-gt-rolePowers"
    }],
    OtherButtons: [{
        "Code": "Select",
        "Name": "选择",
        "Ico": "btn-add",
    }, {
        "Code": "SetVip",
        "Name": "设置Vip码",
        "Ico": "icon-gt-vip"
    }, {
        "Ico": "icon-gt-add",
        "Code": "Custom",
        "Name": "自建"
    }, {
        "Code": "ResetPassword",
        "Name": "重置密码",
        "Ico": "icon-gt-resetPassword"
    }, {
        "Code": "Bind",
        "Name": "绑定标签",
        "Ico": "icon-gt-group"
    }, {
        "Code": "UnBind",
        "Name": "解绑标签",
        "Ico": "btn-unbind"
    }, {
        "Code": "Import",
        "Name": "导入",
        "Ico": "icon-gt-import",
        "Group": true
    }, {
        "Code": "Print",
        "Name": "打印",
        "Ico": "btn-print"
        //     "Code": "DownLoad",
        //     "Name": "下载"
        // }, {
    }],
    BaseButtons: [{
        "Code": "Push",
        "Name": "推送"
    }, {
        "Code": "Prev",
        "Name": "上一步"
    }, {
        "Code": "Next",
        "Name": "下一步"
    }, {
        "Code": "Save",
        "Type": "Submit",
        "Name": "保存"
    }, {
        "Code": "OK",
        "Name": "确定"
    }, {
        "Code": "Search",
        "Name": "查询"
    }, {
        "Code": "Close",
        "Name": "关闭"
    }]
}

function LogSocket($scope, host, port) {
    _this = this;
    _this.host = host;
    _this.portAjax = port;
    _this.MessageList = [];
    $.ajax({
        async: false,
        url: "http://" + _this.host + ":" + _this.portAjax + "/log/port",
        success: function (data) {
            _this.port = data;
        }
    })
    $.ajax({
        async: false,
        url: "http://" + _this.host + ":" + _this.portAjax + "/logs",
        success: function (data) {
            _this.LogList = data.map(function (x) {
                return {
                    Name: x
                };
            });
        }
    })
    if (_this.port) {
        _this.socket = new WebSocket('ws://' + _this.host + ':' + _this.port + '/log');
        _this.socket.onopen = function (event) {
            $scope.$emit('AddLog', "连接成功！");
        };
        // 发送一个初始化消息
        // 监听消息
        _this.socket.onmessage = function (event) {
            $scope.$emit('AddLog', event.data);
        };
    }
}

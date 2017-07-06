// var app = angular.module('UrlConfig', []);
app.run(function($rootScope) {})
app.factory('service', function($http, $rootScope, $q, $state) {
    var s = function() {
        return {
            contentType: "application/json",
            dataType: "json",
            type: "get",
            async: true,
            url: false,
            data: false,
            loadEle: false
        }
    }
    var DataHandle = function(data, fun) {
        if (data.Result == 0) {
            if ($.isArray(data.RtnMsg)) {
                angular.forEach(data.RtnMsg, function(obj, i) {
                    ret.msg.alert(obj.RtnMsg.replace(/\n/g, '<br>'));
                })
            } else {
                ret.msg.alert(data.RtnMsg.replace(/\n/g, '<br>'));
            }
        } else if (data.Result == 999) {
            ret.msg.alert("未登录或登录超时，请重新登录！");
            $state.go("Login");
        } else {
            fun(data.RtnData);
        }
    }
    var ret = {
        http: {
            asyncajax: function(set) {
                set = $.extend(s, set);
                $(".loading").css("display", "block");
                ajaxCount++;
                $.ajax({
                    async: false,
                    dataType: set.dataType,
                    // contentType: set.contentType,
                    type: set.type,
                    url: set.url,
                    headers: {
                        SessionId: sessionStorage.getItem("SessionID")
                    },
                    data: set.data
                }).done(function(data) {
                    DataHandle(data, set.success);
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".loading").css("display", "none");
                    }
                })
            },
            ajax: function(set) {
                set = $.extend(s(), set);
                $(".loading").css("display", "block");
                ajaxCount++;
                return $http({
                    method: set.type,
                    url: set.url,
                    headers: {
                        SessionId: sessionStorage.getItem("SessionID")
                    },
                    params: "get,delete".indexOf(set.type.toLowerCase()) > -1 ? set.data : {},
                    data: "post,put".indexOf(set.type.toLowerCase()) > -1 ? set.data : {}
                }).success(function() {
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".loading").css("display", "none");
                    }
                }).error(function(data) {
                    ajaxCount--;
                    if (ajaxCount === 0) {
                        $(".loading").css("display", "none");
                    }
                })
            },
            DataHandle: function(data, fun) {
                DataHandle(data, fun);
            },
            pageAjax: function(set) {
                ret.ajax(set);
            }
        },
        Cookie: {
            Get: function(key) {
                return sessionStorage.getItem(key);
            },
            Set: function(key, value) {
                sessionStorage.setItem(key, value);
            }
        },
        msg: {
            alert: function(msg) {
                alertify.alert(msg);
            },
            popover: function(msg) {
                $(".pop").show().text(msg);
                $(".pop").animate({
                    top: 5
                }, 'slow');
                setTimeout(function() {
                    $(".pop").animate({
                        top: -50
                    }, 'slow');
                }, 2000);
            },
            confirm: function(msg, OK_fun, Cancel_fun) {
                return alertify.confirm(msg, OK_fun, Cancel_fun);
            }
        },
        FileUpload: {
            BuildUploadObj: function() {
                return new OssUpload({
                    bucket: 'image-gtintel',
                    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
                    chunkSize: 104857600,
                    concurrency: 2,
                    aliyunCredential: {
                        "accessKeyId": "gin6ZIIh3NaJcvFf",
                        "secretAccessKey": "BKY98SroF6UrPM8fnD3VOk4vNpCF8m"
                    }
                    // stsToken: stsToken
                });
            },
            BuildUploadSetting: function(file, folder, done, error, progress) {
                return {
                    file: file,
                    key: folder + file.name.substr(file.name.lastIndexOf('.')),
                    maxRetry: 3,
                    headers: {
                        'CacheControl': 'public',
                        'Expires': '',
                        'ContentEncoding': '',
                        'ContentDisposition': '',
                        'ServerSideEncryption': ''
                    },
                    onerror: error,
                    oncomplete: done,
                    onprogress: progress
                };
            },
            BuildGUID: function() {
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
        },
        //类型转换对象
        convert: {
            //base64编码的img,转化成Blob对象
            convertToBlob: function(base64, type) {
                // base64 的格式为 “data:image/png;base64,****”
                data = base64.split(',')[1];
                data = window.atob(data);
                var ia = new Uint8Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    ia[i] = data.charCodeAt(i);
                };

                // canvas.toDataURL 返回的默认格式就是 image/png
                var blob = new Blob([ia], {
                    type: type
                });
                return blob;
            },
            getAttributeByOtherAttr: function(key, otherAttr, returnAttr, list) {
                var attr;
                list.map(function(obj, index) {
                    if (obj[otherAttr] === key) {
                        attr = obj[returnAttr]
                    };
                    return attr;
                });
                return attr;
            }
        },
        expression: {
            //加载本地表情包
            getExpressionList: function() {
                var expressions = [];
                for (var i = 1; i < 101; i++) {
                    expressions.push('/vendor/wangEditor1.4/expressions/' + i + '.gif');
                }
                return expressions;
            }
        },
        PageSize: 10,
        GuidNull: "00000000-0000-0000-0000-000000000000",
        deferred: $q.defer()
    };
    return ret;
});
// app.config(function($httpProvider){
//  $httpProvider.defaults.useXDomain = true;
//  delete $httpProvider.defaults.headers.common['X-Requested-Width'];
// })

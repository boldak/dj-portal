"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-foundation");

require("file-upload");

require("i18n");

require("ng-ace");

var info = angular.module("app.info", ["mm.foundation", "ngFileUpload", "app.i18n", "ng.ace"]);

info.service("alert", ["$modal", "$log", function ($modal, $log) {
    this.message = function (msg) {
        if (angular.isArray(msg)) {
            for (var i in msg) {
                $log.info(msg);
            }
        } else {
            $log.info(msg);
            msg = [msg];
        }
        $modal.open({
            templateUrl: "/partials/alert.html",
            windowClass: "info-modal",
            controller: "AlertController",
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        });
    };

    this.error = function (msg) {
        if (angular.isArray(msg)) {
            for (var i in msg) {
                $log.info(msg);
            }
        } else {
            $log.error(msg);
            msg = [msg];
        }

        $modal.open({
            templateUrl: "/partials/alert.html",
            windowClass: "info-modal",
            controller: "AlertController",
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        });
    };
}]);

info.factory("confirm", ["$modal", function ($modal) {
    return function (text) {
        return $modal.open({
            templateUrl: "/partials/confirm.html",
            controller: "ConfirmController",
            windowClass: "info-modal",
            resolve: {
                text: function () {
                    return text;
                }
            }
        }).result;
    };
}]);

info.factory("$info", ["$modal", function ($modal) {
    return function (text) {
        return $modal.open({
            templateUrl: "/partials/info.html",
            controller: "InfoController",
            windowClass: "dialog-modal",
            resolve: {
                text: function () {
                    return text;
                }
            }
        }).result;
    };
}]);

info.factory("prompt", ["$modal", function ($modal) {
    return function (text, value) {
        return $modal.open({
            templateUrl: "/partials/prompt.html",
            controller: "PromptController",
            windowClass: "info-modal",
            resolve: {
                text: function () {
                    return text;
                },
                value: function () {
                    return value;
                }
            }
        }).result;
    };
}]);

info.factory("log", ["$modal", function ($modal) {
    return function (log) {
        return $modal.open({
            templateUrl: "/partials/log.html",
            controller: "LogController",
            windowClass: "dialog-modal",
            resolve: {
                log: function () {
                    return log;
                }
            }
        }).result;
    };
}]);

info.factory("dpsEditor", ["$modal", function ($modal) {
    return function (script, title) {
        return $modal.open({
            templateUrl: "/partials/dps-editor.html",
            controller: "DpsEditorController",
            // windowClass: 'dialog-modal',
            backdrop: "static",
            resolve: {
                script: function () {
                    return script;
                },
                title: function () {
                    return title;
                }

            }
        }).result;
    };
}]);

info.factory("jsonEditor", ["$modal", function ($modal) {
    return function (json, title) {
        return $modal.open({
            templateUrl: "/partials/json-editor.html",
            controller: "JsonEditorController",
            // windowClass: 'dialog-modal',
            backdrop: "static",
            resolve: {
                json: function () {
                    return json;
                },
                title: function () {
                    return title;
                }

            }
        }).result;
    };
}]);

info.factory("dialog", ["$modal", function ($modal) {
    return function (form) {
        return $modal.open({
            templateUrl: "/partials/dialog.html",
            controller: "DialogController",
            windowClass: "dialog-modal",
            resolve: {
                form: function () {
                    return form;
                }
            }
        }).result;
    };
}]);

info.factory("$error", ["$modal", function ($modal) {
    return function (msg) {
        return $modal.open({
            templateUrl: "/partials/error.html",
            controller: "ErrorController",
            windowClass: "dialog-modal",
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        }).result;
    };
}]);

info.factory("splash", ["$modal", function ($modal) {
    return function (form, wait) {
        return $modal.open({
            templateUrl: "/partials/splash.html",
            controller: "SplashController",
            windowClass: "splash-modal",
            resolve: {
                form: function () {
                    return form;
                },
                wait: function () {
                    return wait;
                }
            }
        }).result;
    };
}]);

info.factory("progress", ["$modal", function ($modal) {
    return function (title) {
        var instance = {};
        $modal.open({
            templateUrl: "/partials/progress.html",
            windowClass: "splash-modal",
            controller: "ProgressController",
            resolve: {
                instance: function () {
                    return instance;
                },
                title: function () {
                    return title;
                }
            }
        });
        return instance;
    }

    // return {
    //   // close: function(){
    //   //   $modalInstance.dismiss();
    //   // }
    // } 

    ;
}]);

info.controller("AlertController", ["$scope", "msg", "$modalInstance", function ($scope, msg, $modalInstance) {
    $scope.msg = msg;
    $scope.close = function () {
        $modalInstance.dismiss();
    };
}]);

info.controller("ErrorController", ["$scope", "msg", "$modalInstance", function ($scope, msg, $modalInstance) {
    $scope.error = msg;
    $scope.close = function () {
        $modalInstance.dismiss();
    };
}]);

info.controller("PromptController", ["$scope", "$modalInstance", "text", "value", function ($scope, $modalInstance, text, value) {
    $scope.form = {
        text: text,
        value: value,
        dismissed: false,

        close: function close() {
            if (!$scope.form.dismissed) {
                $modalInstance.close($scope.form.value);
            }
        },
        dismiss: function dismiss() {
            $scope.form.dismissed = true;
            $modalInstance.dismiss();
        }
    };
}]);

info.controller("DpsEditorController", ["$scope", "$modalInstance", "script", "title", function ($scope, $modalInstance, script, title) {

    var __script;

    $scope.options = {
        mode: "dps",
        theme: "tomorrow",
        onChange: function onChange(e) {
            __script = e[1].getSession().getValue();
        }
    };

    $scope.getEditorScript = function () {
        return __script;
    };

    $scope.script = script;
    $scope.title = title;

    $scope.close = function () {
        $modalInstance.close(__script);
    };

    $scope.dismiss = function () {
        $modalInstance.dismiss();
    };
}]);

info.controller("JsonEditorController", ["$scope", "$modalInstance", "json", "title", function ($scope, $modalInstance, json, title) {

    var __script;

    $scope.options = {
        mode: "json",
        theme: "tomorrow",
        onChange: function onChange(e) {
            __script = e[1].getSession().getValue();
        }
    };

    $scope.getEditorScript = function () {
        return __script;
    };

    $scope.script = json;
    $scope.title = title;

    $scope.close = function () {
        $modalInstance.close(__script);
    };

    $scope.dismiss = function () {
        $modalInstance.dismiss();
    };
}]);

info.controller("DialogController", ["$scope", "$modalInstance", "form", function ($scope, $modalInstance, form) {

    $scope.form = form;
    $scope.form.cancelable = angular.isDefined($scope.form.cancelable) ? $scope.form.cancelable : true;
    for (var i in form.fields) {
        (function (i) {
            form.fields[i].id = Math.random().toString(36).substring(2);
            form.fields[i].editable = angular.isDefined(form.fields[i].editable) ? form.fields[i].editable : true;
            form.fields[i].required = angular.isDefined(form.fields[i].required) ? form.fields[i].required : true;

            form.fields[i].type = form.fields[i].type || "text";

            if (form.fields[i].type == "typeahead") {
                if (angular.isArray(form.fields[i].list)) {
                    form.fields[i].getList = function (filterValue) {
                        return form.fields[i].list.filter(function (item) {
                            return item.toLowerCase().includes(filterValue.toLowerCase());
                        });
                    };
                } else {
                    form.fields[i].getList = form.fields[i].list;
                }
            }

            if (form.fields[i].type == "select" || form.fields[i].type == "multiselect") {
                form.fields[i].options = form.fields[i].options.map(function (item, index) {
                    return angular.isDefined(item.title) ? angular.isDefined(item.value) ? item : { title: item.title, value: item.title } : angular.isDefined(item.value) ? { title: item.value, value: item.value } : { title: item, value: item };
                });
            }

            if (form.fields[i].type == "checkgroup") {
                form.fields[i].value = form.fields[i].value.map(function (item, index) {
                    return angular.isDefined(item.title) ? angular.isDefined(item.value) ? item : { title: item.title, value: false } : angular.isDefined(item.value) ? { title: index, value: item.value } : { title: item, value: false };
                });
            }
        })(i);
    }

    $scope.getFieldByID = function (id) {
        for (var i in form.fields) {
            if (form.fields[i].id == id) return form.fields[i];
        }
    };

    $scope.form.dismissed = false;

    $scope.setImportFile = function (file, node) {
        this.$apply(function () {
            $scope.getFieldByID(node.id).value = file;
        });
    };

    $scope.completed = $scope.form.validate ? $scope.form.validate : function (form) {
        var f = true;
        for (var i in $scope.form.fields) {
            if ($scope.form.fields[i].required && $scope.form.fields[i].type != "checkbox") {
                if (angular.isUndefined($scope.form.fields[i].value)) {
                    return false;
                }
                if ($scope.form.fields[i].value.length == 0) {
                    return false;
                }
            }
        }
        return true;
    };

    $scope.form.close = function () {
        if (!$scope.form.dismissed) {
            $modalInstance.close($scope.form);
        }
    };

    $scope.form.dismiss = function () {
        console.log($scope.form);
        $scope.form.dismissed = true;
        $modalInstance.dismiss();
    };
}]);

info.controller("SplashController", ["$scope", "$modalInstance", "form", "wait", function ($scope, $modalInstance, form, wait) {
    $scope.form = form;
    wait = wait || 1500;
    if (wait) {
        setTimeout(function () {
            $modalInstance.dismiss();
        }, wait);
    }
}]);

info.controller("ProgressController", ["$scope", "$modalInstance", "instance", "title", function ($scope, $modalInstance, instance, title) {
    $scope.title = title;
    instance.close = function () {
        $modalInstance.dismiss();
    };
}]);

info.controller("LogController", ["$scope", "$modalInstance", "i18n", "log", function ($scope, $modalInstance, i18n, log) {

    $scope.close = function () {
        $modalInstance.dismiss();
    };
    $scope.log = log.messages;
    $scope.title = log.title || { level: "info", text: "Operation Log" };
    $scope.title = $scope.title.text ? $scope.title : { level: "info", text: $scope.title };
    $scope.level = $scope.title.level || "info";

    $scope.formatDate = i18n.formatDate;
}]);

info.controller("ConfirmController", ["$scope", "$modalInstance", "text", function ($scope, $modalInstance, text) {
    $scope.form = {
        text: text,

        ok: function ok() {
            $modalInstance.close(true);
        },
        dismiss: function dismiss() {
            $modalInstance.dismiss();
        }
    };
}]);

info.controller("InfoController", ["$scope", "$modalInstance", "text", function ($scope, $modalInstance, text) {
    $scope.text = text;
    $scope.close = function () {
        $modalInstance.close(true);
    };
}]);
//# sourceMappingURL=info.js.map
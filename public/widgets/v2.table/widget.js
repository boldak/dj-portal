"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("custom-react-directives");

require("angular-oclazyload");

require("widgets/v2.table/wizard");

var m = angular.module("app.widgets.v2.table", ["oc.lazyLoad", "custom-react-directives", "app.widgets.v2.table-wizard", "app.dps"]);

m.controller("TableCtrl", ["$scope", "$http", "$dps", "$ocLazyLoad", "APIProvider", "pageSubscriptions", "TableWizard", "i18n", "$error", function ($scope, $http, $dps, $ocLazyLoad, APIProvider, pageSubscriptions, TableWizard, i18n, $error) {

    $ocLazyLoad.load({
        files: ["/widgets/v2.table/data-widget.css"]
    });

    $scope.select = function () {
        var t = angular.copy($scope.table);

        if ($scope.columnSelection) {
            (function () {
                var indexes = [];
                t.header = t.header.filter(function (h, index) {
                    var f = false;
                    h.metadata.forEach(function (m) {
                        f |= $scope.columnSelection.filter(function (s) {
                            return s.key == m.label && !s.disabled;
                        }).length > 0;
                    });
                    if (f) indexes.push(index);
                    return f;
                });
                t.body.forEach(function (r) {
                    r.value = r.value.filter(function (v, index) {
                        return indexes.indexOf(index) >= 0;
                    });
                });
            })();
        }

        if ($scope.rowSelection) {
            t.body = t.body.filter(function (r) {
                var f = false;
                r.metadata.forEach(function (m) {
                    f |= $scope.rowSelection.filter(function (s) {
                        return s.key == m.label && !s.disabled;
                    }).length > 0;
                });
                return f;
            });
        }

        $scope.settings = { table: t, decoration: angular.copy($scope.decoration) };
    };

    $scope.update = function () {
        $scope.pending = angular.isDefined($scope.widget.dataID);
        if ($scope.pending) {
            $dps.get("/api/data/process/" + $scope.widget.dataID).success(function (resp) {
                $scope.pending = false;
                $scope.table = resp.value;
                $scope.decoration = $scope.widget.decoration;
                $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) };
            });
        } else {
            if ($scope.widget.script) {
                $dps.post("/api/script", {
                    script: $scope.widget.script,
                    locale: i18n.locale()
                }).then(function (resp) {
                    if (resp.data.type == "error") {
                        $error(resp.data.data);
                        return;
                    };
                    $scope.table = resp.data.data;
                    $scope.decoration = $scope.widget.decoration;
                    $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) };
                });
            } else {
                $http.get("./widgets/v2.table/sample.json").success(function (resp) {
                    $scope.table = resp.value;
                    $scope.decoration = $scope.widget.decoration;
                    $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) };
                });
            }
        }
    };

    new APIProvider($scope).config(function () {
        // console.log($scope.widget)
        if ($scope.widget.emitters && $scope.widget.emitters.length && $scope.widget.emitters.trim().length > 0) {
            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName,
                signal: "selectSerie"
            });
            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName,
                signal: "selectObject"
            });

            $scope.emitters = $scope.widget.emitters ? $scope.widget.emitters.split(",") : [];

            $scope.emitters = $scope.emitters.map(function (item) {
                var l = item.trim().split(".");
                return { emitter: l[0], signal: l[1], slot: l[2], receiver: $scope.widget.instanceName };
            });

            pageSubscriptions().addListeners($scope.emitters);
        } else {
            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName,
                signal: "selectSerie"
            });
            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName,
                signal: "selectObject"
            });
        }
        $scope.update();
    }, true).openCustomSettings(function () {
        $scope.wizard = TableWizard;
        return $scope.wizard.start($scope);
    }).provide("selectRow", function (e, selection) {
        $scope.rowSelection = selection;
        $scope.select();
    }).provide("selectColumn", function (e, selection) {
        $scope.columnSelection = selection;
        $scope.select();
    }).provide("setData", function (e, context) {
        // console.log("TABLE SET DATA", context)
        if (!context) {
            $scope.hidden = true;
            return;
        }
        if (context.key == "table") {
            $scope.dataset = context.dataset;
            $scope.table = context.data;
            $scope.hidden = false;
            $scope.pending = false;
            $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) };
        } else {
            if ($scope.dataset != context.dataset) {
                $scope.hidden = true;
            }
        }
    }).provide("updateWithData", function (e, context) {

        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {

            $scope.dataset = context.dataset;
            $scope.table = context.data;
            $scope.pending = false;
            $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) };

            if (context.options) {
                $scope.hidden = context.options.hidden;
            }
        }
    }).provide("updateWithOptions", function (e, context) {

        if (!context) return;

        if (context.widget) {
            context.widget = context.widget.forEach ? context.widget : [context.widget];
        }

        if (!context.widget || context.widget.indexOf($scope.widget.instanceName) >= 0) {
            $scope.hidden = context.options.hidden;
        }
    });
}]);
//# sourceMappingURL=../v2.table/widget.js.map
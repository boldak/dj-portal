"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

angular.module("app.widgets.html-dynamic", []).controller("HtmlDynaController", ["$scope", "APIProvider", "i18n", "dialog", "$dps", "$error", "$sce", "dpsEditor", function ($scope, APIProvider, i18n, dialog, $dps, $error, $sce, dpsEditor) {

    $scope.update = function () {
        if ($scope.script) {
            $dps.post("/api/script", {
                script: $scope.script,
                locale: i18n.locale()
            }).then(function (resp) {
                if (resp.data.type == "error") {
                    $error(resp.data.data);
                    $scope.html = "";
                    // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                    return;
                };
                $scope.html = $sce.trustAsHtml(resp.data.data);
                // $scope.container.getElement()[0].children[0].children[0].innerHTML = resp.data.data;
            });
        } else {
            $scope.html = "";
            // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
        }
    };

    new APIProvider($scope).config(function () {
        $scope.script = $scope.widget.script;
        $scope.update();
    }).openCustomSettings(function () {
        dpsEditor($scope.script).then(function (script) {
            $scope.script = script;
            $scope.widget.script = script;
            $scope.update();
        });
    });
}]);
//# sourceMappingURL=../html-dynamic/widget.js.map
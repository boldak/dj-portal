"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-line/wizard");

require("widgets/v2.nvd3-line/adapter");

var m = angular.module("app.widgets.v2.nvd3-line", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.line-chart-wizard", "app.widgets.v2.line-chart-adapter"]);

m.controller("Nvd3LineChartCtrlV2", ["$scope", "NVD3WidgetV2", "LineChartWizard", "LineChartAdapter", function ($scope, NVD3WidgetV2, LineChartWizard, LineChartAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: LineChartWizard,
    decorationAdapter: LineChartAdapter,
    optionsURL: "/widgets/v2.nvd3-line/options.json",
    sampleURL: "/widgets/v2.nvd3-line/sample.json",

    acceptData: function acceptData(context) {
      return context.key == "line";
    },

    serieAdapter: {
      getX: function getX(d) {
        return d.x;
      },
      getY: function getY(d) {
        return d.y;
      },

      getSeriesSelection: function getSeriesSelection(data) {
        return data.map(function (s) {
          return { key: s.key, disabled: false };
        });
      },

      getObjectsSelection: function getObjectsSelection(data) {
        var r = [];
        data.forEach(function (s) {
          s.values.forEach(function (v) {
            r.push({ key: v.label, disabled: true });
          });
        });

        var result = [];
        r.forEach(function (item) {
          var notExists = true;
          result.forEach(function (v) {
            notExists &= item.key != v.key;
          });
          if (notExists == true) result.push(item);
        });
        return result;
      }

    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-line/widget.js.map
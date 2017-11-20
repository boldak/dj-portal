"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-bar/wizard");

require("widgets/v2.nvd3-bar/adapter");

var m = angular.module("app.widgets.v2.nvd3-bar", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.bar-chart-wizard", "app.widgets.v2.bar-chart-adapter"]);

m.controller("Nvd3BarChartCtrlV2", ["$scope", "NVD3WidgetV2", "BarChartWizard", "BarChartAdapter", function ($scope, NVD3WidgetV2, BarChartWizard, BarChartAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: BarChartWizard,
    decorationAdapter: BarChartAdapter,
    optionsURL: "/widgets/v2.nvd3-bar/options.json",
    sampleURL: "/widgets/v2.nvd3-bar/sample.json",

    acceptData: function acceptData(context) {
      return context.key == "bar";
    },

    serieAdapter: {
      getX: function getX(d) {
        return d.label;
      },
      getY: function getY(d) {
        return d.value;
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
//# sourceMappingURL=../v2.nvd3-bar/widget.js.map
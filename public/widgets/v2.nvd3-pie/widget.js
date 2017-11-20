"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-pie/wizard");

require("widgets/v2.nvd3-pie/adapter");

var m = angular.module("app.widgets.v2.nvd3-pie", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.pie-chart-wizard", "app.widgets.v2.pie-chart-adapter"]);

m.controller("Nvd3PieChartCtrlV2", ["$scope", "NVD3WidgetV2", "PieChartWizard", "PieChartAdapter", function ($scope, NVD3WidgetV2, PieChartWizard, PieChartAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: PieChartWizard,
    decorationAdapter: PieChartAdapter,
    optionsURL: "/widgets/v2.nvd3-pie/options.json",
    sampleURL: "/widgets/v2.nvd3-pie/sample.json",
    acceptData: function acceptData(context) {
      return context.key == "pie";
    },
    serieAdapter: {
      getX: function getX(d) {
        return d.label;
      },
      getY: function getY(d) {
        return isNaN(d.value) ? d.value : Number(Number(d.value).toFixed(2));
      },
      getSeries: function getSeries(series) {
        return series;
      },

      getSeriesSelection: function getSeriesSelection(data) {
        return data.map(function (s) {
          return { key: s.label, disabled: false };
        });
      },

      getObjectsSelection: function getObjectsSelection(data) {
        return [];
      }
    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-pie/widget.js.map
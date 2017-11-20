"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-stacked-area/wizard");

require("widgets/v2.nvd3-stacked-area/adapter");

var m = angular.module("app.widgets.v2.nvd3-stacked-area", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.stacked-area-chart-wizard", "app.widgets.v2.stacked-area-chart-adapter"]);

m.controller("Nvd3StackedAreaChartCtrlV2", ["$scope", "NVD3WidgetV2", "StackedAreaChartWizard", "StackedAreaAdapter", function ($scope, NVD3WidgetV2, StackedAreaChartWizard, StackedAreaAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: StackedAreaChartWizard,
    decorationAdapter: StackedAreaAdapter,
    optionsURL: "/widgets/v2.nvd3-stacked-area/options.json",
    sampleURL: "/widgets/v2.nvd3-stacked-area/sample.json",
    acceptData: function acceptData(context) {
      return context.key == "area";
    },
    serieAdapter: {
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
//# sourceMappingURL=../v2.nvd3-stacked-area/widget.js.map
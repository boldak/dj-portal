"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-chord/wizard");

require("widgets/v2.nvd3-chord/adapter");

var m = angular.module("app.widgets.v2.nvd3-chord", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.chord-chart-wizard", "app.widgets.v2.chord-chart-adapter"]);

m.controller("Nvd3ChordChartCtrlV2", ["$scope", "NVD3WidgetV2", "ChordChartWizard", "NVD3ChordAdapter", function ($scope, NVD3WidgetV2, ChordChartWizard, NVD3ChordAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: ChordChartWizard,
    decorationAdapter: NVD3ChordAdapter,
    optionsURL: "/widgets/v2.nvd3-chord/options.json",
    sampleURL: "/widgets/v2.nvd3-chord/sample.json",
    acceptData: function acceptData(context) {
      return context.key == "deps";
    },
    serieAdapter: {
      getSeriesSelection: function getSeriesSelection(data) {
        return [];
      },

      getObjectsSelection: function getObjectsSelection(data) {
        return [];
      },

      tooltipContent: function tooltipContent(serie, x, y, s) {
        return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>";
      }
    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-chord/widget.js.map
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-distribution/wizard");

require("widgets/v2.nvd3-distribution/adapter");

var m = angular.module("app.widgets.v2.nvd3-distribution", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.distribution-chart-wizard", "app.widgets.v2.distribution-chart-adapter"]);

m.controller("Nvd3DistributionChartCtrlV2", ["$scope", "NVD3WidgetV2", "DistributionChartWizard", "DistributionAdapter", function ($scope, NVD3WidgetV2, DistributionChartWizard, DistributionAdapter) {

  new NVD3WidgetV2($scope, {
    wizard: DistributionChartWizard,
    decorationAdapter: DistributionAdapter,
    optionsURL: "/widgets/v2.nvd3-distribution/options.json",
    serieAdapter: {
      getX: function getX(d) {
        return d.x;
      },
      getY: function getY(d) {
        return d.y;
      },
      getLabel: function getLabel(d) {
        return ( /*"["+d.label+"] - "+*/d.y
        );
      },

      label: function label(d) {
        return d.label;
      }
    }
  });
}]);
//# sourceMappingURL=../v2.nvd3-distribution/widget.js.map
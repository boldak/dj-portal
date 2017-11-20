"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

// import 'widgets/v2.nvd3-widget/nvd3-widget';

require("widgets/wizard/wizard");

require("widgets/v2.steps/edit-widget-id");

require("widgets/v2.nvd3-pie/pie-chart-decoration");

require("widgets/v2.nvd3-pie/adapter");

var m = angular.module("app.widgets.v2.pie-chart-wizard", [
// 'app.widgets.v2.nvd3-widget',
"app.widgets.wizard", "app.widgets.v2.steps.edit-widget-id", "app.widgets.v2.steps.pie-chart-decoration"]);

m._wizard = undefined;

m.factory("PieChartWizard", ["$http", "$modal",
// "NVD3WidgetV2",
"Wizard", "EditWidgetID", "PieChartDecoration", "parentHolder",
// "PieChartAdapter",
function ($http, $modal,
// NVD3WidgetV2,
Wizard, EditWidgetID, PieChartDecoration, parentHolder
// ,
// PieChartAdapter
) {
	if (!m._wizard) {
		m._wizard = new Wizard($modal).setTitle("Pie Chart Settings Wizard").push(EditWidgetID).push(PieChartDecoration).onStart(function (wizard) {
			wizard.conf = {};
			angular.copy(wizard.parentScope.widget, wizard.conf);
			console.log("Start conf", wizard.conf);
		}).onCancel(function (wizard) {
			wizard.conf = {};
			wizard.context = {};
		}).onFinish(function (wizard) {
			wizard.parentScope.widget.instanceName = wizard.conf.instanceName;
			wizard.parentScope.widget.decoration = wizard.conf.decoration;
			wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
			wizard.parentScope.widget.queryID = wizard.conf.queryID;
			wizard.parentScope.widget.dataID = wizard.conf.dataID;
			wizard.parentScope.widget.script = wizard.conf.script;
			wizard.parentScope.widget.emitters = wizard.conf.emitters;

			// wizard.parentScope.updateChart();

			wizard.conf = {};
			wizard.context = {};
		});
	}
	return m._wizard;
}]);

// "app.widgets.v2.pie-chart-adapter"
//# sourceMappingURL=../v2.nvd3-pie/wizard.js.map
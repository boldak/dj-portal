"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var m = angular.module("app.widgets.v2.steps.edit-widget-id", []);

m.factory("EditWidgetID", function () {
	return {

		id: "EditWidgetID",

		title: "Widget ID",

		description: "Edit widget ID if needed",

		html: "./widgets/v2.steps/edit-widget-id.html",

		onStartWizard: function onStartWizard(wizard) {
			this.instanceName = wizard.conf.instanceName;
		},

		onFinishWizard: function onFinishWizard(wizard) {
			wizard.conf.instanceName = this.instanceName;
			// this.instanceName = undefined;	
		}
	};
});
//# sourceMappingURL=../v2.steps/edit-widget-id.js.map
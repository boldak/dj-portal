"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("angular-oclazyload");

var m = angular.module("app.widgets.wizard", ["oc.lazyLoad"]);

m.factory("Wizard", ["$ocLazyLoad", function ($ocLazyLoad) {

	$ocLazyLoad.load({
		files: ["./widgets/wizard/styles.css"]
	});

	var Wizard = function Wizard(modalInstance) {
		this.steps = [];
		this.context = {};
		this.currentStepIndex;
		this.modalInstance = modalInstance;
		this.title = "Settings Wizard";
	};

	Wizard.prototype = {

		getAboveIndexes: function getAboveIndexes(step) {
			var result = [];
			for (var i = step.index + 1; i < this.steps.length; i++) {
				result.push(i);
			}
			return result;
		},

		getBelowIndexes: function getBelowIndexes(step) {
			var result = [];
			for (var i = step.index - 1; i >= 0; i--) {
				result.push(i);
			}
			return result;
		},

		getWithoutIndexes: function getWithoutIndexes(step) {
			var result = [];
			for (var i = 0; i < this.steps.length; i++) {
				if (i != step.index) result.push(i);
			}
			return result;
		},

		getSteps: function getSteps(callback) {
			return this.steps.filter(function (item) {
				return callback(item);
			});
		},

		setContext: function setContext(context) {
			this.context = context;
			return this;
		},

		setTitle: function setTitle(title) {
			this.title = title;
			return this;
		},

		setIcon: function setIcon(icon) {
			this.icon = icon;
			return this;
		},

		push: function push(step) {
			step.enabled = true;
			step.active = false;
			step.index = this.steps.length;
			step.activationCount = 0;
			this.steps.push(step);

			return this;
		},

		complete: function complete(step) {
			// console.log("W complete", step)
			if (this.onCompleteStepCallback) this.onCompleteStepCallback(this, step);
		},

		process: function process(step) {
			if (this.onProcessStepCallback) this.onProcessStepCallback(this, step);
		},

		enable: function enable(stepIndexes) {
			var thos = this;
			if (angular.isUndefined(stepIndexes)) {
				return;
			}stepIndexes = angular.isUndefined(stepIndexes.length) ? [stepIndexes] : stepIndexes;
			stepIndexes.forEach(function (currentStepIndex) {
				if (thos.steps[currentStepIndex]) {
					thos.steps[currentStepIndex].enabled = true;
					if (thos.steps[currentStepIndex].enable) thos.steps[currentStepIndex].enable(thos);
				}
			});
		},

		disable: function disable(stepIndexes) {
			var thos = this;
			if (angular.isUndefined(stepIndexes)) {
				return;
			}stepIndexes = angular.isUndefined(stepIndexes.length) ? [stepIndexes] : stepIndexes;
			stepIndexes.forEach(function (currentStepIndex) {
				if (thos.steps[currentStepIndex]) {
					thos.steps[currentStepIndex].enabled = false;
					if (thos.steps[currentStepIndex].disable) thos.steps[currentStepIndex].disable(thos);
				}
			});
		},

		activate: function activate(stepIndex) {
			if (this.steps[stepIndex] && this.steps[stepIndex].enabled
			// && 	this.steps[stepIndex].activate
			 && this.currentStepIndex != stepIndex) {

				if (angular.isDefined(this.currentStepIndex)) this.steps[this.currentStepIndex].active = false;

				this.currentStepIndex = stepIndex;
				this.steps[stepIndex].active = true;
				this.steps[stepIndex].activationCount++;
				if (this.steps[stepIndex].activate) this.steps[stepIndex].activate(this);
			}
		},

		next: function next() {
			if (this.steps.length > this.currentStepIndex) this.activate(this.currentStepIndex + 1);
		},

		prev: function prev() {
			if (0 < this.currentStepIndex) this.activate(this.currentStepIndex - 1);
		},

		onStart: function onStart(onStartCallback) {
			this.onStartCallback = onStartCallback;
			return this;
		},

		onCompleteStep: function onCompleteStep(onCompleteStepCallback) {
			this.onCompleteStepCallback = onCompleteStepCallback;
			return this;
		},

		onProcessStep: function onProcessStep(onProcessStepCallback) {
			this.onProcessStepCallback = onProcessStepCallback;
			return this;
		},

		onFinish: function onFinish(onFinishCallback) {
			this.onFinishCallback = onFinishCallback;
			return this;
		},

		onCancel: function onCancel(onCancelCallback) {
			this.onCancelCallback = onCancelCallback;
			return this;
		},

		start: function start(parentScope) {
			var thos = this;
			this.parentScope = parentScope;
			parentScope.wizard = this;

			if (this.onStartCallback) this.onStartCallback(this);

			this.steps.forEach(function (step) {
				if (step.onStartWizard) step.onStartWizard(thos);
			});

			this.activate(0);

			var s = this.parentScope;

			return this.modalInstance.open({
				templateUrl: "widgets/wizard/wizard.html",
				controller: "WizardController",
				backdrop: "static",
				resolve: {
					widgetScope: function widgetScope() {
						return s;
					}
				}
			}).result
			// .result.then(function (newWidgetConfig) {});
			;
		},

		finish: function finish() {
			var thos = this;
			this.steps.forEach(function (step) {
				if (step.onFinishWizard) step.onFinishWizard(thos);
			});
			if (this.onFinishCallback) this.onFinishCallback(this);
		},

		cancel: function cancel() {
			var thos = this;
			this.steps.forEach(function (step) {
				if (step.onCancelWizard) step.onCancelWizard(thos);
			});
			if (this.onCancelCallback) this.onCancelCallback(this);
		}

	};
	return Wizard;
}]);

m.controller("WizardController", ["$scope", "$modalInstance", "widgetScope", function ($scope, $modalInstance, widgetScope) {
	$scope.wizard = widgetScope.wizard;

	$scope.finish = function () {
		$scope.wizard.finish();
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$scope.wizard.cancel();
		$modalInstance.dismiss();
	};
}]);
//# sourceMappingURL=../wizard/wizard.js.map
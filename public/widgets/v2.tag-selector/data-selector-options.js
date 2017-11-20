"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

// import 'widgets/v2.nvd3-widget/nvd3-widget';
// import "widgets/v2.nvd3-bar/adapter";
// import "wizard-directives";

var m = angular.module("app.widgets.v2.data-selector-options", ["app.dps"]);

m.factory("DataSelectorOptions", ["$http", "$dps", "$q", "parentHolder", "pageWidgets", function ($http, $dps, $q, parentHolder, pageWidgets) {

	return {
		id: "DataSelectorOptions",

		title: "Data Selector Options",

		description: "Setup data selector options",

		html: "./widgets/v2.data-selector/data-selector-options.html",

		onStartWizard: function onStartWizard(wizard) {
			var _this = this;

			this.wizard = wizard;
			this.conf = {
				decoration: wizard.conf.decoration || {},
				dataID: wizard.conf.dataID,
				queryID: wizard.conf.queryID,
				serieDataId: wizard.conf.serieDataId,
				optionsUrl: "./widgets/v2.nvd3-bar/options.json",
				dataUrl: $dps.getUrl() + "/api/data/process/"
			};

			this.conf.decoration.direction = this.conf.decoration.direction || "Rows";

			this.queries = [];

			pageWidgets().filter(function (item) {
				return item.type == "v2.query-manager";
			}).map(function (item) {
				return item.queries;
			}).forEach(function (item) {
				_this.queries = _this.queries.concat(item);
			});

			if (this.conf.queryID) {
				var thos = this;
				this.inputQuery = this.queries.filter(function (item) {
					return item.$id == _this.conf.queryID;
				})[0].$title;
			}
		},

		onFinishWizard: function onFinishWizard(wizard) {

			wizard.conf.decoration = this.conf.decoration;
			wizard.conf.serieDataId = this.conf.serieDataId;
			wizard.conf.queryID = this.conf.queryID;
			wizard.conf.dataID = this.conf.dataID;

			this.selectorData = undefined;
			this.conf = {};
		},

		onCancelWizard: function onCancelWizard(wizard) {
			this.selectorData = undefined;
			this.conf = {};
		},

		selectInputData: function selectInputData() {
			var thos = this;
			thos.wizard.context.postprocessedTable = undefined;
			var iq = this.queries.filter(function (item) {
				return item.$title == thos.inputQuery;
			})[0];
			this.conf.dataID = iq.context.queryResultId;
			this.conf.queryID = iq.$id;
			this.loadData();
		},

		selectDirection: function selectDirection(dir) {
			this.metadataList = [];
			this.getMetadataList(this.wizard.context.postprocessedTable);
		},

		selectMeta: function selectMeta(meta) {
			if (!meta) {
				this.selectorData = undefined;
				return;
			}

			var list = this.conf.decoration.direction == "Rows" ? this.wizard.context.postprocessedTable.body : this.wizard.context.postprocessedTable.header;

			this.selectorData = list.map(function (item) {
				return item.metadata[meta.index].label;
			});
		},

		getMetadataList: function getMetadataList(table) {
			var list = this.conf.decoration.direction == "Rows" ? table.body[0].metadata : table.header[0].metadata;
			this.metadataList = list.map(function (d, i) {
				return { key: d.dimensionLabel, index: i };
			});
		},

		loadData: function loadData() {
			var thos = this;
			if (!this.wizard.context.postprocessedTable) {
				$dps.get("/api/data/process/" + this.conf.dataID).success(function (resp) {
					thos.wizard.context.postprocessedTable = resp.value;
					/// extract object list
					thos.getMetadataList(thos.wizard.context.postprocessedTable);
					thos.apply();
				});
			}
		},

		activate: function activate(wizard) {
			// this.dataset = wizard.context.dataset;
			if (this.conf.dataID) {
				this.loadData();
			}
		},

		apply: function apply() {}
	};
}]);

// set $scope.data
//# sourceMappingURL=../v2.tag-selector/data-selector-options.js.map
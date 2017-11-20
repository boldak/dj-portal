"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/v2.nvd3-widget/nvd3-widget");

require("widgets/v2.nvd3-geochart/adapter");

require("wizard-directives");

var m = angular.module("app.widgets.v2.geochart-decoration", ["app.widgets.v2.nvd3-widget", "app.widgets.v2.geochart-adapter", "wizard-directives", "app.dps"]);

m.factory("GeochartDecoration", ["$http", "$dps", "$q", "parentHolder", "GeochartAdapter", "pageWidgets", "i18n", function ($http, $dps, $q, parentHolder, GeochartAdapter, pageWidgets, i18n) {

	return {
		id: "GeochartDecoration",

		title: "Chart Decoration",

		description: "Setup chart decoration options",

		html: "./widgets/v2.nvd3-geochart/geochart-decoration.html",

		onStartWizard: function onStartWizard(wizard) {
			var _this = this;

			this.wizard = wizard;
			this.conf = {

				direction: wizard.conf.direction ? wizard.conf.direction : "Rows",
				dataIndex: wizard.conf.dataIndex ? wizard.conf.dataIndex : [0],
				bins: this.wizard.conf.bins ? wizard.conf.bins : 2,
				scope: this.wizard.conf.scope ? wizard.conf.scope : "none",

				decoration: wizard.conf.decoration,
				dataID: wizard.conf.dataID,
				queryID: wizard.conf.queryID,
				serieDataId: wizard.conf.serieDataId,
				optionsUrl: "./widgets/v2.nvd3-geochart/options.json",
				dataUrl: "/api/data/process/",
				emitters: wizard.conf.emitters
			};

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
			} else {
				this.inputQuery = undefined;
			}
			this.complete = false;
		},

		onFinishWizard: function onFinishWizard(wizard) {
			this.conf.decoration.setColor = undefined;
			wizard.conf.decoration = this.conf.decoration;
			wizard.conf.serieDataId = this.conf.serieDataId;
			wizard.conf.queryID = this.conf.queryID;
			wizard.conf.dataID = this.conf.dataID;
			wizard.conf.direction = this.conf.direction;
			wizard.conf.dataIndex = this.conf.dataIndex;
			wizard.conf.bins = this.conf.bins;
			wizard.conf.scope = this.conf.scope;
			wizard.conf.emitters = this.conf.emitters;

			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		onCancelWizard: function onCancelWizard(wizard) {
			this.settings = { options: angular.copy(this.options), data: [] };
			this.conf = {};
		},

		reversePalette: function reversePalette() {
			if (this.conf.decoration.color) {
				this.conf.decoration.color = this.conf.decoration.color.reverse();
			}
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

		makeSerieList: function makeSerieList(table) {
			var thos = this;
			var list = this.conf.direction == "Rows" ? table.header : table.body;
			return list.map(function (item, index) {
				return {
					label: item.metadata.map(function (m) {
						return m.label;
					}).join("."),
					index: index,
					enable: thos.conf.dataIndex.indexOf(index) >= 0
				};
			});
		},

		selectSerie: function selectSerie() {

			this.conf.dataIndex = this.indexList.filter(function (item) {
				return item.enable == true;
			}).map(function (item) {
				return item.index;
			});

			if (this.conf.dataIndex.length == 0) {
				this.indexList[0].enable = true;
				this.conf.dataIndex = [0];
			}
		},

		selectAllSeries: function selectAllSeries() {
			this.indexList.forEach(function (item) {
				item.enable = true;
			});
			this.selectSerie();
		},

		inverseSeriesSelection: function inverseSeriesSelection() {
			this.indexList.forEach(function (item) {
				item.enable = !item.enable;
			});
			this.selectSerie();
		},

		clearSeriesSelection: function clearSeriesSelection() {
			this.indexList.forEach(function (item) {
				item.enable = false;
			});
			this.selectSerie();
		},

		fixBoundary: function fixBoundary() {
			if (this.conf.decoration.initialScope == true) {
				this.conf.decoration.boundary = this.chartAPI.chart().boundary();
			} else {
				this.conf.decoration.boundary = {};
			}
		},

		setDirection: function setDirection() {
			this.indexList = this.makeSerieList(this.wizard.context.postprocessedTable);
		},

		loadOptions: function loadOptions() {
			return $http.get(this.conf.optionsUrl);
		},

		loadSeries: function loadSeries() {

			return $dps.post("/api/data/script", {
				data: "source(table:'" + this.conf.dataID + "');" + "geojson(dir:'" + this.conf.direction + "'," + "dataIndex:" + JSON.stringify(this.conf.dataIndex) + "," + "bins:" + this.conf.bins + "," + "scope:'" + this.conf.scope + "'" + ");" + "save()",
				locale: i18n.locale()
			})

			// let r = $dps.post(this.conf.dataUrl,
			// 	{
			// 		"cache": false,
			//               "data_id": this.conf.dataID,

			//               "params": {
			//               	"direction" : this.conf.direction,
			//               	"dataIndex":this.conf.dataIndex,
			//          			"bins":this.conf.bins,
			//          			"scope" : this.conf.scope
			// 		},

			//               "proc_name": "geochart-serie",
			//               "response_type": "data"
			//           }
			// )
			// return r
			;
		},

		loadData: function loadData() {
			var _this = this;

			var thos = this;
			this.complete = false;

			if (!this.wizard.context.postprocessedTable) {
				$dps.get("/api/data/process/" + this.conf.dataID).success(function (resp) {
					thos.wizard.context.postprocessedTable = resp.value;
					thos.indexList = thos.makeSerieList(thos.wizard.context.postprocessedTable);
				});
			} else {
				this.indexList = this.makeSerieList(this.wizard.context.postprocessedTable);
			}

			this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
			this.loadOptions().then(function (options) {
				thos.options = options.data;
				thos.options.locale = i18n.locale();

				if (!thos.conf.decoration) {
					thos.conf.decoration = GeochartAdapter.getDecoration(thos.options);
				}

				thos.conf.decoration.setColor = function (palette) {
					thos.conf.decoration.color = angular.copy(palette);
					thos.conf.bins = thos.conf.decoration.color.length;
				};

				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;

				thos.options.chart.tooltipContent = function (serie, x, y, s) {
					var locale = i18n.locale();
					var name = serie.properties.name[locale] ? serie.properties.name[locale] : serie.properties.name.en;
					var result = "<center><b>" + name + "</center></b>";
					if (serie.properties.values && serie.properties.values[y.index()].c >= 0) {
						result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + y.series[y.index()].key + " : " + serie.properties.values[y.index()].v + "</div>";
					}
					return result;
				}

				//             thos.conf.decoration.title = thos.dataset.dataset.label;
				// thos.conf.decoration.subtitle = thos.dataset.dataset.source;
				// thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
				// thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
				// thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
				;
			});

			this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
			this.loadSeries().then(function (resp) {
				thos.data = resp.data.data.data;
				thos.conf.serieDataId = resp.data.data.data_id;
			});

			$q.all([this.optionsLoaded, this.dataLoaded]).then(function () {
				_this.complete = true;
				thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
				thos.options.chart.width = thos.conf.decoration.width;
				GeochartAdapter.applyDecoration(thos.options, thos.conf.decoration);
				// console.log(thos.options,thos.conf.decoration)
				thos.settings = { options: angular.copy(thos.options), data: angular.copy(thos.data) };
				// thos.apply()
			});
		},

		activate: function activate(wizard) {
			// this.dataset = wizard.context.dataset;
			if (this.conf.dataID) {
				this.loadData();
			}
		},

		apply: function apply() {
			this.activate();
			// this.conf.decoration.width = parentHolder(this.wizard.conf).width;
			// geoChartAdapter.applyDecoration(this.options,this.conf.decoration);
			// this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
		}
	};
}]);
//# sourceMappingURL=../v2.nvd3-geochart/geochart-decoration.js.map
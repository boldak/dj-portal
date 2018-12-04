import htmlWidget from "./html/html.type.js"

import mediatorWidget from "./mediator/mediator.type.js"

import echartWidget from "./echart/echart.type.js"
import BarChartWidget from "./chart-bar/bar-chart.type.js"
import PieChartWidget from "./chart-pie/pie-chart.type.js"
import LineChartWidget from "./chart-line/line-chart.type.js"
import ScatterChartWidget from "./chart-scatter/scatter-chart.type.js"
import BubbleChartWidget from "./chart-bubble/bubble-chart.type.js"
import RadarChartWidget from "./chart-radar/radar-chart.type.js"
import TreeChartWidget from "./chart-tree/tree-chart.type.js"
import TreeMapChartWidget from "./chart-treemap/treemap-chart.type.js"
import SunburstChartWidget from "./chart-sunburst/sunburst-chart.type.js"
import Scatter3dChartWidget from "./chart-scatter3d/scatter3d-chart.type.js"
import GeoChartWidget from "./chart-geo/geo-chart.type.js"



import DataSelectorWidget from "./data-selector/data-selector.type.js"
import DataTableWidget from "./data-table/data-table.type.js"



import AppTopbarWidget from "./app-topbar/app-topbar.type.js"
import AppFooterWidget from "./app-footer/app-footer.type.js"
import AppListWidget from "./app-list/app-list.type.js"

export default {
	'html-widget' : htmlWidget,

	"mediator-widget" : mediatorWidget,
	
	"echart-widget" : echartWidget,
	"bar-chart-widget": BarChartWidget,
	"pie-chart-widget": PieChartWidget,
	"line-chart-widget": LineChartWidget,
	"scatter-chart-widget": ScatterChartWidget,
	"bubble-chart-widget": BubbleChartWidget,
	"radar-chart-widget": RadarChartWidget,
	"tree-chart-widget": TreeChartWidget,
	"treemap-chart-widget": TreeMapChartWidget,
	"sunburst-chart-widget": SunburstChartWidget,
	"scatter3d-chart-widget": Scatter3dChartWidget,
	"geo-chart-widget": GeoChartWidget,

	"data-selector-widget": DataSelectorWidget,
	"data-table-widget": DataTableWidget,


	"app-topbar-widget": AppTopbarWidget,
	"app-footer-widget": AppFooterWidget,
	"app-list-widget": AppListWidget

}	



//       'hello-world' :() => import("./hello-world/HelloWorld.vue"),
//       'html-widget' :() => import("./html/html.vue"),
//       'tree-widget' :() => import("./tree/tree.vue"),
//       'chart-widget' :() => import("./echart/echart.vue"),
//       'editor-widget' :() => import("./ace/ace.vue")
// }
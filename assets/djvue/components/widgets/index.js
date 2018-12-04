
export default {
      'hello-world' :() => import("./hello-world/HelloWorld.vue"),

      'html-widget' :() => import("./html/html.vue"),
      'mediator-widget' : () => import("./mediator/mediator.vue"),
      


      'tree-widget' :() => import("./tree/tree.vue"),
      'echart-widget' :() => import("./echart/echart.vue"),



      'bar-chart-widget': () => import("./chart-bar/bar-chart.vue"),
      'pie-chart-widget': () => import("./chart-pie/pie-chart.vue"),
      'line-chart-widget': () => import("./chart-line/line-chart.vue"),
      'scatter-chart-widget': () => import("./chart-scatter/scatter-chart.vue"),
      'bubble-chart-widget': () => import("./chart-bubble/bubble-chart.vue"),
      'radar-chart-widget': () => import("./chart-radar/radar-chart.vue"),
      'tree-chart-widget': () => import("./chart-tree/tree-chart.vue"),
      'treemap-chart-widget': () => import("./chart-treemap/treemap-chart.vue"),
      'sunburst-chart-widget': () => import("./chart-sunburst/sunburst-chart.vue"),
      'scatter3d-chart-widget': () => import("./chart-scatter3d/scatter3d-chart.vue"),
      'geo-chart-widget': () => import("./chart-geo/geo-chart.vue"),


      'data-selector-widget': () => import("./data-selector/data-selector.vue"),
      'data-table-widget': () => import("./data-table/data-table.vue"),


      'app-topbar-widget': () => import("./app-topbar/app-topbar.vue"),
      'app-footer-widget': () => import("./app-footer/app-footer.vue"),
      'app-list-widget': () => import("./app-list/app-list.vue"),

      
      

      'editor-widget' :() => import("./ace/ace.vue")
}
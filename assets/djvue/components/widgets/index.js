
export default {
      'hello-world' :() => import("./hello-world/HelloWorld.vue"),
      'html-widget' :() => import("./html/html.vue"),
      'tree-widget' :() => import("./tree/tree.vue"),
      'chart-widget' :() => import("./echart/echart.vue"),
      'editor-widget' :() => import("./ace/ace.vue")
}
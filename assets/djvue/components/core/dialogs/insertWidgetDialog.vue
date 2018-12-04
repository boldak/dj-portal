<template>
    <config-dialog 
      icon="mdi-widgets"
      title="Insert widget"
      :config="config"
      :resolve="resolve"
      :reject="reject"
      :editorTree="editorTree"
    ></config-dialog>  
 </template> 




<script>
import widgetTypesPanel from "./widgetTypesPanel.vue";
import mixin from "djvue/mixins/core/configDialog.mixin.js"


export default {
	
  name: "insert-widget-dialog",
  
  components:{ "config-dialog": Vue.createConfigDialog({"widget-types-panel": widgetTypesPanel})},

  // mixins:[mixin],

  methods:{
      resolve(){
       if(this.widgetConfig) this.$emit('submit', this.widgetConfig)
        this.reject()  
      },

      reject(){
        this.$emit('submit', null)
      }  
    },
  
	props:["config"],

  created(){
    this.setWidgetConfig = (widgetConfig, force) => {
      this.widgetConfig = widgetConfig
      if (force) this.resolve();
    }

    this.$eventHub.on("widget-config-dlg-select", this.setWidgetConfig)
    // this.$eventHub.on("widget-config-dlg-select-force", this.setWidgetConfig)
  },

  destroyed(){
    this.$eventHub.off("widget-config-dlg-select", this.setWidgetConfig)
    // this.$eventHub.off("widget-config-dlg-select-force", this.setWidgetConfig)
  },

	
  data () {
      return {
        setWidgetConfig:null,
        widgetConfig: null,
        editorTree:[
          {
            name: "Widget categories",
            children: [
              {
                name: "Application level",
                editor:"widget-types-panel",
                items:[
                  "app-topbar-widget",
                  "app-footer-widget", 
                  "html-widget:banner", 
                  "app-list-widget"
                ]
              },
              {
                name: "General info content",
                editor:"widget-types-panel",
                items:["html-widget", "html-widget:title", "html-widget:banner","html-widget:paragraph"]
              },
              { name: "Data",
                editor:"widget-types-panel",
                items:[
                  
                  "data-selector-widget", 
                  "data-table-widget:Data Table"

                ]
              },
              { name: "Charts",
                editor:"widget-types-panel",
                items:[
                  
                  "bar-chart-widget:Horizontal Bars", 
                  "bar-chart-widget:Vertical Bars",
                  "bar-chart-widget:Polar Bars",
                  "bar-chart-widget:Radial Bars",


                  "bar-chart-widget:Stacked Horizontal Bars", 
                  "bar-chart-widget:Stacked Vertical Bars",
                  "bar-chart-widget:Stacked Polar Bars",
                  "bar-chart-widget:Stacked Radial Bars",
                  
                  
                  'pie-chart-widget:Pie',
                  'pie-chart-widget:Doughnut',
                  'pie-chart-widget:Doughnut Rose',


                  'line-chart-widget:Line',
                  'line-chart-widget:Area',
                  'line-chart-widget:Stacked Line',
                  'line-chart-widget:Stacked Area',

                  'scatter-chart-widget:Classic Scatterplot',
                  'scatter-chart-widget:Rich Scatterplot',

                  'bubble-chart-widget:Bubbles',

                  'radar-chart-widget:Radar'
                  



                ]
              },
              
              { name: "Tree Charts",
                editor:"widget-types-panel",
                items:[
                  "tree-chart-widget:Left Right Tree",
                  "tree-chart-widget:Top Bottom Tree",
                  "tree-chart-widget:Radial Tree",
                  "treemap-chart-widget",
                  "sunburst-chart-widget"
                ]
              },

              { name: "3D Charts",
                editor:"widget-types-panel",
                items:[
                  
                  "scatter3d-chart-widget"

                ]
              },

              { name: "Maps",
                editor:"widget-types-panel",
                items:[
                  
                  "geo-chart-widget:World",
                  "geo-chart-widget:Ukraine"

                ]
              },

              { name: "Page Management",
                editor:"widget-types-panel",
                items:["mediator-widget"]
              }
            ]
          }
        ]    
      }
    }
}

</script>
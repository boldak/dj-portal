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
    this.setWidgetConfig = widgetConfig => {
      this.widgetConfig = widgetConfig
    }

    this.$eventHub.on("widget-config-dlg-select", this.setWidgetConfig)
  },

  destroyed(){
    this.$eventHub.off("widget-config-dlg-select", this.setWidgetConfig)
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
                name: "General info content",
                editor:"widget-types-panel",
                items:["html-widget", "html-widget:title", "html-widget:banner","html-widget:paragraph"]
              },
              { name: "Data management",
                editor:"widget-types-panel"
              },
              { name: "Interactive reports",
                editor:"widget-types-panel"
              },
              { name: "Page Management",
                editor:"widget-types-panel"
              }
            ]
          }
        ]    
      }
    }
}

</script>
<template>
    <config-dialog 
      :icon="config.icon"
      :title="`mediator-widget: ${config.id} ${config.name}`"
      :resolve="resolve"
      :reject="reject"
      :config="config"
      :editorTree="editorTree"
    ></config-dialog>  
 </template> 




<script>
import component from "./name-editor.vue";
import mixin from "djvue/mixins/core/configDialog.mixin.js"



export default {
	
  name: "MediatorConfig",
  
  components:{ "config-dialog": Vue.createConfigDialog({"name-editor": component})},

  mixins:[mixin],
  
	props:["config"],

	
  data () {
      return {
        editorTree:[
          {
            name: "Configuration",
            children: [
              {
                name: 'Widget',
                editor:"name-editor"
              }
            ]
          }
        ],
      }
    }
}

</script>
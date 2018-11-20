<template>
    <div v-html="html"></div>
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import HtmlConfig from "./html-config.vue"
  import snippets from "./snippets.js"


  Vue.prototype.$dialog.component('HtmlConfig', HtmlConfig)


  let compile = (template,context) => {
     _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    let result = _.template(template)(context)

    _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    return result
    
  }



 export default  {
    
    name:"html-widget",

    icon: "mdi-language-html5",

    getInitialConfig( snippet ){
        snippet = snippet || "default"
        let res = snippets[snippet] || snippets["default"]
        res.id = Vue.prototype.$djvue.randomName()
        return res
    },
    
    mixins:[djvueMixin],

    methods:{

      onWidgetUpdateState ({data, options}) {
        this.template = data;
        this.html = compile(this.template, this);
      },

      onWidgetConfigure (widgetConfig) {
       return this.$dialog.showAndWait(HtmlConfig, {config:widgetConfig})
      },

      onWidgetError (error) {
        this.html = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      },

      onWidgetDelete () {
        console.log("OnWidgetDelete")
      }

    },

    
    props:["config"],

    created(){
      this.template = this.config.data.embedded || "";
      this.html = compile(this.template, this);
      
    },
    
    data () {
      return {
        html:'',
        template:''
      }
    }
  }

</script>	
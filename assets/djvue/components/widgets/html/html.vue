<template>
 
    <div v-html="html"></div>

</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
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
    
    mixins:[djvueMixin, listenerMixin],

    methods:{

      onUpdateState ({data, options}) {
        console.log("onUpdateState", data, JSON.stringify(options))
        this.template = data;
      },

      onReconfigure (widgetConfig) {
       return this.$dialog.showAndWait(HtmlConfig, {config:widgetConfig})
      },

      onError (error) {
        this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      },

      onDataSelect (emitter, data) {
        console.log("onDataSelect", this.config.id, data)
        setTimeout(()=> {
          this.template = data
        },1000)
        this.emit("data-select", this, data+" redirected")
      }

    },

    
    props:["config"],

    computed:{
      html(){

         try {
          return compile(this.template, this);  
        } catch(e) {
          this.$djvue.warning({
                      type:"error",
                      title:"Cannot compile template",
                      text:e.toString()
                    })
        }
      }

    },

    created(){ this.template = this.config.data.embedded || ""; },

    mounted(){ this.$emit("init") },
    
    data: () =>({
      template:""
    })

  }

</script>	
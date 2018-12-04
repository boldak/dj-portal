<template>
  <v-footer
    height="auto"
    color="blue-grey"
  >
    <v-layout
      justify-center
      row
      wrap
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        flat
        round
      >
        {{ link }}
      </v-btn>
      <v-flex
        blue-grey
        py-3
        text-xs-center
        white--text
        xs12
      >
        &copy;2018 — <strong>Djvue</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  // import HtmlConfig from "./html-config.vue"
  // import snippets from "./snippets.js"


  // Vue.prototype.$dialog.component('HtmlConfig', HtmlConfig)


  // let compile = (template,context) => {
  //    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

  //   let result = _.template(template)(context)

  //   _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

  //   return result
    
  // }



 export default  {
    
    name:"app-footer-widget",

    icon: "mdi-page-layout-footer",

    mixins:[djvueMixin, listenerMixin],

    methods:{
      //   loadAppList() {
      //   this.$portal
      //     .get('api/app/get-list')
      //     .then(response => {
      //       console.log(response)
      //     })
      // },

      // fullReload(){
      //   this.$djvue.fullReload()
      // },

      // login(){
      //   this.$djvue.login()
      // }

      // onUpdate ({data, options}) {
      //   this.template = data;
      // },

      // onReconfigure (widgetConfig) {
      //  return this.$dialog.showAndWait(HtmlConfig, {config:widgetConfig})
      // },

      // onError (error) {
      //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      // },

      // onDataSelect (emitter, data) {
      //   // console.log(JSON.stringify(data))
      //   this.template = data.filter(item => item.selected).map(item => item.entity).join(", ")
      //   // this.emit("data-select", this, data+" redirected")
      // }

    },

    
    props:["config"],

    computed:{
      // html(){

      //    try {
      //     return compile(this.template, this);  
      //   } catch(e) {
      //     this.$djvue.warning({
      //                 type:"error",
      //                 title:"Cannot compile template",
      //                 text:e.toString()
      //               })
      //   }
      // }

    },

    created(){ 
      console.log(JSON.stringify(this.app, null, "\t"))
      // this.template = this.config.data.embedded || ""; 
    },

    mounted(){ this.$emit("init") },
    
    data: () =>({
      links: [
        'Home',
        'About Us',
        'Team',
        'Services',
        'Blog',
        'Contact Us'
      ]
      // template:""
    })

  }

</script> 
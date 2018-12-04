<template>
 
   <v-toolbar dark dence color="blue-grey" style="padding-top: 1em;">
       <v-avatar flat>
        <v-img :src="app.icon" small>
       </v-avatar> 
       <v-toolbar-title class="white--text">{{app.name}}</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
         v-for="page in app.pages"
        :key="page.title"
        color="white"
        flat
        round
      >
         <router-link  :to="`/${page.id || ''}`" class="white--text" style="text-decoration: none; padding: 0 0.2em;">
          {{page.title}}
        </router-link>
      </v-btn>

       <!--  <v-toolbar-title  v-for="page in app.pages">
         <router-link  :to="`/${page.id || ''}`" class="white--text" style="text-decoration: none; padding: 0 0.2em;">
          {{page.title}}
        </router-link>
       </v-toolbar-title> -->
        <v-btn icon v-on:click="loadAppList()">
          <v-icon>apps</v-icon>
        </v-btn>

        <v-btn icon v-on:click="fullReload()">
          <v-icon>refresh</v-icon>
        </v-btn>

        <v-btn icon v-if="!app.user.isLoggedIn" v-on:click="login()">
          <v-icon>mdi-google-plus</v-icon>
        </v-btn>

        <v-btn icon v-if="app.user.isLoggedIn">
          <v-avatar size="32">
            <img v-bind:src="app.user.photo" alt="avatar">
          </v-avatar>
        </v-btn>
      </v-toolbar>

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
    
    name:"app-topbar-widget",

    icon: "mdi-page-layout-header",

    mixins:[djvueMixin, listenerMixin],

    methods:{
        loadAppList() {
        this.$portal
          .get('api/app/get-list')
          .then(response => {
            console.log(response)
          })
      },

      fullReload(){
        this.$djvue.fullReload()
      },

      login(){
        this.$djvue.login()
      }

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
      // template:""
    })

  }

</script> 
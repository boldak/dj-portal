<template>
            <v-card  v-bind:class="{widget:!isProductionMode}" ma-1 flat style="background:transparent;">
              <v-toolbar dark card height="36px" :color="(!hasError)?'blue-grey':'error'" v-if="!isProductionMode">
                                   
                  <v-tooltip top>
                    <v-avatar class="handle" size="32" tile slot="activator">
                        <v-icon large>{{config.icon}}</v-icon>
                    </v-avatar>
                     <span>{{config.type}}</span>
                  </v-tooltip>

                  <v-toolbar-title class="body-2 white--text">{{config.id}} "{{config.name}}"</v-toolbar-title>
                
                  <v-spacer></v-spacer>
                 
                   <v-menu bottom left>
                      <v-btn 
                        slot="activator"
                        dark
                        icon
                      >
                        <v-icon>more_vert</v-icon>
                      </v-btn>

                      <v-list>
                        
                        <v-list-tile @click="collapsed = !collapsed">
                          <v-list-tile-title>{{(collapsed) ? "Expand" : "Collapse"}}</v-list-tile-title>
                        </v-list-tile>
                       
                       
                        <v-list-tile  @click.stop="configure()">
                          <v-list-tile-title>Edit options...</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile @click="cloneWidget()">
                        <v-list-tile-title>Clone</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile @click="deleteWidget()">
                          <v-list-tile-title>Delete</v-list-tile-title>
                        </v-list-tile>
                        

                      </v-list>
                    </v-menu>
               
              </v-toolbar>

             <!--  <v-divider v-if="!isProductionMode"></v-divider>
                <h4>this.config</h4>
                <pre>{{JSON.stringify(config,null,"\t")}}</pre>
                <h4>global config</h4>
                <pre>{{JSON.stringify(globalConfig,null,"\t")}}</pre>
                <pre>{{(!collapsed && !isProductionMode) || (config.options.widget.visible && isProductionMode)}}</pre>
                
              <v-divider v-if="!isProductionMode"></v-divider> -->
              <v-card-text pa-0 style="padding:0;" v-show="options.widget.visible">
                <component v-bind:is="config.type" ref="instance" :config="config" @init="onInitChild"></component>
              </v-card-text>

             </v-card>
  
</template>  
<script>

 import components from "djvue/components/widgets/index.js"
 import djvueMixin from "djvue/mixins/core/djvue.mixin.js"
 import widgetMixin from "djvue/mixins/core/widget.mixin.js";
 

 export default  {

    mixins:[djvueMixin, widgetMixin],

    name:"dj-widget",
    
    props:["type","holder"],
    
    components,
    
    data: () => {
      return {
        collapsed:false,
        hasError:false
      }
    },

    computed:{
      globalConfig(){
        // console.log(JSON.stringify(this.app.currentPage.holders[this.holder], null, "\t"))
        return _.find(this.app.currentPage.holders[this.holder].widgets,(item) => item.id == this.config.id)
      }
    },

    methods:
      {
        
        configure(){
          this.$eventHub.emit("widget-reconfigure", this)
        },        

        cloneWidget(){
          this.$eventHub.emit("widget-clone", this)
        },

        deleteWidget(){
          this.$eventHub.emit("widget-delete", this)
        }

      }  
    
  }
</script>  

<style>
  .widget {
    border:1px solid #bbb !important;
  }
  .handle {
    cursor: pointer;
  }

</style>
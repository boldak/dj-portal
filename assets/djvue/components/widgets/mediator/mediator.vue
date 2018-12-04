<template>
   <v-container fluid class="pa-1" v-show="!isProductionMode">

    <v-layout wrap>
      <v-flex xs12>
        
        <editor       :content="config.data.script" 
                      lang="javascript" 
                      :sync="true"
                      @change="onUpdateSource"
                      style="border:1px solid #999"
        > 
        </editor>

      </v-flex>
    </v-layout>
    <v-layout>
        <v-spacer></v-spacer>
        <v-btn dark color="blue-grey" v-on:click="_runScript()">
              Run
        </v-btn>  
     </v-layout>  
   
  </v-container>  
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  import editor from 'djvue/components/core/ext/ace-editor.vue';
  import MediatorConfig from "./mediator-config.vue"
  
  Vue.prototype.$dialog.component('MediatorConfig', MediatorConfig)
  
 export default  {
    
    name:"mediator-widget",

    icon: "mdi-language-javascript",

    components:{editor},

    mixins:[djvueMixin, listenerMixin],

    methods:{

      onReconfigure (widgetConfig) {
       return this.$dialog.showAndWait(MediatorConfig, {config:widgetConfig})
      },

      onUpdateSource (value) {
          this.config.data.script = value
      },

      onPageStart () {
       this._runScript();
      },

      _runScript () {

        this.api = {
          selectWidgets: (filter) => {
            filter = filter || (item => true);
            if(!_.isFunction(filter)){
              let identifiers = (_.isArray(filter)) ? filter : [filter];
              filter = (item) => _.find(identifiers, i => item.config.id == i)  
            }

            let res = this.$djvue.selectWidgets( this.$root, item => item.config && filter(item)); 
            
            return (res.length == 0) 
                      ? undefined
                      : (res.length == 1)
                        ? res[0]
                        : res
          },
          on:this.on,
          off: this.off,
          emit: (event,data) => {this.emit(event,this,data)}
        }

        try {

          eval(
            `
            (function() { 
              let selectWidgets = this.api.selectWidgets;
              let on = this.api.on;
              let off = this.api.off;
              let emit = this.api.emit;
              ${this.config.data.script} }
            )

            `
          ).apply(this)  

        } catch(e) {
          this.$djvue.warning({
                    type:"error",
                    title:`Error mediator ${this.config.id}:${this.config.name} script error`,
                    text:e.toString()
                  })

        }
      }

    },

    
    props:["config"],

  
    mounted(){
       this.$emit("init")
    }

  }

</script>	
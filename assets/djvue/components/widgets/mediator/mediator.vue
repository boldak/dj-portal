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
  
  
 export default  {
    
    name:"mediator-widget",

    icon: "mdi-language-javascript",

    components:{editor},

    getInitialConfig( snippet ){

        let res = {
            type:"mediator-widget", 
            name:"noname",
            icon:"mdi-language-javascript",
            options: { widget:{
                visible:true
              }
            },
            data:{
              script:`// type script here
                alert("Djvue app run in "+this.app.mode+" mode")
              `
            }
        }
        return res
    },
    
    mixins:[djvueMixin, listenerMixin],


    methods:{

      onUpdateSource (value) {
          this.config.data.script = value
      },

      onPageStart () {
        console.log("Mediator on page start")
        this._runScript();
      },

      _runScript () {

        try {
          eval(
            `
            (function() {
                  ${this.config.data.script}
                }).apply(this)
            `
          )      
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
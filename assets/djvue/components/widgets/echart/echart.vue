<template>
    <div  class="chart" :style="style"></div>
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  
   
 export default  {
    
    name:"barchart-widget",

    icon: "mdi-chart-bar",

    mixins:[djvueMixin, listenerMixin],
    
    computed:{
      style(){
        return {
          height:(this.height || 250)+"px"
        }
      }
    },

    methods:{

      onUpdate ({data, options}) {
        const temp = options;
        temp.dataset = data.dataset;
        this.options = temp;
        this.height = temp.height;
      }

      // onReconfigure (widgetConfig) {
      //  return this.$dialog.showAndWait(HtmlConfig, {config:widgetConfig})
      // },

      // onError (error) {
      //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      // },

      // onDataSelect (emitter, data) {
      //   console.log("onDataSelect", this.config.id, data)
      //   setTimeout(()=> {
      //     this.template = data
      //   },1000)
      //   this.emit("data-select", this, data+" redirected")
      // }

    },

    
    props:["config"],

    watch:{
      options:{
        handler: function(value){
          this.height = value.height;
          this.chart.setOption(value)
        },
        deep:true
      },
      
      height(value){
        this.$nextTick(() => {
            this.chart.resize({
              height:value
            })  
          })
      }
    },

    created(){ 
      const temp = this.config.options;
      temp.dataset = this.config.data.embedded.dataset;
      this.options = temp;
    },

    mounted(){ 
      
      this.chart = echarts.init(this.$el)
      this.resizeHandler = () => this.chart.resize();

        if ( window.attachEvent ) {
            window.attachEvent('onresize', this.resizeHandler);
        } else {
            window.addEventListener('resize', this.resizeHandler);
        }
     
      this.$emit("init") 
    },
    
    beforeDestroy(){
      if ( window.attachEvent ) {
            window.detachEvent('onresize', this.resizeHandler);
        } else {
            window.removeEventListener('resize', this.resizeHandler, false);
        }
    },


    data: () =>({
      options:{},
      height:250,
      chart:null,
      resizeHandler:null
    })
  }

</script> 

<style scoped>
  .chart {
    width: 100%;
  }
</style>
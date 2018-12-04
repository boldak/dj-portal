<template>
    <div  class="chart" :style="style"></div>
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  import getGeoJson from "./maps.js";
  
   
 export default  {
    
    name:"geo-chart-widget",

    icon: "mdi-map",

    mixins:[djvueMixin, listenerMixin],
    
    computed:{
      style(){
        return {
          height:(this.height || 600)+"px"
        }
      }
    },

    methods:{

      onUpdate ({data, options}) {
        const temp = options;
        // temp.dataset = data.dataset;
        this.options = temp;
        this.height = temp.height;
      },

      
      onLegendSelect(event) {
        
        let newOptions = this.config.options
        let serie = _.find(newOptions.series, s => s.name == event.name)
        if (serie ){
          newOptions.visualMap.min = _.min(serie.data.map(item => item.value))
          newOptions.visualMap.max = _.max(serie.data.map(item => item.value))
          newOptions.visualMap.range = [newOptions.visualMap.min, newOptions.visualMap.max]
          
          this.$nextTick(()=>{
              this.options = newOptions
              this.chart.setOption(newOptions)
          }) 
        } 
      
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
      
      if(!echarts.getMap(this.config.options.map.name)){
          let map = getGeoJson(this.config.options.map.scope, this.config.options.map.locale);
          echarts.registerMap(this.config.options.map.name, map)
      }
      
      this.options = this.config.options

    },

    mounted(){ 
      let vm = this;
      this.chart = echarts.init(this.$el)
      this.resizeHandler = () => this.chart.resize();

        if ( window.attachEvent ) {
            window.attachEvent('onresize', this.resizeHandler);
        } else {
            window.addEventListener('resize', this.resizeHandler);
        }
      
      this.onLegendSelect({name:this.config.options.series[0].name})
      
      this.chart.on("legendselectchanged", this.onLegendSelect)
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
      height:600,
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
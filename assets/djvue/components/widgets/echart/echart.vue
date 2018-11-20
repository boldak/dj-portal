<template>
    <div>
     
    
     <div class="chart" v-echarts="options"></div>



     <v-dialog
        v-model="dialog"
        scrollable
        max-width="400"
        height="400"        
      >

       


        <v-card> 
          <v-card-title  primary-title class="headline" >Chart Configuration</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
                <v-layout row>
                  <v-flex xs6>
                    <v-treeview
                        v-model="tree"
                        
                        :items="configTree"
                        activatable
                        item-key="name"
                        open-on-click
                      >
                        <template slot="prepend" slot-scope="{ item, open, leaf }">
                          <v-icon v-if="!item.file">
                            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                          </v-icon>
                          <v-icon v-else>
                            {{ files[item.file] }}
                          </v-icon>
                        </template>
                      </v-treeview>
                  </v-flex>
                  <v-flex xs6>
                    Editor
                  </v-flex>    
                </v-layout>  
          </v-card-text>        
         
           <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="rejectConfig"
            >
              Disagree
            </v-btn>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="resolveConfig"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>  
</template>

<script>

  import directive from "djvue/components/core/ext/echarts-directive.js"
  import mixin from "djvue/mixins/core/widget.mixin.js"


   export default {
    
    name: 'chart-widget',

    mixins:[mixin],

    directives: {
      'echarts': directive
    },
    
    props: ["config"],



    methods:{

      configLoaded({data,options}){
        this.config.options.dataset = data
        this.options = this.config.options
      },
      
     configure(widgetConfig){
      this.newConfig = widgetConfig;
       return this.openDialog()
     }, 


      openDialog(){
       let vm = this 
       this.configTree = this.$djvue.toTree(this.newConfig)
       return new Promise((resolve,reject) => {
          vm.resolve = resolve;
          vm.reject = reject;
          vm.dialog = true
       })
      },

      resolveConfig(){
        this.dialog = false
        this.newConfig.name="ECHART";
        this.newConfig.options =
              {
            tooltip : {
                trigger: 'axis'
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Num',
                    type:'line',
                    // areaStyle: {normal: {}},
                    data: [52, 54, 60, 61, 65, 62, 80, 85, 90, 99, 40, 30, 20, 10, 0]
                },
                {
                    name:'Bar',
                    type:'bar',
                    // areaStyle: {normal: {}},
                    data: [52, 54, 60, 61, 65, 62, 80, 85, 90, 99, 40, 30, 20, 10, 0]
                },

            ]
        }
 
        this.resolve(this.$djvue.extend({},this.newConfig))
      },

      rejectConfig(){
        this.dialog = false
        this.reject()
      }

    },

    


    // mounted: function () {
    //     const _this = this;

    //     // simulate realtime data change in line chart
    //     setInterval(function () {
    //         _this.update();
    //     }, 1000);

    //     // // you can access an Echarts instance at the `mounted` stage of the parent VM,
    //     // // by accessing the `echartsInstance` property of the element
    //     // // that v-echarts directive is bind with
    //     // const barChartElement = document.querySelector('#this-is-bar-chart');
    //     // console.log(barChartElement.echartsInstance);
    // },

    // methods:{
    //   update(){
    //     const _this = this;
    //         // creat a fresh object with properties from the original object
    //         const newOptions = Object.assign({}, _this.options);

    //         // modify properties of the new object
    //         // update xAxis data
    //         newOptions.xAxis[0].data.push(
    //             _this.options.xAxis[0].data[_this.options.xAxis[0].data.length - 1] + 1
    //         );
    //         newOptions.xAxis[0].data.shift();

    //         // update series data
    //         newOptions.series[0].data.push(Math.round(Math.random() * 100));
    //         newOptions.series[0].data.shift();

    //         // assign the new object to variable `lineChartOptions`, Vue.js will detect the change
    //         // and Echarts will update the chart properly
    //         _this.options = newOptions;
    //   }
    // },

    data: () => { return {
      
      dialog:false,

      resolve:{},
      reject:{},

      newConfig:{},

      tree:[],

      configTree:[],

      options:{} 

//         {
//     dataset: {
//         source: [
//             [12, 323, 11.2],
//             [23, 167, 8.3],
//             [81, 284, 12],
//             [91, 413, 4.1],
//             [13, 287, 13.5]
//         ]
//     },
//     // Use visualMap to perform visual encoding.
//     visualMap: {
//         show: false,
//         dimension: 2, // Encode the third column.
//         min: 2, // Min value is required in visualMap component.
//         max: 15, // Max value is required in visualMap component.
//         inRange: {
//             // The range of bubble size, from 5 pixel to 60 pixel.
//             symbolSize: [5, 60]
//         }
//     },
//     xAxis: {},
//     yAxis: {},
//     series: {
//         type: 'scatter'
//     }
// }



      // {
      //       tooltip : {
      //           trigger: 'axis'
      //       },
      //       xAxis : [
      //           {
      //               type : 'category',
      //               boundaryGap : true,
      //               data : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      //           }
      //       ],
      //       yAxis : [
      //           {
      //               type : 'value'
      //           }
      //       ],
      //       series : [
      //           {
      //               name:'Num',
      //               type:'line',
      //               // areaStyle: {normal: {}},
      //               data: [52, 54, 60, 61, 65, 62, 80, 85, 90, 99, 40, 30, 20, 10, 0]
      //           },
      //           {
      //               name:'Bar',
      //               type:'bar',
      //               // areaStyle: {normal: {}},
      //               data: [52, 54, 60, 61, 65, 62, 80, 85, 90, 99, 40, 30, 20, 10, 0]
      //           },

      //       ]
      //   }
      // barChartOptions: {
      //       tooltip: {},
      //       xAxis: {
      //           data: ['A', 'B', 'C', 'D', 'E']
      //       },
      //       yAxis: {},
      //       series: [
      //           {
      //               name: 'Num',
      //               type: 'bar',
      //               data: [5, 20, 36, 10, 10]
      //           }
      //       ]
      //   }
      }
    }      

  }  
    
     
 

</script>

<style scoped>
  .chart {
    width: 100%;
    height: 400px;
  }
</style>
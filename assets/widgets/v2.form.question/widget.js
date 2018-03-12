

import angular from 'angular';
import 'angular-ui-tree';
import "custom-react-directives";
import "d3";
import "angular-oclazyload";
import "tinycolor";
import "./js/config/index.js"
import "./js/utility/index.js"




let m = angular.module('app.widgets.v2.form.question', [
  'app.dps','ui.tree',"custom-react-directives","oc.lazyLoad", 
  "v2.question.factory",
  "v2.question.utility"
  // ,
  // 'ngSanitize'
])


m.controller('FormQuestionController', function(
  $scope,
  APIProvider,
  dialog,
  app,
  i18n,
  $dps,
  EventEmitter,
  $error,
  log,
  pageSubscriptions,
  $q,
  pageWidgets,
  metadataDialog,
  config,
  instanceNameToScope,
  $sce,
  htmlEditor,
  randomID,
  d3,
  $ocLazyLoad,
  user,
  globalConfig,
  APIUser,
  questionFactory,
  listEditor,
  colorUtility,
  questionTypes
  
) {


// Load css
$ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 


angular.extend($scope, {
  markModified : app.markModified
})

let listEditorTools = listEditor($scope)


angular.extend($scope,{

    colorUtility: colorUtility($scope),

    treeOptions: listEditorTools.treeOptions(),

    questionTypes:questionTypes,

    _click: null,
    delete:(object,index) => { listEditorTools.delete(object,index) },
    add: (object) => { listEditorTools.add(object) },
    cselect: (value) => { listEditorTools.cselect(value) },
   
    alternatives : [],
    
    entities : [],
    
    properties : [],
    
    factors : [],
    
    effects : [],
    
    textFields : {
      alternative: "",
      entity:"",
      object: "",
      property:"",
      effect:"",
      factor:""
    },

    hidden: true,

    setOpacity: (value) => { $scope.config.state.options.colors.opacity = value },

    setPallete: (pallete) => { $scope.config.state.options.colors.pallete = pallete },

    reversePallete:() => {
      $scope.config.state.options.colors.pallete = $scope.config.state.options.colors.pallete.reverse()
    }  

})

$scope.widgetPanel.allowConfiguring = undefined;
$scope.widgetPanel.allowCloning = undefined;

// $scope.openFile = () => {
//   dialog({
//     title:"",
//     fields:{
//       file:{
//         type:"file",
//         title:"file"
//       }
//     }
//   }).then((form) => {
//     $scope.transport.loadLocalFile(form.fields.file.value)
//       .then((res => {
//         console.log(res)
//       }))
//   })
// }






  
//  let prefix = "" 
// // default question configuration
// $scope.defaultQuestionConfig = {
//   text: {
//     type:{value:"text", title:"Text"}, 
//     widget:{
//       css:"fa fa-align-left", 
//       view:prefix+"text.view.html", 
//       options:prefix+"text.options.html"
//     },
//     options:{
//       required: false,
//       title:"", 
//       note:""
//     }
//   },

//   date: {
//       type:{value:"date", title:"Date"}, 
//       widget:{
//         css:"fa fa-calendar", 
//         view:prefix+"date.view.html", 
//         options:prefix+"date.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         range:{
//           min:"2013-01-01",
//           max:"2018-01-01"
//         }  
//       }
//   },

//   month:{
//       type:{value:"month", title:"Month"}, 
//       widget:{
//         css:"fa fa-calendar",
//         view:prefix+"month.view.html", 
//         options:prefix+"month.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         range:{
//           min:"2013-01-01",
//           max:"2018-01-01"
//         }  
//       }
//   },

//   time:{
//       type:{value:"time", title:"Time"}, 
//       widget:{
//         css:"fa fa-calendar",
//         view:prefix+"time.view.html", 
//         options:prefix+"time.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         range:{
//           min:"2013-01-01",
//           max:"2018-01-01"
//         }  
//       }
//   },

//   datetime:{
//       type:{value:"datetime", title:"Date & Time"}, 
//       widget:{
//         css:"fa fa-calendar",
//         view:prefix+"datetime.view.html", 
//         options:prefix+"datetime.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         range:{
//           min:"2013-01-01",
//           max:"2018-01-01"
//         }  
//       }
//   },

//   radio:{
//       type:{value:"radio", title:"Оne of many"}, 
//       widget:{
//         css:"fa fa-stop-circle", 
//         view:prefix+"radio.view.html", 
//         options:prefix+"radio.options.html"
//       },
//       options:{
//         required: false,
//         addEnabled: false,
//         showUserInfo: true,
//         title:"", 
//         note:"",
//         nominals:{}
//       },
//       callback:{

//         configure: () => {
          
//           // prepare question config before setting $scope.qtype variable 
//           // res - next config, $scope.config - previus config
//           let res = $scope.defaultQuestionConfig.radio;
//           if(angular.isUndefined($scope.config)) return res;

//           res = defaultConfigure(res);
//           if(["dropdown","check"].indexOf($scope.config.type.value) < 0) return res;
          
//           res.options.nominals = {};
          
//           for(let item of $scope.alternatives){
//             res.options.nominals[item.id] = {title:item.title, user:item.user}; 
//           }
          
//           if ($scope.config.type.value == "check"){
//             res.options.addEnabled = $scope.config.options.addEnabled;
//             res.options.showUserInfo = $scope.config.options.showUserInfo;
//           }
//           $scope.markModified();  
//           return res;
//         },
        
//         prepare: () => {

//           // prepare helped data structures
//           $scope.alternatives = _.toPairs($scope.config.options.nominals)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })
//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type:"radio",
//             value:[]
//           }
//         },

//         setValue: (value) => {
//           // if(!globalConfig.designMode) app.markModified();
//           $scope.answer.valid = (angular.isDefined($scope.answer.value[0]))
//         },

//         applyAnswer: () => {

//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           $scope.config.options.nominals = {};
//           for(let item of $scope.alternatives){
//             $scope.config.options.nominals[item.id] = {title: item.title, user:item.user}; 
//           }
//         }
//       }
//   },

//   check:{
//       type:{value:"check", title:"Many of many"}, 
//       widget:{
//         css:"fa fa-check-square", 
//         view:prefix+"check.view.html", 
//         options:prefix+"check.options.html"
//       },
//       options:{
//         required: false,
//         addEnabled: false,
//         showUserInfo: true,
//         title:"", 
//         note:"",
//         nominals:{}
//       },
//       callback:{
      
//         configure: () => {
          
//           // prepare question config before setting $scope.qtype variable 
//           // res - next config, $scope.config - previus config
//           let res = $scope.defaultQuestionConfig.check;
//           if(angular.isUndefined($scope.config)) return res;

//           res = defaultConfigure(res);
//           if(["dropdown","radio"].indexOf($scope.config.type.value) < 0) return res;
          
//           res.options.nominals = {};
          
//           for(let item of $scope.alternatives){
//             res.options.nominals[item.id] = {title:item.title, user:item.user}; 
//           }
          
//           if ($scope.config.type.value == "radio"){
//             res.options.addEnabled = $scope.config.options.addEnabled;
//             res.options.showUserInfo = $scope.config.options.showUserInfo;
//           }

//           return res;
//         },
        
//         prepare: () => {

//           // prepare helped data structures
//           $scope.alternatives = _.toPairs($scope.config.options.nominals)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })
//           $scope.checkboxes = {};
//           for(let item of $scope.alternatives){
//            $scope.checkboxes[item.id] = false; 
//           }   

//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type: "check",
//             value: []
//           }
//         },

//         setValue: (value) => {
//           // if(!globalConfig.designMode) app.markModified();
          
//           $scope.answer.value = _.toPairs($scope.checkboxes)
//                                   .filter(item => item[1])
//                                   .map(item => item[0]);
//           $scope.answer.valid = $scope.answer.value.length > 0;
//           // $scope.answerCompleted = $scope.answer.value.length > 0;                         
//         },

//         applyAnswer: () => {
//           $scope.checkboxes = {};
//           for(let item of $scope.alternatives){
//            $scope.checkboxes[item.id] = $scope.answer.value.indexOf(item.id) >= 0; 
//           }
//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           $scope.config.options.nominals = {};
//           for(let item of $scope.alternatives){
//             $scope.config.options.nominals[item.id] = {title: item.title, user:item.user}; 
//           }
//         }
//       }
//     },

//   dropdown:{
//       type:{value:"dropdown", title:"Dropdown"}, 
//       widget:{
//         css:"fa fa-list", 
//         view:prefix+"dropdown.view.html", 
//         options:prefix+"dropdown.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         nominals:{}
//       },
//       callback:{

//         configure: () => {
          
//           // prepare question config before setting $scope.qtype variable 
//           // res - next config, $scope.config - previus config
//           let res = $scope.defaultQuestionConfig.dropdown;
//           if(angular.isUndefined($scope.config)) return res;

//           res = defaultConfigure(res);
//           if(["radio","check"].indexOf($scope.config.type.value) < 0) return res;
          
//           res.options.nominals = {};
          
//           for(let item of $scope.alternatives){
//             res.options.nominals[item.id] = {title:item.title}; 
//           }
          
          
//           $scope.markModified();  
//           return res;
//         },
        
//         prepare: () => {

//           // prepare helped data structures
//           $scope.alternatives = _.toPairs($scope.config.options.nominals)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })
//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type:"dropdown",
//             value:[]
//           }
//         },

//         setValue: (value) => {
//           // if(!globalConfig.designMode) $scope.markModified(); 
          
//           $scope.answer.value[0] = value.id;
//           $scope.answer.valid = (angular.isDefined($scope.answer.value[0]))
//           // $scope.answerCompleted = (angular.isDefined($scope.answer.value[0])) 
//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           $scope.config.options.nominals = {};
//           for(let item of $scope.alternatives){
//             $scope.config.options.nominals[item.id] = {title: item.title}; 
//           }
//         }
//       }
//   },

//   scale:{
//       type:{value:"scale", title:"Scale"}, 
//       widget:{
//         css:"fa fa-ellipsis-h", 
//         view:prefix+"scale.view.html", 
//         options:prefix+"scale.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         ordinals:{
//           range:{ min:1, max:7 },
//           "undefined":{title:"undefined", value:0},
//           values : [
//             {value:1, title:"Low"},
//             {value:2},
//             {value:3},
//             {value:4, title:"Medium"},
//             {value:5},
//             {value:6},
//             {value:7, title:"High"}
//           ]
//         },
//         colors:{
//           pallete:["#f7fcb9", "#addd8e", "#31a354"],
//           opacity: 70,
//           "undefined":" #aaa"  
//         }
//       },
//       callback:{

//         configure: () => {
//           let res = $scope.defaultQuestionConfig.scale;
//           $scope.markModified();  

//           if(angular.isUndefined($scope.config)) return res;

//           // res = defaultConfigure(res);
          
//           // if(["radio","check"].indexOf($scope.config.type.value) < 0) return res;
          
//           return res;
//         },
        
//         prepare: () => {

//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type:"scale",
//             value:[]
//           }
         
//         },

//         setValue: (value) => {
//           // if(!globalConfig.designMode) $scope.markModified(); 
          
//           $scope.answer.value[0] = value;
//           $scope.answer.valid = (angular.isDefined($scope.answer.value[0]))
//           // $scope.answerCompleted = (angular.isDefined($scope.answer.value[0])) 
//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           // $scope.config.options.nominals = {};
//         }
//       } 
//   },

//   rate:{
//       type:{value:"rate", title:"Rate"}, 
//       widget:{
//         css:"fa fa-star", 
//         view:prefix+"rate.view.html", 
//         options:prefix+"rate.options.html"
//       },
//       options:{
//         title:"", 
//         note:"",
//         max:5  
//       }
//   },

//   range:{
//       type:{value:"range", title:"Range"}, 
//       widget:{
//         css:"fa fa-arrows-h", 
//         view:prefix+"range.view.html", 
//         options:prefix+"range.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         step:1,
//         min:0,
//         max:100
//       }  
//   },

//   scales:{
//       type:{value:"scales", title:"Scales"}, 
//       widget:{
//         css:"fa fa-th-list", 
//         view:prefix+"scales.view.html", 
//         options:prefix+"scales.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         entities:{},
//         ordinals:{
//           range:{ min:1, max:7 },
//           "undefined":{title:"undefined", value:0},
//           values : [
//             {value:1, title:"Low"},
//             {value:2},
//             {value:3},
//             {value:4, title:"Medium"},
//             {value:5},
//             {value:6},
//             {value:7, title:"High"}
//           ]
//         },
//         disables:[],
//         colors:{
//           pallete:["#f7fcb9", "#addd8e", "#31a354"],
//           opacity: 70,
//           "undefined":" #aaa"  
//         }  
//       },
//       callback:{

//         configure: () => {
//           let res = $scope.defaultQuestionConfig.scales;
//           $scope.markModified();  

//           if(angular.isUndefined($scope.config)) return res;

//           res = defaultConfigure(res);
          
//           if(["scale"].indexOf($scope.config.type.value) < 0) return res;
          
//           return res;
//         },
        
//         prepare: () => {
//           $scope.entities = _.toPairs($scope.config.options.entities)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })

          
//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type:"scales",
//             value: [] // angular.copy($scope.config.options.entities)
//           }
         
//         },

//         setValue: (entity, value) => {
//           // if(!globalConfig.designMode) $scope.markModified(); 
          
//           let index = $scope.answer.value
//                       .map(item => item.entity)
//                       .indexOf(entity)
          
//           if(index < 0){
//             $scope.answer.value.push({entity:entity, value:value})
//           } else {
//             $scope.answer.value[index].value = value;
//           }
          
//           $scope.answer.valid = $scope.entities.length == $scope.answer.value.length;
//           // $scope.answerCompleted = $scope.entities.length == $scope.answer.value.length; 
//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           // $scope.config.options.nominals = {};
//           $scope.config.options.entities = {};
//           for(let item of $scope.entities){
//             $scope.config.options.entities[item.id] = {title: item.title, user:item.user}; 
//           }
//         }
//       } 
//   },

//   pairs:{
//       type:{value:"pairs", title:"Paired matches"}, 
//       widget:{
//         css:"fa fa-th", 
//         view:prefix+"pairs.view.html", 
//         options:prefix+"pairs.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
//         entities:{},
//         properties:{},
//         disables:[]  
//       }
//   },

//   influences:{
//       type:{value:"influences", title:"Impact assessment"}, 
//       widget:{
//         css:"fa fa-braille", 
//         view:prefix+"influences.view.html", 
//         options:prefix+"influences.options.html"
//       },
//       options:{
//         required: false,
//         title:"", 
//         note:"",
       
//         factors:{
//           f1: {title:"Factor 1"},
//           f2: {title:"Factor 2"},
//           f3: {title:"Factor 3"}
//         },
       
//         effects:{
//           ef1: {title:"Effect 1"},
//           ef2: {title:"Effect 2"},
//           ef3: {title:"Effect 3"},
//           ef4: {title:"Effect 4"},
//           ef5: {title:"Effect 5"},
//           ef6: {title:"Effect 6"},
//           ef7: {title:"Effect 7"},
//           ef8: {title:"Effect 8"}
//         },
       
//         ordinals:{
//           range:{ min:-3, max:3 },
//           "undefined":{title:"undefined", value:0},
//           values : [
//             {value:-3, title:"negatively"},
//             {value:-2},
//             {value:-1},
//             {value:0, title:"neutrally"},
//             {value:1},
//             {value:2},
//             {value:3, title:"positively"}
//           ]
//         },

//         disables:[
//           {factor:"f2",effect:"ef1"},
//           {factor:"f2",effect:"ef2"},
//           {factor:"f3",effect:"ef1"}
//         ],

//         colors:{
//           pallete:["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
//           opacity: 70,
//           "undefined":" #aaa"  
//         }
//       },
//        callback:{

//         configure: () => {
//           let res = $scope.defaultQuestionConfig.influences;
//           $scope.markModified();  

//           if(angular.isUndefined($scope.config)) return res;

//           res = defaultConfigure(res);
          
//           // if(["scale"].indexOf($scope.config.type.value) < 0) return res;
          
//           return res;
//         },
        
//         prepare: () => {
//           $scope.factors = _.toPairs($scope.config.options.factors)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })

//           $scope.effects = _.toPairs($scope.config.options.effects)
//                                   .map(item => {
//                                     return {
//                                       id:item[0],
//                                       title:item[1].title,
//                                       user:item[1].user
//                                     }
//                                   })
                                  
          
//           $scope.answer = {
//             valid: false,
//             question: $scope.widget.ID,
//             type:"influences",
//             value: [] // angular.copy($scope.config.options.entities)
//           }
         
//         },

//         setValue: (factor, effect, value) => {
//           // if(!globalConfig.designMode) $scope.markModified(); 
          
          
          
//           let index = -1;
//           $scope.answer.value.forEach((item, i) => {
//             if((item.factor == factor) && (item.effect == effect)) index = i;
//           })

          
//           if(index < 0){
//             $scope.answer.value.push({factor:factor, effect:effect, value:value})
//           } else {
//             $scope.answer.value[index].value = value;
//           }
          
//           $scope.answer.valid = 
//           (
//             ( $scope.factors.length * $scope.effects.length ) 
//             - 
//             ( $scope.answer.value.length + $scope.config.options.disables.length )
//           )
//           < Number.EPSILON; 

//           // $scope.answerCompleted = 
//           // (
//           //   ( $scope.factors.length * $scope.effects.length ) 
//           //   - 
//           //   ( $scope.answer.value.length + $scope.config.options.disables.length )
//           // )
//           // < Number.EPSILON; 
//         },

//         getValue: (factor, effect) => {
//           let index = -1;
//           $scope.answer.value.forEach((item, i) => {
//             if((item.factor == factor) && (item.effect == effect)) index = i;
//           })
//           if(index >= 0 ) return $scope.answer.value[index].value;
//           return "-";
//         },

//         disabled: (factor, effect) => {
//           let index = -1;
//           $scope.config.options.disables.forEach((item, i) => {
//             if((item.factor == factor) && (item.effect == effect)) index = i;
//           })

//           return index >= 0;
//         },

//         updateConfig: () => {
//           //  transform helped data structures into config
//           // $scope.config.options.nominals = {};
//         }
//       } 
//   }
// }

// $scope.questionTypes = _.toPairs($scope.defaultQuestionConfig).map(item => item[0]);




$scope.selectQtype = (type) => {
  
  if($scope.config && $scope.config.type && $scope.config.type.value == type) return;
  
  $scope.qtype = type;
  $scope.config = questionFactory[type]($scope, $scope.config)
  $scope.config.prepare();
}



$scope.submit = () => {
// TODO save answer on server

  $scope.answerCompleted = false;
}

$scope.addPMAlternative = (collection, field) => {
  console.log("ADD", field)
  
  collection.push({
      id:randomID(), 
      title: $scope.textFields[(field || 'alternative')],
      user:user, 
      $djItemType:"embeded"
  })
  
  $scope.textFields[(field || 'alternative')] = undefined;

  if(!globalConfig.designMode){ 
    (new APIUser()).invokeAll("questionMessage", {action:"add-alternative", data:$scope.widget.config})
  }
}






$scope.getColor = (p,o,r,value,invert) => {

      if (angular.isDefined(value)){
        let pc;
        let s = d3.scale.linear().domain([r.min,r.max]).rangeRound([0,p.length-1])
        pc = p[s(value)]
        


        let c = tinycolor(pc);
        if ( invert ) {
            c.spin(180);
            if(c.isLight()){
              return c.darken(70).toRgbString()
            } else {
              return c.lighten(70).toRgbString()
            }
        } else {
          c.setAlpha(o/100);
          return c.toRgbString()
        }  
      } else {
        return "#e7e7e7"
      }
}


$scope.coloredScaleStyle = (value) => {
  
  return {
    margin: "0.25em 0",
    background: "none", 
    color:  ( angular.isDefined($scope.answer.value[0]))
              ? ((value >= $scope.config.options.ordinals.range.min)
                  && (value < $scope.answer.value[0])
                ) 
                ? $scope.getColor(
                        $scope.config.options.colors.pallete,
                        $scope.config.options.colors.opacity,
                        $scope.config.options.ordinals.range,
                        value)
                : ((value >= $scope.config.options.ordinals.range.min)
                    && (value == $scope.answer.value[0])
                  )
                  ? $scope.getColor(
                        $scope.config.options.colors.pallete,
                        $scope.config.options.colors.opacity,
                        $scope.config.options.ordinals.range,
                        value)
                  : "#e7e7e7"
              : "#e7e7e7"              
  }
}

$scope.coloredMScaleStyle = (entity, value) => {
  
  let index = $scope.answer.value.map(item => item.entity).indexOf(entity)

  return {
    margin: "0.25em 0",
    background: "none", 
    color:  ( angular.isDefined($scope.answer.value[index]))
              ? ((value >= $scope.config.options.ordinals.range.min)
                  && (value < $scope.answer.value[index].value)
                ) 
                ? $scope.getColor(
                        $scope.config.options.colors.pallete,
                        $scope.config.options.colors.opacity,
                        $scope.config.options.ordinals.range,
                        value)
                : ((value >= $scope.config.options.ordinals.range.min)
                    && (value == $scope.answer.value[index].value)
                  )
                  ? $scope.getColor(
                        $scope.config.options.colors.pallete,
                        $scope.config.options.colors.opacity,
                        $scope.config.options.ordinals.range,
                        value)
                  : "#e7e7e7"
              : "#e7e7e7"              
  }
}

$scope.isEntityValue = (entity, value) => {
  let index = $scope.answer.value.map(item => item.entity).indexOf(entity)
  return (index>=0) && ($scope.answer.value[index].value == value)
}   


$scope.influenceStyle = (factor, effect) => {
  let index = -1;
  $scope.answer.value.forEach((item, i) => {
    if((item.factor == factor) && (item.effect == effect)) index = i;
  })
  if( index >= 0 ){
    let value = $scope.answer.value[index].value;
    let bg = $scope.getColor(
        $scope.config.options.colors.pallete,
        $scope.config.options.colors.opacity,
        $scope.config.options.ordinals.range,
        value
    )    
    
    return {
      background: bg,
      border:"3px solid "+tinycolor(bg).darken(10).toRgbString(),
      color: $scope.getColor(
        $scope.config.options.colors.pallete,
        $scope.config.options.colors.opacity,
        $scope.config.options.ordinals.range,
        value,
        true
      )
    }
  } else {
    return {
      background:"#e7e7e7",
      border:"3px solid "+tinycolor("#e7e7e7").darken(10).toRgbString(),
    }
  }  
}

$scope.scaleStyle = (value) => {
    
    if( angular.isDefined(value) ){
      return {
        background: $scope.getColor(
          $scope.config.options.colors.pallete,
          $scope.config.options.colors.opacity,
          $scope.config.options.ordinals.range,
          value
        ),
        color: $scope.getColor(
          $scope.config.options.colors.pallete,
          $scope.config.options.colors.opacity,
          $scope.config.options.ordinals.range,
          value,
          true
        )
      }  
    } else {
      return {
        background: "#e7e7e7"
      }
    }
}



$scope.m = true;


  
  let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

  let updateConfig = () => {

    if(!$scope.config) return;
      $scope.config.updateConfig();
      $scope.config.state.id = $scope.widget.ID;    
      $scope.widget.config = $scope.config.state;
      (new APIUser()).invokeAll("questionMessage", {action:"update-config", data:$scope.widget.config})
  
  }


  let applyAnswer = () => {
    if(!$scope.config) return;
    $scope.config.applyAnswer()
  }
  
  $scope.$watch("widget.ID", updateWidget)
  $scope.$watch("config.state", updateConfig,true);
  $scope.$watch("alternatives", updateConfig, true);
  $scope.$watch("entities", updateConfig, true);
  $scope.$watch("properties", updateConfig, true);
  $scope.$watch("factors", updateConfig, true);
  $scope.$watch("effects", updateConfig, true);

  $scope.$watch("answer", (oldV, newV) => {
    if($scope.config.validateAnswer) $scope.config.validateAnswer();
    (new APIUser()).invokeAll("questionMessage", {action:"change-answer", data:$scope.answer})
  }, true);


  let updateWidget = () => {

    
    $scope.disabled = $scope.widget.disabled = angular.isUndefined($scope.widget.ID);
    
    if(!$scope.disabled){
      if($scope.widget && $scope.widget.config && $scope){
        
        $scope.config = $scope.config 
          || questionFactory[$scope.widget.config.type.value]($scope, $scope.config); 
        
        angular.extend($scope.config.state, $scope.widget.config);
  
        if($scope.config.state.type) $scope.qtype = $scope.config.state.type.value;

        $scope.config.prepare();
      }
    }

  }

  
  
  new APIProvider($scope)
    .config(updateWidget)

    .beforePresentationMode(updateConfig)

    .beforeDesignMode(updateConfig)

    .save(updateConfig)

    .create((event, widget) => {
        console.log("Question handle create widget", widget)

    })

    .translate(updateWidget)
    
    .provide('formMessage', (e, context) => {
        console.log("HANDLE MESSAGE FROM FORM", context)
        
        if(context.action == "remove" && context.data.widget.instanceName == $scope.widget.formWidget){
            $scope.widget.ID = undefined;
            $scope.widget.formWidget = undefined;
            return
        }
        
        if(context.action == "configure"){
            
            (new APIUser()).invokeAll("questionMessage",{action:"init", data:$scope})
            return
        } 

        if(context.action == "update" && $scope.widget.ID){
          if(context.data.config.questions[$scope.widget.ID]){
            let newConf = context.data.config.questions[$scope.widget.ID];
            $scope.selectQtype(newConf.type.value)
            angular.extend($scope.widget.config, newConf); 
            updateWidget();
          }  
          return
        }  

        if(context.action == "set-answer" && $scope.widget.ID){
          let newAnswer = context.data.data[$scope.widget.ID];
          angular.extend($scope.answer, angular.copy(newAnswer)); 
          applyAnswer()
          return
        } 

        if(context.action == "show"){
          $scope.hidden = false;
          return
        }

        if(context.action == "hide"){
          $scope.hidden = true;
          return
        }   

    })    

    .removal(() => {
      console.log('Form question widget is destroyed');
      // (new APIUser()).invokeAll("questionMessage",{action:"remove", data:$scope})
    });
})


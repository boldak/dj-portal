

import angular from 'angular';
import 'angular-ui-tree';
import "custom-react-directives";
import "d3";
import "angular-oclazyload";
import "tinycolor";



let m = angular.module('app.widgets.v2.form.question', [
  'app.dps','ui.tree',"custom-react-directives","oc.lazyLoad"
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
  user
  
) {

// Load css
$ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 

// Call it when app config was modified
$scope.markModified = () => {
  app.markModified();
}  

// for template urls
const prefix = "./widgets/v2.form.question/partitions/";


// initial state for helped data structures
$scope.alternatives = [];
$scope.entities = [];
$scope.properties = [];
$scope.factors = [];
$scope.effects = [];


// default configure implementation
let defaultConfigure = conf => {
  conf.options.title = $scope.config.options.title;
  conf.options.note = $scope.config.options.note;
  conf.options.required = $scope.config.options.required;
  return conf;
}

// list editor tools
$scope._click = null;

$scope.delete = (object,index) => {
    object.splice(index,1);
    $scope.markModified();
}
$scope.add = (object) => {
    object.push({id:randomID(), title:"New item",$djItemType:"embeded"});
    $scope.markModified();
}

$scope.cselect = (value) => {
    $scope._click = value
}


// drag&drop options

let dest = null;
let startDest = null;
$scope.treeOptions = {
  dropped:(event) => {
  //   console.log("DROP", event.source.index+" -> "+event.dest.index)
  //   // event.source.nodeScope.$$childHead.drag = false;
  //   // selectHolder(null);
    $scope.markModified()
  },
  dragStart:(event) => {
        dest = event.dest.nodesScope;
        startDest = event.dest.nodesScope;
      // console.log("DRAGSTART", event)
      // event.source.nodeScope.$$childHead.drag = true;
  },
  accept: (sourceNodeScope, destNodesScope, destIndex) => {
    if(dest != destNodesScope){
        dest = destNodesScope;
    }
    return startDest == dest;
  }
}


  
  
// default question configuration
$scope.defaultQuestionConfig = {
  text: {
    type:{value:"text", title:"Text"}, 
    widget:{
      css:"fa fa-align-left", 
      view:prefix+"text.view.html", 
      options:prefix+"text.options.html"
    },
    options:{
      required: false,
      title:"", 
      note:""
    }
  },

  date: {
      type:{value:"date", title:"Date"}, 
      widget:{
        css:"fa fa-calendar", 
        view:prefix+"date.view.html", 
        options:prefix+"date.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        range:{
          min:"2013-01-01",
          max:"2018-01-01"
        }  
      }
  },

  month:{
      type:{value:"month", title:"Month"}, 
      widget:{
        css:"fa fa-calendar",
        view:prefix+"month.view.html", 
        options:prefix+"month.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        range:{
          min:"2013-01-01",
          max:"2018-01-01"
        }  
      }
  },

  time:{
      type:{value:"time", title:"Time"}, 
      widget:{
        css:"fa fa-calendar",
        view:prefix+"time.view.html", 
        options:prefix+"time.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        range:{
          min:"2013-01-01",
          max:"2018-01-01"
        }  
      }
  },

  datetime:{
      type:{value:"datetime", title:"Date & Time"}, 
      widget:{
        css:"fa fa-calendar",
        view:prefix+"datetime.view.html", 
        options:prefix+"datetime.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        range:{
          min:"2013-01-01",
          max:"2018-01-01"
        }  
      }
  },

  radio:{
      type:{value:"radio", title:"Оne of many"}, 
      widget:{
        css:"fa fa-stop-circle", 
        view:prefix+"radio.view.html", 
        options:prefix+"radio.options.html"
      },
      options:{
        required: false,
        addEnabled: false,
        showUserInfo: true,
        title:"", 
        note:"",
        nominals:{}
      },
      callback:{

        configure: () => {
          
          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          let res = $scope.defaultQuestionConfig.radio;
          if(angular.isUndefined($scope.config)) return res;

          res = defaultConfigure(res);
          if(["dropdown","check"].indexOf($scope.config.type.value) < 0) return res;
          
          res.options.nominals = {};
          
          for(let item of $scope.alternatives){
            res.options.nominals[item.id] = {title:item.title, user:item.user}; 
          }
          
          if ($scope.config.type.value == "check"){
            res.options.addEnabled = $scope.config.options.addEnabled;
            res.options.showUserInfo = $scope.config.options.showUserInfo;
          }
          $scope.markModified();  
          return res;
        },
        
        prepare: () => {

          // prepare helped data structures
          $scope.alternatives = _.toPairs($scope.config.options.nominals)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })
          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type:"radio",
            value:[]
          }
        },

        setValue: (value) => {
          
          $scope.answerCompleted = (angular.isDefined($scope.answer.value[0])) 
        },

        updateConfig: () => {
          //  transform helped data structures into config
          $scope.config.options.nominals = {};
          for(let item of $scope.alternatives){
            $scope.config.options.nominals[item.id] = {title: item.title, user:item.user}; 
          }
        }
      }
  },

  check:{
      type:{value:"check", title:"Many of many"}, 
      widget:{
        css:"fa fa-check-square", 
        view:prefix+"check.view.html", 
        options:prefix+"check.options.html"
      },
      options:{
        required: false,
        addEnabled: false,
        showUserInfo: true,
        title:"", 
        note:"",
        nominals:{}
      },
      callback:{
      
        configure: () => {
          
          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          let res = $scope.defaultQuestionConfig.check;
          if(angular.isUndefined($scope.config)) return res;

          res = defaultConfigure(res);
          if(["dropdown","radio"].indexOf($scope.config.type.value) < 0) return res;
          
          res.options.nominals = {};
          
          for(let item of $scope.alternatives){
            res.options.nominals[item.id] = {title:item.title, user:item.user}; 
          }
          
          if ($scope.config.type.value == "radio"){
            res.options.addEnabled = $scope.config.options.addEnabled;
            res.options.showUserInfo = $scope.config.options.showUserInfo;
          }

          return res;
        },
        
        prepare: () => {

          // prepare helped data structures
          $scope.alternatives = _.toPairs($scope.config.options.nominals)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })
          $scope.checkboxes = {};
          for(let item of $scope.alternatives){
           $scope.checkboxes[item.id] = false; 
          }   

          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type: "check",
            value: []
          }
        },

        setValue: (value) => {
          $scope.answer.value = _.toPairs($scope.checkboxes)
                                  .filter(item => item[1])
                                  .map(item => item[0]);
          $scope.answerCompleted = $scope.answer.value.length > 0;                         
        },

        updateConfig: () => {
          //  transform helped data structures into config
          $scope.config.options.nominals = {};
          for(let item of $scope.alternatives){
            $scope.config.options.nominals[item.id] = {title: item.title, user:item.user}; 
          }
        }
      }
    },

  dropdown:{
      type:{value:"dropdown", title:"Dropdown"}, 
      widget:{
        css:"fa fa-list", 
        view:prefix+"dropdown.view.html", 
        options:prefix+"dropdown.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        nominals:{}
      },
      callback:{

        configure: () => {
          
          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          let res = $scope.defaultQuestionConfig.dropdown;
          if(angular.isUndefined($scope.config)) return res;

          res = defaultConfigure(res);
          if(["radio","check"].indexOf($scope.config.type.value) < 0) return res;
          
          res.options.nominals = {};
          
          for(let item of $scope.alternatives){
            res.options.nominals[item.id] = {title:item.title}; 
          }
          
          
          $scope.markModified();  
          return res;
        },
        
        prepare: () => {

          // prepare helped data structures
          $scope.alternatives = _.toPairs($scope.config.options.nominals)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })
          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type:"dropdown",
            value:[]
          }
        },

        setValue: (value) => {
          $scope.answer.value[0] = value.id;
          $scope.answerCompleted = (angular.isDefined($scope.answer.value[0])) 
        },

        updateConfig: () => {
          //  transform helped data structures into config
          $scope.config.options.nominals = {};
          for(let item of $scope.alternatives){
            $scope.config.options.nominals[item.id] = {title: item.title}; 
          }
        }
      }
  },

  scale:{
      type:{value:"scale", title:"Scale"}, 
      widget:{
        css:"fa fa-ellipsis-h", 
        view:prefix+"scale.view.html", 
        options:prefix+"scale.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        ordinals:{
          range:{ min:1, max:7 },
          "undefined":{title:"undefined", value:0},
          values : [
            {value:1, title:"Low"},
            {value:2},
            {value:3},
            {value:4, title:"Medium"},
            {value:5},
            {value:6},
            {value:7, title:"High"}
          ]
        },
        colors:{
          pallete:["#f7fcb9", "#addd8e", "#31a354"],
          opacity: 70,
          "undefined":" #aaa"  
        }
      },
      callback:{

        configure: () => {
          let res = $scope.defaultQuestionConfig.scale;
          $scope.markModified();  

          if(angular.isUndefined($scope.config)) return res;

          // res = defaultConfigure(res);
          
          // if(["radio","check"].indexOf($scope.config.type.value) < 0) return res;
          
          return res;
        },
        
        prepare: () => {

          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type:"scale",
            value:[]
          }
         
        },

        setValue: (value) => {
          $scope.answer.value[0] = value;
          $scope.answerCompleted = (angular.isDefined($scope.answer.value[0])) 
        },

        updateConfig: () => {
          //  transform helped data structures into config
          // $scope.config.options.nominals = {};
        }
      } 
  },

  rate:{
      type:{value:"rate", title:"Rate"}, 
      widget:{
        css:"fa fa-star", 
        view:prefix+"rate.view.html", 
        options:prefix+"rate.options.html"
      },
      options:{
        title:"", 
        note:"",
        max:5  
      }
  },

  range:{
      type:{value:"range", title:"Range"}, 
      widget:{
        css:"fa fa-arrows-h", 
        view:prefix+"range.view.html", 
        options:prefix+"range.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        step:1,
        min:0,
        max:100
      }  
  },

  scales:{
      type:{value:"scales", title:"Scales"}, 
      widget:{
        css:"fa fa-th-list", 
        view:prefix+"scales.view.html", 
        options:prefix+"scales.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        entities:{
          e1: {title:"Entity 1"},
          e2: {title:"Entity 2"},
          e3: {title:"Entity 3"}
        },
        ordinals:{
          range:{ min:1, max:7 },
          "undefined":{title:"undefined", value:0},
          values : [
            {value:1, title:"Low"},
            {value:2},
            {value:3},
            {value:4, title:"Medium"},
            {value:5},
            {value:6},
            {value:7, title:"High"}
          ]
        },
        disables:[],
        colors:{
          pallete:["#f7fcb9", "#addd8e", "#31a354"],
          opacity: 70,
          "undefined":" #aaa"  
        }  
      },
      callback:{

        configure: () => {
          let res = $scope.defaultQuestionConfig.scales;
          $scope.markModified();  

          if(angular.isUndefined($scope.config)) return res;

          res = defaultConfigure(res);
          
          if(["scale"].indexOf($scope.config.type.value) < 0) return res;
          
          return res;
        },
        
        prepare: () => {
          $scope.entities = _.toPairs($scope.config.options.entities)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })

          
          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type:"scales",
            value: [] // angular.copy($scope.config.options.entities)
          }
         
        },

        setValue: (entity, value) => {
          let index = $scope.answer.value
                      .map(item => item.entity)
                      .indexOf(entity)
          
          if(index < 0){
            $scope.answer.value.push({entity:entity, value:value})
          } else {
            $scope.answer.value[index].value = value;
          }
          
          $scope.answerCompleted = $scope.entities.length == $scope.answer.value.length; 
        },

        updateConfig: () => {
          //  transform helped data structures into config
          // $scope.config.options.nominals = {};
        }
      } 
  },

  pairs:{
      type:{value:"pairs", title:"Paired matches"}, 
      widget:{
        css:"fa fa-th", 
        view:prefix+"pairs.view.html", 
        options:prefix+"pairs.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        entities:{},
        properties:{},
        disables:[]  
      }
  },

  influences:{
      type:{value:"influences", title:"Impact assessment"}, 
      widget:{
        css:"fa fa-braille", 
        view:prefix+"influences.view.html", 
        options:prefix+"influences.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
       
        factors:{
          f1: {title:"Factor 1"},
          f2: {title:"Factor 2"},
          f3: {title:"Factor 3"}
        },
       
        effects:{
          ef1: {title:"Effect 1"},
          ef2: {title:"Effect 2"},
          ef3: {title:"Effect 3"},
          ef4: {title:"Effect 4"},
          ef5: {title:"Effect 5"},
          ef6: {title:"Effect 6"},
          ef7: {title:"Effect 7"},
          ef8: {title:"Effect 8"}
        },
       
        ordinals:{
          range:{ min:-3, max:3 },
          "undefined":{title:"undefined", value:0},
          values : [
            {value:-3, title:"negatively"},
            {value:-2},
            {value:-1},
            {value:0, title:"neutrally"},
            {value:1},
            {value:2},
            {value:3, title:"positively"}
          ]
        },

        disables:[
          {factor:"f2",effect:"ef1"},
          {factor:"f2",effect:"ef2"},
          {factor:"f3",effect:"ef1"}
        ],

        colors:{
          pallete:["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
          opacity: 70,
          "undefined":" #aaa"  
        }
      },
       callback:{

        configure: () => {
          let res = $scope.defaultQuestionConfig.influences;
          $scope.markModified();  

          if(angular.isUndefined($scope.config)) return res;

          res = defaultConfigure(res);
          
          // if(["scale"].indexOf($scope.config.type.value) < 0) return res;
          
          return res;
        },
        
        prepare: () => {
          $scope.factors = _.toPairs($scope.config.options.factors)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })

          $scope.effects = _.toPairs($scope.config.options.effects)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })
                                  
          
          $scope.answer = {
            question: $scope.widget.ID,
            user: user,
            type:"influences",
            value: [] // angular.copy($scope.config.options.entities)
          }
         
        },

        setValue: (factor, effect, value) => {
          
          let index = -1;
          $scope.answer.value.forEach((item, i) => {
            if((item.factor == factor) && (item.effect == effect)) index = i;
          })

          
          if(index < 0){
            $scope.answer.value.push({factor:factor, effect:effect, value:value})
          } else {
            $scope.answer.value[index].value = value;
          }
           
          $scope.answerCompleted = 
          (
            ( $scope.factors.length * $scope.effects.length ) 
            - 
            ( $scope.answer.value.length + $scope.config.options.disables.length )
          )
          < Number.EPSILON; 
        },

        getValue: (factor, effect) => {
          let index = -1;
          $scope.answer.value.forEach((item, i) => {
            if((item.factor == factor) && (item.effect == effect)) index = i;
          })
          if(index >= 0 ) return $scope.answer.value[index].value;
          return "-";
        },

        disabled: (factor, effect) => {
          let index = -1;
          $scope.config.options.disables.forEach((item, i) => {
            if((item.factor == factor) && (item.effect == effect)) index = i;
          })

          return index >= 0;
        },

        updateConfig: () => {
          //  transform helped data structures into config
          // $scope.config.options.nominals = {};
        }
      } 
  }
}

$scope.questionTypes = _.toPairs($scope.defaultQuestionConfig).map(item => item[0]);


$scope.selectQtype = (type) => {
  
  if($scope.config && $scope.config.type.value == type) return;
  
  $scope.qtype = type;
    
  $scope.config = 
  ($scope.defaultQuestionConfig[type].callback && $scope.defaultQuestionConfig[type].callback.configure)
    ? $scope.defaultQuestionConfig[type].callback.configure()
    : $scope.defaultQuestionConfig[type]; 
    
    if ($scope.config.callback && $scope.config.callback.prepare) $scope.config.callback.prepare(); 
}

$scope.textFields = {
  alternative: "",
  object: "",
  property:"",
  effect:"",
  factor:""
}  

$scope.addPMAlternative = (collection) => {
 
  collection.push({
      id:randomID(), 
      title: $scope.textFields.alternative,
      user:user, 
      $djItemType:"embeded"
  })
  
  $scope.textFields.alternative = undefined;
}



$scope.setOpacity = (value) => {$scope.influenceOpacity = value}


$scope.setPallete = (pallete) => {
    $scope.influencePallete = pallete;
}

$scope.reversePallete = () => {
    $scope.influencePallete = $scope.influencePallete.reverse();
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

// $scope.labelStyle = (i,j) => {
//     return {color: $scope.getInvColor($scope.influenceData[i][j]), textAlign:"center"}
// }


$scope.m = true;


  
  let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

  
  
  let updateWidget = () => {
    
    $scope.disabled = $scope.widget.disabled = angular.isUndefined($scope.widget.ID);
    
    if(!$scope.disabled){
      if($scope.widget && $scope.widget.config){
        $scope.config = $scope.widget.config;
        if($scope.config.type) $scope.qtype = $scope.config.type.value;
        $scope.config.callback = $scope.defaultQuestionConfig[$scope.config.type.value].callback;
        if ($scope.config.callback && $scope.config.callback.prepare) $scope.config.callback.prepare(); 
      }
    }

    // const eventEmitter = new EventEmitter($scope);
    // eventEmitter.emit("questionMessage", {action:"update question",data:$scope})
    

    
    
  }

  $scope.$watch("widget.ID", ( oldValue, newValue) => {
    if(oldValue != newValue) updateWidget();
  })
  
  new APIProvider($scope)
    .config(updateWidget)

    .beforePresentationMode(() => {
      if( $scope.config.callback && $scope.config.callback.updateConfig ) {
        $scope.config.callback.updateConfig();
      }  
        $scope.widget.config = $scope.config;
    })

    .beforeDesignMode(() => {
      if( $scope.config ) {
        $scope.qtype = $scope.config.type.value;
        if( $scope.config.callback && $scope.config.callback.updateConfig ) {
          $scope.config.callback.updateConfig();
        } 
      }  
    })

    .save(() => {
      if( $scope.config.callback && $scope.config.callback.updateConfig ) {
        $scope.config.callback.updateConfig();
      }  
        $scope.widget.config = $scope.config;
    })

   .create((event, widget) => {
        console.log("Question handle create widget", widget)

    })

    // .translate(updateWidget)
    
    .provide('formMessage', (e, context) => {
        console.log($scope.widget.instanceName, 'formMessage handler', context)
        
        if(context.action == "remove" && context.data.widget.instanceName == $scope.widget.formWidget){
            $scope.widget.ID = undefined;
            $scope.widget.formWidget = undefined;
            return
        }
        
        if(context.action == "configure"){
            
            pageSubscriptions().addListener(
                {
                    emitter: $scope.widget.instanceName,
                    receiver: context.data.widget.instanceName,
                    signal: "questionMessage",
                    slot: "questionMessage"
                }
            );

            const eventEmitter = new EventEmitter($scope);   
            eventEmitter.emit("questionMessage",{action:"init", data:$scope})
            return
        }    
    })    

    .removal(() => {
      console.log('Form question widget is destroyed');
      const eventEmitter = new EventEmitter($scope);   
      eventEmitter.emit("questionMessage",{action:"remove", data:$scope})
    });
})

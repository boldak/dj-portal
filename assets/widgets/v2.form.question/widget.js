

import angular from 'angular';
import 'angular-ui-tree';
import "custom-react-directives";
// import "ng-material-datetimepicker";
import "d3";
import "angular-oclazyload";
import "tinycolor";
import "./js/config/index.js";
import "./js/utility/index.js";
import "moment";




let m = angular.module('app.widgets.v2.form.question', [
  'app.dps','ui.tree',"custom-react-directives","oc.lazyLoad", 
  "v2.question.factory",
  "v2.question.utility"
  // ,
  // "ngMaterialDatePicker"
  // ,
  // 'ngSanitize'
])


let localeDateFormat = {
  
  "day": {
    "en": "MMMM DD YYYY",
    "uk": "DD MMMM YYYY р."
  },

  "date": {
    "en": "MMMM DD YYYY",
    "uk": "DD MMMM YYYY р."
  },

  "month": {
    "en": "MMMM YYYY",
    "uk": "MMMM YYYY р."
  }

}


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
  questionTypes,
  $mdColors,
  $translate
  
) {


// Load css
// $ocLazyLoad.load({files:["/widgets/v2.form.question/djform.css"]}); 


angular.extend($scope, {

  i18n : i18n,

  truncate: (value, length) => {
    length = length || 20;
    return ( value.toString().length <= length )
      ? value.toString()
      : ( (value.toString().length - length) > 10 )
        ? value.toString().substring(0,length)+'...'
        : value.toString();
  },        

  globalConfig: globalConfig,

  randomID: randomID,

  markModified : app.markModified,

  primaryColor: $mdColors.getThemeColor('primary'),

  accentColor: $mdColors.getThemeColor('accent'),

  warnColor: $mdColors.getThemeColor('warn'),

  disableColor: "#333",

  openMenu: ($mdMenu, ev) => {
      originatorEv = ev;
      $mdMenu.open(ev);
  }
  
})

let listEditorTools = $scope.listEditorTools = listEditor($scope)


angular.extend($scope,{

    message : ( messageID, embedded) => {
      _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
      let res = _.template($translate.instant('WIDGET.V2.FORM.QUESTION.'+messageID))(embedded)
      _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g; 
      return res; 
    },  

    colorUtility: colorUtility($scope),

    treeOptions: listEditorTools.treeOptions(),

    questionTypes: questionTypes.map(item => item),

    _click: null,
    delete:(object,index) => { listEditorTools.delete(object,index) },
    add: (object) => { listEditorTools.add(object) },
    cselect: (value) => { listEditorTools.cselect(value) },
   
    alternatives : listEditorTools.createCollection(),
    
    entities : listEditorTools.createCollection(),
    
    properties : listEditorTools.createCollection(),
    
    factors : listEditorTools.createCollection(),
    
    effects : listEditorTools.createCollection(),
    
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
      $scope.config.state.options.colors.reversePalette = !$scope.config.state.options.colors.reversePalette;
      $scope.config.state.options.colors.pallete = $scope.config.state.options.colors.pallete.reverse()
    },

    formatDate: () => {
      if ( angular.isUndefined($scope.answer.value[0]) ) return "";
      let res = moment(new Date($scope.answer.value[0]))
        .format(localeDateFormat[$scope.config.state.options.format][i18n.locale()]); 
      // console.log($scope.answer.value[0]
      //   ,$scope.config.state.options.format
      //   ,i18n.locale()
      //   ,localeDateFormat[$scope.config.state.options.format][i18n.locale()] , res
      //   )
      return res
    }


})

$scope.widgetPanel.allowConfiguring = undefined;
$scope.widgetPanel.allowCloning = undefined;

  
// console.log( $scope.monthDateLocale.formatDate(new Date()),
//   $scope.monthDateLocale.parseDate($scope.monthDateLocale.formatDate(new Date()))
// )



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

$scope.selectAllAlt = (collection) => {
  collection.forEach(item => {
    item._selected = true;
  })
}

$scope.deleteAlt = (collection) => {
  _.remove( collection, { _selected : true } )
}

$scope.percent = (v) => ((angular.isDefined(v)) ? v : 0)

$scope.addPMAlternative = (collection, field) => {
  // console.log("ADD", field)
  
  let alt = {
      id:randomID(), 
      title: $scope.textFields[(field || 'alternative')],
      user:(globalConfig.designMode) ? undefined : user, 
      _selected:true
  };


  $scope.listEditorTools.add(collection, alt)
  
  $scope.textFields[(field || 'alternative')] = undefined;

  if(!globalConfig.designMode){ 
    (new APIUser($scope)).invokeAll("questionMessage", {action:"add-alternative", data:$scope.widget.config})
    $scope.config.setValue(alt.id, true);
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
      (new APIUser($scope)).invokeAll("questionMessage", {action:"update-config", data:$scope.widget.config})
  
  }


  $scope.applyAnswer = () => {
   
    if(!$scope.config) return;
    $scope.config.applyAnswer()
  }
  
  $scope.$watch("widget.ID", updateWidget)
  $scope.$watch("config.state", updateConfig,true);
  // $scope.$watch("alternatives", updateConfig, true);
  // $scope.$watch("entities", updateConfig, true);
  // $scope.$watch("properties", updateConfig, true);
  // $scope.$watch("factors", updateConfig, true);
  // $scope.$watch("effects", updateConfig, true);

  $scope.$watch("answer", (oldV, newV) => {
    if($scope.config && $scope.config.validateAnswer) $scope.config.validateAnswer();
      (new APIUser($scope)).invokeAll("questionMessage", {action:"change-answer", data:$scope.answer})
    
  }, true);


  let updateWidget = () => {

    
    $scope.disabled = $scope.widget.disabled = angular.isUndefined($scope.widget.ID);
    
    if(!$scope.disabled){
      if($scope.widget && $scope.widget.config && $scope){
        
        $scope.config = $scope.config 
          || questionFactory[$scope.widget.config.type.value]($scope, $scope.config); 
        
        angular.extend($scope.config.state, $scope.widget.config);
  
        if($scope.config.state.type) $scope.qtype = $scope.config.state.type.value;

        // $scope.monthDateLocale = i18n.getDateLocale(localeDateFormat.month[i18n.locale()])  
        $scope.monthDateLocale = i18n.monthDateLocale(i18n.locale())
        $scope.config.prepare();

      }
    }

  }

  
  
  new APIProvider($scope)
    .config(() => {
      updateWidget()
    })

    // .beforePresentationMode(updateConfig)

    // .beforeDesignMode(updateConfig)

    .save(updateConfig)

    .create((event, widget) => {
      

        // console.log("Question handle create widget", widget)

    })

    .translate(() => {
      // $scope.monthDateLocale = i18n.getDateLocale(localeDateFormat.month[i18n.locale()])
      updateWidget();
    })
    
    .provide('formMessage', (e, context) => {
        // console.log("HANDLE MESSAGE FROM FORM", context)
        
        if(context.action == "remove" && context.data.widget.instanceName == $scope.widget.formWidget){
            $scope.widget.ID = undefined;
            $scope.widget.formWidget = undefined;
            return
        }
        
        if(context.action == "configure"){
            
            (new APIUser($scope)).invokeAll("questionMessage",{action:"init", data:$scope})
            return
        } 

        if(context.action == "update" && $scope.widget.ID){
          if(context.data.config.questions[$scope.widget.ID]){
            let newConf = context.data.config.questions[$scope.widget.ID];
            $scope.selectQtype(newConf.type.value)
            $scope.widget.config = $scope.widget.config || {};
            angular.extend($scope.widget.config, newConf); 
            updateWidget();
          }  
          return
        } 

        if(context.action == "update-config"){
          if($scope.config && $scope.config.updateConfig){
            $scope.config.updateConfig();
          }
          return
        } 

        if(context.action == "set-answer" && $scope.widget.ID){
          // console.log("set-answer", $scope)
          let newAnswer = context.data.data[$scope.widget.ID];
          
          if(newAnswer){
            angular.extend($scope.answer, angular.copy(newAnswer)); 
          }

          $scope.applyAnswer()
          
          $scope.$evalAsync(() => {
            (new APIUser($scope)).invokeAll("questionMessage", {action:"change-answer", data:$scope.answer})
          })
          
          return
        } 

        if(context.action == "responseStat" && $scope.widget.ID){
          // console.log("ResponseStat", context)
          if(context.data && $scope.config) {
            if($scope.config.getResponseStat) {
                $scope.config.getResponseStat(context.data)
                if($scope.config.calcAnswerIndex){
                  // for highest isResponse performance
                  $scope.config.calcAnswerIndex()
                }
            }
          } 
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
      // console.log('Form question widget is destroyed');
      (new APIUser($scope)).invokeAll("questionMessage",{action:"remove", data:$scope})
    });
})


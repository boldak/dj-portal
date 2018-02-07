import angular from 'angular';
import 'angular-ui-tree';
import "custom-react-directives";
import "d3";


let m = angular.module('app.widgets.v2.form.question', [
  'app.dps','ui.tree',"custom-react-directives"
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
  d3
  
) {

  // const eventEmitter = new EventEmitter($scope);

$scope.answer = {
    type:"radio"
    // ,
    // value:"a4"
};

$scope.options = {
    title:`
        <h5 style="color:#cd7b18;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_8ltcpWl3s18O0f7i4zzznzb_1hGfWkra-cCAvsFdN1S8ZLT" style="width:2em; margin-right:1em;">
        Як, у цiлому, Ви оцiнюєте свою стараннiсть у навчаннi?
        </h5>`,
    note:"<i>Як, у цiлому, Ви оцiнюєте свою стараннiсть у навчаннi?</i>",
    type:"radiogroup",
    closure:"closed",
    // values:[]
    values:[
        {id:"a1", text:"Навчаюся з повною вiддачею сил"},
        {id:"a2", text:"Навчаюся старанно лише час вiд часу"},
        {id:"a3", text:"Навчаюся зовсiм нестаранно"},
        {id:"a4", text:"Важко вiдповiсти"}
    ]
}



$scope.questionTypes = [
    {value:"text", title:"Text", css:"fa fa-align-left"},
    {value:"date", title:"Date", css:"fa fa-calendar"},
    {value:"month", title:"Month", css:"fa fa-calendar"},
    {value:"time", title:"Time", css:"fa fa-calendar"},
    {value:"datetime", title:"Date Time", css:"fa fa-calendar"},
    {value:"radio", title:"1 from n", css:"fa fa-stop-circle"},
    {value:"check", title:"m from n", css:"fa fa-check-square"},
    {value:"dropdown", title:"Dropdown", css:"fa fa-list"},
    {value:"scale", title:"Scale", css:"fa fa-ellipsis-h"},
    {value:"rate", title:"Rate", css:"fa fa-star"},
    {value:"range", title:"Range", css:"fa fa-arrows-h"},
    {value:"scales", title:"Scales", css:"fa fa-th-list"},
    {value:"pairs", title:"Pairs", css:"fa fa-th"},
    {value:"influence", title:"Influence", css:"fa fa-braille"}
]

$scope.alt = [];
for(let i in [1,2,3,4,5,6]){
    $scope.alt.push({id:randomID(), title:"Alternative "+i, $djItemType:"embeded"})
}

$scope.rows = [];
for(let i in [1,2,3,4,5]){
    $scope.rows.push({id:randomID(), title:"Object "+i, $djItemType:"embeded"})
}

$scope.cols = [];
for(let i in [1,2,3]){
    $scope.cols.push({id:randomID(), title:"Property "+i, $djItemType:"embeded"})
}


$scope._click = null;

$scope.select = (value) => {
    console.log("SELECT", value)
    $scope._over = value
}

$scope.delete = (object,index) => {
    object.splice(index,1)
}
$scope.add = (object) => {
    object.push({id:randomID(), title:"New item",$djItemType:"embeded"})
}

$scope.cselect = (value) => {
    console.log("CSELECT", value)
    $scope._click = value
}


$scope.influencePallete = ["#f7fcb9", "#addd8e", "#31a354"];
$scope.influenceUndefinedColor = "#eee";
$scope.influenceDisabledColor = "#00000080";
$scope.influenceOpacity = 70;


$scope.setPallete = (pallete) => {
    $scope.influencePallete = pallete;
}

$scope.influenceScale = {
    "min":1,
    "max":7,
    "undefined":0
}

$scope.getColor = (value) => {
      let pc;
      if(value == "d"){
        pc = $scope.influenceDisabledColor
      } else {
        if (value == $scope.influenceScale["undefined"]) {
            pc = $scope.influenceUndefinedColor
        } else {
            let s = d3.scale.linear().domain([$scope.influenceScale.min,$scope.influenceScale.max]).rangeRound([0,$scope.influencePallete.length-1])
            pc = $scope.influencePallete[s(value)]
        }
      }

      let c = d3.rgb(pc);
      return "rgba("+ c.r + ","+ c.g + ","+ c.b + ","+($scope.influenceOpacity/100)+ ")"
}

$scope.getInvColor = (value) => {
      let pc;
      if(value == "d"){
        pc = $scope.influenceDisabledColor
      } else {
        if (value == $scope.influenceScale["undefined"]) {
            pc = $scope.influenceUndefinedColor
        } else {
            let s = d3.scale.linear().domain([$scope.influenceScale.min,$scope.influenceScale.max]).rangeRound([0,$scope.influencePallete.length-1])
            pc = $scope.influencePallete[s(value)]
        }
      }

      let c = d3.rgb(pc);
      return "rgba("+ (255-c.r) + ","+ (255-c.g) + ","+ (255-c.b) + ",1)"
}


$scope.influenceStyle = (i,j) => {
    return {background: $scope.getColor($scope.influenceData[i][j])}
}

$scope.labelStyle = (i,j) => {
    return {color: $scope.getInvColor($scope.influenceData[i][j]), textAlign:"center"}
}

$scope.influenceData = [
    [0,1,2,3,4,5,6],
    ["d",0,0,0,"d",0,7],
    ["d","d",0,0,0,0,0],
    ["d","d","d",0,0,0,0]
]



$scope.influenceDataRows = [0,1,2,3]
$scope.influenceDataCols = [0,1,2,3,4,5,6]

$scope.setValue = (i,j) => {
    if($scope.influenceData[i][j] == "d") return;
    $scope.influenceData[i][j]++;
    $scope.influenceData[i][j] = ($scope.influenceData[i][j] > $scope.influenceScale.max)
        ? (angular.isNumber($scope.influenceScale["undefined"]))
            ? $scope.influenceScale["undefined"]
            : $scope.influenceScale.min
        : $scope.influenceData[i][j] 
}


let dest = null;
let startDest = null;
$scope.treeOptions = {
  // dropped:(event) => {
  //   console.log("DROP", event.source.index+" -> "+event.dest.index)
  //   // event.source.nodeScope.$$childHead.drag = false;
  //   // selectHolder(null);
  //   // app.markModified()
  // },
  dragStart:(event) => {
        dest = event.dest.nodesScope;
        startDest = event.dest.nodesScope;
      // console.log("DRAGSTART", event)
      // event.source.nodeScope.$$childHead.drag = true;
  },
  accept: (sourceNodeScope, destNodesScope, destIndex) => {
    if(dest != destNodesScope){
        dest = destNodesScope;
        // console.log("acccept ", dest)
    }
    // console.log("ACCEPT", sourceNodeScope, destNodesScope, destIndex)
    // selectHolder(destNodesScope.$treeScope.$parent.$parent);
    // console.log(scope, destNodesScope.$treeScope.$parent.$parent);
    return startDest == dest;
  }
}


$scope.selectType = () => {
    dialog({
        title: "Select question type",
        fields:{
            type:{
                title:"Question type",
                type:"select",
                options:$scope.questionTypes,
                value:$scope.options.type
            }
        }
    })
    .then (form => {
        $scope.options.type = form.fields.type.value
        
        if($scope.options.type == "radiogroup"){
            $scope.answer = {
                type:"radio"
            };
        }

        if($scope.options.type == "checkgroup"){
           let value = {}
           $scope.options.values.forEach((item) => {
                value[item.id] = false
           })
           value["a2"] = true;
           
           $scope.answer = {
                type:"check",
                value: value
            };
        }
    })
}

$scope.editTitle = () => {
    htmlEditor($scope.options.title, "Edit question title")
        .then (res => {
            $scope.options.title = res;
            updateWidget()
        })
} 

$scope.editNote = () => {
    htmlEditor($scope.options.note, "Edit question note")
        .then (res => {
            $scope.options.note = res;
            updateWidget()
        })
} 

$scope.selectQtype = (type) => {
    $scope.qtype = type
}

$scope.setRadioAnswer = value => {
    $scope.answer = {
        type:"radio",
        value:value
    }
}

$scope.m = true;

$scope.setCheckAnswer = value => {
    
    // $scope.answer = {
    //     type:"check",
    //     value: ($scope.answer.value) ? $scope.answer.value : new Set()
    // }


    if(!$scope.answer.value.has(value)){ 
        $scope.answer.value.add(value);
    } else {
        $scope.answer.value.delete(value);
    }
        
    console.log($scope.answer.value)
}

  
  let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

  
  
  let updateWidget = () => {

    $scope.disabled = $scope.widget.disabled = angular.isUndefined($scope.widget.ID);
    const eventEmitter = new EventEmitter($scope);
    eventEmitter.emit("questionMessage", {action:"update question",data:$scope})
    $scope.title = $sce.trustAsHtml($scope.options.title)
    $scope.note = $sce.trustAsHtml($scope.options.note)
    $scope.options.id = $scope.widget.ID;
    // setHTML($scope.options.id+"title", $scope.options.title)
    // setHTML($scope.options.id+"note", $scope.options.note)
  }

  $scope.$watch("widget.ID", ( oldValue, newValue)=>{
    if(oldValue != newValue) updateWidget();
  })
  
  new APIProvider($scope)
    .config(updateWidget)

    .save(() => {
      console.log("Save app event handler")
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

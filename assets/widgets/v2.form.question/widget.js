import angular from 'angular';


let m = angular.module('app.widgets.v2.form.question', [
  'app.dps'
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
  htmlEditor
) {

  // const eventEmitter = new EventEmitter($scope);



$scope.options = {
    title:`
        <h5 style="color:#cd7b18;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_8ltcpWl3s18O0f7i4zzznzb_1hGfWkra-cCAvsFdN1S8ZLT" style="width:2em; margin-right:1em;">
        Як, у цiлому, Ви оцiнюєте свою стараннiсть у навчаннi?
        </h5>`,
    note:"<i>Як, у цiлому, Ви оцiнюєте свою стараннiсть у навчаннi?</i>",
    type:"radiogroup",
    closure:"closed",
    values:[
        {id:"a1", text:"Навчаюся з повною вiддачею сил"},
        {id:"a2", text:"Навчаюся старанно лише час вiд часу"},
        {id:"a3", text:"Навчаюся зовсiм нестаранно"},
        {id:"a4", text:"Важко вiдповiсти"}
    ]
}



$scope.questionTypes = [
    {value:"string", title:"String"},
    {value:"text", title:"Text"},
    {value:"radiogroup", title:"Radio"},
    {value:"checkgroup", title:"Checkbox"},
    {value:"scale", title:"Scale"},
    {value:"matrix", title:"Matrix"}
]


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

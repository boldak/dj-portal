import angular from 'angular';
// import 'dictionary';

let m = angular.module('app.widgets.v2.form', [
  'app.dps'
])


m.controller('FormController', function(
  $scope,
  APIProvider,
  APIUser,
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
  randomID,
  $window
) {


$scope.pageConfig = app.pageConfig();

  // const eventEmitter = new EventEmitter($scope);
  // const apiUser = new APIUser();
  // $scope.formatDate = i18n.formatDate;
  let scopeFor = widgetInstanceName => instanceNameToScope.get(widgetInstanceName);

// operation process indicator

$scope.processing = false;

  let dps = {

    getProjectList: `
            // getProjectList
            <?javascript
                $scope.s = (item) => {
                    return {
                        id: item.id,
                        owner: item.owner,
                        metadata: item.metadata
                    }
                }
            ?>
            dml.select(from:"project", as:{{s}})
        `,

    createProject: `
            // createProject
            client();
            set("owner")
            <?javascript
                $scope.project = {
                    metadata:$scope.project,
                    owner:$scope.owner.client.user,
                    history:[
                        {
                            state:"created",
                            message:"Create project via "+$scope.owner.client.app,
                            user: $scope.owner.client.user,
                            date: new Date()
                        }
                    ]
                }
            ?>
            dml.insert(into:"project", values:{{project}})
        `,

    createForm: `
            // createForm 
            client();
            set("owner")
            <?javascript
                $scope.form = {
                    metadata:$scope.form,
                    owner:$scope.owner.client.user,
                    history:[
                        {
                            state:"created",
                            message:"Create form via "+$scope.owner.client.app,
                            user: $scope.owner.client.user,
                            date: new Date()
                        }
                    ]
                }
            ?>
            dml.insert(into:"form", values:{{form}})
        `,

    updateForm: `
        // updateForm
            client();
            set("owner")

            <?javascript

                $scope.updatedForm = (item) => item.id == $scope.form.id;
                $scope.update = (item) => {
                    
                    // $scope.form.history.push({
                    //     date: new Date(),
                    //     message:"Update form",
                    //     state:"updated",
                    //     user: $scope.owner.client.user
                    // });
                    
                    return $scope.form;
                };

            ?>

            dml.update(for:"form", as:{{update}}, where:{{updatedForm}})
        `,

    getForm: `
            // getForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.select(from:"form", where:{{filter}}, populate:"project")
        `,

    deleteForm:`
            // deleteForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.delete(from:"form", where:{{filter}})
    `

  }

  let runDPS = (params) => {

    let script = params.script;
    let storage = params.state;

    let state = {
      storage: storage,
      locale: i18n.locale()
    }

    return $dps.post("/api/script", {
        "script": script,
        "state": state
      })
      .then(function(response) {
        return {
          type: response.data.type,
          data: response.data.data
        }
      })
  }


  let createNewProject = (form) => {
    metadataDialog({
        title: "New Project Metadata",
        object: {
          title: "",
          note: ""
        }
      })
      .then((res) => {
        runDPS({
            script: dps.createProject,
            state: {
              project: res
            }
          })
          .then((res) => {
            // console.log(res)
            form.fields.project.options.push({
              title: res.data[0].metadata.title,
              value: res.data[0].id,
              selected: true
            })
          })
      })
  }

  $scope.selectProject = () => {
    runDPS({
        script: dps["getProjectList"]
    })
    .then(res =>
        dialog({
            title: "Select Project",
            fields: {
               project: {
                title: "Project",
                type: "select",
                options: [{ title: "none", value: "" }].concat(
                  (res.data) 
                    ? res.data.map((item, index) => {
                        return {
                          title: item.metadata.title,
                          value: item.id
                        }
                      }) 
                    : []
                ),
                required: false,
                value: ($scope.form && $scope.form.project) ? $scope.form.project.id : "",
                nested: [{
                  title: "New Project...",
                  action: createNewProject
                }]
              }
            }
        })      
    )
    .then( form => {
        $scope.form.project = (form.fields.project.value == "")
            ? null
            : form.fields.project.value;

        return runDPS({
            script: dps.updateForm,
            state: {
              form: $scope.form
            }
        })
    })
    .then(() => {
            updateWidget();
            app.markModified();    
    })  
  }


  $scope.editFornMetadata = metadata => {
    metadataDialog({
        title: "Edit Form Metadata",
        object: metadata
      })
      .then(res => {
        $scope.form.metadata = res;
        return runDPS({
            script: dps.updateForm,
            state: {
              form: $scope.form
            }
        })
      })
      .then(() => {
            updateWidget();
            app.markModified();    
      })   
  }






  let prepaireMetadata = (obj) => {
    let res = [];
    obj = obj.metadata;
    if (obj) {
      for (let key in obj) {
        res.push({ key: key, value: obj[key] })
      }
    }
    return res;
  }



    let createNewForm = () => {

      $scope.processing = true;

      let meta = {
        app_name: config.name,
        app_title: config.title,
        app_url: $window.location.href,
        app_icon:config.icon,
        page_title:app.pageConfig().shortTitle
      }
      
      

      runDPS({
        script: dps.createForm,
        state: {
          form: meta
        }
      })
      .then((res) => {
        $scope.widget.form = res.data[0].id;
        app.markModified();
        let usr = new APIUser;
        usr.invokeAll("formMessage", {action:"configure", data:$scope});
        updateWidget();
        $scope.processing = false;
      })
    }

    let loadForm = () => {
      runDPS({
        script: dps.getForm,
        state: {
          form: $scope.widget.form
        }  
      })
      .then(res => {
        $scope.processing = false;
        $scope.form = res.data[0];

          // eventEmitter.emit("formMessage", {action:"update", data:$scope.form});
          let usr = new APIUser(); 
          usr.invokeAll("formMessage", {action:"update", data:$scope.form});
          

          $scope.formMetadata = prepaireMetadata($scope.form)
          $scope.formAttributes = [];
          $scope.formAttributes.push({key:"Cloned from", value:$scope.form.cloned})
          $scope.formAttributes.push({key:"Id", value:$scope.form.id})
          $scope.formAttributes.push({key:"Identity", value:$scope.form.metadata.identity})
          $scope.formAttributes.push({key:"Created at", value:i18n.formatDate($scope.form.createdAt)})
          // $scope.formAttributes.push({key:"State", value:$scope.form.history.last().state})
          $scope.formAttributes.push({key:"Updated at", value:i18n.formatDate($scope.form.updatedAt)})
          

          $scope.team = [{name:$scope.form.owner.name+" (Author)", photo:$scope.form.owner.photo}]
                        .concat(config.collaborations.map(item => {
                            return{name:item.user.name, photo:item.user.photo}
                        }))


          if($scope.form.project){              
            $scope.projectMetadata = prepaireMetadata($scope.form.project)
          }
          $scope.widgetPanel.allowConfiguring = undefined;
          $scope.widgetPanel.allowCloning = undefined;
        })
      }


  let updateWidget = () => {
    // let forms = pageWidgets().filter((item) => item.type === "v2.form");
    // $scope.disabled = $scope.widget.disabled = (forms.length > 1)&&(!$scope.widget.form);
    
    if($scope.disabled) return;
    
    if($scope.widget.form) loadForm()
    
  }

  let initQuestion = s => {
    $scope.widget.questions = ($scope.widget.questions) 
        ? $scope.widget.questions 
        : {};
    s.widget.ID = randomID();
    s.widget.formWidget = $scope.widget.instanceName; 
    
    pageSubscriptions().addListener(
        {
            emitter: $scope.widget.instanceName,
            receiver: s.widget.instanceName,
            signal: "formMessage",
            slot: "formMessage"
        }
    );
    pageSubscriptions().addListener(
        {
            emitter: s.widget.instanceName,
            receiver: $scope.widget.instanceName,
            signal: "questionMessage",
            slot: "questionMessage"
        }
    );
    $scope.widget.questions[s.widget.ID] = {id: s.widget.ID, form: $scope.form, config:{}}
  }

  new APIProvider($scope)
    .config(() => {
        updateWidget()  
    })

    .save(() => {
      console.log("Save app event handler")
    })

    .translate(updateWidget)

    .create((event,widget) => {
        
        if( widget.instanceName == $scope.widget.instanceName){
          let forms = pageWidgets().filter((item) => item.type === "v2.form");
          if(forms.length == 1) createNewForm();
        } 
        
        if(!$scope.disabled && $scope.form && (widget.type == "v2.form.question")){
            initQuestion(scopeFor(widget.instanceName))
        }
    })

    .provide('questionMessage', (e, context) => {
        if(context.action == 'init'){
            initQuestion(context.data)
            return
        }

        if(context.action == 'remove'){
            $scope.widget.questions[context.data.widget.ID] = undefined
            return
        }

    })  

    .provide('formMessage', (e, context) => {
        if((context.action == "remove") && ($scope.widget.instanceName != context.data.widget.instanceName)){
            updateWidget()
        }
    })  

    .removal(() => {
      let user = new APIUser();
      user.invokeAll("formMessage", {action:"remove", data:$scope});
      
      $scope.processing = true;
      if($scope.form){
        runDPS({
            script: dps.deleteForm,
            state: {
              form: $scope.form.id
            }
        })
        .then(() => {
          $scope.processing = false;        
        })  
      }
          
      console.log('Form widget is destroyed');
    });
})

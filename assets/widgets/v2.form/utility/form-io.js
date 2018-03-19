import angular from 'angular';

let dps = {

  createForm: `
            // createForm 
            client();
            set("owner")
            <?javascript
                $scope.form = {
                    metadata: $scope.form.metadata,
                    config: $scope.form.config,
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

    cloneForm: `
            // cloneForm 
            client();
            set("owner")
            <?javascript
                $scope.form.owner = $scope.owner.client.user;
                $scope.form.history.push({
                            state:"created",
                            message:"Clone form via "+$scope.owner.client.app,
                            user: $scope.owner.client.user,
                            date: new Date()
                })
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

  extendForm: `
        // extendForm
            <?javascript
    
                $scope.updatedForm = (item) => item.id == $scope.form.id;
                
                $scope.extendNominals = (item) => {
                  for(let q of Object.keys(item.config.questions)){
                    let qo = item.config.questions[q].options.nominals;
                    if(qo && $scope.form.config.questions[q] && $scope.form.config.questions[q].options.nominals){
                      qo = _.extend(qo,$scope.form.config.questions[q].options.nominals)
                    }
                  }
                  return item
                }
    
            ?>


            dml.update(for:"form", as:{{extendNominals}}, where:{{updatedForm}})
            
        `,


  getForm: `
            // getForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.select(from:"form", where:{{filter}}, populate:"project")
        `,

  deleteForm: `
            // deleteForm
            <?javascript
                $scope.filter = (item) => item.id == $scope.form;
            ?>

            dml.delete(from:"form", where:{{filter}})
    `,

  updateAnswer: `
            // updateAnswer
            dml.insertOrUpdate(into:"answer", value:{{answer}})
    `,

  getAnswer: `
      // getAnswer
      <?javascript
          $scope.forUser = item => {
            if(!$scope.user.id) {
              if(!$scope.user.apikey) return false;
              return item.form == $scope.form && item.user.apikey == $scope.user.apikey;
            }  
            return item.form == $scope.form && item.user.email == $scope.user.email;
          }  
          $scope.byDate = _util.comparator.Date["Z-A"](item => item.updatedAt)
      ?>

      dml.select(from:"answer",where:{{forUser}})
      sort({{byDate}})
      select("$[0]")

    `,
    loadResponseStat:
    `
        <?javascript
          $scope.f = item => item.form == $scope.form;
          $scope.map = (item,index) => {return {date:item.updatedAt,v:1}};
          $scope.sort = _util.comparator.Date["A-Z"](item => item.date);
        ?>

        dml.select(from:"answer", where:{{f}}, as:{{map}})
        json()
        sort({{sort}})
    `,
    exportResponses:`
        

        // exportResponses

        //<?javascript
        //    $scope.form_id = "5aa657defdaef838271d946f";
        //
        //?>

        <?javascript
            $scope.forForm = (item) => item.form == $scope.form_id;
            $scope.isForm = (item) => item.id == $scope.form_id;

            $scope.filename = $scope.form_id+"_"+_util.format.date(new Date(),"YYYY_MM_DD_HH_mm")+"_responses.csv";
        ?>

        dml.select(from:"answer", where:{{forForm}})
        set("answers")
        dml.select(from:"form", where:{{isForm}})
        set("form")

        <?javascript

        let questions = $scope.form[0].config.questions;

        let answers = $scope.answers.map ((a) => {
          a.data = _.pairs(a.data).map(d => {
            d[1].title = questions[d[0]].options.title;
            
            d[1].id = d[0];
            
            if (!d[1].value) {
              return d[1]
            }
            
            if( ["influences"].indexOf(d[1].type) >=0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: v.property,
                  property_title: questions[d[0]].options.properties[v.property].title,
                  value:v.value
                }
              }) 
            }

            if( ["pairs","radiopairs"].indexOf(d[1].type) >=0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: v.property,
                  property_title: questions[d[0]].options.properties[v.property].title,
                  value:1
                }
              }) 
            }

            if( ["radio","check","dropdown"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v,
                  entity_title: questions[d[0]].options.nominals[v].title,
                  property_id: "",
                  property_title:"",
                  value:1
                }
              }) 
            }
            
            if( ["scales"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: "",
                  property_title:"",
                  value:v.value
                }
              }) 
            }
            
            
            if( ["text","rate","range","datetime","scale"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: "",
                  entity_title: "",
                  property_id: "",
                  property_title:"",
                  value:(d[1].type=="datetime")? _util.format.date(new Date(v), "DD/MM/YY HH:mm") : v
                }
              }) 
            }
            
            return d[1];
          })
          return a;
        });





        let responses = [];

        answers = answers.forEach( a => {
            a.data.forEach( d => {
              if(d.value){
                d.value.forEach( v => {
                    responses.push({
                      response_id:a.id,
                      updatedAt: _util.format.date(a.updatedAt, "DD/MM/YY HH:mm"),
                      form:a.form,
                      respondent:(a.user.email)? a.user.email : "",
                      question_id: d.id,
                      question_title: d.title,
                      question_type: d.type,
                      valid:(d.valid)? 1 : 0,
                      entity_id: v.entity_id,
                      entity_title:v.entity_title,
                      property_id:v.property_id,
                      property_title:v.property_title,
                      value:v.value     
                    })
                  })    
              } 
            })
        });

        $scope.responses = responses;

        ?>

        get("responses")
        export({{filename}})


    `,
    loadAllResponses:
    `
      // loadAllResponses    
        <?javascript
            $scope.forForm = (item) => item.form == $scope.form_id;
            $scope.isForm = (item) => item.id == $scope.form_id;

            // $scope.filename = $scope.form_id+"_"+_util.format.date(new Date(),"YYYY_MM_DD_HH_mm")+"_responses.csv";
        ?>

        dml.select(from:"answer", where:{{forForm}})
        set("answers")
        dml.select(from:"form", where:{{isForm}})
        set("form")

        <?javascript

        let questions = $scope.form[0].config.questions;

        let answers = $scope.answers.map ((a) => {
          a.data = _.pairs(a.data).map(d => {
            d[1].title = questions[d[0]].options.title;
            
            d[1].id = d[0];
            
            if (!d[1].value) {
              return d[1]
            }
            
            if( ["influences"].indexOf(d[1].type) >=0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: v.property,
                  property_title: questions[d[0]].options.properties[v.property].title,
                  value:v.value
                }
              }) 
            }

            if( ["pairs","radiopairs"].indexOf(d[1].type) >=0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: v.property,
                  property_title: questions[d[0]].options.properties[v.property].title,
                  value:1
                }
              }) 
            }

            if( ["radio","check","dropdown"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v,
                  entity_title: questions[d[0]].options.nominals[v].title,
                  property_id: "",
                  property_title:"",
                  value:1
                }
              }) 
            }
            
            if( ["scales"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: v.entity,
                  entity_title: questions[d[0]].options.entities[v.entity].title,
                  property_id: "",
                  property_title:"",
                  value:v.value
                }
              }) 
            }
            
            
            if( ["text","rate","range","datetime","scale"].indexOf(d[1].type) >= 0 ){
              d[1].value = d[1].value.map(v => {
                return {
                  entity_id: "",
                  entity_title: "",
                  property_id: "",
                  property_title:"",
                  value:(d[1].type=="datetime")? _util.format.date(new Date(v), "DD/MM/YY HH:mm") : v
                }
              }) 
            }
            
            return d[1];
          })
          return a;
        });





        let responses = [];

        answers = answers.forEach( a => {
            a.data.forEach( d => {
              if(d.value){
                d.value.forEach( v => {
                    responses.push({
                      response_id:a.id,
                      updatedAt: _util.format.date(a.updatedAt, "DD/MM/YY HH:mm"),
                      form:a.form,
                      respondent:(a.user.email)? a.user.email : "",
                      question_id: d.id,
                      question_title: d.title,
                      question_type: d.type,
                      valid:(d.valid)? 1 : 0,
                      entity_id: v.entity_id,
                      entity_title:v.entity_title,
                      property_id:v.property_id,
                      property_title:v.property_title,
                      value:v.value     
                    })
                  })    
              } 
            })
        });

        $scope.responses = responses;

        ?>

        get("responses")

    `
}


let FormIO = class {

  constructor(scope, transport) {
    this.$dps = transport;
    this.scope = scope;
  }

  runDPS(params) {

    return this.$dps.post("/api/script", {
        "script": params.script,
        "state": { storage: params.state }
      })
      .then(response => {
        return {
          type: response.data.type,
          data: response.data.data
        }
      })
  }

  runDPSwithFile(file, params) {

    return this.$dps.postWithFile("/api/script", file, {
        "script": params.script,
        "state": { storage: params.state }
      })
      .then(function(response) {
        return {
          type: response.data.type,
          data: response.data.data
        }
      })

  }

  loadLocalFile(file, encoding) {

    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = (e) => {
        resolve(e.target.result)
      }
      fr.readAsText(file, encoding);
      // reader.readAsText(file, 'CP866');
    })

  }

  createForm(form) {

    return this.runDPS({
      script: dps.createForm,
      state: { form: form }
    })

  }




  cloneForm(form) {
    let f = angular.extend({}, form);
    
    f.config.cloned = form.id;
    f.metadata.app_url.value = location.href;
    delete f.id;
    delete f.updatedAt;
    delete f.createdAt;
    
    return this.runDPS({
      script: dps.cloneForm,
      state: { form: f }
    })

  }

  loadForm(formId) {

    return this.runDPS({
      script: dps.getForm,
      state: { form: formId }
    })

  }

  updateForm(form) {

    return this.runDPS({
      script: dps.updateForm,
      state: { form: form }
    })

  }

  extendForm(form) {
    return this.runDPS({
      script: dps.extendForm,
      state: { form: form }
    })
  }

  deleteForm(formId) {

    return this.runDPS({
      script: dps.deleteForm,
      state: { form: formId }
    })

  }

  loadAnswer(user, formId) {
    return this.runDPS({
      script: dps.getAnswer,
      state: {
        user: user,
        form: formId
      }
    })
  }

  updateAnswer(answer) {

    return this.runDPS({
      script: dps.updateAnswer,
      state: { answer: answer }
    })

  }

  exportResponses(form_id){
    return this.runDPS({
      script: dps.exportResponses,
      state: { form_id: form_id }
    })
  }


  loadResponseStat(form) {

    return this.runDPS({
      script: dps.loadResponseStat,
      state: { form_id: form }
    })

  }

  loadAllResponses(form) {

    return this.runDPS({
      script: dps.loadAllResponses,
      state: { form_id: form }
    })

  }



  prepareContext(u) {
    let metadata = {}
    _.toPairs(this.scope.widget.form.metadata)
      .map(item => item[1])
      .forEach((item) => {
        metadata[item.key] = item.value;
      })

    metadata.app_url +=(u.name)? "" : `?apikey=${u.apikey}`;
    return {
        metadata: metadata,
        user: u
      }
  }

  sendMails() {
    
    let templateStr = `sendmail({{o<%= index %>}});
                      ` 
    let state = {}
    let script = "";
   
    this.scope.widget.form.config.access.users.forEach((u,index) => {
      
      script += _.template(templateStr)({index:index})
      
      state[("o"+index)] = {
        from: this.scope.widget.form.config.access.notiificator,
        to: u.email,
        subject: this.scope.widget.form.config.access.notificationSubject,
        html: _.template(this.scope.widget.form.config.access.notificationTemplate)
                (this.prepareContext(u))
      }
    })
  
   
// TODO Comments 3 lines below for production mode
   // return new Promise((resolve) => {
   //  resolve({script:script, state:state})
   // }) 



    return this.runDPS({
      script: script,
      state: state
    })

  }

}


module.exports = FormIO;

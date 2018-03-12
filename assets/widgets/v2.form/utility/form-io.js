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


  loadResponseStat(form) {

    return this.runDPS({
      script: dps.loadResponseStat,
      state: { form: form }
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
   return new Promise((resolve) => {
    resolve({script:script, state:state})
   }) 



    return this.runDPS({
      script: script,
      state: state
    })

  }

}


module.exports = FormIO;

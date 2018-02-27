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
            if(!$scope.user.email) return false;
            return item.form==$scope.form && item.user.email==$scope.user.email;
          }  
          $scope.byDate = _util.comparator.Date["Z-A"](item => item.updatedAt)
      ?>

      dml.select(from:"answer",where:{{forUser}})
      sort({{byDate}})
      select("$[0]")
      // set("r")
      // return("r[0]")
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

  loadLocalFile(file) {

    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = (e) => {
        resolve(e.target.result)
      }
      fr.readAsText(file);
    })

  }

  createForm(form) {

    return this.runDPS({
      script: dps.createForm,
      state: { form: form }
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

}


module.exports = FormIO;

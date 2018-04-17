import angular from 'angular';
import Question from "./question.js"

       


let OneToMany = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
	      type:{value:"radio", title:"Оne of many"}, 
	      widget:{
	        css:"fa-stop-circle", 
	        view:this.prefix+"radio.view.html", 
	        options:this.prefix+"radio.options.html"
	      },
	      options:{
	        required: false,
	        addEnabled: false,
	        showUserInfo: true,
	        title:"", 
	        note:"",
	        nominals:{}
	      }
	    }  
		

	    this.configure(previus) 
	}

	configure(previus) {
    	
    	super.configure()
    	if(!previus) return;

          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config

          this.state.options.title = previus.state.options.title; 
          this.state.options.note = previus.state.options.note;
          this.state.options.required = previus.state.options.required;
          this.state.options.showResponsesStat = previus.state.options.showResponsesStat;


          if(["dropdown","check"].indexOf(previus.state.type.value) < 0) return;
          
          this.state.options.nominals = {};
          
          for ( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = { title: item.title, user: item.user }; 
          }
          
          if (previus.state.type.value == "check"){
            this.state.options.addEnabled = previus.state.options.addEnabled;
            this.state.options.showUserInfo = previus.state.options.showUserInfo;
          }
    }

    applyAnswer() {}

    prepare() {

          // prepare helped data structures
          this.scope.alternatives = 
              this.scope.listEditorTools.createCollection(
                _.toPairs(this.state.options.nominals)
                  .map(item => {
                    return {
                      id:item[0],
                      title:item[1].title,
                      user:item[1].user
                    }
                  })
                  .filter( item =>  {
                    if(this.scope.globalConfig.designMode) return true;
                    if (this.state.options.userCollaboration) return true;
                    if(item.user) return item.user.email == this.scope.user.email;
                    return true
                  })
              )    
          
          this.scope.checkboxes = {};
          for(let item of this.scope.alternatives){
           this.scope.checkboxes[item.id] = false; 
          }   

          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"radio",
            value:[]
          }

        }

        setValue(value) {
          if(angular.isDefined(value)){
            this.scope.answer.value[0] = value;
          }
          this.validateAnswer();
        	// this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))	
        }

        validateAnswer() {

          if(!this.state.options.required) {
            this.scope.answer.validationResult = { 
                valid: true,
                message: "",
                needSaveAnswer: true,
                needSaveForm: true 
              }
          } else {
            this.scope.answer.validationResult = {
              valid: ( angular.isDefined(this.scope.answer.value[0]) ),
              message: ( angular.isDefined(this.scope.answer.value[0]) ) 
                          ? ""
                          : this.scope.message("O2M_VALIDATION", {
                              question : this.scope.truncate(this.scope.config.state.options.title, 40)
                            }),
              needSaveAnswer: true,
              needSaveForm: true 
            }  
          }
        
          this.scope.answer.valid =  this.scope.answer.validationResult.valid
        }

       
        updateConfig() {

          //  transform helped data structures into config
          if(this.scope.globalConfig.designMode){
            this.state.options.nominals = {};
          } 
          // update exists nominals and add new nominals
          this.state.options.nominals = this.state.options.nominals || {};
          // console.log("UPDATE CONFIG",this.scope.globalConfig.designMode, this.state.options.nominals, this.scope.alternatives )
          for( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = {title: item.title, user:item.user}; 
          }
          //  transform helped data structures into config
          // this.state.options.nominals = {};
          // for( let item of this.scope.alternatives ){
          //   this.state.options.nominals[item.id] = {title: item.title, user:item.user}; 
          // }
        }

          getResponseStat(responses) {
            if(!responses) return;
            let RStat = {};
            this.scope.alternatives.forEach(e => {
              RStat[e.id] = responses.filter(r => {
                  if ( r.entity_id == e.id ) {
                      return true
                    } else {
                      return false
                    }
                }).length;
              
            })
            // console.log("RSTAT!!!!!!!!!!!!", RStat)
            let pairs = _.toPairs(RStat)
            if(pairs.length == 0){
              this.scope.rstat = undefined;
              return;  
            }
            let values = pairs.map(item => item[1])
            let sum = values.reduce((item,sum) => {return sum+item})
            if(sum==0){
                  values = values.map(item => 0)
                }else{
                  values = values.map(item => item/sum )
                }
            // console.log(values)    
            pairs.forEach((p,index) => {
              RStat[p[0]] = values[index]
            })    
            // console.log(RStat)
            this.scope.rstat = RStat;
          }

          isResponse(value){
            return this.scope.answer.value.indexOf(value) >= 0
          }
        

}

module.exports = OneToMany;


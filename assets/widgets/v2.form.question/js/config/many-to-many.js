import angular from 'angular';
import Question from "./question.js"



let minValues = [
  {value: 0 , title:"0"},
  {value: 1 , title:"1"},
  {value: 2 , title:"2"},
  {value: 3 , title:"3"},
  {value: 4 , title:"4"},
  {value: 5 , title:"5"}
]

let maxValues = [
  {value: 0 , title:"*"},
  {value: 1 , title:"1"},
  {value: 2 , title:"2"},
  {value: 3 , title:"3"},
  {value: 4 , title:"4"},
  {value: 5 , title:"5"}
]




let ManyToMany = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  ={
      
      minValues : minValues,
      maxValues : maxValues,

			type : {value:"check", title:"Many of many"}, 
      	
	      	widget : {
		        css:"fa-check-square", 
		        view:this.prefix+"check.view.html", 
		        options:this.prefix+"check.options.html"
		     },

	      	options : {
		        required: false,
		        addEnabled: false,
		        showUserInfo: false,
            userCollaboration:false,
		        title:"", 
		        note:"",
		        nominals:{},
            constraints:{
              min:"1",
              max:"0"
            }
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
          

          if(["dropdown","radio"].indexOf(previus.state.type.value) < 0) return;
          
          this.state.options.nominals = {};
          
          for ( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = { title: item.title, user: item.user }; 
          }
          
          if (previus.state.type.value == "radio"){
            this.state.options.addEnabled = previus.state.options.addEnabled;
            this.state.options.showUserInfo = previus.state.options.showUserInfo;
          }
    }

    prepare() {
          // console.log("PREPARE", this.scope.globalConfig.designMode, this.state.options.nominals)
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
          
          // console.log("PREPARE"
          //     , this.scope.globalConfig.designMode
          //     , this.state.options.nominals
          //     , this.scope.alternatives)
          
          this.scope.checkboxes = {};
          for(let item of this.scope.alternatives){
           this.scope.checkboxes[item.id] = false; 
          }   

          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type: "check",
            value: []
          }
        }

        setValue(value,state) {
          
          if(angular.isDefined(state)) this.scope.checkboxes[value] = state;

          this.scope.answer.value = _.toPairs(this.scope.checkboxes)
                                  .filter(item => item[1])
                                  .map(item => item[0]);
          this.validateAnswer();
          // this.scope.answer.valid = this.scope.answer.value.length > 0;

        }

        validateAnswer() {

          let minC = this.scope.answer.value.length >= this.state.options.constraints.min*1
          let maxC = this.scope.answer.value.length <= this.state.options.constraints.max*1
          maxC = maxC || (this.state.options.constraints.max == 0)

          
          if(!this.state.options.required) {
            this.scope.answer.validationResult = { 
                valid: true,
                message: "",
                needSaveAnswer: true,
                needSaveForm: true 
              }
          } else {
            this.scope.answer.validationResult = {
              valid: ( minC && maxC ),
              message: ( minC && maxC ) 
                          ? ""
                          : this.scope.message("M2M_VALIDATION", {
                              min : this.state.options.constraints.min,
                              max : this.state.options.constraints.max,
                              question : this.scope.truncate(this.scope.config.state.options.title, 40),
                              selection : this.scope.answer.value.length  
                            }),
              needSaveAnswer: true,
              needSaveForm: true 
            }  
          }
        
          this.scope.answer.valid =  this.scope.answer.validationResult.valid
        }

        applyAnswer() {
          this.scope.checkboxes = {};
          for(let item of this.scope.alternatives){
           this.scope.checkboxes[item.id] = this.scope.answer.value.indexOf(item.id) >= 0; 
          }
          this.validateAnswer();
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
            // console.log(pairs)
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


module.exports = ManyToMany;
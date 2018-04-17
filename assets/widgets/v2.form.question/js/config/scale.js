import angular from 'angular';
import Question from "./question.js"


let Scale = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
      type:{value:"scale", title:"Scale"}, 
      widget:{
        css:"fa-ellipsis-h", 
        view:this.prefix+"scale.view.html", 
        options:this.prefix+"scale.options.html"
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
          paletteIndex: 0,
          reversePalette: false,
          pallete: [],
          opacity: 70,
          "undefined":" #aaa"  
        },
        
        decoration:{
          icon:"fa-star",
          useColors: true,
          showValues: true,
          showTitles: true
        }
	    }
    }    
		

	    this.configure(previus) 
	}

	configure(previus) {
    	super.configure()
      if(!previus) return;
      this.state.options.title = previus.state.options.title; 
      this.state.options.note = previus.state.options.note;
      this.state.options.required = previus.state.options.required;
      this.state.options.showResponsesStat = previus.state.options.showResponsesStat;
    }

    applyAnswer() {
      
      if(this.scope.answer && this.scope.answer.value[0]){
        this.setValue(this.scope.answer.value[0]);
      }  
    }

    setPalette() {
      this.state.options.colors.pallete = 
        this.scope.colorUtility.palettes[this.state.options.colors.paletteIndex].map(item => item);
      if(this.state.options.colors.reversePalette){
        this.state.options.colors.pallete = this.state.options.colors.pallete.reverse();
      }  
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
                      : this.scope.message("SCALE_VALIDATION", {
                          question : this.scope.truncate(this.scope.config.state.options.title, 40)
                        }),
          needSaveAnswer: true,
          needSaveForm: true 
        }  
      }
    
      this.scope.answer.valid =  this.scope.answer.validationResult.valid
    }

    prepare() {
          
          this.state.options.decoration = this.state.options.decoration || {
                                                                              useColors: true,
                                                                              showValues: true,
                                                                              showTitles: true,
                                                                              icon:"fa-star"
                                                                           };
          this.setPalette();
          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"scale",
            value:[]
          }

    }

  setValue(value) {
  	this.scope.answer.value[0] = value;
    this.validateAnswer();
    // this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))	
  }

 
  updateConfig() {
  }

  generateValues() {
    let values = this.scope.config.state.options.ordinals.values;
    let range = this.scope.config.state.options.ordinals.range;
    let lowTitle = values[0].title;
    let highTitle = values[values.length-1].title;
    let newValues = []
    for(let i=range.min; i<=range.max; i++) newValues.push({value:i})
    newValues[0].title = lowTitle;
    newValues[newValues.length-1].title = highTitle;
    this.scope.config.state.options.ordinals.values = newValues;   
  }

  getResponseStat(responses) {
    if(!responses) return;
      let RStat = {};

      this.scope.config.state.options.ordinals.values.forEach(e => {
        RStat[e.value] = responses.filter(r => {
            if ( r.question_id == this.scope.config.state.id  && r.value == e.value) {
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

    isResponse(value) {
       return this.scope.answer.value[0] == value
    }

}

module.exports = Scale;

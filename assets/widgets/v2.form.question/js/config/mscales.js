import angular from 'angular';
import Question from "./question.js"

let MScales = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
      type:{value:"scales", title:"Scales"}, 
      widget:{
        css:"fa-th-list", 
        view:this.prefix+"scales.view.html", 
        options:this.prefix+"scales.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        entities:{},
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
        disables:[],
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

          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          this.state.options.title = previus.state.options.title; 
          this.state.options.note = previus.state.options.note;
          this.state.options.required = previus.state.options.required;
          this.state.options.showResponsesStat = previus.state.options.showResponsesStat;


          if(["dropdown","check", "radio", "scale"].indexOf(previus.state.type.value) < 0) return;
          
          if(["dropdown","check", "radio"].indexOf(previus.state.type.value) >= 0){
            this.state.options.entities = {};
          
            for ( let item of this.scope.alternatives ){
              this.state.options.entities[item.id] = { title: item.title, user: item.user }; 
            }  
          }
          
          if( previus.state.type.value == "scale" ){
            this.state.options.ordinals = previus.state.options.ordinals;
            this.state.options.colors = previus.state.options.colors;
          }
          
          
    }

    setPalette() {
      this.state.options.colors.pallete = 
        this.scope.colorUtility.palettes[this.state.options.colors.paletteIndex].map(item => item);
      if(this.state.options.colors.reversePalette){
        this.state.options.colors.pallete = this.state.options.colors.pallete.reverse();
      }  
    }

    applyAnswer() {}

    prepare() {
          this.state.options.decoration = this.state.options.decoration || {
                                                                              useColors: true,
                                                                              showValues: true,
                                                                              showTitles: true,
                                                                              icon:"fa-star"
                                                                           };

          this.setPalette();

          // prepare helped data structures
          this.scope.entities = 
            this.scope.listEditorTools.createCollection(
              _.toPairs(this.state.options.entities)
                                    .map(item => {
                                      return {
                                        id:item[0],
                                        title:item[1].title,
                                        user:item[1].user
                                      }
                                    })
            )                        
          
          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"scales",
            value: [] 
          }

        }

        setValue(entity, value) {
          
          let index = this.scope.answer.value
                      .map(item => item.entity)
                      .indexOf(entity)
          
          if(index < 0){
            this.scope.answer.value.push({entity:entity, value:value})
          } else {
            this.scope.answer.value[index].value = value;
          }
          
          this.validateAnswer()
          // this.scope.answer.value.forEach( ( item, index) => {
             
          //   if( this.scope.entities.map(v => v.id).indexOf(item.entity) <0 ){
          //     this.scope.answer.value.splice(index,1) 
          //   }            
          // })

          this.scope.answer.valid = this.scope.entities.length <= this.scope.answer.value.length;
        }

        validateAnswer() {
          // console.log(this.scope.answer.value, this.state.options.entities)
          this.scope.answer.value = this.scope.answer.value.filter(item => this.state.options.entities[item.entity]) 
          
          let isValid = this.scope.entities.length == this.scope.answer.value.length 
                  
          if(!this.state.options.required) {
            this.scope.answer.validationResult = { 
                valid: true,
                message: "",
                needSaveAnswer: true,
                needSaveForm: true 
              }
          } else {
            this.scope.answer.validationResult = {
              valid: isValid,
              message: ( isValid ) 
                          ? ""
                          : this.scope.message("SCALES_VALIDATION", {
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
          this.state.options.entities = {};
          for( let item of this.scope.entities ){
            this.state.options.entities[item.id] = {title: item.title, user:item.user}; 
          }
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

        getValue(entity) {
          if(this.scope.answer.value.map(item => item.entity).indexOf(entity)>=0){
            return 
            this.scope.answer.value[
              this.scope.answer.value.map(item => item.entity).indexOf(entity)
            ].value  
          }
        }

        getResponseStat(responses) {
          if(!responses) return;
            let RStat = {};
            this.scope.entities.forEach(e => {
              RStat[e.id] = {}
              this.scope.config.state.options.ordinals.values.forEach(p => {
                RStat[e.id][p.value] = responses.filter(r => {
                  if ( (r.entity_id == e.id) && (r.value == p.value) ){
                      return true
                    }else{
                      return false
                    }
                }).length;
              })
            })
            let pairs = _.toPairs(RStat)

            if(pairs.length == 0){
              this.scope.rstat = undefined;
              return;  
            }

            pairs.forEach(e => {
                let values = _.toPairs(e[1]);
                let v = values.map(item => item[1])
                let sum = v.reduce((item,sum) => {return sum+item})
                if(sum==0){
                  v = v.map(item => 0)
                }else{
                  v = v.map(item => item/sum )
                }

                values.map(item => item[0]).forEach((item,index)=>{
                  RStat[e[0]][item] = v[index]
                })  
            });

        

            this.scope.rstat = RStat;
        }

      isResponse(entity,value) {
        let index = this.scope.answer.value.map(item => item.entity).indexOf(entity);
        if(index >= 0){
          return this.scope.answer.value[index].value == value
        } else{
          return false
        }
      }


  
}

module.exports = MScales;


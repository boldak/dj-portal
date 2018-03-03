import angular from 'angular';

let AnswerUtils  = class {

  constructor(scope) {
    this.scope = scope;
  }

  create() {

    let res = {
      form: this.scope.widget.form.id,
      user: this.scope.user,
      data: {}
    }
    
    return this.normalize(res);

  }

  normalize(answer) {

  	let a = _.toPairs(answer.data)
  			 .map(item => item[0])  	
  	
  	// console.log("A", a)
  	
  	let r = _.toPairs(this.scope.widget.form.config.questions)
  			 .map(item => item[0])	
    
    // console.log("R", r)

    a.forEach((item) => {
    	if(r.indexOf(item) < 0){
    		delete answer.data[item]
    	}
    })

    r.forEach((item) => {
    	answer.data[item] = answer.data[item] || { valid: false }  
    })  

    // console.log("NORMALIZED",answer)
    return answer;

  }

  validateAnswers() {

    let a = _.toPairs(this.scope.answer.data)
    let nvc = a.filter((item) => !item[1].valid).length;
    let vc = a.length - nvc;
    if (nvc == 0) {
      this.scope.fanButton.state("success")
    } else {
      if ((a.length - nvc) > 0) {
        this.scope.fanButton.state("warning");
        this.scope.fanButton._state.tooltip =
          `You can save the response. 
           But ${nvc} out of ${a.length} responses are not completed.
           Click to save changes.`
          
      } else {
        this.scope.fanButton.state("none");
      }
    }
    this.scope.modified.answer = true;
  }

}

module.exports = AnswerUtils;

import angular from 'angular';

import "moment";

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

  round( date, start, level, value) {
      let defFormat = "YYYY-MM-DD HH:mm";
    
      let lo = moment(start).startOf(level).format(defFormat)
      let hi = moment(lo).add(value,level).format(defFormat)
      while(!(moment(date).isSameOrAfter(lo) && moment(date).isSameOrBefore(hi))){
        lo = hi;
        hi = moment(lo).add(value,level).format(defFormat);
      }

      let dLo = moment(date).diff(lo)
      let dHi = -moment(date).diff(hi)
      return (dLo < dHi) ? lo: hi
  }

  getResponseDynamic(responses) {

    let defFormat = "YYYY-MM-DD HH:mm";
    let inputFormat = "DD/MM/YY HH:mm";


    let RStat = responses
    // .filter(r => {
    //       if ( r.question_id == this.scope.config.state.id) {
    //           return true
    //         } else {
    //           return false
    //         }
    //     })
        .map(item => moment(new Date(item.date)))
        .sort((a,b) => a.diff(b))
        .map(item => item.format(defFormat))

    
    let p = [
      ['m',1],
      ['m',5],
      ['m',10],
      ['m',15],
      ['m',20],
      ['m',30],
      ['h',1],
      ['h',2],
      ['h',4],
      ['h',12],
      ['d',1],
      ['d',3],
      ['d',7],
      ['M',1],
      ['M',3],
      ['M',6],
      ['y',1],
      ['y',2],
      ['y',5],
      ['y',10]
    ]
    
    
    // let round = ( date, start, level, value) => {

    //   let lo = moment(start).startOf(level).format(defFormat)
    //   let hi = moment(lo).add(value,level).format(defFormat)
    //   while(!(moment(date).isSameOrAfter(lo) && moment(date).isSameOrBefore(hi))){
    //     lo = hi;
    //     hi = moment(lo).add(value,level).format(defFormat);
    //   }

    //   let dLo = moment(date).diff(lo)
    //   let dHi = -moment(date).diff(hi)
    //   return (dLo < dHi) ? lo: hi
    // }

    let getPoints = (start, stop, level, value) => {
      let res =[];
      let lo = moment(start).startOf(level).format(defFormat)
      let hi = moment(lo).add(value,level).format(defFormat)
      res.push(lo)
      while(!(moment(stop).isSameOrAfter(lo) && moment(stop).isSameOrBefore(hi))){
        lo = hi;
        hi = moment(lo).add(value,level).format(defFormat);
        res.push(lo)
      }
      res.push(hi)
      return res;      
    }

    

    let titleFormat = {
      'm' :['HH:mm',''],
      'h' :['DD.MM HH:','00'],
      'd' :['DD.MM',''],
      'M' :['MM.YY',''],
      'y' :['YYYY','']
    } 
    
    let u;
    
    for(u of p){
      if( (moment(RStat[RStat.length-1]).diff(RStat[0],u[0]) / u[1]) <= 24) break;
    }
    
    this.u = u;

    if(moment(RStat[RStat.length-1]).diff(RStat[0],u[0])<1) return;

    RStat = RStat.map(
      item => this.round(item,RStat[0],u[0],u[1])
    );

    let points = getPoints(RStat[0], RStat[RStat.length-1], u[0], u[1]);

    let stats = points.map(item => RStat.filter(t => moment(t).isSame(item,u[0])).length)
    let sum = stats.reduce((item,sum) => {return sum+item})
    
    
    if(sum==0){
          stats = stats.map(item => 0)
        }else{
          stats = stats.map(item => item/sum )
        }
    
    let max = stats.reduce((item,max) => {return (max>item) ? max : item})
        
    RStat = points.map((item,index) => {
      return {
        title: moment(item).format(titleFormat[u[0]][0])+titleFormat[u[0]][1],
        value: stats[index],
        height: (max>0) ? stats[index]/max : 0
      }
    })

    this.points = points;
    return RStat;
  }

}

module.exports = AnswerUtils;

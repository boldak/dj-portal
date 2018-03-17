import angular from 'angular';
import Question from "./question.js";

import "moment";

// console.log((new moment()).format("YYYY MM DD"))

let DateTime = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "datetime", title: "Date & Time" },
      widget: {
        css: "fa fa-calendar",
        view: this.prefix + "datetime.view.html",
        options: this.prefix + "datetime.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        format:"date",//"date",
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    super.configure()
  }

  applyAnswer() {
    if(this.scope.answer && this.scope.answer.value[0]){
        this.scope.answer.value[0] = new Date(this.scope.answer.value[0])  
    }
    
  }

  prepare() {
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      format:this.state.options.format,
      type: "datetime",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  getValue() {
    return (new Date(this.scope.answer.value[0]))//.toLocaleDateString()//.toLocaleString()
  }

  validateAnswer() {
   this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0])) 
  }

  updateConfig() {}

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

  getResponseStat(responses) {

    let defFormat = "YYYY-MM-DD HH:mm";
    let inputFormat = "DD/MM/YY HH:mm";


    let RStat = responses.filter(r => {
          if ( r.question_id == this.scope.config.state.id) {
              return true
            } else {
              return false
            }
        })
        .map(item => moment(item.value,inputFormat))
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
      'h' :['HH:','00'],
      'd' :['DD.MM',''],
      'M' :['MM.YY',''],
      'y' :['YYYY','']
    } 
    
    let u;
    
    for(u of p){
      if( (moment(RStat[RStat.length-1]).diff(RStat[0],u[0]) / u[1]) <= 10) break;
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

    RStat = points.map((item,index) => {
      return {
        title: moment(item).format(titleFormat[u[0]][0])+titleFormat[u[0]][1],
        value: stats[index]
      }
    })

    this.points = points;
    this.scope.rstat = RStat;
  }

  isResponse(index) {
    
    if(this.points){
      return moment(
        this.round(moment(this.scope.answer.value[0]), this.points[0], this.u[0], this.u[1])
        ).isSame(this.points[index],this.u[0])
    }else{
      return false
    }
  }



}

module.exports = DateTime;

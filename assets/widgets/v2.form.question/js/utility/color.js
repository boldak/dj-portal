import angular from 'angular';
import "d3";
import "tinycolor";

let ColorUtility = class {
	constructor(scope){
		this.scope = scope;
	}


	getColor(pallete, opacity, range, value, invert) {

	      if (angular.isDefined(value)){
	        let pc;
	        let s = d3.scale.linear().domain([range.min,range.max]).rangeRound([0,pallete.length-1])
	        pc = pallete[s(value)]
	        


	        let c = tinycolor(pc);
	        if ( invert ) {
	            c.spin(180);
	            if(c.isLight()){
	              return c.darken(70).toRgbString()
	            } else {
	              return c.lighten(70).toRgbString()
	            }
	        } else {
	          c.setAlpha(opacity/100);
	          return c.toRgbString()
	        }  
	      } else {
	        return "#e7e7e7"
	      }
	}

	scaleColor(value) {
		let res =  
		( angular.isDefined(this.scope.answer.value[0]))
              ? ((value >= this.scope.config.state.options.ordinals.range.min)
                  && (value < this.scope.answer.value[0])
                ) 
                ? this.getColor(
                        this.scope.config.state.options.colors.pallete,
                        this.scope.config.state.options.colors.opacity,
                        this.scope.config.state.options.ordinals.range,
                        value)
                : ((value >= this.scope.config.state.options.ordinals.range.min)
                    && (value == this.scope.answer.value[0])
                  )
                  ? this.getColor(
                        this.scope.config.state.options.colors.pallete,
                        this.scope.config.state.options.colors.opacity,
                        this.scope.config.state.options.ordinals.range,
                        value)
                  : "#e7e7e7"
              : "#e7e7e7";
        
        return res;
		      
	}

	scaleFontColor(value) {
		let res =  
		( angular.isDefined(this.scope.answer.value[0]))
              ? ((value >= this.scope.config.state.options.ordinals.range.min)
                  && (value < this.scope.answer.value[0])
                ) 
                ? "#5b6d81"
                : ((value >= this.scope.config.state.options.ordinals.range.min)
                    && (value == this.scope.answer.value[0])
                  )
                  ? "#5b6d81"
                  : "#e7e7e7"
              : "#e7e7e7";
        
        return res;
	}

	mScaleFontColor(entity, value){
		let index = this.scope.answer.value.map(item => item.entity).indexOf(entity)

		  return  ( angular.isDefined(this.scope.answer.value[index]))
		              ? ((value >= this.scope.config.state.options.ordinals.range.min)
		                  && (value < this.scope.answer.value[index].value)
		                ) 
		                ? "#5b6d81"
		                : ((value >= this.scope.config.state.options.ordinals.range.min)
		                    && (value == this.scope.answer.value[index].value)
		                  )
		                  ? "#5b6d81"
		                  : "#e7e7e7"
		              : "#e7e7e7"              
	}

	mScaleColor(entity, value){
		let index = this.scope.answer.value.map(item => item.entity).indexOf(entity)

		  return  ( angular.isDefined(this.scope.answer.value[index]))
		              ? ((value >= this.scope.config.state.options.ordinals.range.min)
		                  && (value < this.scope.answer.value[index].value)
		                ) 
		                ? this.getColor(
		                        this.scope.config.state.options.colors.pallete,
		                        this.scope.config.state.options.colors.opacity,
		                        this.scope.config.state.options.ordinals.range,
		                        value)
		                : ((value >= this.scope.config.state.options.ordinals.range.min)
		                    && (value == this.scope.answer.value[index].value)
		                  )
		                  ? this.getColor(
		                        this.scope.config.state.options.colors.pallete,
		                        this.scope.config.state.options.colors.opacity,
		                        this.scope.config.state.options.ordinals.range,
		                        value)
		                  : "#e7e7e7"
		              : "#e7e7e7"              
	}


	influenceBg(value) {

		return (angular.isDefined(value)) 
			? 	this.getColor (
			        this.scope.config.state.options.colors.pallete,
			        this.scope.config.state.options.colors.opacity,
			        this.scope.config.state.options.ordinals.range,
			        value
			    )
			:   "#e7e7e7";

	}

	
	influenceBorder(value) {

		return tinycolor(this.influenceBg(value)).darken(10).toRgbString()

	}

	influenceColor(value) {

		
		return (angular.isDefined(value)) 
			? 	this.getColor (
			        this.scope.config.state.options.colors.pallete,
			        this.scope.config.state.options.colors.opacity,
			        this.scope.config.state.options.ordinals.range,
			        value,
			        true
			    )
			:   tinycolor("#e7e7e7").darken(10).toRgbString();	
	
	}

	darkPallete(){
		this.scope.config.state.options.colors.pallete = 
			this.scope.config.state.options.colors.pallete.map( item => tinycolor(item).darken(10).toRgbString())

	}

	lightPallete(){
				this.scope.config.state.options.colors.pallete = 
			this.scope.config.state.options.colors.pallete.map( item => tinycolor(item).lighten(10).toRgbString())

	}

}

module.exports = ColorUtility



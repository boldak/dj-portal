import angular from 'angular';


let FormMetadata = class {
	
	constructor (scope) {
		this.scope = scope;
		this.metadata = [];
	}

	valid(field) {
    let res;
      
      if(!this.scope.textFields.key){
        res = false;
        if(field){
          field.$error = (field.$error) ? field.$error : {}; 
          field.$error.required = true;  
        }
        
      } else {
         res = this.metadata.map(item => item.key).indexOf(this.scope.textFields.key) < 0
         if (field){
            field.$error = (field.$error) ? field.$error : {};
          if (res) {
            field.$error.doublicate = undefined;
            field.$valid = true;
            field.$invalid = false;
           } else {
            field.$error.doublicate = true;
           }
         }  
      }
    return res;
  }
	
	prepaire() {
      this.metadata = _.toPairs(this.scope.widget.form.metadata)
                          .map(item => {
                            return {
                              key:item[0],
                              value:item[1].value,
                              required:item[1].required,
                              editable: item[1].editable
                            }
                          })
	}

    add(key, value) {
      this.metadata.push({
          key: key,
          value: value,
          required: false,
          editable: true
      })
      this.scope.textFields.key = undefined;
      this.scope.textFields.value = undefined;
    }

    delete(key) {
      let index = this.metadata.map(item => item.key).indexOf(key);
      this.metadata.splice(index,1)
    }

    update () {
      if(this.scope.widget.form){
        this.scope.widget.form.metadata = {}
        this.metadata.forEach((item) => {
          this.scope.widget.form.metadata[item.key] = item
        })  
      }
    }
}

module.exports = FormMetadata;


import * as Cookie from "modules/tiny-cookie/dist/tiny-cookie.js"
import dialogFactory from "djvue/components/core/ext/configDialog.js"
import warningDialog from "djvue/components/core/dialogs/warning.vue"


 Vue.prototype.$dialog.component("warningDialog", warningDialog)


export var cookie = {

        install: function (Vue) {
            Vue.prototype.$cookie = this;
            Vue.cookie = this;
        },
        set: function (name, value, daysOrOptions) {
            var opts = daysOrOptions;
            if(Number.isInteger(daysOrOptions)) {
                opts = {expires: daysOrOptions};
            }
            return Cookie.set(name, value, opts);
        },

        put: function (name, value, daysOrOptions) {
        		return this.set(name, value, daysOrOptions)
        },

        get: function (name) {
            return Cookie.get(name);
        },

        delete: function (name, options) {
            var opts = {expires: -1};
            if(options !== undefined) {
                opts = Object.assign(options, opts);
            }
            this.set(name, '', opts);
        }
    }


export var portal = {
	install(Vue, options = {baseURL:"/"}) {
		Vue.prototype.$portal = axios.create(options)
	}
}

export var http = {
    install(Vue, options) {
        Vue.prototype.$http = axios.create(options)
    }
}

var findChild =  (component, filter) => {
				let res = _.find(component.$children, filter)
				if (!res) {
					component.$children.forEach(child => {
						if ( child.$children && !res){
							res = findChild(child, filter)	
						}
					})
				}
				return res
}

var toTree = (object) =>
                
                    _.keys(object).map( key => {
                        return {
                            name: (_.isObject(object[key])) ? key: `${key}: ${object[key]}`,
                            children: (!_.isObject(object[key])) ? undefined : toTree(object[key]) 
                        }
                    })

export var djvue = {
	install(Vue, options){
        
        Vue.createConfigDialog = (components) => dialogFactory(components)
        
		Vue.prototype.$djvue = {
			
			fullReload: (url) => window.location = url ||  window.location,
			login: () => {
				Vue.cookie.set('redirectToUrl', window.location);
      			window.location = `/auth/google`;
			},
			randomName: () => Math.random().toString(36).substring(2),
			findChild,
            toTree,

            extend:( object, extention) => {
                return {...object,...JSON.parse(JSON.stringify(extention))}
            },

            createConfigDialog(components){
                return dialogFactory(components)
            },

            warning(options){
                options = options || {}
                options.text = options.text || "";
                options.type = options.type || "info";
                options.title = options.title || options.type;

                Vue.prototype.$dialog.showAndWait(warningDialog, {options:options})
            }
		}
		
	}
}

var eventHub={}

export var eventhub = {
	install(Vue, options){
		 eventHub = new Vue();
		 
		 Object.defineProperties(eventHub, {
            on: {
                get: function() {
                    return eventHub.$on
                }
            },
            emit: {
                get: function() {
                	return eventHub.$emit
                }
            },
            off: {
                get: function() {
                    return eventHub.$off
                }
            }
        });

        Object.defineProperty(Vue.prototype, '$eventHub', {
            get: function() {
                return eventHub;
            }
        });

        Object.defineProperty(Vue, 'eventHub', {
            get: function() {
                return eventHub;
            }
        });
	}	
}




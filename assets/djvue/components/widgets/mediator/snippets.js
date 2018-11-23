export default {
	
	"default":{
      
        type:"html-widget", 
        // id:Vue.prototype.$djvue.randomName(),
        name:"noname",
        icon:"mdi-language-html5",
        options: {},
        data:{
          source:"embedded",
          embedded:`<h2 color="#eee"><center>not configured<center></h2><p>Use options dialog for configure this widget</p>`
        }
       
    },

    "title":{
      type:"html-widget", 
        // id:Vue.prototype.$djvue.randomName(),
        name:"noname",
        icon:"mdi-language-html5",
        options: {},
        data:{
          source:"embedded",
          embedded:`<h1>DJApp {{app.name}}.Page title</h1>`
        }
       
    },

    "paragraph":{
      type:"html-widget", 
        // id:Vue.prototype.$djvue.randomName(),
        name:"noname",
        icon:"mdi-language-html5",
        options: {},
        data:{
          source:"embedded",
          embedded:`<p>
          Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante imperdiet, 
          dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, 
          sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor. Ultrices nascetur nulla gravida ante arcu. 
          Pharetra rhoncus morbi ipsum, nunc tempor debitis, ipsum pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. 
          Phasellus quis lectus luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet, nibh praesent, elementum nulla. 
          Sit lacus pharetra tempus magna neque pellentesque, nulla vel erat.
          </p>`
        }
    },

    "banner":{
      type:"html-widget", 
        // id:Vue.prototype.$djvue.randomName(),
        name:"noname",
        icon:"mdi-language-html5",
        options: {},
        data:{
          source:"embedded",
          embedded:`<div style="height:50px; background-color:#eee"></div>`
        }
    }

}
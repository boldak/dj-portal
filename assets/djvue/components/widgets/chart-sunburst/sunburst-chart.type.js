import snippets from "./snippets.js"

export default {

	name:"sunburst-chart-widget",

    icon: "mdi-chart-arc",

    getInitialConfig(snippet){
        snippet = snippet || "Default"
        let res = snippets[snippet] || snippets["Default"]
        return res
    }    

}
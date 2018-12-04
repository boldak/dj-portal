import snippets from "./snippets.js"

export default {

	name:"treemap-chart-widget",

    icon: "mdi-grid-large",

    getInitialConfig(snippet){
        snippet = snippet || "Default"
        let res = snippets[snippet] || snippets["Default"]
        return res
    }    

}
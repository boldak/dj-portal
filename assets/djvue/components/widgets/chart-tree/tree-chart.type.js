import snippets from "./snippets.js"

export default {

	name:"tree-chart-widget",

    icon: "mdi-triforce",

    getInitialConfig(snippet){
        snippet = snippet || "Line"
        let res = snippets[snippet] || snippets["Line"]
        return res
    }    

}
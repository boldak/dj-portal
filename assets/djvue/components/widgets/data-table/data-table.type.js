import snippets from "./snippets.js"

export default {

	name:"data-table-widget",

    icon: "mdi-grid",

    getInitialConfig(snippet){
        snippet = snippet || "Data Table"
        let res = snippets[snippet] || snippets["Data Table"]
        return res
    }    

}
import snippets from "./snippets.js"

export default {

	name:"bubble-chart-widget",

    icon: "mdi-chart-bubble",

    getInitialConfig(snippet){
        snippet = snippet || "Bubbles"
        let res = snippets[snippet] || snippets["Bubbles"]
        return res
    }    

}
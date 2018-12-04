import snippets from "./snippets.js"

export default {
	name:"html-widget",

    icon: "mdi-language-html5",

    getInitialConfig( snippet ){
        snippet = snippet || "default"
        let res = snippets[snippet] || snippets["default"]
        return res
    }

}

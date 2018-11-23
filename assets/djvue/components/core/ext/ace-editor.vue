<template>
  <div class="editor"></div>  
</template>

<script>
  export default {
    
    name:"editor",

    template: '<div></div>',

    props: {
      content: {
        type: String,
        required: true
      },
      lang: {
        type: String,
        default: 'javascript'
      },
      theme: {
        type: String,
        default: 'tomorrow'
      },
      sync: {
        type: Boolean,
        default: true
      }
    },

    data: function () {
      return {
        editor: null,
        session:null
      };
    },

    methods:{
      insert(snippet){
        let session = this.editor.getSession()
        session.replace(this.editor.selection.getRange(), snippet)
      }
    },

    mounted() {
      const vm = this;
      var lang = vm.lang;
      var theme = vm.theme;
      var editor = vm.editor = ace.edit(vm.$el);
      var session = vm.session = editor.getSession();
      editor.$blockScrolling = Infinity;
      session.setMode('ace/mode/' + lang);
      editor.setTheme('ace/theme/' + theme);
      session.setValue(vm.content, 1);
      session.on('change', () => {
         vm.$emit('change', session.getValue());
      });
     
    },

    watch: {
      
      content: function (newContent) {
        const vm = this;
        if (vm.sync && ( newContent !== vm.session.getValue() )) {
          vm.editor.setValue(newContent, 1);
        }
      },

      theme: function (newTheme) {
        const vm = this;
        vm.editor.setTheme('ace/theme/' + newTheme);
      }
    }
  }

</script>

<style scoped>
  .editor {
    width: 100%;
    height: 400px;
    font-size: 16px;
  }
</style>
